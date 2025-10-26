"use client";

import { cn } from "@/components/ui/utils";
import { ForkKnife, Music, Map, Hammer, Leaf } from "lucide-react";
import type { ListingType } from "@/data/listings";

const OPTIONS: { key: ListingType; label: string; Icon: any }[] = [
  { key: "eats", label: "eats", Icon: ForkKnife },
  { key: "music", label: "music", Icon: Music },
  { key: "city-hop", label: "city hop", Icon: Map },
  { key: "workshops", label: "workshops", Icon: Hammer },
  { key: "nature", label: "nature", Icon: Leaf },
];

export default function FilterBar({
  selected,
  onSelect,
}: {
  selected: ListingType | null;
  onSelect: (t: ListingType) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {OPTIONS.map(({ key, label, Icon }) => {
        const active = selected === key;
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2 border transition text-sm font-medium",
              active
                ? "bg-[#DDF95C] text-black border-[#DDF95C]"
                : "bg-gray-200 text-gray-900 border-gray-300 hover:border-gray-400 hover:bg-gray-300"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
