# 📸 Guía de Gestión de Imágenes de Productos

## Descripción General

Tu app ahora tiene **dos formas de obtener imágenes** de productos:

1. **Scraping Automático** - Extrae imágenes directamente de las tiendas online
2. **Carga Manual** - Sube imágenes desde tu dispositivo o desde URLs

---

## 🔄 Opción 1: Scraping Automático de Imágenes

### ¿Cómo funciona?

Cuando haces clic en **"Actualizar Productos"**, el sistema:
1. Accede a la URL de la tienda
2. Busca productos y sus imágenes
3. Descarga las imágenes automáticamente
4. Las guarda en Supabase Storage
5. Las vincula a cada producto

### Ventajas
✅ Automático - No requiere intervención manual
✅ Rápido - Procesa múltiples productos a la vez
✅ Actualizado - Obtiene imágenes nuevas cada vez
✅ Eficiente - Usa almacenamiento en la nube

### Limitaciones
⚠️ Depende de la estructura HTML de la tienda
⚠️ Algunas tiendas pueden bloquear scraping
⚠️ Imágenes pueden no ser de alta calidad

### Cómo usar
1. Selecciona una tienda
2. Haz clic en **"🔄 Actualizar Productos"**
3. El sistema buscará productos E imágenes
4. Las imágenes se mostrarán automáticamente

---

## 📤 Opción 2: Carga Manual de Imágenes

### Método A: Subir desde tu dispositivo

**Paso 1:** Haz clic en la miniatura o el icono 📷 del producto

**Paso 2:** En el modal, selecciona **"Opción 1: Subir desde tu dispositivo"**

**Paso 3:** Haz clic en el campo de archivo y selecciona una imagen

**Paso 4:** Verás un preview de la imagen

**Paso 5:** Haz clic en **"📤 Subir Imagen"**

**Resultado:** La imagen se sube a Supabase Storage y se vincula al producto

### Método B: Descargar desde URL

**Paso 1:** Haz clic en la miniatura o el icono 📷 del producto

**Paso 2:** En el modal, selecciona **"Opción 2: Descargar desde URL"**

**Paso 3:** Pega la URL de la imagen (ej: `https://ejemplo.com/imagen.jpg`)

**Paso 4:** Haz clic en **"🔗 Descargar desde URL"**

**Resultado:** La imagen se descarga y se guarda en Supabase Storage

### Ventajas
✅ Control total sobre las imágenes
✅ Puedes usar imágenes de cualquier fuente
✅ Imágenes de alta calidad
✅ Funciona offline (después de descargar)

### Limitaciones
⚠️ Requiere intervención manual
⚠️ Más lento para muchos productos
⚠️ Necesitas tener las imágenes disponibles

---

## 🗑️ Eliminar Imágenes

### Cómo eliminar una imagen

1. Haz clic en la miniatura del producto
2. En el modal, haz clic en **"🗑️ Eliminar Imagen"**
3. Confirma la eliminación
4. La imagen se eliminará de Supabase Storage

---

## 💾 Almacenamiento en Supabase

### Límites
- **Almacenamiento gratis:** 1 GB
- **Tamaño máximo por imagen:** 5 MB
- **Formatos soportados:** JPG, PNG, GIF, WebP

### Estimación
- Imagen promedio: ~100 KB
- 1 GB = ~10,000 imágenes
- Suficiente para la mayoría de casos

### Ubicación
Las imágenes se guardan en:
```
product-images/
├── {producto-id}/
│   ├── {timestamp}-imagen1.jpg
│   ├── {timestamp}-imagen2.jpg
│   └── ...
```

---

## 🔧 Endpoints de API

### Subir imagen manualmente
```
POST /api/productos/{id}/imagen
Content-Type: multipart/form-data

Body:
- imagen: [archivo]

Response:
{
  "success": true,
  "producto": {...},
  "imageUrl": "https://..."
}
```

