require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cheerio = require('cheerio');
const multer = require('multer');
const { setupImageEndpoints } = require('./image-endpoints');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Configurar multer para carga de archivos
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://your-project.supabase.co',
  process.env.SUPABASE_KEY || 'your-anon-key'
);

// ==================== TIENDAS ====================

// Obtener todas las tiendas
app.get('/api/tiendas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tiendas')
      .select('*')
      .order('nombre', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nueva tienda
app.post('/api/tiendas', async (req, res) => {
  try {
    const { nombre, url } = req.body;
    
    if (!nombre || !url) {
      return res.status(400).json({ error: 'Nombre y URL son requeridos' });
    }

    const { data, error } = await supabase
      .from('tiendas')
      .insert([{ nombre, url }])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar tienda
app.delete('/api/tiendas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('tiendas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PRODUCTOS ====================

// Obtener productos de una tienda
app.get('/api/productos/:tiendaId', async (req, res) => {
  try {
    const { tiendaId } = req.params;
    const { search } = req.query;

    let query = supabase
      .from('productos')
      .select('*')
      .eq('tienda_id', tiendaId);

    if (search) {
      query = query.or(`nombre.ilike.%${search}%,referencia.ilike.%${search}%`);
    }

    const { data, error } = await query.order('nombre', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Scraping de productos desde una URL
app.post('/api/scrape', async (req, res) => {
  try {
    const { url, tiendaId } = req.body;

    if (!url || !tiendaId) {
      return res.status(400).json({ error: 'URL y tiendaId son requeridos' });
    }

    // Obtener la página
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const productos = [];

    // Estrategia genérica: buscar elementos comunes de productos
    $('[class*="product"], [class*="item"], article').each((index, element) => {
      const nombre = $(element).find('[class*="name"], [class*="title"], h2, h3').text().trim();
      const referencia = $(element).find('[class*="sku"], [class*="code"], [class*="ref"]').text().trim() 
        || $(element).find('span').eq(0).text().trim();

      if (nombre && referencia && nombre.length > 2 && referencia.length > 1) {
        productos.push({
          nombre: nombre.substring(0, 255),
          referencia: referencia.substring(0, 100),
          tienda_id: tiendaId
        });
      }
    });

    // Eliminar duplicados
    const productosUnicos = Array.from(
      new Map(productos.map(p => [p.referencia, p])).values()
    );

    if (productosUnicos.length === 0) {
      return res.status(400).json({ 
        error: 'No se encontraron productos. La estructura HTML puede ser diferente.' 
      });
    }

    // Insertar productos nuevos (ignorar duplicados)
    const { data, error } = await supabase
      .from('productos')
      .upsert(
        productosUnicos.map(p => ({
          ...p,
          stock: 0
        })),
        { onConflict: 'referencia,tienda_id' }
      )
      .select();

    if (error) throw error;

    res.json({ 
      success: true, 
      productosInsertados: data.length,
      productos: data 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STOCK ====================

// Actualizar stock de un producto
app.patch('/api/productos/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (cantidad === undefined) {
      return res.status(400).json({ error: 'Cantidad es requerida' });
    }

    // Obtener stock actual
    const { data: producto, error: getError } = await supabase
      .from('productos')
      .select('stock')
      .eq('id', id)
      .single();

    if (getError) throw getError;

    const nuevoStock = Math.max(0, (producto.stock || 0) + cantidad);

    const { data, error } = await supabase
      .from('productos')
      .update({ stock: nuevoStock })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar stock directamente
app.put('/api/productos/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ error: 'Stock debe ser un número positivo' });
    }

    const { data, error } = await supabase
      .from('productos')
      .update({ stock })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== IMÁGENES ====================

// Configurar endpoints de imágenes
setupImageEndpoints(app, supabase, upload);

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
