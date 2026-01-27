# Gestor de Inventario Multi-Tienda - Guía de Setup

## Requisitos Previos
- Node.js 16+ instalado
- Cuenta en Supabase (gratuita en https://supabase.com)
- npm o yarn

## Paso 1: Crear Base de Datos en Supabase

1. Ve a https://supabase.com y crea una cuenta
2. Crea un nuevo proyecto
3. En el panel de Supabase, ve a "SQL Editor" y ejecuta este script:

```sql
-- Crear tabla de tiendas
CREATE TABLE tiendas (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de productos
CREATE TABLE productos (
  id BIGSERIAL PRIMARY KEY,
  tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  referencia VARCHAR(100) NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tienda_id, referencia)
);

-- Crear índices para búsqueda rápida
CREATE INDEX idx_productos_tienda ON productos(tienda_id);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_referencia ON productos(referencia);

-- Habilitar RLS (Row Level Security) - opcional pero recomendado
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Crear políticas públicas (para desarrollo)
CREATE POLICY "Enable read access for all users" ON tiendas FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON tiendas FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON tiendas FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON tiendas FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON productos FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON productos FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON productos FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON productos FOR DELETE USING (true);
```

## Paso 2: Obtener Credenciales de Supabase

1. En tu proyecto de Supabase, ve a "Settings" → "API"
2. Copia:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_KEY)

## Paso 3: Configurar Variables de Entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza los valores:

```env
PORT=5000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key-aqui
```

## Paso 4: Instalar Dependencias

```bash
npm install
```

## Paso 5: Ejecutar el Servidor

```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## Paso 6: Acceder a la Aplicación

1. Abre `index.html` en tu navegador (o sirve desde un servidor local)
2. La app se conectará automáticamente al backend en `http://localhost:5000`

## Uso de la Aplicación

### Crear una Tienda
1. Haz clic en "+ Nueva Tienda"
2. Ingresa el nombre y la URL de la tienda
3. Haz clic en "Crear"

### Importar Productos
1. Selecciona una tienda
2. Haz clic en "🔄 Actualizar Productos"
3. La app buscará productos en la URL de la tienda

### Buscar Productos
- Usa el campo de búsqueda para filtrar por nombre o referencia

### Gestionar Stock
- Usa los botones + y - para aumentar o disminuir el stock
- El stock se actualiza en tiempo real

## Notas Importantes

### Sobre el Scraping
- El scraping es genérico y busca elementos comunes en HTML
- Algunas tiendas pueden tener estructuras HTML diferentes
- Si no encuentra productos, puede ser necesario ajustar el selector CSS en `server.js`

### Para Ajustar Selectores CSS
Si el scraping no funciona con una tienda específica:

1. Abre la tienda en el navegador
2. Inspecciona el HTML (F12)
3. Identifica las clases o IDs de los productos
4. Modifica la sección de scraping en `server.js`:

```javascript
// Busca elementos con clases específicas
$('.tu-clase-producto').each((index, element) => {
  const nombre = $(element).find('.nombre-clase').text().trim();
  const referencia = $(element).find('.ref-clase').text().trim();
  // ...
});
```

### Seguridad en Producción
- Cambia las políticas RLS en Supabase para mayor seguridad
- Implementa autenticación
- Usa variables de entorno seguras
- Valida todas las entradas en el servidor

## Troubleshooting

### Error: "Cannot find module"
```bash
npm install
```

### Error de conexión a Supabase
- Verifica que SUPABASE_URL y SUPABASE_KEY sean correctos
- Comprueba que las tablas existan en Supabase

### CORS Error
- Asegúrate de que el frontend accede a `http://localhost:5000`
- El servidor tiene CORS habilitado por defecto

### Scraping no encuentra productos
- Verifica que la URL sea correcta
- Algunos sitios pueden bloquear scraping
- Ajusta los selectores CSS según la estructura del sitio

## Estructura del Proyecto

```
.
├── server.js           # Backend Express
├── index.html          # Frontend HTML/CSS/JS
├── package.json        # Dependencias
├── .env               # Variables de entorno
└── SETUP.md           # Este archivo
```

## API Endpoints

### Tiendas
- `GET /api/tiendas` - Obtener todas las tiendas
- `POST /api/tiendas` - Crear nueva tienda
- `DELETE /api/tiendas/:id` - Eliminar tienda

### Productos
- `GET /api/productos/:tiendaId` - Obtener productos de una tienda
- `POST /api/scrape` - Importar productos desde URL
- `PATCH /api/productos/:id/stock` - Actualizar stock (incrementar/decrementar)
- `PUT /api/productos/:id/stock` - Establecer stock directo

## Soporte

Para problemas o preguntas, revisa:
1. La consola del navegador (F12)
2. Los logs del servidor en la terminal
3. La documentación de Supabase: https://supabase.com/docs
