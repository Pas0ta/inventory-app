# Inicio Rápido - Gestor de Inventario

## 5 Pasos para Empezar

### Paso 1: Crear Base de Datos (2 minutos)

1. Ve a https://supabase.com y crea una cuenta gratuita
2. Crea un nuevo proyecto
3. Espera a que se cree (toma ~1 minuto)
4. Ve a "SQL Editor" en el panel izquierdo
5. Haz clic en "New Query"
6. Copia y pega TODO el contenido de `database.sql`
7. Haz clic en "Run" (botón azul)
8. ¡Listo! Las tablas están creadas

### Paso 2: Obtener Credenciales (1 minuto)

1. En Supabase, ve a "Settings" → "API"
2. Copia estos dos valores:
   - **Project URL** (empieza con https://)
   - **anon public** (la clave larga)

### Paso 3: Configurar Proyecto (1 minuto)

1. Abre el archivo `.env` en la carpeta del proyecto
2. Reemplaza:
   ```env
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_KEY=tu-clave-aqui
   ```
3. Guarda el archivo

### Paso 4: Instalar y Ejecutar (2 minutos)

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
npm start
```

Verás algo como:
```
Servidor ejecutándose en puerto 5000
```

### Paso 5: Abrir la App (1 minuto)

1. Abre `index.html` en tu navegador
2. ¡La app está lista!

---

## Primeros Pasos en la App

### 1. Crear una Tienda

1. Haz clic en "+ Nueva Tienda"
2. Ingresa:
   - **Nombre**: "Farmasi" (o el nombre que quieras)
   - **URL**: "https://farmasi.es"
3. Haz clic en "Crear"

### 2. Importar Productos

1. Selecciona la tienda que creaste
2. Haz clic en "🔄 Actualizar Productos"
3. Espera a que termine (puede tomar 10-30 segundos)
4. ¡Los productos aparecerán en la tabla!

### 3. Buscar Productos

- Usa el campo "Buscar por nombre o referencia"
- Escribe parte del nombre o referencia
- Los resultados se filtran en tiempo real

### 4. Gestionar Stock

- Haz clic en **+** para aumentar stock
- Haz clic en **−** para disminuir stock
- El stock se actualiza automáticamente

### 5. Agregar Más Tiendas

- Repite el proceso para agregar más tiendas
- Cada tienda tiene su propio inventario
- Cambia entre tiendas en el panel izquierdo

---

## Solución de Problemas

### "Error: Cannot find module"
```bash
npm install
```

### "Error de conexión a Supabase"
- Verifica que SUPABASE_URL y SUPABASE_KEY sean correctos
- Copia exactamente desde Supabase (sin espacios)

### "No se encuentran productos"
- Verifica que la URL sea correcta
- Algunos sitios pueden bloquear scraping
- Intenta con otra tienda

### "CORS Error en la consola"
- Asegúrate de que el servidor está corriendo (`npm start`)
- Verifica que accedes a `http://localhost:5000`

---

## Estructura de Archivos

```
proyecto/
├── server.js          ← Backend (no tocar)
├── index.html         ← App (abre en navegador)
├── package.json       ← Dependencias (no tocar)
├── .env              ← Configuración (EDITAR)
├── database.sql      ← Script BD (ejecutar en Supabase)
├── README.md         ← Documentación completa
└── SETUP.md          ← Guía detallada
```

---

## Próximos Pasos

- Lee `README.md` para más detalles
- Lee `SETUP.md` para configuración avanzada
- Personaliza los selectores CSS en `server.js` si el scraping no funciona

---

## Soporte Rápido

**¿Qué hace cada botón?**
- ➕ **+**: Aumenta stock en 1
- ➖ **−**: Disminuye stock en 1
- 🔄 **Actualizar**: Busca nuevos productos en la tienda
- 🔃 **Recargar**: Recarga la lista de productos

**¿Dónde se guardan los datos?**
- En Supabase (base de datos en la nube)
- Accesible desde cualquier navegador

**¿Puedo usar múltiples tiendas?**
- ¡Sí! Crea todas las que necesites
- Cada una tiene su propio inventario

---

¡Listo! Ya tienes tu gestor de inventario funcionando. 🎉
