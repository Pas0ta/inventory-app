// ==================== GESTIÓN DE IMÁGENES ====================

// Abrir modal para subir imagen
function abrirModalImagen(productoId) {
    document.getElementById('modal-imagen').classList.add('active');
    document.getElementById('producto-id-imagen').value = productoId;
    document.getElementById('preview-imagen').innerHTML = '';
    document.getElementById('file-input').value = '';
}

// Cerrar modal de imagen
function cerrarModalImagen() {
    document.getElementById('modal-imagen').classList.remove('active');
    document.getElementById('preview-imagen').innerHTML = '';
    document.getElementById('file-input').value = '';
}

// Preview de imagen antes de subir
document.getElementById('file-input')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('preview-imagen');
            preview.innerHTML = `<img src="${event.target.result}" style="max-width: 100%; max-height: 300px; border-radius: 8px;">`;
        };
        reader.readAsDataURL(file);
    }
});

// Subir imagen manualmente
async function subirImagen() {
    const productoId = document.getElementById('producto-id-imagen').value;
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        mostrarAlerta('Por favor selecciona una imagen', 'error');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('imagen', file);

        const response = await fetch(`${API_URL}/productos/${productoId}/imagen`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }

        const resultado = await response.json();
        mostrarAlerta('Imagen subida exitosamente', 'success');
        cerrarModalImagen();
        cargarProductos();
    } catch (error) {
        mostrarAlerta('Error al subir imagen: ' + error.message, 'error');
    }
}

// Descargar imagen desde URL
async function descargarImagenDesdeUrl() {
    const productoId = document.getElementById('producto-id-imagen').value;
    const urlImagen = document.getElementById('url-imagen').value.trim();

    if (!urlImagen) {
        mostrarAlerta('Por favor ingresa una URL de imagen', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/productos/${productoId}/descargar-imagen`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: urlImagen })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error);
        }

        const resultado = await response.json();
        mostrarAlerta('Imagen descargada exitosamente', 'success');
        cerrarModalImagen();
        cargarProductos();
    } catch (error) {
        mostrarAlerta('Error al descargar imagen: ' + error.message, 'error');
    }
}

// Eliminar imagen de producto
async function eliminarImagen(productoId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta imagen?')) return;

    try {
        const response = await fetch(`${API_URL}/productos/${productoId}/imagen`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar imagen');

        mostrarAlerta('Imagen eliminada', 'success');
        cargarProductos();
    } catch (error) {
        mostrarAlerta('Error: ' + error.message, 'error');
    }
}

// Mostrar productos con miniaturas
function mostrarProductosConImagenes(productos) {
    const container = document.getElementById('productos-container');

    if (productos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No hay productos</h3>
                <p>Haz clic en "Actualizar Productos" para importar productos de la tienda</p>
            </div>
        `;
        return;
    }

    let html = `
        <table class="products-table">
            <thead>
                <tr>
                    <th style="width: 80px;">Imagen</th>
                    <th>Nombre</th>
                    <th>Referencia</th>
                    <th>Stock</th>
                </tr>
            </thead>
            <tbody>
    `;

    productos.forEach(producto => {
        const imagenHtml = producto.image_url 
            ? `<img src="${producto.image_url}" alt="${producto.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; cursor: pointer;" onclick="abrirModalImagen('${producto.id}')">`
            : `<div style="width: 60px; height: 60px; background: #f0f4ff; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 24px;" onclick="abrirModalImagen('${producto.id}')">📷</div>`;

        html += `
            <tr>
                <td style="text-align: center;">
                    ${imagenHtml}
                </td>
                <td>${producto.nombre}</td>
                <td><code style="background: #f0f4ff; padding: 4px 8px; border-radius: 4px;">${producto.referencia}</code></td>
                <td>
                    <div class="stock-controls">
                        <button class="stock-btn minus" onclick="actualizarStock('${producto.id}', -1)">−</button>
                        <span class="stock-value">${producto.stock || 0}</span>
                        <button class="stock-btn plus" onclick="actualizarStock('${producto.id}', 1)">+</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}
