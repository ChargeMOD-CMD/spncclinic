import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Departments } from "@/components/site/Departments";
import { Footer } from "@/components/site/Footer";
import { ChatOrb } from "@/components/site/ChatOrb";

export const Route = createFileRoute("/departments")({
  component: DepartmentsPage,
});

function DepartmentsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900">
      <Navbar />
      <main className="flex-1 bg-white pt-24 md:pt-32">
        <Departments />
      </main>
      <Footer />
      <ChatOrb />
    </div>
  );
}
