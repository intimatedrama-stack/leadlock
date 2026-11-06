// Lead statuses
export const CONVERSATION_STATUSES = [
  "new",
  "acknowledged",
  "engaged",
  "booked",
  "completed",
  "expired",
] as const;

export type ConversationStatus = (typeof CONVERSATION_STATUSES)[number];

// Booking statuses
export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
  "rescheduled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

// Review statuses
export const REVIEW_STATUSES = ["pending", "approved", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

// Escalation timers (in milliseconds)
export const ESCALATION_TIMERS = {
  AUTO_ACK_DELAY: 0, // send immediately (within 30s of webhook processing)
  PROVIDER_NOTIFY_1: 2 * 60 * 1000, // 2 minutes
  PROVIDER_NOTIFY_2: 10 * 60 * 1000, // 10 minutes
  CLIENT_FOLLOWUP: 30 * 60 * 1000, // 30 minutes
  LEAD_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// Booking reminder timers
export const REMINDER_TIMERS = {
  REMINDER_24H: 24 * 60 * 60 * 1000,
  REMINDER_2H: 2 * 60 * 60 * 1000,
} as const;

// Default SMS templates
export const DEFAULT_TEMPLATES = {
  auto_ack:
    "Hey! Thanks for reaching out. {{alias}} here. Book a time: {{booking_link}} — or just reply and I'll get back to you shortly!",
  auto_ack_followup:
    "Hey, sorry for the wait! {{alias}} will be with you soon. You can also book directly: {{booking_link}}",
  booking_confirm:
    "You're booked with {{alias}} on {{date}} at {{time}}. Reply RESCHEDULE to change. See you soon!",
  reminder_24h: "Reminder: {{alias}} tomorrow at {{time}}. Reply YES to confirm.",
  reminder_2h:
    "See you in 2 hours! Details: {{details}}",
  review_request:
    "Thanks for visiting {{alias}}! Leave a quick review: {{review_link}}",
  re_engage:
    "Hey! {{alias}} has new availability this week. Book here: {{booking_link}}",
} as const;

// Posting platforms (free-text labels used in the spec)
export const POSTING_PLATFORMS = [
  "instagram",
  "facebook",
  "tiktok",
  "twitter",
  "general",
] as const;

export type PostingPlatform = (typeof POSTING_PLATFORMS)[number];
