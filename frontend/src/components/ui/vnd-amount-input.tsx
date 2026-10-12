'use client';

import { Surface as HeroSurface } from '@heroui/react';

import { Badge } from './badge';
import { Button } from './button';

export interface AmountPresetItem {
  label: string;
  value: number;
  mode?: 'add' | 'replace';
}

interface VndAmountInputProps {
  label: string;
  amount: number;
  onChange: (nextAmount: number) => void;
  presets?: ReadonlyArray<AmountPresetItem>;
  showThousandMultiplier?: boolean;
  autoFocus?: boolean;
}

export function VndAmountInput({
  label,
  amount,
  onChange,
  presets,
  showThousandMultiplier = false,
  autoFocus = false,
}: VndAmountInputProps) {
  const handlePresetPress = (preset: AmountPresetItem) => {
    if (preset.mode === 'add') {
      onChange(amount + preset.value);
    } else {
      onChange(preset.value);
    }
  };

  const handleMultiplyThousand = () => {
    if (amount > 0 && amount < 1000000) {
      onChange(amount * 1000);
    }
  };

  return (
    <HeroSurface className="space-y-2.5 rounded-xl border border-border bg-surface-secondary/30 p-3.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">{label}</label>
        {amount > 0 ? (
          <Button
            type="button"
            size="sm"
            tone="ghost"
            onPress={() => onChange(0)}
            className="h-6 px-2 text-[11px] font-medium text-danger"
          >
            Đặt lại 0
          </Button>
        ) : null}
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          inputMode="numeric"
          value={amount > 0 ? amount.toLocaleString('vi-VN') : ''}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '');
            onChange(digits ? parseInt(digits, 10) : 0);
          }}
          placeholder="0"
          className="w-full bg-transparent pr-8 font-mono text-2xl font-bold text-foreground tabular-nums placeholder:text-muted/40 focus:outline-none sm:text-3xl"
          autoFocus={autoFocus}
        />
        <span className="font-serif text-lg font-bold text-muted select-none">
          ₫
        </span>
      </div>

      {presets && presets.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePresetPress(preset)}
              className="cursor-pointer transition-transform active:scale-95"
            >
              <Badge
                size="sm"
                variant={
                  preset.mode !== 'add' && amount === preset.value
                    ? 'primary'
                    : 'secondary'
                }
                mono
                className="cursor-pointer text-[11px] font-semibold"
              >
                {preset.label}
              </Badge>
            </button>
          ))}

          {showThousandMultiplier ? (
            <button
              type="button"
              onClick={handleMultiplyThousand}
              className="cursor-pointer transition-transform active:scale-95"
            >
              <Badge
                size="sm"
                color="warning"
                variant="soft"
                mono
                className="cursor-pointer text-[11px] font-bold"
              >
                .000
              </Badge>
            </button>
          ) : null}
        </div>
      ) : null}
    </HeroSurface>
  );
}
