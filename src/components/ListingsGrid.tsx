"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, MouseEvent } from "react";
import type { Listing, ListingType } from "@/data/listings";
import FilterBar from "./FilterBar";
import SearchBar from "./SearchBar";
import BudgetSlider, { BudgetRange } from "./BudgetSlider";
import DateRangeFilter, { DateRange } from "./DateRangeFilter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, X } from "lucide-react";

export default function ListingsGrid({ items }: { items: Listing[] }) {
  const [selected, setSelected] = useState<ListingType | null>(null);
  const [query, setQuery] = useState("");
  const [dates, setDates] = useState<DateRange>({});

  // Budget limits
  const [absMin, absMax] = useMemo(() => {
    if (!items.length) return [0, 0] as const;
    return [
      Math.min(...items.map((i) => i.price)),
      Math.max(...items.map((i) => i.price)),
    ] as const;
  }, [items]);

  const [budget, setBudget] = useState<BudgetRange>({ min: absMin, max: absMax });

  useEffect(() => {
    if (items.length) setBudget({ min: absMin, max: absMax });
  }, [items.length, absMin, absMax]);

  // Date overlap logic
  const overlaps = (s1: string, e1: string, s2?: string, e2?: string) => {
    if (!s2 && !e2) return true;
    const start2 = s2 ?? s1;
    const end2 = e2 ?? e1;
    return s1 <= end2 && start2 <= e1;
  };

  // Apply filters
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = selected ? items.filter((i) => i.type === selected) : items;

    if (q)
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );

    list = list.filter((i) => i.price >= budget.min && i.price <= budget.max);

    if (dates.start || dates.end) {
      list = list.filter((i) =>
        overlaps(i.dateRange.start, i.dateRange.end, dates.start, dates.end)
      );
    }

    return list;
  }, [items, selected, query, budget.min, budget.max, dates.start, dates.end]);

  const onHeartClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: favorite toggle
  };

  // ✅ One central "Clear All" function
  const clearAllFilters = () => {
    setSelected(null);
    setQuery("");
    setDates({});
    setBudget({ min: absMin, max: absMax });
  };

  return (
    <div className="space-y-5">
      {/* Controls inside a single gray rounded box */}
      <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
          {/* Destination / Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
            <SearchBar
              value={query}
              onChange={setQuery}
              label=""
              placeholder="Enter a City or Country"
              className="w-full"
            />
          </div>

          {/* Date range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <DateRangeFilter value={dates} onChange={setDates} label="" />
          </div>

          {/* Price / Budget slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <BudgetSlider
                  min={absMin}
                  max={absMax}
                  step={1}
                  value={budget}
                  onChange={setBudget}
                  label=""
                />
              </div>
              <div className="whitespace-nowrap text-sm text-gray-600">
              </div>
            </div>
          </div>
        </div>

        {/* Experience chips + Clear All (aligned and styled) */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience
          </label>

          <div className="flex flex-wrap items-center gap-3 justify-between">
            {/* Filter chips */}
            <div className="flex flex-wrap items-center gap-3">
              <FilterBar selected={selected} onSelect={(t) => setSelected(t)} />
            </div>

            {/* Clear All button — slightly moved left for alignment */}
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 h-10 rounded-md bg-black text-white px-4 text-sm font-medium hover:bg-gray-900 transition mr-4"
            >
              <X className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

      </div>

      {/* Results */}
      <h2 className="text-lg font-semibold">Hidden Gems for You</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <Link
            key={item.id}
            href={`/destinations/${item.id}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
          >
            <Card className="relative overflow-hidden group cursor-pointer">
              <CardContent className="p-0">
                <div className="relative w-full h-48">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center border-t p-4">
                <span className="text-base font-semibold">${item.price}</span>
                <button
                  className="rounded-full p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Add to favorites"
                  onClick={onHeartClick}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No results. Try another destination or adjust filters.
        </p>
      )}
    </div>
  );
}
