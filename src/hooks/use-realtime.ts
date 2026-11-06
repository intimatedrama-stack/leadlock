"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message, Conversation } from "@/types";

export function useRealtimeMessages(
  conversationId: string | null,
  onNewMessage: (message: Message) => void
) {
  useEffect(() => {
    if (!conversationId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          onNewMessage(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, onNewMessage]);
}

export function useRealtimeConversations(
  onUpdate: (conversation: Conversation) => void
) {
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        (payload) => {
          onUpdate(payload.new as Conversation);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
}
