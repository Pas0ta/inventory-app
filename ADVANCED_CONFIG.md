# Configuración Avanzada

## Variables de Entorno

### Desarrollo

```env
PORT=5000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key
NODE_ENV=development
```

### Producción

```env
PORT=3000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-service-role-key
NODE_ENV=production
CORS_ORIGIN=https://tudominio.com
```

## Configuración de CORS

En `server.js`, personaliza CORS:

```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

## Configuración de Supabase

### Políticas de Seguridad (RLS)

Para producción, reemplaza las políticas públicas con autenticación:

```sql
-- Política para usuarios autenticados
CREATE POLICY "Users can view their own tiendas"
ON tiendas FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tiendas"
ON tiendas FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tiendas"
ON tiendas FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tiendas"
ON tiendas FOR DELETE
USING (auth.uid() = user_id);
```

### Agregar Columna de Usuario

```sql
ALTER TABLE tiendas ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE productos ADD COLUMN user_id UUID REFERENCES auth.users(id);
```

## Optimización de Base de Datos

### Índices Adicionales

```sql
-- Búsqueda de texto completo
CREATE INDEX idx_productos_nombre_trgm ON productos USING GIN(nombre gin_trgm_ops);
CREATE INDEX idx_productos_referencia_trgm ON productos USING GIN(referencia gin_trgm_ops);

-- Búsqueda por tienda
CREATE INDEX idx_productos_tienda_stock ON productos(tienda_id, stock);

-- Búsqueda por fecha
CREATE INDEX idx_productos_created ON productos(created_at DESC);
```

### Vistas Útiles

```sql
-- Vista de resumen de stock
CREATE VIEW stock_summary AS
SELECT 
  t.id,
  t.nombre,
  COUNT(p.id) as total_productos,
  SUM(p.stock) as stock_total,
  AVG(p.stock) as stock_promedio,
  MIN(p.stock) as stock_minimo,
  MAX(p.stock) as stock_maximo
FROM tiendas t
LEFT JOIN productos p ON t.id = p.tienda_id
GROUP BY t.id, t.nombre;

-- Vista de productos con bajo stock
CREATE VIEW low_stock_products AS
SELECT 
  t.nombre as tienda,
  p.nombre,
  p.referencia,
  p.stock
FROM productos p
JOIN tiendas t ON p.tienda_id = t.id
WHERE p.stock < 10
ORDER BY p.stock ASC;
```

## Escalabilidad

### Caché con Redis

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cachear productos
app.get('/api/productos/:tiendaId', async (req, res) => {
  const cacheKey = `productos:${req.params.tiendaId}`;
  
  // Intentar obtener del caché
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Si no está en caché, obtener de BD
  const { data } = await supabase
    .from('productos')
    .select('*')
    .eq('tienda_id', req.params.tiendaId);
  
  // Guardar en caché por 5 minutos
  await client.setex(cacheKey, 300, JSON.stringify(data));
  
  res.json(data);
});
```

### Paginación

```javascript
app.get('/api/productos/:tiendaId', async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;
  
  const { data, count } = await supabase
    .from('productos')
    .select('*', { count: 'exact' })
    .eq('tienda_id', req.params.tiendaId)
    .range(offset, offset + limit - 1);
  
  res.json({
    data,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit)
    }
  });
});
```

## Logging

### Winston Logger

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Usar en endpoints
app.post('/api/tiendas', async (req, res) => {
  try {
    logger.info('Creando nueva tienda', req.body);
    // ...
  } catch (error) {
    logger.error('Error al crear tienda', error);
  }
});
```

## Validación de Datos

### Joi Validation

```javascript
const Joi = require('joi');

const tiendaSchema = Joi.object({
  nombre: Joi.string().min(3).max(255).required(),
  url: Joi.string().uri().required()
});

app.post('/api/tiendas', async (req, res) => {
  const { error, value } = tiendaSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  // Procesar datos validados
  const { data } = await supabase
    .from('tiendas')
    .insert([value])
    .select();
  
  res.json(data[0]);
});
```

## Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});

app.use('/api/', limiter);
```

## Autenticación JWT

```javascript
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

app.get('/api/tiendas', verifyToken, async (req, res) => {
  // Solo usuarios autenticados
  const { data } = await supabase
    .from('tiendas')
    .select('*')
    .eq('user_id', req.user.id);
  
  res.json(data);
});
```

## Monitoreo

### Health Check Mejorado

```javascript
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a Supabase
    const { data, error } = await supabase
      .from('tiendas')
      .select('count', { count: 'exact' });
    
    if (error) throw error;
    
    res.json({
      status: 'OK',
      timestamp: new Date(),
      database: 'connected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});
```

## Backup Automático

```javascript
const schedule = require('node-schedule');

// Backup diario a las 2 AM
schedule.scheduleJob('0 2 * * *', async () => {
  try {
    const { data } = await supabase
      .from('productos')
      .select('*');
    
    const backup = {
      timestamp: new Date(),
      data
    };
    
    // Guardar en archivo o servicio de almacenamiento
    console.log('Backup completado:', backup.timestamp);
  } catch (error) {
    console.error('Error en backup:', error);
  }
});
```

## Deployment

### Heroku

```bash
# Crear app
heroku create mi-app

# Configurar variables
heroku config:set SUPABASE_URL=...
heroku config:set SUPABASE_KEY=...

# Deploy
git push heroku main
```

### Vercel (Frontend)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

```bash
# Build
docker build -t inventory-app .

# Run
docker run -p 5000:5000 -e SUPABASE_URL=... inventory-app
```

## Monitoreo en Producción

### Sentry (Error Tracking)

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.errorHandler());
```

### New Relic (Performance)

```javascript
require('newrelic');

// El resto del código...
```

## Mejores Prácticas

1. **Usa variables de entorno** para todas las configuraciones
2. **Valida todas las entradas** en el servidor
3. **Implementa autenticación** en producción
4. **Usa HTTPS** siempre
5. **Haz backups regulares** de la BD
6. **Monitorea errores** con Sentry o similar
7. **Usa rate limiting** para prevenir abuso
8. **Implementa logging** completo
9. **Prueba la seguridad** regularmente
10. **Mantén dependencias actualizadas**

---

Para más información, consulta la documentación oficial:
- Supabase: https://supabase.com/docs
- Express: https://expressjs.com
- Node.js: https://nodejs.org/docs
