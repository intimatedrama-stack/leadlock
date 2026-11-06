-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================

-- Providers
CREATE INDEX idx_providers_slug ON public.providers(slug);
CREATE INDEX idx_providers_twilio_phone ON public.providers(twilio_phone);

-- Clients
CREATE INDEX idx_clients_provider ON public.clients(provider_id);
CREATE INDEX idx_clients_phone ON public.clients(provider_id, phone);
CREATE INDEX idx_clients_last_seen ON public.clients(provider_id, last_seen_at DESC);

-- Conversations
CREATE INDEX idx_conversations_provider_status ON public.conversations(provider_id, status);
CREATE INDEX idx_conversations_provider_last_msg ON public.conversations(provider_id, last_message_at DESC);
CREATE INDEX idx_conversations_phone ON public.conversations(provider_id, phone_number);

-- Messages
CREATE INDEX idx_messages_conversation_time ON public.messages(conversation_id, sent_at DESC);
CREATE INDEX idx_messages_provider ON public.messages(provider_id);

-- Availability
CREATE INDEX idx_availability_provider_day ON public.availability(provider_id, day_of_week);

-- Bookings
CREATE INDEX idx_bookings_provider_time ON public.bookings(provider_id, start_at);
CREATE INDEX idx_bookings_provider_status ON public.bookings(provider_id, status);
CREATE INDEX idx_bookings_reminders ON public.bookings(start_at)
  WHERE status = 'confirmed' AND (reminder_24h_sent = false OR reminder_2h_sent = false);

-- Reviews
CREATE INDEX idx_reviews_provider_status ON public.reviews(provider_id, status);
CREATE INDEX idx_reviews_token ON public.reviews(token);

-- Earnings
CREATE INDEX idx_earnings_provider_date ON public.earnings(provider_id, earned_at DESC);

-- Ad Kits
CREATE INDEX idx_ad_kits_provider ON public.ad_kits(provider_id);

-- Posting Schedule
CREATE INDEX idx_posting_schedule_provider ON public.posting_schedule(provider_id, day_of_week);

-- Posting Logs
CREATE INDEX idx_posting_logs_provider_date ON public.posting_logs(provider_id, posted_at DESC);

-- Access Logs
CREATE INDEX idx_access_logs_provider ON public.access_logs(provider_id, created_at DESC);
