"use client";

import { useMemo } from "react";

export type BudgetRange = { min: number; max: number };

export default function BudgetSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label = "Budget per day",
}: {
  min: number;
  max: number;
  step?: number;
  value: BudgetRange;
  onChange: (v: BudgetRange) => void;
  label?: string;
}) {
  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  // track highlight position
  const left = useMemo(() => pct(value.min), [value.min, min, max]);
  const right = useMemo(() => 100 - pct(value.max), [value.max, min, max]);

  return (
    <div className="w-full max-w-xl">
      <p className="mb-2 text-sm">
        <span className="font-medium">{label}</span>{" "}
        <span className="tabular-nums">
          ${value.min} – ${value.max}
        </span>
      </p>

      <div className="relative h-8">
        {/* Base track */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 rounded bg-gray-600/70" />

        {/* Selected range highlight */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-lime-400 rounded"
          style={{ left: `${left}%`, right: `${right}%` }}
        />

        {/* Lower thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.min}
          onChange={(e) =>
            onChange({
              min: Math.min(Number(e.target.value), value.max), // prevent crossing
              max: value.max,
            })
          }
          className="absolute left-0 right-0 top-0 h-8 w-full appearance-none bg-transparent accent-lime-400 cursor-pointer"
        />

        {/* Upper thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.max}
          onChange={(e) =>
            onChange({
              min: value.min,
              max: Math.max(Number(e.target.value), value.min), // prevent crossing
            })
          }
          className="absolute left-0 right-0 top-0 h-8 w-full appearance-none bg-transparent accent-lime-400 cursor-pointer"
        />
      </div>
    </div>
  );
}
