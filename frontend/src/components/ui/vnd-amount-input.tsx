'use client';

import { Surface as HeroSurface } from '@heroui/react';
import { Button } from './button';
import { Badge } from './badge';

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
    <HeroSurface className="bg-surface-secondary/30 border border-border rounded-xl p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">{label}</label>
        {amount > 0 ? (
          <Button
            type="button"
            size="sm"
            tone="ghost"
            onPress={() => onChange(0)}
            className="h-6 px-2 text-[11px] text-danger font-medium"
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
          className="w-full text-2xl sm:text-3xl font-mono font-bold bg-transparent text-foreground placeholder:text-muted/40 focus:outline-none pr-8 tabular-nums"
          autoFocus={autoFocus}
        />
        <span className="text-lg font-serif font-bold text-muted select-none">
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
              className="cursor-pointer active:scale-95 transition-transform"
            >
              <Badge
                size="sm"
                variant={
                  preset.mode !== 'add' && amount === preset.value
                    ? 'primary'
                    : 'secondary'
                }
                mono
                className="text-[11px] font-semibold cursor-pointer"
              >
                {preset.label}
              </Badge>
            </button>
          ))}

          {showThousandMultiplier ? (
            <button
              type="button"
              onClick={handleMultiplyThousand}
              className="cursor-pointer active:scale-95 transition-transform"
            >
              <Badge
                size="sm"
                color="warning"
                variant="soft"
                mono
                className="text-[11px] font-bold cursor-pointer"
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
