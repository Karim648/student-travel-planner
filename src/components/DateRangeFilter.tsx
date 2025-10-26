"use client";

import { useId } from "react";

export type DateRange = {
  start?: string; // ISO 8601: YYYY-MM-DD
  end?: string;   // ISO 8601: YYYY-MM-DD
};

export default function DateRangeFilter({
  value,
  onChange,
  label = "Dates",
  className = "",
}: {
  value: DateRange;
  onChange: (r: DateRange) => void;
  label?: string;
  className?: string;
}) {
  const startId = useId();
  const endId = useId();

  const setStart = (start?: string) => onChange({ ...value, start });
  const setEnd = (end?: string) => onChange({ ...value, end });

  const invalid =
    value.start && value.end ? value.start > value.end : false;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <label htmlFor={startId} className="sr-only">Start date</label>
          <input
            id={startId}
            type="date"
            value={value.start ?? ""}
            onChange={(e) => setStart(e.target.value || undefined)}
            className="py-3 rounded-xl border px-3 text-sm bg-gray-200" // Updated height classes
          />
        </div>
        <span className="text-gray-500">–</span>
        <div className="flex flex-col">
          <label htmlFor={endId} className="sr-only">End date</label>
          <input
            id={endId}
            type="date"
            value={value.end ?? ""}
            onChange={(e) => setEnd(e.target.value || undefined)}
            className="py-3 rounded-xl border px-3 text-sm bg-gray-200" // Updated height classes
            min={value.start}
          />
        </div>
      </div>

      {invalid && (
        <p className="text-xs text-red-600">
          Start date must be on or before end date.
        </p>
      )}
    </div>
  );
}