### Descargar imagen desde URL
```
POST /api/productos/{id}/descargar-imagen
Content-Type: application/json

Body:
{
  "imageUrl": "https://ejemplo.com/imagen.jpg"
}

Response:
{
  "success": true,
  "producto": {...},
  "imageUrl": "https://..."
}
```

### Obtener imagen de producto
```
GET /api/productos/{id}/imagen

Response:
{
  "imageUrl": "https://...",
  "imagePath": "product-images/..."
}
```

### Eliminar imagen
```
DELETE /api/productos/{id}/imagen

Response:
{
  "success": true,
  "producto": {...}
}
```

---

## 🎯 Casos de Uso

### Caso 1: Tienda online con imágenes
1. Crea la tienda
2. Haz clic en "Actualizar Productos"
3. El sistema descarga automáticamente las imágenes
4. ✅ Listo - Tienes miniaturas de todos los productos

### Caso 2: Catálogo sin imágenes
1. Crea la tienda
2. Haz clic en "Actualizar Productos" (sin imágenes)
3. Manualmente, sube imágenes para los productos importantes
4. ✅ Tienes imágenes de los productos clave

### Caso 3: Mezcla de ambas
1. Haz scraping automático (obtiene algunas imágenes)
2. Reemplaza imágenes de baja calidad manualmente
3. Agrega imágenes a productos que no las tienen
4. ✅ Catálogo completo y de calidad

---

## ⚡ Consejos y Trucos

### Optimizar imágenes
- Usa imágenes de máximo 500x500 px
- Comprime imágenes antes de subir
- Usa formatos JPG o WebP para mejor compresión

### Scraping efectivo
- Asegúrate de que la URL sea correcta
- Algunas tiendas pueden requerir espera entre requests
- Si falla, intenta con una URL más específica

### Carga manual rápida
- Abre varias pestañas para subir imágenes en paralelo
- Usa URLs directas en lugar de descargar archivos
- Agrupa productos por categoría para subir imágenes similares

### Mantenimiento
- Revisa regularmente imágenes de baja calidad
- Actualiza imágenes cuando cambien los productos
- Elimina imágenes de productos descontinuados

---

## 🐛 Solución de Problemas

### "Error al subir imagen"
- Verifica que el archivo sea una imagen válida
- Comprueba que el tamaño sea menor a 5 MB
- Intenta con otro formato (JPG en lugar de PNG)

### "Error al descargar desde URL"
- Verifica que la URL sea correcta
- Asegúrate de que la imagen sea accesible públicamente
- Intenta con otra URL

### "Imagen no aparece"
- Recarga la página
- Verifica la conexión a internet
- Comprueba que Supabase Storage esté configurado

### "Scraping no encuentra imágenes"
- La tienda puede tener estructura HTML diferente
- Intenta con una URL más específica
- Usa carga manual como alternativa

---

## 📊 Estadísticas

Después de actualizar productos, verás:
- **Productos encontrados:** Total de productos
- **Productos con imagen:** Cuántos tienen imagen automática
- **Porcentaje:** % de cobertura de imágenes

---

## 🔐 Privacidad y Seguridad

- Las imágenes se almacenan en Supabase Storage (privado)
- Solo tú puedes acceder a tus imágenes
- Las URLs son públicas pero únicas
- Las imágenes se eliminan cuando las borras

---

## 📱 Uso en PWA (Android)

Las imágenes funcionan perfectamente en la app instalada:
- Se cachean automáticamente
- Funcionan offline después de cargar
- Se actualizan cuando hay conexión
- Ocupan poco espacio en el dispositivo

---

## 🚀 Próximas Mejoras

Características planeadas:
- [ ] Editar imágenes (crop, rotate)
- [ ] Galería de múltiples imágenes por producto
- [ ] Búsqueda por imagen
- [ ] Compresión automática
- [ ] Sincronización de imágenes offline

---

¿Preguntas? Consulta la documentación principal o contacta al equipo de desarrollo.
