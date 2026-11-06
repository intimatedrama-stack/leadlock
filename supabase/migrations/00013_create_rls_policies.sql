-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- All data is scoped to the authenticated provider (auth.uid())
-- ============================================================

-- Providers: users can only read/update their own row
CREATE POLICY "providers_select_own" ON public.providers
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "providers_update_own" ON public.providers
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "providers_insert_own" ON public.providers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Clients: scoped by provider_id
CREATE POLICY "clients_select" ON public.clients
  FOR SELECT USING (provider_id = auth.uid());
CREATE POLICY "clients_insert" ON public.clients
  FOR INSERT WITH CHECK (provider_id = auth.uid());
CREATE POLICY "clients_update" ON public.clients
  FOR UPDATE USING (provider_id = auth.uid()) WITH CHECK (provider_id = auth.uid());
CREATE POLICY "clients_delete" ON public.clients
  FOR DELETE USING (provider_id = auth.uid());

-- Conversations: scoped by provider_id
CREATE POLICY "conversations_select" ON public.conversations
  FOR SELECT USING (provider_id = auth.uid());
CREATE POLICY "conversations_insert" ON public.conversations
  FOR INSERT WITH CHECK (provider_id = auth.uid());
CREATE POLICY "conversations_update" ON public.conversations
  FOR UPDATE USING (provider_id = auth.uid()) WITH CHECK (provider_id = auth.uid());

-- Messages: scoped by provider_id
CREATE POLICY "messages_select" ON public.messages
  FOR SELECT USING (provider_id = auth.uid());
CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT WITH CHECK (provider_id = auth.uid());

-- Availability: full CRUD scoped by provider_id
CREATE POLICY "availability_select" ON public.availability
  FOR SELECT USING (provider_id = auth.uid());
CREATE POLICY "availability_insert" ON public.availability
  FOR INSERT WITH CHECK (provider_id = auth.uid());
CREATE POLICY "availability_update" ON public.availability
  FOR UPDATE USING (provider_id = auth.uid()) WITH CHECK (provider_id = auth.uid());
CREATE POLICY "availability_delete" ON public.availability
  FOR DELETE USING (provider_id = auth.uid());

-- Bookings: scoped by provider_id
CREATE POLICY "bookings_select" ON public.bookings
  FOR SELECT USING (provider_id = auth.uid());
CREATE POLICY "bookings_insert" ON public.bookings
  FOR INSERT WITH CHECK (provider_id = auth.uid());
CREATE POLICY "bookings_update" ON public.bookings
  FOR UPDATE USING (provider_id = auth.uid()) WITH CHECK (provider_id = auth.uid());

-- Reviews: provider can read/update their reviews
CREATE POLICY "reviews_select" ON public.reviews
  FOR SELECT USING (provider_id = auth.uid());
CREATE POLICY "reviews_update" ON public.reviews
  FOR UPDATE USING (provider_id = auth.uid()) WITH CHECK (provider_id = auth.uid());

-- Earnings: full CRUD scoped by provider_id
CREATE POLICY "earnings_select" ON public.earnings
  FOR SELECT USING (provider_id = auth.uid());
CREATE POLICY "earnings_insert" ON public.earnings
  FOR INSERT WITH CHECK (provider_id = auth.uid());
CREATE POLICY "earnings_update" ON public.earnings
  FOR UPDATE USING (provider_id = auth.uid()) WITH CHECK (provider_id = auth.uid());
CREATE POLICY "earnings_delete" ON public.earnings
  FOR DELETE USING (provider_id = auth.uid());

-- Ad Kits: full CRUD scoped by provider_id
CREATE POLICY "ad_kits_select" ON public.ad_kits
  FOR SELECT USING (provider_id = auth.uid());
CREATE POLICY "ad_kits_insert" ON public.ad_kits
  FOR INSERT WITH CHECK (provider_id = auth.uid());
CREATE POLICY "ad_kits_update" ON public.ad_kits
  FOR UPDATE USING (provider_id = auth.uid()) WITH CHECK (provider_id = auth.uid());
CREATE POLICY "ad_kits_delete" ON public.ad_kits
  FOR DELETE USING (provider_id = auth.uid());

-- Posting Schedule: full CRUD scoped by provider_id
CREATE POLICY "posting_schedule_select" ON public.posting_schedule
  FOR SELECT USING (provider_id = auth.uid());
CREATE POLICY "posting_schedule_insert" ON public.posting_schedule
  FOR INSERT WITH CHECK (provider_id = auth.uid());
CREATE POLICY "posting_schedule_update" ON public.posting_schedule
  FOR UPDATE USING (provider_id = auth.uid()) WITH CHECK (provider_id = auth.uid());
CREATE POLICY "posting_schedule_delete" ON public.posting_schedule
  FOR DELETE USING (provider_id = auth.uid());

-- Posting Logs: insert + select scoped by provider_id
CREATE POLICY "posting_logs_select" ON public.posting_logs
  FOR SELECT USING (provider_id = auth.uid());
CREATE POLICY "posting_logs_insert" ON public.posting_logs
  FOR INSERT WITH CHECK (provider_id = auth.uid());

-- Access Logs: insert-only for users, select for own data
CREATE POLICY "access_logs_select" ON public.access_logs
  FOR SELECT USING (provider_id = auth.uid());
CREATE POLICY "access_logs_insert" ON public.access_logs
  FOR INSERT WITH CHECK (provider_id = auth.uid());
