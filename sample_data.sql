-- Script de Datos de Prueba
-- Ejecuta esto en Supabase SQL Editor después de crear las tablas

-- Insertar tiendas de ejemplo
INSERT INTO tiendas (nombre, url) VALUES
('Farmasi', 'https://farmasi.es'),
('Carrefour', 'https://carrefour.es'),
('El Corte Inglés', 'https://elcorteingles.es')
ON CONFLICT DO NOTHING;

-- Insertar productos de ejemplo para Farmasi
INSERT INTO productos (tienda_id, nombre, referencia, stock) VALUES
(1, 'Vitamina C 1000mg', 'FARM-VIT-C-1000', 45),
(1, 'Paracetamol 500mg', 'FARM-PARA-500', 120),
(1, 'Ibuprofeno 400mg', 'FARM-IBU-400', 85),
(1, 'Omeprazol 20mg', 'FARM-OMEP-20', 32),
(1, 'Loratadina 10mg', 'FARM-LORA-10', 67),
(1, 'Amoxicilina 500mg', 'FARM-AMOX-500', 28),
(1, 'Metformina 850mg', 'FARM-METF-850', 54),
(1, 'Atorvastatina 20mg', 'FARM-ATOR-20', 41),
(1, 'Lisinopril 10mg', 'FARM-LISI-10', 36),
(1, 'Simvastatina 20mg', 'FARM-SIMV-20', 49)
ON CONFLICT (tienda_id, referencia) DO NOTHING;

-- Insertar productos de ejemplo para Carrefour
INSERT INTO productos (tienda_id, nombre, referencia, stock) VALUES
(2, 'Leche Entera 1L', 'CARR-LECH-1L', 200),
(2, 'Pan Integral 500g', 'CARR-PAN-INT', 150),
(2, 'Queso Manchego 250g', 'CARR-QUES-250', 75),
(2, 'Jamón Serrano 100g', 'CARR-JAM-100', 90),
(2, 'Aceite de Oliva 1L', 'CARR-ACEI-1L', 110),
(2, 'Arroz Blanco 1kg', 'CARR-ARR-1K', 180),
(2, 'Pasta Integral 500g', 'CARR-PAST-500', 160),
(2, 'Huevos Docena', 'CARR-HUE-12', 220),
(2, 'Yogur Natural 125g', 'CARR-YOG-125', 140),
(2, 'Café Molido 250g', 'CARR-CAF-250', 95)
ON CONFLICT (tienda_id, referencia) DO NOTHING;

-- Insertar productos de ejemplo para El Corte Inglés
INSERT INTO productos (tienda_id, nombre, referencia, stock) VALUES
(3, 'Camiseta Básica Blanca', 'ECI-CAM-BLA-M', 85),
(3, 'Pantalón Vaquero Azul', 'ECI-PAN-VQ-32', 62),
(3, 'Zapatos Deportivos', 'ECI-ZAP-DEP-42', 48),
(3, 'Sudadera Gris', 'ECI-SUD-GRI-L', 71),
(3, 'Calcetines Pack 3', 'ECI-CAL-3-BL', 156),
(3, 'Cinturón Negro', 'ECI-CIN-NEG-M', 39),
(3, 'Gafas de Sol', 'ECI-GAF-SOL-UV', 52),
(3, 'Bufanda Lana', 'ECI-BUF-LAN-GR', 28),
(3, 'Guantes Invierno', 'ECI-GUA-INV-BL', 44),
(3, 'Gorro Lana', 'ECI-GOR-LAN-NE', 35)
ON CONFLICT (tienda_id, referencia) DO NOTHING;

-- Verificar que se insertaron correctamente
SELECT 
  t.nombre as tienda,
  COUNT(p.id) as total_productos,
  SUM(p.stock) as stock_total
FROM tiendas t
LEFT JOIN productos p ON t.id = p.tienda_id
GROUP BY t.id, t.nombre
ORDER BY t.nombre;
