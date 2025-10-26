import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Saved Items",
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
