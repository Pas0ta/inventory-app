# Crear Repositorio en GitHub

## Paso 1: Crear el Repositorio

1. Ve a https://github.com/new
2. Completa los campos:
   - **Repository name**: `inventory-app`
   - **Description**: "Gestor de Inventario Multi-Tienda"
   - **Visibility**: Selecciona **Private** (privado)
   - **Initialize this repository with**: NO marques nada
3. Haz clic en **"Create repository"**

## Paso 2: Copiar el Comando

Después de crear el repositorio, GitHub te mostrará comandos. Copia y ejecuta esto en tu terminal:

```bash
cd /workspace
git branch -m master main
git remote add origin https://github.com/Pas0ta/inventory-app.git
git push -u origin main
```

Cuando pida autenticación:
- **Username**: Pas0ta
- **Password**: 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

## Paso 3: Verificar

Ve a https://github.com/Pas0ta/inventory-app y deberías ver todos los archivos.

---

**IMPORTANTE**: El repositorio debe estar creado ANTES de hacer push.
