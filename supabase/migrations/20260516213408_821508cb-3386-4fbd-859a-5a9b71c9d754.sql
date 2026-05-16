
-- Create product_annotations table for diagnostic annotations
CREATE TABLE public.product_annotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_key TEXT NOT NULL,
    created_by UUID NOT NULL,
    topographic_reference TEXT NOT NULL,
    defect_type TEXT NOT NULL,
    defect_nature TEXT NOT NULL,
    additional_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_annotations ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_annotations_product_key ON public.product_annotations(product_key);
CREATE INDEX idx_annotations_created_by ON public.product_annotations(created_by);

-- RLS policies
CREATE POLICY "Authenticated users can read annotations"
ON public.product_annotations
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert annotations"
ON public.product_annotations
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own annotations"
ON public.product_annotations
FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own annotations"
ON public.product_annotations
FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- Create user_metadata table for user roles
CREATE TABLE public.user_metadata (
    id UUID PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('admin', 'technicien_diag', 'viewer')) DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_metadata ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_metadata
CREATE POLICY "Authenticated users can read user_metadata"
ON public.user_metadata
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own metadata"
ON public.user_metadata
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert their own metadata"
ON public.user_metadata
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Trigger for updated_at on user_metadata
CREATE TRIGGER update_user_metadata_updated_at
BEFORE UPDATE ON public.user_metadata
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
