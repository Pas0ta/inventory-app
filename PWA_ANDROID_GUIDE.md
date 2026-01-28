# Guía: Instalar la App en Android como PWA

## ¿Qué es una PWA?

Una **Progressive Web App (PWA)** es una aplicación web que funciona como una app nativa en tu teléfono Android. Puedes:
- ✅ Instalarla desde el navegador
- ✅ Usarla sin conexión a internet
- ✅ Recibir notificaciones
- ✅ Acceder a ella desde la pantalla de inicio

## Requisitos

- ✅ Android 5.0 o superior
- ✅ Chrome, Firefox, Edge o cualquier navegador moderno
- ✅ Conexión a internet (solo para instalar)

## Pasos para Instalar en Android

### Paso 1: Abrir la App en el Navegador

1. Abre **Chrome** (o tu navegador favorito) en tu teléfono Android
2. Ve a: `http://localhost:5000` (o la URL donde esté alojada tu app)
3. Espera a que cargue completamente

### Paso 2: Instalar la App

**Opción A: Menú de Chrome (Recomendado)**
1. Toca el menú ⋮ (tres puntos) en la esquina superior derecha
2. Selecciona **"Instalar app"** o **"Agregar a pantalla de inicio"**
3. Confirma el nombre de la app
4. ¡Listo! La app aparecerá en tu pantalla de inicio

**Opción B: Notificación Automática**
- Si ves una notificación que dice "Instalar", tócala
- Confirma la instalación

### Paso 3: Usar la App

1. Busca el icono **"Inventario"** en tu pantalla de inicio
2. Tócalo para abrir la app
3. ¡Funciona como una app nativa!

## Características de la PWA

### 📱 Funciona Offline
- Puedes ver los productos que ya cargaste
- Los cambios se sincronizarán cuando vuelva la conexión

### 🔄 Actualizaciones Automáticas
- La app se actualiza automáticamente
- No necesitas ir a Google Play

### 📲 Notificaciones
- Recibe notificaciones de cambios importantes
- Funciona incluso con la app cerrada

### 💾 Almacenamiento Local
- Los datos se guardan en tu teléfono
- Acceso rápido sin esperar al servidor

## Solucionar Problemas

### "No veo la opción de instalar"

1. Asegúrate de que la app esté completamente cargada
2. Espera 2-3 segundos
3. Toca el menú ⋮ nuevamente
4. Si aún no aparece, intenta con otro navegador (Firefox, Edge)

### "La app no funciona offline"

1. Verifica que el Service Worker esté registrado:
   - Abre DevTools (F12)
   - Ve a "Application" → "Service Workers"
   - Deberías ver "service-worker.js" con estado "activated"

2. Si no aparece:
   - Recarga la página (Ctrl+R)
   - Espera a que se registre
   - Intenta nuevamente

### "No puedo conectar a la base de datos"

1. Verifica que tu servidor esté corriendo:
   ```bash
   npm start
   ```

2. Comprueba que Supabase esté configurado correctamente:
   - Abre DevTools (F12)
   - Ve a "Console"
   - Busca errores de conexión

3. Verifica tu archivo `.env`:
   ```
   SUPABASE_URL=https://rwlxsxdbvdqprcwnqugv.supabase.co
   SUPABASE_KEY=tu_clave_aqui
   ```

## Desinstalar la App

1. Mantén presionado el icono de la app en la pantalla de inicio
2. Selecciona **"Desinstalar"** o **"Remover"**
3. Confirma

## Actualizar la App

La app se actualiza automáticamente cuando:
- Haces cambios en los archivos
- Recargas la página
- Cierras y abres la app nuevamente

Para forzar una actualización:
1. Abre DevTools (F12)
2. Ve a "Application" → "Service Workers"
3. Haz clic en "Unregister"
4. Recarga la página

## Consejos

- 💡 Usa la app en modo pantalla completa para mejor experiencia
- 💡 Agrega accesos directos a tiendas específicas desde el menú
- 💡 Activa las notificaciones para recibir alertas de cambios
- 💡 Sincroniza regularmente cuando tengas conexión

## Más Información

- [Documentación de PWA](https://web.dev/progressive-web-apps/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Service Workers](https://developer.mozilla.org/es/docs/Web/API/Service_Worker_API)

¡Tu app está lista para funcionar en Android! 🚀
