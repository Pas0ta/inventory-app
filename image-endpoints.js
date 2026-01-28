// ==================== IMÁGENES ====================

// Subir imagen de producto (carga manual)
async function setupImageEndpoints(app, supabase, upload) {
  
  // Subir imagen manualmente
  app.post('/api/productos/:id/imagen', upload.single('imagen'), async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return res.status(400).json({ error: 'No se proporcionó imagen' });
      }

      // Validar que sea imagen
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: 'El archivo debe ser una imagen' });
      }

      // Generar nombre único
      const timestamp = Date.now();
      const filename = `productos/${id}/${timestamp}-${req.file.originalname}`;

      // Subir a Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filename, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filename);

      // Actualizar producto con URL de imagen
      const { data: producto, error: updateError } = await supabase
        .from('productos')
        .update({ 
          image_url: publicUrl,
          image_path: filename
        })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;

      res.json({
        success: true,
        producto: producto[0],
        imageUrl: publicUrl
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener imagen de producto
  app.get('/api/productos/:id/imagen', async (req, res) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('productos')
        .select('image_url, image_path')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data.image_url) {
        return res.status(404).json({ error: 'Producto sin imagen' });
      }

      res.json({
        imageUrl: data.image_url,
        imagePath: data.image_path
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Eliminar imagen de producto
  app.delete('/api/productos/:id/imagen', async (req, res) => {
    try {
      const { id } = req.params;

      // Obtener ruta de imagen actual
      const { data: producto, error: getError } = await supabase
        .from('productos')
        .select('image_path')
        .eq('id', id)
        .single();

      if (getError) throw getError;

      if (producto.image_path) {
        // Eliminar de Storage
        const { error: deleteError } = await supabase.storage
          .from('product-images')
          .remove([producto.image_path]);

        if (deleteError) console.log('Error al eliminar archivo:', deleteError);
      }

      // Actualizar producto
      const { data, error: updateError } = await supabase
        .from('productos')
        .update({ 
          image_url: null,
          image_path: null
        })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;

      res.json({
        success: true,
        producto: data[0]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Scraping mejorado con extracción de imágenes
  app.post('/api/scrape-con-imagenes', async (req, res) => {
    try {
      const { url, tiendaId } = req.body;

      if (!url || !tiendaId) {
        return res.status(400).json({ error: 'URL y tiendaId son requeridos' });
      }

      const axios = require('axios');
      const cheerio = require('cheerio');

      // Obtener la página
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const productos = [];

      // Buscar productos con imágenes
      $('[class*="product"], [class*="item"], article').each((index, element) => {
        const nombre = $(element).find('[class*="name"], [class*="title"], h2, h3').text().trim();
        const referencia = $(element).find('[class*="sku"], [class*="code"], [class*="ref"]').text().trim() 
          || $(element).find('span').eq(0).text().trim();
        
        // Buscar imagen
        let imagenUrl = null;
        const img = $(element).find('img').first();
        if (img.length) {
          imagenUrl = img.attr('src') || img.attr('data-src');
          // Convertir URLs relativas a absolutas
          if (imagenUrl && !imagenUrl.startsWith('http')) {
            const baseUrl = new URL(url);
            imagenUrl = new URL(imagenUrl, baseUrl).href;
          }
        }

        if (nombre && referencia && nombre.length > 2 && referencia.length > 1) {
          productos.push({
            nombre: nombre.substring(0, 255),
            referencia: referencia.substring(0, 100),
            tienda_id: tiendaId,
            image_url: imagenUrl
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

      // Insertar productos
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
        productosConImagen: data.filter(p => p.image_url).length,
        productos: data 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Descargar imagen desde URL externa y guardar en Supabase
  app.post('/api/productos/:id/descargar-imagen', async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ error: 'URL de imagen es requerida' });
      }

      const axios = require('axios');

      // Descargar imagen
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const buffer = Buffer.from(response.data);
      const contentType = response.headers['content-type'] || 'image/jpeg';

      // Generar nombre único
      const timestamp = Date.now();
      const ext = contentType.split('/')[1] || 'jpg';
      const filename = `productos/${id}/${timestamp}.${ext}`;

      // Subir a Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filename, buffer, {
          contentType: contentType,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filename);

      // Actualizar producto
      const { data: producto, error: updateError } = await supabase
        .from('productos')
        .update({ 
          image_url: publicUrl,
          image_path: filename
        })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;

      res.json({
        success: true,
        producto: producto[0],
        imageUrl: publicUrl
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

module.exports = { setupImageEndpoints };
