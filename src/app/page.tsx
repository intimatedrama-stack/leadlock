import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, BarChart3, Send } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <span className="text-xl font-bold">LeadLock</span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Never Miss a Lead Again
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Auto-acknowledge every inquiry within 30 seconds. Manage bookings,
          clients, and posting cadence from one dashboard. Privacy-first.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg">Start Free Trial</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Lead Lock System</h3>
            <p className="text-sm text-muted-foreground">
              Auto-respond to every inbound message within 30 seconds with your
              booking link. Never lose a lead to slow response time.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Smart Booking</h3>
            <p className="text-sm text-muted-foreground">
              Share a clean, professional booking page. Clients pick a time, you
              get notified. Automatic reminders keep no-shows low.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">CRM + Earnings</h3>
            <p className="text-sm text-muted-foreground">
              Track every client, session, and dollar. Tags, notes, and verified
              reviews build your reputation over time.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Posting Scheduler</h3>
            <p className="text-sm text-muted-foreground">
              Keep your ads fresh with rotated copy, posting reminders, and
              streak tracking. No automation — full control.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          LeadLock. Built for independent service providers.
        </div>
      </footer>
    </div>
  );
}
