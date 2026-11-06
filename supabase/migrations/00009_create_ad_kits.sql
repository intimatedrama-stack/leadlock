CREATE TABLE public.ad_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  platform_label TEXT NOT NULL,
  city TEXT NOT NULL,
  titles JSONB NOT NULL DEFAULT '[]'::jsonb,
  bodies JSONB NOT NULL DEFAULT '[]'::jsonb,
  photo_notes TEXT,
  current_title_idx INT DEFAULT 0,
  current_body_idx INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_kits ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER ad_kits_updated_at
  BEFORE UPDATE ON public.ad_kits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
