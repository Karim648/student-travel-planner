import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth(); 

  if (userId) {
    redirect("/main");
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <SignIn />
    </div>
  );
}
