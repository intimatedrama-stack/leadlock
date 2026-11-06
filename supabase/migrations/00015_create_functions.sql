-- ============================================================
-- DATABASE FUNCTIONS
-- ============================================================

-- Function: upsert client (find or create by phone for a provider)
CREATE OR REPLACE FUNCTION public.upsert_client(
  p_provider_id UUID,
  p_phone TEXT,
  p_name TEXT DEFAULT NULL,
  p_source TEXT DEFAULT 'sms'
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client_id UUID;
BEGIN
  SELECT id INTO v_client_id
  FROM public.clients
  WHERE provider_id = p_provider_id AND phone = p_phone;

  IF v_client_id IS NULL THEN
    INSERT INTO public.clients (provider_id, phone, display_name, lead_source, last_seen_at)
    VALUES (p_provider_id, p_phone, p_name, p_source, now())
    RETURNING id INTO v_client_id;
  ELSE
    UPDATE public.clients
    SET last_seen_at = now(),
        display_name = COALESCE(p_name, display_name)
    WHERE id = v_client_id;
  END IF;

  RETURN v_client_id;
END;
$$ LANGUAGE plpgsql;

-- Function: get available booking slots for a provider on a given date
CREATE OR REPLACE FUNCTION public.get_available_slots(
  p_provider_id UUID,
  p_date DATE,
  p_duration_minutes INTEGER DEFAULT 60
)
RETURNS TABLE(slot_start TIMESTAMPTZ, slot_end TIMESTAMPTZ)
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_dow INTEGER;
  v_tz TEXT;
BEGIN
  -- Get provider timezone
  SELECT timezone INTO v_tz FROM public.providers WHERE id = p_provider_id;
  IF v_tz IS NULL THEN
    v_tz := 'America/New_York';
  END IF;

  -- Get day of week (0=Sunday)
  v_dow := EXTRACT(DOW FROM p_date);

  RETURN QUERY
  WITH available_windows AS (
    SELECT
      (p_date + a.start_time) AT TIME ZONE v_tz AS window_start,
      (p_date + a.end_time) AT TIME ZONE v_tz AS window_end
    FROM public.availability a
    WHERE a.provider_id = p_provider_id
      AND a.day_of_week = v_dow
      AND a.is_blocked = false
      AND (a.is_override = false OR a.override_date = p_date)
  ),
  existing_bookings AS (
    SELECT b.start_at, b.end_at
    FROM public.bookings b
    WHERE b.provider_id = p_provider_id
      AND b.start_at::date = p_date
      AND b.status IN ('pending', 'confirmed')
  ),
  slots AS (
    SELECT
      generate_series(
        aw.window_start,
        aw.window_end - (p_duration_minutes || ' minutes')::interval,
        (p_duration_minutes || ' minutes')::interval
      ) AS slot_s
    FROM available_windows aw
  )
  SELECT
    s.slot_s AS slot_start,
    s.slot_s + (p_duration_minutes || ' minutes')::interval AS slot_end
  FROM slots s
  WHERE NOT EXISTS (
    SELECT 1 FROM existing_bookings eb
    WHERE s.slot_s < eb.end_at
      AND (s.slot_s + (p_duration_minutes || ' minutes')::interval) > eb.start_at
  )
  ORDER BY s.slot_s;
END;
$$ LANGUAGE plpgsql;

-- Function: calculate posting streak for a provider
CREATE OR REPLACE FUNCTION public.get_posting_streak(p_provider_id UUID)
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_streak INTEGER := 0;
  v_check_date DATE := CURRENT_DATE;
  v_has_post BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM public.posting_logs
      WHERE provider_id = p_provider_id
        AND posted_at::date = v_check_date
    ) INTO v_has_post;

    IF v_has_post THEN
      v_streak := v_streak + 1;
      v_check_date := v_check_date - 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;

  RETURN v_streak;
END;
$$ LANGUAGE plpgsql;
