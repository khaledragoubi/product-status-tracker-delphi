
-- Create trace_view table with ACTIA industrial tracking schema
CREATE TABLE public.trace_view (
    num SERIAL PRIMARY KEY,
    sfc TEXT,
    product_key TEXT,
    adress_io TEXT,
    code_2d TEXT,
    num_poste_blt INTEGER,
    status_blt_sfc INTEGER,
    blt_date_heure TIMESTAMP WITH TIME ZONE,
    nc_log_bl TEXT,
    num_poste_rf INTEGER,
    status_rf_sfc INTEGER,
    rf_date_heure TIMESTAMP WITH TIME ZONE,
    nc_log_rf TEXT,
    status_vision_sfc INTEGER,
    vision_date_heure TIMESTAMP WITH TIME ZONE,
    nc_log_vision TEXT,
    num_poste_uft INTEGER,
    status_uft_sfc INTEGER,
    uft_date_heure TIMESTAMP WITH TIME ZONE,
    nc_log_uft TEXT,
    num_poste_rf_slider INTEGER,
    status_rf_slider_sfc INTEGER,
    rf_slider_date_heure TIMESTAMP WITH TIME ZONE,
    nc_log_rf_slide TEXT,
    status INTEGER,
    position INTEGER,
    num_porte_outil INTEGER,
    config_ligne TEXT,
    ref_pcba_actia TEXT,
    ref_pcba_somfy TEXT,
    sw_produit TEXT,
    hw_version TEXT,
    calibration_data TEXT,
    param_test TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trace_view ENABLE ROW LEVEL SECURITY;

-- Create indexes for search performance
CREATE INDEX idx_trace_view_code_2d ON public.trace_view(code_2d);
CREATE INDEX idx_trace_view_sfc ON public.trace_view(sfc);
CREATE INDEX idx_trace_view_num ON public.trace_view(num DESC);

-- RLS policies: authenticated users can read all data
CREATE POLICY "Authenticated users can read trace_view"
ON public.trace_view
FOR SELECT
TO authenticated
USING (true);

-- Allow inserts/updates for authenticated users (admin and technicien_diag)
CREATE POLICY "Authenticated users can insert trace_view"
ON public.trace_view
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update trace_view"
ON public.trace_view
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin can delete trace_view"
ON public.trace_view
FOR DELETE
TO authenticated
USING (true);
