-- Crear tabla de clientes
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dni TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de cotizaciones
CREATE TABLE public.quotes (
  id TEXT PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('En espera', 'Aprobado', 'Rechazado')),
  rejection_reason TEXT,
  seller TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de productos de cotizaciones
CREATE TABLE public.quote_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id TEXT REFERENCES public.quotes(id) ON DELETE CASCADE,
  product_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_products ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para customers (acceso público para lectura y escritura)
CREATE POLICY "Todos pueden leer clientes"
  ON public.customers
  FOR SELECT
  USING (true);

CREATE POLICY "Todos pueden crear clientes"
  ON public.customers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Todos pueden actualizar clientes"
  ON public.customers
  FOR UPDATE
  USING (true);

-- Políticas RLS para quotes (acceso público para lectura y escritura)
CREATE POLICY "Todos pueden leer cotizaciones"
  ON public.quotes
  FOR SELECT
  USING (true);

CREATE POLICY "Todos pueden crear cotizaciones"
  ON public.quotes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Todos pueden actualizar cotizaciones"
  ON public.quotes
  FOR UPDATE
  USING (true);

-- Políticas RLS para quote_products (acceso público para lectura y escritura)
CREATE POLICY "Todos pueden leer productos de cotizaciones"
  ON public.quote_products
  FOR SELECT
  USING (true);

CREATE POLICY "Todos pueden crear productos de cotizaciones"
  ON public.quote_products
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Todos pueden actualizar productos de cotizaciones"
  ON public.quote_products
  FOR UPDATE
  USING (true);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_quotes_customer_id ON public.quotes(customer_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_quote_products_quote_id ON public.quote_products(quote_id);
CREATE INDEX idx_customers_dni ON public.customers(dni);