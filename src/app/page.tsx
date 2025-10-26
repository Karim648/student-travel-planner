import Navbar from "@/components/Navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/main");

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/landing-bg.png')" }}
    >
      <Navbar />
      <main className="flex flex-1 flex-col justify-center p-6 pl-24">
        <div className="text-left max-w-lg pl-8">
          <h2 className="text-5xl font-bold text-black mb-6 leading-tight">
            Discover authentic, budget-friendly experiences for your trip with Coot!
          </h2>
          <p className="text-gray-700 text-xl mb-8">
            Get personalized travel recommendations, budget tips, and activity suggestions from our latest AI-powered travel assistant, Coot!
          </p>
        </div>
      </main>
    </div>
  );
}
