import Navbar from "@/components/Navbar";
import Image from "next/image";
import { allListings } from "@/data/listings";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart } from "lucide-react"; // icon library, comes with shadcn
import ListingsGrid from "@/components/ListingsGrid";
import AIAgentButton from "@/components/AIAgentButton";

export default function MainPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl p-6">
        <ListingsGrid items={allListings} />
        <AIAgentButton />
      </main>
    </div>
  );
}
