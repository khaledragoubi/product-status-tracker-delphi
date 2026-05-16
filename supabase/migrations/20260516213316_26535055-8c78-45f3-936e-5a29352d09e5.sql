
-- Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sfc TEXT NOT NULL,
    code_2d TEXT,
    product_key TEXT,
    passage_count INTEGER DEFAULT 0,
    final_status TEXT CHECK (final_status IN ('PASS', 'FAIL', 'PENDING')),
    failed_station TEXT,
    failure_date TIMESTAMP WITH TIME ZONE,
    operator_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create test results table (one row per station test)
CREATE TABLE public.product_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    station TEXT NOT NULL CHECK (station IN ('BLT', 'RF', 'VISION', 'UFT', 'RF_SLIDER')),
    status TEXT NOT NULL CHECK (status IN ('PASS', 'FAIL', 'PENDING')),
    test_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tests ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_products_sfc ON public.products(sfc);
CREATE INDEX idx_products_code_2d ON public.products(code_2d);
CREATE INDEX idx_product_tests_product_id ON public.product_tests(product_id);
CREATE INDEX idx_product_tests_station ON public.product_tests(station);

-- RLS policies: authenticated users can read all products/tests
CREATE POLICY "Authenticated users can read products"
ON public.products
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin and Technicien can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admin and Technicien can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read product tests"
ON public.product_tests
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert product tests"
ON public.product_tests
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
