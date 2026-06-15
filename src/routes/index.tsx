import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Lenis from "lenis";
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
import { StackSection } from "@/components/site/StackSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPNC Clinic & Dr. Nimmy's Radiance Skin and Hair Clinic — Sulthan Bathery, Wayanad" },
      {
        name: "description",
        content:
          "Multi-speciality clinic in Sulthan Bathery, Wayanad — Neurology, Dermatology, Orthopedics, Psychiatry & Pharmacy, plus Dr. Nimmy's Radiance Skin and Hair Clinic.",
      },
      { property: "og:title", content: "SPNC Clinic — Trusted Healthcare in Wayanad" },
      {
        property: "og:description",
        content: "Advanced Care. Trusted Specialists. Healthy Living.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-slate-900">
      <Navbar />

      {/* 
        Hero uses StackSection so it sticks and zooms out on first scroll.
        The rest of the page flows normally over it.
      */}
      <StackSection bg="bg-transparent" zIndex={10}>
        <Hero />
      </StackSection>

      {/* The rest of the page scrolls up normally as one continuous block */}
      <div className="relative z-20 bg-white shadow-[0_-8px_32px_-4px_rgba(0,0,0,0.12)]">
        <Departments />
        <Doctors />
        <Radiance />
        <AIAssessment />
        <Pharmacy />
        <BookAppointment />
        <Footer />
      </div>

      <ChatOrb />
    </div>
  );
}
