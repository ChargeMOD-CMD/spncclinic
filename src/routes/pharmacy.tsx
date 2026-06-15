import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Pharmacy } from "@/components/site/Pharmacy";
import { Footer } from "@/components/site/Footer";
import { ChatOrb } from "@/components/site/ChatOrb";

export const Route = createFileRoute("/pharmacy")({
  component: PharmacyPage,
});

function PharmacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900">
      <Navbar />
      <main className="flex-1 bg-white pt-24 md:pt-32">
        <Pharmacy />
      </main>
      <Footer />
      <ChatOrb />
    </div>
  );
}
