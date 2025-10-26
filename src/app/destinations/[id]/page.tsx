// src/app/destinations/[id]/page.tsx
import { notFound } from "next/navigation";
import { getListingDetailById } from "@/data/listings";
import DestinationDetail from "@/components/DestinationDetail";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;                 // ← await the Promise
  const detail = getListingDetailById(id);     // now id is defined

  if (!detail) return notFound();
  return <DestinationDetail detail={detail} />;
}
