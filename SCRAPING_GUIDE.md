# Guía de Personalización del Scraping

## Cómo Funciona el Scraping

El scraping busca productos en una página web extrayendo:
- **Nombre**: El nombre del producto
- **Referencia**: El código/SKU del producto

## Estrategia Genérica (Por Defecto)

El código busca elementos comunes:

```javascript
$('[class*="product"], [class*="item"], article').each((index, element) => {
  const nombre = $(element).find('[class*="name"], [class*="title"], h2, h3').text();
  const referencia = $(element).find('[class*="sku"], [class*="code"], [class*="ref"]').text();
  // ...
});
```

Esto funciona con muchas tiendas, pero algunas pueden tener estructuras diferentes.

## Cómo Personalizar para Tu Tienda

### Paso 1: Inspeccionar la Página

1. Abre la tienda en tu navegador
2. Haz clic derecho en un producto
3. Selecciona "Inspeccionar" (o presiona F12)
4. Busca la estructura HTML del producto

### Paso 2: Identificar Selectores

Busca patrones como:

```html
<!-- Ejemplo 1: Clase específica -->
<div class="product-item">
  <h2 class="product-name">Nombre del Producto</h2>
  <span class="product-sku">REF-12345</span>
</div>

<!-- Ejemplo 2: Estructura diferente -->
<article data-product="true">
  <a href="...">Nombre del Producto</a>
  <p class="code">REF-12345</p>
</article>

<!-- Ejemplo 3: Atributos -->
<div data-id="REF-12345" data-name="Nombre del Producto">
  ...
</div>
```

### Paso 3: Modificar server.js

Abre `server.js` y busca la sección de scraping (alrededor de la línea 100).

#### Ejemplo 1: Clase Específica

Si la tienda usa clases específicas:

```javascript
// Reemplaza esta sección:
$('[class*="product"], [class*="item"], article').each((index, element) => {
  const nombre = $(element).find('[class*="name"], [class*="title"], h2, h3').text().trim();
  const referencia = $(element).find('[class*="sku"], [class*="code"], [class*="ref"]').text().trim();

// Con esto:
$('.product-item').each((index, element) => {
  const nombre = $(element).find('.product-name').text().trim();
  const referencia = $(element).find('.product-sku').text().trim();
```

#### Ejemplo 2: Estructura Diferente

```javascript
$('article[data-product="true"]').each((index, element) => {
  const nombre = $(element).find('a').text().trim();
  const referencia = $(element).find('.code').text().trim();
```

#### Ejemplo 3: Atributos HTML

```javascript
$('[data-id]').each((index, element) => {
  const nombre = $(element).attr('data-name');
  const referencia = $(element).attr('data-id');
```

#### Ejemplo 4: Estructura Compleja

```javascript
$('.product-container').each((index, element) => {
  const nombre = $(element).find('.title').first().text().trim();
  const referencia = $(element).find('[data-sku]').attr('data-sku');
  
  // Limpia espacios extra
  if (nombre && referencia) {
    productos.push({
      nombre: nombre.replace(/\s+/g, ' ').substring(0, 255),
      referencia: referencia.substring(0, 100),
      tienda_id: tiendaId
    });
  }
});
```

## Selectores CSS Comunes

| Selector | Descripción |
|----------|------------|
| `.clase` | Busca por clase |
| `#id` | Busca por ID |
| `[atributo]` | Busca por atributo |
| `[atributo="valor"]` | Busca por atributo exacto |
| `elemento` | Busca por etiqueta HTML |
| `elemento.clase` | Combina etiqueta y clase |
| `elemento > hijo` | Hijo directo |
| `elemento descendiente` | Cualquier descendiente |

## Herramientas Útiles

### Consola del Navegador

1. Abre la tienda en el navegador
2. Presiona F12 para abrir DevTools
3. Ve a la pestaña "Console"
4. Prueba selectores:

