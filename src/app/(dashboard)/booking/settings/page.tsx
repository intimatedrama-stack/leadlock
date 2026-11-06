"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import type { Availability } from "@/types";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface TimeWindow {
  id?: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

type WeekSchedule = Record<number, TimeWindow[]>;

export default function BookingSettingsPage() {
  const { toast } = useToast();
  const supabase = createClient();
  const [schedule, setSchedule] = useState<WeekSchedule>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("availability")
        .select("*")
        .eq("provider_id", user.id)
        .order("start_time", { ascending: true });

      const grouped: WeekSchedule = {};
      for (let d = 0; d < 7; d++) {
        grouped[d] = [];
      }

      (data || []).forEach((row: Availability) => {
        grouped[row.day_of_week].push({
          id: row.id,
          start_time: row.start_time,
          end_time: row.end_time,
          is_active: row.is_active,
        });
      });

      setSchedule(grouped);
      setLoading(false);
    }
    load();
  }, [supabase]);

  function addWindow(day: number) {
    setSchedule((prev) => ({
      ...prev,
      [day]: [
        ...(prev[day] || []),
        { start_time: "09:00", end_time: "17:00", is_active: true },
      ],
    }));
  }

  function removeWindow(day: number, index: number) {
    setSchedule((prev) => ({
      ...prev,
      [day]: (prev[day] || []).filter((_, i) => i !== index),
    }));
  }

  function updateWindow(
    day: number,
    index: number,
    field: "start_time" | "end_time",
    value: string
  ) {
    setSchedule((prev) => ({
      ...prev,
      [day]: (prev[day] || []).map((w, i) =>
        i === index ? { ...w, [field]: value } : w
      ),
    }));
  }

  async function handleSave() {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return;
    }

    // Delete existing availability rows
    await supabase
      .from("availability")
      .delete()
      .eq("provider_id", user.id);

    // Insert new rows
    const rows: Array<{
      provider_id: string;
      day_of_week: number;
      start_time: string;
      end_time: string;
      is_active: boolean;
    }> = [];

    for (let day = 0; day < 7; day++) {
      (schedule[day] || []).forEach((w) => {
        rows.push({
          provider_id: user.id,
          day_of_week: day,
          start_time: w.start_time,
          end_time: w.end_time,
          is_active: w.is_active,
        });
      });
    }

    if (rows.length > 0) {
      const { error } = await supabase.from("availability").insert(rows);
      if (error) {
        toast({ title: "Failed to save", variant: "destructive" });
        setSaving(false);
        return;
      }
    }

    toast({ title: "Availability saved" });
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Availability</h1>
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Availability</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="space-y-3">
        {DAYS.map((dayName, dayIndex) => {
          const windows = schedule[dayIndex] || [];

          return (
            <Card key={dayIndex}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{dayName}</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addWindow(dayIndex)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Window
                  </Button>
                </div>
              </CardHeader>
              {windows.length > 0 && (
                <CardContent className="pt-0 space-y-2">
                  {windows.map((w, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground w-10">
                          From
                        </Label>
                        <Input
                          type="time"
                          value={w.start_time}
                          onChange={(e) =>
                            updateWindow(dayIndex, i, "start_time", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground w-6">
                          To
                        </Label>
                        <Input
                          type="time"
                          value={w.end_time}
                          onChange={(e) =>
                            updateWindow(dayIndex, i, "end_time", e.target.value)
                          }
                          className="w-32"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeWindow(dayIndex, i)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              )}
              {windows.length === 0 && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    No availability set. Click &quot;Add Window&quot; to add
                    hours.
                  </p>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
