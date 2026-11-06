"use client";

import { useState, useEffect, useMemo } from "react";
import { format, isPast, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  UserX,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Booking } from "@/types";

function bookingStatusVariant(
  status: string
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "completed":
      return "outline";
    case "cancelled":
    case "no_show":
      return "destructive";
    default:
      return "secondary";
  }
}

export default function BookingPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    const res = await fetch("/api/bookings");
    const json = await res.json();
    setBookings(json.data || []);
    setLoading(false);
  }

  async function updateStatus(bookingId: string, status: string) {
    setActionLoading(bookingId);
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      toast({ title: `Booking ${status}` });
    } else {
      toast({ title: "Failed to update", variant: "destructive" });
    }
    setActionLoading(null);
  }

  const upcoming = useMemo(
    () =>
      bookings.filter(
        (b) =>
          !isPast(parseISO(b.starts_at)) &&
          !["cancelled", "completed", "no_show"].includes(b.status)
      ),
    [bookings]
  );

  const past = useMemo(
    () =>
      bookings.filter(
        (b) =>
          isPast(parseISO(b.starts_at)) ||
          ["cancelled", "completed", "no_show"].includes(b.status)
      ),
    [bookings]
  );

  function renderBookingCard(booking: Booking) {
    const isUpcoming =
      !isPast(parseISO(booking.starts_at)) &&
      !["cancelled", "completed", "no_show"].includes(booking.status);
    const isLoading = actionLoading === booking.id;

    return (
      <Card key={booking.id}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">
                  {booking.client_name}
                </h3>
                <Badge variant={bookingStatusVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(parseISO(booking.starts_at), "MMM d, yyyy")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {format(parseISO(booking.starts_at), "h:mm a")}
                  {" - "}
                  {format(parseISO(booking.ends_at), "h:mm a")}
                </span>
              </div>
              {booking.service_type && (
                <p className="text-xs text-muted-foreground">
                  {booking.service_type}
                </p>
              )}
              {booking.notes && (
                <p className="text-xs text-muted-foreground truncate max-w-md">
                  {booking.notes}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {isUpcoming && (
              <div className="flex items-center gap-1 shrink-0">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {booking.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(booking.id, "confirmed")}
                        title="Confirm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(booking.id, "completed")}
                      title="Complete"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(booking.id, "cancelled")}
                      title="Cancel"
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(booking.id, "no_show")}
                      title="No-show"
                    >
                      <UserX className="h-4 w-4 text-orange-500" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Badge variant="secondary" className="ml-2">
          {bookings.length}
        </Badge>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {upcoming.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No upcoming bookings.
              </CardContent>
            </Card>
          ) : (
            upcoming.map(renderBookingCard)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 mt-4">
          {past.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No past bookings.
              </CardContent>
            </Card>
          ) : (
            past.map(renderBookingCard)
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-3 mt-4">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No bookings yet.
              </CardContent>
            </Card>
          ) : (
            bookings.map(renderBookingCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
