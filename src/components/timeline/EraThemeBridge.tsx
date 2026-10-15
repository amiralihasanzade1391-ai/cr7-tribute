"use client";

import React, { useEffect, useRef } from "react";

interface EraThemeBridgeProps {
  onTimelineEnter?: () => void;
  onTimelineLeave?: () => void;
}

/**
 * Lightweight observer keeping body attribute data-era-active in sync
 * without interfering with CareerTimeline's active era color palette.
 */
export const EraThemeBridge: React.FC<EraThemeBridgeProps> = ({
  onTimelineEnter,
  onTimelineLeave,
}) => {
  const bridgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bridgeRef.current?.parentElement;
    if (!el || typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.body.setAttribute("data-era-active", "true");
            onTimelineEnter?.();
          } else {
            document.body.setAttribute("data-era-active", "false");
            onTimelineLeave?.();
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onTimelineEnter, onTimelineLeave]);

  return (
    <div
      ref={bridgeRef}
      className="hidden pointer-events-none"
      aria-hidden="true"
    />
  );
};
