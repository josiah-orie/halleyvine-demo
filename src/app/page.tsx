import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SourceProvider } from "@/components/SourceProvider";
import { WhatsAppFab } from "@/components/WhatsAppButton";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Apartments } from "@/components/sections/Apartments";
import { Living } from "@/components/sections/Living";
import { Location } from "@/components/sections/Location";
import { EnquirySection } from "@/components/sections/EnquiryForm";
import { WhatsAppSection } from "@/components/sections/WhatsAppSection";

export default function Home() {
  return (
    <SourceProvider>
      <Header />
      <main>
        <Hero />
        <Intro />
        <Apartments />
        <Living />
        <Location />
        <EnquirySection />
        <WhatsAppSection />
      </main>
      <Footer />
      <WhatsAppFab />
    </SourceProvider>
  );
}
