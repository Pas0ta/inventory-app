# Instrucciones para Subir a GitHub

## Paso 1: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `inventory-app` (o el que prefieras)
3. Descripción: "Gestor de Inventario Multi-Tienda"
4. Selecciona "Private" (privado) para seguridad
5. NO inicialices con README (ya lo tenemos)
6. Haz clic en "Create repository"

## Paso 2: Conectar Repositorio Local con GitHub

Copia y ejecuta estos comandos en la terminal:

```bash
cd /workspace

# Agregar el repositorio remoto (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/inventory-app.git

# Cambiar rama a main (GitHub usa main por defecto)
git branch -m master main

# Subir los archivos
git push -u origin main
```

## Paso 3: Configurar Credenciales de GitHub

Si es la primera vez que usas GitHub desde la terminal:

### Opción A: Token de Acceso Personal (Recomendado)

1. Ve a https://github.com/settings/tokens
2. Haz clic en "Generate new token"
3. Dale un nombre: "inventory-app"
4. Selecciona permisos: `repo` (acceso completo a repositorios)
5. Haz clic en "Generate token"
6. **Copia el token** (no lo perderás de vista)
7. Cuando Git pida contraseña, pega el token

### Opción B: SSH (Más seguro)

1. Genera clave SSH:
```bash
ssh-keygen -t ed25519 -C "tu-email@example.com"
```

2. Agrega la clave a GitHub:
   - Ve a https://github.com/settings/keys
   - Haz clic en "New SSH key"
   - Pega el contenido de `~/.ssh/id_ed25519.pub`

3. Cambia la URL remota:
```bash
git remote set-url origin git@github.com:TU_USUARIO/inventory-app.git
```

## Paso 4: Verificar que Está Subido

1. Ve a https://github.com/TU_USUARIO/inventory-app
2. Deberías ver todos los archivos

## Paso 5: Proteger Credenciales

**IMPORTANTE**: Nunca subas el archivo `.env` con credenciales reales.

El `.gitignore` ya lo protege, pero verifica:

```bash
# Ver qué se va a subir
git status

# Nunca deberías ver .env en la lista
```

## Comandos Útiles para el Futuro

```bash
# Ver estado
git status

# Ver cambios
git diff

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción del cambio"

# Subir cambios
git push

# Descargar cambios
git pull

# Ver historial
git log --oneline
```

## Estructura en GitHub

Después de subir, tu repositorio tendrá:

```
inventory-app/
├── .env.example          ← Ejemplo de configuración
├── .gitignore            ← Archivos ignorados
├── README.md             ← Documentación principal
├── QUICK_START.md        ← Inicio rápido
├── SETUP.md              ← Guía de instalación
├── SCRAPING_GUIDE.md     ← Personalizar scraping
├── ADVANCED_CONFIG.md    ← Configuración avanzada
├── package.json          ← Dependencias
├── server.js             ← Backend
├── index.html            ← Frontend
├── database.sql          ← Script de BD
└── sample_data.sql       ← Datos de prueba
```

## Próximos Pasos

1. Clona el repositorio en otra máquina:
```bash
git clone https://github.com/TU_USUARIO/inventory-app.git
cd inventory-app
npm install
```

2. Configura `.env` con tus credenciales

3. Ejecuta:
```bash
npm start
```

## Notas de Seguridad

- ✅ `.env` está en `.gitignore` (no se sube)
- ✅ `node_modules/` está en `.gitignore` (no se sube)
- ✅ Usa `.env.example` como referencia
- ✅ Nunca compartas tu token de GitHub
- ✅ Usa repositorio privado para código sensible

---

¿Necesitas ayuda con algún paso?
