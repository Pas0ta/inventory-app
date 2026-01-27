# Guía de Configuración de Supabase - Solución del Error

## El Problema
El error `operator class "gin_trgm_ops" does not exist` ocurre porque la extensión `pg_trgm` no está habilitada en tu base de datos.

## Solución Paso a Paso

### Paso 1: Acceder a Supabase
1. Ve a https://app.supabase.com
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto `inventory-app`

### Paso 2: Abrir el SQL Editor
1. En el menú izquierdo, haz clic en **"SQL Editor"**
2. Haz clic en **"New Query"**

### Paso 3: Habilitar las Extensiones
Copia y pega esto en el editor SQL:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

Luego haz clic en **"Run"** (o presiona Ctrl+Enter)

### Paso 4: Crear las Tablas
Ahora copia y pega TODO el contenido del archivo `database_fixed.sql` en una nueva query y ejecuta.

**O alternativamente:**

1. Haz clic en **"New Query"**
2. Copia el contenido completo de `database_fixed.sql`
3. Pega en el editor
4. Haz clic en **"Run"**

### Paso 5: Verificar que Funcionó
Deberías ver mensajes como:
- ✅ `CREATE EXTENSION`
- ✅ `CREATE TABLE`
- ✅ `CREATE INDEX`
- ✅ `CREATE POLICY`

Si ves errores, verifica que:
- Las extensiones se habilitaron correctamente
- No hay conflictos con tablas existentes

### Paso 6: Configurar tu Aplicación

En tu archivo `.env`, asegúrate de tener:

```
SUPABASE_URL=https://rwlxsxdbvdqprcwnqugv.supabase.co
SUPABASE_KEY=tu_clave_anon_aqui
```

Para obtener tu clave:
1. Ve a **Settings** → **API**
2. Copia el valor de **"anon public"**

### Paso 7: Probar la Conexión

Ejecuta tu aplicación:
```bash
npm start
```

Luego abre http://localhost:3000 en tu navegador.

## Troubleshooting

### Si aún ves el error de `gin_trgm_ops`:
1. Verifica que `pg_trgm` esté habilitado:
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_trgm';
   ```
   Deberías ver una fila con `pg_trgm`

2. Si no aparece, ejecuta:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "pg_trgm";
   ```

### Si ves "permission denied":
- Asegúrate de estar usando la clave correcta
- Verifica que tu usuario tenga permisos de administrador

### Si las tablas ya existen:
- Puedes eliminarlas primero:
  ```sql
  DROP TABLE IF EXISTS inventory_movements CASCADE;
  DROP TABLE IF EXISTS products CASCADE;
  DROP TABLE IF EXISTS stores CASCADE;
  ```
- Luego ejecuta `database_fixed.sql` nuevamente

## Verificar que Todo Funciona

En el SQL Editor, ejecuta:

```sql
-- Ver todas las tablas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver extensiones habilitadas
SELECT * FROM pg_extension;

-- Insertar una tienda de prueba
INSERT INTO stores (name, location) VALUES ('Tienda Test', 'Ubicación Test');

-- Ver las tiendas
SELECT * FROM stores;
```

¡Si ves los datos, todo está funcionando correctamente! ✅
