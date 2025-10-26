"use client";

import Image from "next/image";
import type { ListingDetail } from "@/data/listings";

export default function DestinationDetail({ detail }: { detail: ListingDetail }) {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* hero */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden border">
        <Image
          src={detail.image}
          alt={detail.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* title / meta */}
      <h1 className="text-2xl font-bold mt-6">{detail.name}</h1>
      <div className="text-sm text-gray-600 mt-1">
        {detail.address && <span>{detail.address}</span>}
        {detail.rating && <span className="ml-3">★ {detail.rating.toFixed(1)}</span>}
      </div>

      {/* long description */}
      {detail.longDescription && (
        <p className="mt-4 text-gray-700">{detail.longDescription}</p>
      )}

      {/* highlights */}
      {detail.highlights?.length ? (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Highlights</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {detail.highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
