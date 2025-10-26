"use client";

import { Search, MapPin } from "lucide-react";
import { cn } from "@/components/ui/utils";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Enter a City or Country",
  className,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="relative flex items-center">
          <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl bg-gray-200 py-2.5 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 outline-none"
            aria-label={label ?? "Search destination"}
          />
        </div>
      </div>
    </div>
  );
}
