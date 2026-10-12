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
    <HeroSurface className="relative bg-[#EFE8D8] dark:bg-[#3E3834] border border-[#D5C7A9] dark:border-[#524B46] rounded-xs p-2 shadow-2xs font-mono text-[9px] text-stone-700 dark:text-stone-300">
      {/* Metric Notches */}
      <div className="flex justify-between items-end h-3.5 px-1 border-b border-stone-400/50 dark:border-stone-500/50 pb-0.5 select-none">
        <span>0%</span>
        <span className="h-1 w-px bg-stone-400 dark:bg-stone-500" />
        <span>25%</span>
        <span className="h-1.5 w-px bg-stone-400 dark:bg-stone-500" />
        <span className="font-bold text-stone-900 dark:text-stone-100">
          50%
        </span>
        <span className="h-1.5 w-px bg-stone-400 dark:bg-stone-500" />
        <span className="text-amber-800 dark:text-amber-300 font-semibold">
          80%
        </span>
        <span className="h-1 w-px bg-stone-400 dark:bg-stone-500" />
        <span className="text-danger font-bold">100%</span>
      </div>

      {/* Progress Track with Optional Time Pace Marker */}
      <div className="mt-2 h-2.5 bg-surface rounded-2xs overflow-hidden relative border border-border/50">
        <div
          className={`h-full transition-all duration-500 rounded-2xs ${
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
            className="absolute top-0 bottom-0 w-0.5 bg-accent z-10"
            style={{ left: `${Math.min(100, Math.max(0, dayPercentage))}%` }}
          />
        ) : null}
      </div>
    </HeroSurface>
  );
}