```javascript
// Prueba si encuentra elementos
document.querySelectorAll('.product-item').length

// Prueba extracción
document.querySelector('.product-item .product-name').textContent

// Con jQuery (si está disponible)
$('.product-item').length
$('.product-item').first().find('.product-name').text()
```

### Herramienta de Scraping Online

Usa https://www.scrapehero.com/web-scraper/ para probar selectores antes de implementar.

## Casos Especiales

### Productos en JavaScript (SPA)

Si los productos se cargan con JavaScript:

```javascript
// Espera a que cargue el contenido
await new Promise(resolve => setTimeout(resolve, 3000));

// Luego extrae
const $ = cheerio.load(response.data);
```

O usa Puppeteer para JavaScript:

```javascript
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(url);
const html = await page.content();
const $ = cheerio.load(html);
```

### Productos en Tabla

```javascript
$('table tbody tr').each((index, element) => {
  const nombre = $(element).find('td').eq(0).text().trim();
  const referencia = $(element).find('td').eq(1).text().trim();
```

### Productos en Lista

```javascript
$('ul.products li').each((index, element) => {
  const nombre = $(element).find('h3').text().trim();
  const referencia = $(element).find('[data-sku]').text().trim();
```

### Productos con Paginación

```javascript
// Scraping de múltiples páginas
const urls = [
  'https://tienda.com/productos?page=1',
  'https://tienda.com/productos?page=2',
  'https://tienda.com/productos?page=3'
];

for (const url of urls) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  // Extrae productos...
}
```

## Debugging

### Ver qué se está extrayendo

Agrega logs en `server.js`:

```javascript
$('.product-item').each((index, element) => {
  const nombre = $(element).find('.product-name').text().trim();
  const referencia = $(element).find('.product-sku').text().trim();
  
  console.log(`Producto ${index}:`, { nombre, referencia });
  
  if (nombre && referencia) {
    productos.push({...});
  }
});

console.log('Total productos encontrados:', productos.length);
```

Luego ejecuta:
```bash
npm start
```

Y verás los logs en la terminal.

### Verificar HTML

```javascript
console.log(response.data.substring(0, 1000)); // Primeros 1000 caracteres
```

## Tiendas Populares - Ejemplos

### Farmasi.es

```javascript
$('.product-item').each((index, element) => {
  const nombre = $(element).find('.product-title').text().trim();
  const referencia = $(element).find('.product-code').text().trim();
```

### Amazon

```javascript
$('[data-component-type="s-search-result"]').each((index, element) => {
  const nombre = $(element).find('h2 a span').text().trim();
  const referencia = $(element).find('[data-asin]').attr('data-asin');
```

### eBay

```javascript
$('.s-item').each((index, element) => {
  const nombre = $(element).find('.s-item__title').text().trim();
  const referencia = $(element).find('[data-item-id]').attr('data-item-id');
```

## Mejores Prácticas

1. **Limpia los datos**
   ```javascript
   nombre: nombre.replace(/\s+/g, ' ').trim().substring(0, 255)
   ```

2. **Valida antes de insertar**
   ```javascript
   if (nombre && referencia && nombre.length > 2) {
     productos.push({...});
   }
   ```

3. **Elimina duplicados**
   ```javascript
   const productosUnicos = Array.from(
     new Map(productos.map(p => [p.referencia, p])).values()
   );
   ```

4. **Maneja errores**
   ```javascript
   try {
     // Scraping
   } catch (error) {
     console.error('Error en scraping:', error);
     return res.status(400).json({ error: error.message });
   }
   ```

5. **Respeta robots.txt**
   - Verifica si la tienda permite scraping
   - Agrega delays entre requests
   - Usa User-Agent apropiado

## Soporte

Si tienes problemas:

1. Verifica la estructura HTML con F12
2. Prueba selectores en la consola
3. Agrega logs en server.js
4. Revisa los errores en la terminal

¡Buena suerte! 🚀
