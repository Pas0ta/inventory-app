-- ============================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS
-- Gestor de Inventario Multi-Tienda
-- ============================================

-- Crear tabla de tiendas
CREATE TABLE IF NOT EXISTS tiendas (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id BIGSERIAL PRIMARY KEY,
  tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  referencia VARCHAR(100) NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tienda_id, referencia)
);

-- Crear índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_productos_tienda ON productos(tienda_id);
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos USING GIN(nombre gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_productos_referencia ON productos USING GIN(referencia gin_trgm_ops);

-- Habilitar extensión para búsqueda de texto
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Habilitar RLS (Row Level Security)
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Crear políticas públicas (para desarrollo - cambiar en producción)
DROP POLICY IF EXISTS "Enable read access for all users" ON tiendas;
CREATE POLICY "Enable read access for all users" ON tiendas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON tiendas;
CREATE POLICY "Enable insert for all users" ON tiendas FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for all users" ON tiendas;
CREATE POLICY "Enable update for all users" ON tiendas FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for all users" ON tiendas;
CREATE POLICY "Enable delete for all users" ON tiendas FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON productos;
CREATE POLICY "Enable read access for all users" ON productos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON productos;
CREATE POLICY "Enable insert for all users" ON productos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for all users" ON productos;
CREATE POLICY "Enable update for all users" ON productos FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for all users" ON productos;
CREATE POLICY "Enable delete for all users" ON productos FOR DELETE USING (true);

-- Datos de ejemplo (opcional)
-- INSERT INTO tiendas (nombre, url) VALUES 
-- ('Farmasi', 'https://farmasi.es'),
-- ('Ejemplo Tienda 2', 'https://ejemplo.com');
