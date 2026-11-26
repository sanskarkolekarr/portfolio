"use client";

import { useEffect, useState } from "react";

interface LiveClockProps {
  timezone: string;
}

export function LiveClock({ timezone }: LiveClockProps) {
  const [time, setTime] = useState<string>("--:-- --");

  useEffect(() => {
    const formatTime = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date());
        setTime(formatted);
      } catch {
        setTime("IST");
      }
    };

    formatTime();
    const interval = setInterval(formatTime, 15000);
    return () => clearInterval(interval);
  }, [timezone]);

  return <span suppressHydrationWarning>{time}</span>;
}
