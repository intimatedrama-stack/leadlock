-- Seed data for development/testing
-- Run after migrations with: npx supabase db reset

-- Note: In production, providers are created via the signup flow.
-- This seed data is for local development only.
-- The provider ID must match a Supabase Auth user ID.
-- When using Supabase locally, create a test user first via the Auth UI,
-- then update this seed file with the correct user UUID.

-- Example seed (uncomment and update UUID after creating test auth user):

-- INSERT INTO public.providers (id, email, internal_name, client_alias, slug, twilio_phone, timezone)
-- VALUES (
--   'YOUR-AUTH-USER-UUID-HERE',
--   'test@leadlock.app',
--   'Test Provider',
--   'Jade',
--   'jade',
--   '+12065559999',
--   'America/Los_Angeles'
-- );

-- INSERT INTO public.availability (provider_id, day_of_week, start_time, end_time)
-- VALUES
--   ('YOUR-AUTH-USER-UUID-HERE', 1, '10:00', '18:00'),
--   ('YOUR-AUTH-USER-UUID-HERE', 2, '10:00', '18:00'),
--   ('YOUR-AUTH-USER-UUID-HERE', 3, '10:00', '18:00'),
--   ('YOUR-AUTH-USER-UUID-HERE', 4, '10:00', '18:00'),
--   ('YOUR-AUTH-USER-UUID-HERE', 5, '10:00', '18:00');
