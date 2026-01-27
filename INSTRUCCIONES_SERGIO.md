# Instrucciones Personalizadas para Sergio

## Tu Información

- **Usuario GitHub**: Pas0ta
- **URL Supabase**: https://rwlxsxdbvdqprcwnqugv.supabase.co
- **Proyecto**: Gestor de Inventario Multi-Tienda

## Paso 1: Obtener tu Clave de Supabase

1. Ve a https://rwlxsxdbvdqprcwnqugv.supabase.co
2. Inicia sesión
3. Ve a "Settings" → "API" en el panel izquierdo
4. Copia la clave **anon public** (la que empieza con `eyJ...`)
5. Guárdala en un lugar seguro

## Paso 2: Configurar .env Localmente

1. Abre el archivo `.env` en tu editor
2. Reemplaza:

```env
PORT=5000
SUPABASE_URL=https://rwlxsxdbvdqprcwnqugv.supabase.co
SUPABASE_KEY=PEGA_TU_CLAVE_AQUI
```

3. Guarda el archivo

## Paso 3: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `inventory-app`
3. Descripción: "Gestor de Inventario Multi-Tienda"
4. Selecciona **Private** (privado)
5. Haz clic en "Create repository"

## Paso 4: Subir a GitHub

Copia y ejecuta en la terminal:

```bash
cd /workspace

git remote add origin https://github.com/Pas0ta/inventory-app.git
git branch -m master main
git push -u origin main
```

Cuando pida contraseña:
- **Usuario**: Pas0ta
- **Contraseña**: Tu token de GitHub (ver abajo)

## Paso 5: Crear Token de GitHub

1. Ve a https://github.com/settings/tokens
2. Haz clic en "Generate new token"
3. Nombre: "inventory-app"
4. Selecciona: `repo` (acceso completo)
5. Haz clic en "Generate token"
6. **Copia el token** (aparece una sola vez)
7. Úsalo como contraseña en el paso anterior

## Paso 6: Crear Base de Datos en Supabase

1. Ve a https://rwlxsxdbvdqprcwnqugv.supabase.co
2. Inicia sesión
3. Ve a "SQL Editor"
4. Haz clic en "New Query"
5. Copia TODO el contenido de `database.sql`
6. Pégalo en el editor
7. Haz clic en "Run"
8. ¡Listo! Las tablas están creadas

## Paso 7: Instalar y Ejecutar Localmente

```bash
cd /workspace
npm install
npm start
```

Deberías ver:
```
Servidor ejecutándose en puerto 5000
```

## Paso 8: Abrir la App

1. Abre `index.html` en tu navegador
2. ¡La app está lista!

## Verificar que Todo Funciona

1. Haz clic en "+ Nueva Tienda"
2. Ingresa:
   - Nombre: "Farmasi"
   - URL: "https://farmasi.es"
3. Haz clic en "Crear"
4. Selecciona la tienda
5. Haz clic en "🔄 Actualizar Productos"
6. Espera a que termine
7. ¡Deberías ver productos en la tabla!

## Archivos Importantes

| Archivo | Descripción |
|---------|------------|
| `.env` | Tus credenciales (NO subir a GitHub) |
| `.env.example` | Ejemplo de configuración (SÍ subir) |
| `server.js` | Backend Express |
| `index.html` | Frontend |
| `database.sql` | Script para crear tablas |
| `QUICK_START.md` | Inicio rápido |

## Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error: "SUPABASE_URL is not defined"
- Verifica que `.env` tenga la URL correcta
- Reinicia el servidor: `npm start`

### Error: "No se encuentran productos"
- Verifica que la URL de la tienda sea correcta
- Algunos sitios pueden bloquear scraping
- Intenta con otra tienda

### Error de conexión a GitHub
- Verifica tu usuario: `Pas0ta`
- Verifica tu token (no uses contraseña)
- Intenta de nuevo

## Próximos Pasos

1. ✅ Subir a GitHub
2. ✅ Configurar Supabase
3. ✅ Instalar dependencias
4. ✅ Ejecutar servidor
5. ✅ Probar la app
6. 📝 Personalizar scraping si es necesario
7. 🚀 Desplegar en producción (opcional)

## Contacto y Soporte

Si tienes problemas:
1. Revisa los logs en la terminal
2. Abre la consola del navegador (F12)
3. Revisa los archivos de documentación

---

¡Listo para empezar! 🚀
