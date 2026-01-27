# Gestor de Inventario Multi-Tienda

Una aplicación web completa para gestionar inventario de productos de múltiples tiendas online.

## Características

✅ **Gestión de Múltiples Tiendas**
- Crear, editar y eliminar tiendas
- Cambiar entre tiendas fácilmente
- Cada tienda tiene su propio inventario

✅ **Importación Automática de Productos**
- Scraping automático de productos desde URLs
- Extrae nombre y referencia de productos
- Actualiza automáticamente con nuevos productos

✅ **Búsqueda y Filtrado**
- Buscar por nombre de producto
- Buscar por número de referencia
- Búsqueda en tiempo real

✅ **Gestión de Stock**
- Botones + y - para ajustar stock
- Actualización en tiempo real
- Stock por defecto en 0

✅ **Base de Datos Robusta**
- Almacenamiento en Supabase (PostgreSQL)
- Tablas: tiendas, productos
- Índices para búsqueda rápida
- Relaciones y restricciones

✅ **Interfaz Moderna**
- Diseño responsive
- Interfaz intuitiva
- Animaciones suaves
- Modo oscuro compatible

## Requisitos

- Node.js 16+
- npm o yarn
- Cuenta en Supabase (gratuita)
- Navegador moderno

## Instalación Rápida

### 1. Clonar o descargar el proyecto

### 2. Crear base de datos en Supabase

1. Ve a https://supabase.com
2. Crea un nuevo proyecto
3. En SQL Editor, ejecuta el contenido de `database.sql`

### 3. Configurar variables de entorno

Edita `.env`:
```env
PORT=5000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key
```

### 4. Instalar dependencias

```bash
npm install
```

### 5. Ejecutar servidor

```bash
npm start
```

### 6. Abrir aplicación

Abre `index.html` en tu navegador o sirve desde un servidor local.

## Uso

### Crear una Tienda
1. Haz clic en "+ Nueva Tienda"
2. Ingresa nombre y URL
3. Haz clic en "Crear"

### Importar Productos
1. Selecciona una tienda
2. Haz clic en "🔄 Actualizar Productos"
3. Espera a que se completen las búsquedas

### Buscar Productos
- Usa el campo de búsqueda para filtrar

### Gestionar Stock
- Usa + para aumentar
- Usa - para disminuir

## Estructura

```
├── server.js          # Backend Express + Scraping
├── index.html         # Frontend completo
├── package.json       # Dependencias
├── .env              # Configuración
├── database.sql      # Script de BD
├── SETUP.md          # Guía detallada
└── README.md         # Este archivo
```

## API

### Tiendas
- `GET /api/tiendas` - Listar tiendas
- `POST /api/tiendas` - Crear tienda
- `DELETE /api/tiendas/:id` - Eliminar tienda

### Productos
- `GET /api/productos/:tiendaId` - Listar productos
- `POST /api/scrape` - Importar productos
- `PATCH /api/productos/:id/stock` - Ajustar stock
- `PUT /api/productos/:id/stock` - Establecer stock

## Troubleshooting

**Error de conexión a Supabase**
- Verifica SUPABASE_URL y SUPABASE_KEY en .env
- Comprueba que las tablas existan

**Scraping no encuentra productos**
- Verifica que la URL sea correcta
- Algunos sitios pueden bloquear scraping
- Ajusta selectores CSS en server.js

**CORS Error**
- Asegúrate de que frontend accede a http://localhost:5000

## Notas de Seguridad

Para producción:
- Implementa autenticación
- Cambia políticas RLS en Supabase
- Valida todas las entradas
- Usa HTTPS
- Protege variables de entorno

## Licencia

MIT

## Soporte

Revisa SETUP.md para guía detallada de instalación.
