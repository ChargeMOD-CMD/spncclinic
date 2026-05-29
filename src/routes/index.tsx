import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Departments } from "@/components/site/Departments";
import { Doctors } from "@/components/site/Doctors";
import { Radiance } from "@/components/site/Radiance";
import { AIAssessment } from "@/components/site/AIAssessment";
import { Pharmacy } from "@/components/site/Pharmacy";
import { BookAppointment } from "@/components/site/BookAppointment";
import { Footer } from "@/components/site/Footer";
import { ChatOrb } from "@/components/site/ChatOrb";
import { Cursor } from "@/components/site/Cursor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SNPC Clinic & Dr. Nimmy's Radiance Skin and Hair Clinic — Wayanad" },
      {
        name: "description",
        content:
          "Multi-speciality clinic in Sulthan Bathery, Wayanad — Neurology, Dermatology, Orthopedics, Psychiatry & Pharmacy, plus Dr. Nimmy's Radiance Skin and Hair Clinic.",
      },
      { property: "og:title", content: "SNPC Clinic · Radiance NeuroVerse" },
      {
        property: "og:description",
        content: "Advanced Care. Trusted Specialists. Radiant Health.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Departments />
        <Doctors />
        <Radiance />
        <AIAssessment />
        <Pharmacy />
        <BookAppointment />
      </main>
      <Footer />
      <ChatOrb />
    </div>
  );
}
