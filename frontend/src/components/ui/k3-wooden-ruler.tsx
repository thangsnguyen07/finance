'use client';

import { Surface as HeroSurface } from '@heroui/react';

interface K3WoodenRulerProps {
  usagePercentage: number;
  dayPercentage?: number;
  dayMarkerTooltip?: string;
}

export function K3WoodenRuler({
  usagePercentage,
  dayPercentage,
  dayMarkerTooltip,
}: K3WoodenRulerProps) {
  const clampedWidth = Math.min(100, Math.max(0, usagePercentage));

  return (
    <HeroSurface className="relative rounded-xs border border-[#D5C7A9] bg-[#EFE8D8] p-2 font-mono text-[9px] text-stone-700 shadow-2xs dark:border-[#524B46] dark:bg-[#3E3834] dark:text-stone-300">
      {/* Metric Notches */}
      <div className="flex h-3.5 items-end justify-between border-b border-stone-400/50 px-1 pb-0.5 select-none dark:border-stone-500/50">
        <span>0%</span>
        <span className="h-1 w-px bg-stone-400 dark:bg-stone-500" />
        <span>25%</span>
        <span className="h-1.5 w-px bg-stone-400 dark:bg-stone-500" />
        <span className="font-bold text-stone-900 dark:text-stone-100">
          50%
        </span>
        <span className="h-1.5 w-px bg-stone-400 dark:bg-stone-500" />
        <span className="font-semibold text-amber-800 dark:text-amber-300">
          80%
        </span>
        <span className="h-1 w-px bg-stone-400 dark:bg-stone-500" />
        <span className="font-bold text-danger">100%</span>
      </div>

      {/* Progress Track with Optional Time Pace Marker */}
      <div className="rounded-2xs relative mt-2 h-2.5 overflow-hidden border border-border/50 bg-surface">
        <div
          className={`rounded-2xs h-full transition-all duration-500 ${
            usagePercentage >= 100
              ? 'bg-danger'
              : usagePercentage >= 80
                ? 'bg-warning'
                : 'bg-gradient-to-r from-amber-700 to-amber-900'
          }`}
          style={{ width: `${clampedWidth}%` }}
        />
        {dayPercentage !== undefined ? (
          <div
            title={dayMarkerTooltip}
            className="absolute top-0 bottom-0 z-10 w-0.5 bg-accent"
            style={{ left: `${Math.min(100, Math.max(0, dayPercentage))}%` }}
          />
        ) : null}
      </div>
    </HeroSurface>
  );
}
