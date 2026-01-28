-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Crear tabla de tiendas
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    category VARCHAR(100),
    price DECIMAL(10, 2),
    quantity INTEGER DEFAULT 0,
    description TEXT,
    image_url TEXT,
    image_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de movimientos de inventario
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para búsqueda de texto
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_id ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_store_id ON inventory_movements(store_id);

-- Crear vista para resumen de inventario
CREATE OR REPLACE VIEW inventory_summary AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.category,
    p.price,
    p.quantity,
    s.name as store_name,
    p.created_at
FROM products p
JOIN stores s ON p.store_id = s.id;

-- Habilitar RLS (Row Level Security)
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad (permitir acceso público por ahora)
CREATE POLICY "Allow public read on stores" ON stores FOR SELECT USING (true);
CREATE POLICY "Allow public insert on stores" ON stores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on stores" ON stores FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on stores" ON stores FOR DELETE USING (true);

CREATE POLICY "Allow public read on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert on products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on products" ON products FOR DELETE USING (true);

CREATE POLICY "Allow public read on inventory_movements" ON inventory_movements FOR SELECT USING (true);
CREATE POLICY "Allow public insert on inventory_movements" ON inventory_movements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on inventory_movements" ON inventory_movements FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on inventory_movements" ON inventory_movements FOR DELETE USING (true);
