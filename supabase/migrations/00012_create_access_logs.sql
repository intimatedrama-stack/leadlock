CREATE TABLE public.access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID,
  action TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
