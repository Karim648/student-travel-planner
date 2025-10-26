// src/app/destinations/page.tsx
import ListingsGrid from "@/components/ListingsGrid";
import { allListings } from "@/data/listings";

export default function DestinationsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Destinations</h1>
      <ListingsGrid items={allListings} />
    </main>
  );
}
