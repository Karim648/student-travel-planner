import React from "react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Recommendations",
};

export default function RecommendationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
