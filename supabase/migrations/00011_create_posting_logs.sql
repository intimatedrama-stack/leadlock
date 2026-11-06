CREATE TABLE public.posting_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  ad_kit_id UUID REFERENCES public.ad_kits(id),
  schedule_id UUID REFERENCES public.posting_schedule(id),
  title_used TEXT,
  body_used TEXT,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.posting_logs ENABLE ROW LEVEL SECURITY;
