import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Hero } from "./sections/Hero";
import { HeroGallery } from "./HeroGallery";
import { site } from "@/content/site";
import { WhatsAppSection } from "./sections/WhatsAppSection";
import { Intro } from "./sections/Intro";
import { Apartments } from "./sections/Apartments";
import { Location } from "./sections/Location";
import { EnquiryForm } from "./sections/EnquiryForm";
import { SourceProvider } from "./SourceProvider";
import { Header } from "./Header";
import { Footer } from "./Footer";

describe("sections", () => {
  it("renders header and footer with developer credit", () => {
    render(<><Header /><Footer /></>);
    expect(screen.getByText("Enquire")).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    expect(screen.getByText("Developed by")).toBeInTheDocument();
    expect(screen.getByText(site.developer.name)).toBeInTheDocument();
    expect(screen.getByAltText(site.developer.name)).toBeInTheDocument();
  });
  it("renders the WhatsApp section with a tap-to-call line", () => {
    render(<SourceProvider><WhatsAppSection /></SourceProvider>);
    expect(screen.getByText(site.whatsapp.call)).toHaveAttribute("href", `tel:${site.whatsapp.phone}`);
  });
  it("renders hero headline and CTA", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(site.headline);
    expect(screen.getByText(site.hero.cta)).toHaveAttribute("href", "#introduction");
  });
  it("hero gallery auto-advances and responds to dots", () => {
    vi.useFakeTimers();
    const images = [
      { src: "/images/a.jpg", alt: "A" },
      { src: "/images/b.jpg", alt: "B" },
      { src: "/images/c.jpg", alt: "C" },
    ];
    const { container } = render(<HeroGallery images={images} intervalMs={1000} />);
    const active = () => container.querySelector(".hv-slide.is-active .hv-slide-fg img")?.getAttribute("alt");
    expect(active()).toBe("A");
    act(() => vi.advanceTimersByTime(1000));
    expect(active()).toBe("B");
    fireEvent.click(screen.getByLabelText("Show photo 3 of 3"));
    expect(active()).toBe("C");
    act(() => vi.advanceTimersByTime(1000));
    expect(active()).toBe("A");
    vi.useRealTimers();
  });
  it("hero gallery hides dots for a single image", () => {
    render(<HeroGallery images={[{ src: "/images/a.jpg", alt: "A" }]} />);
    expect(screen.queryByLabelText(/Show photo/)).not.toBeInTheDocument();
  });
  it("renders the intro title", () => {
    render(<Intro />);
    expect(screen.getByText(site.intro.title)).toBeInTheDocument();
  });
  it("opens and closes the floor plan dialog", () => {
    render(<SourceProvider><Apartments /></SourceProvider>);
    expect(screen.getByText(site.apartments.units[0].name)).toBeInTheDocument();
    expect(screen.getByText(site.apartments.units[1].name)).toBeInTheDocument();
    fireEvent.click(screen.getAllByText("View floor plan")[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Close floor plan"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("shows the coastal road call-out and a lazy map", () => {
    render(<Location />);
    expect(screen.getByText(site.location.coastalCallout.title.trim())).toBeInTheDocument();
    expect(screen.getByTitle(/Map showing/)).toHaveAttribute("loading", "lazy");
  });
});

describe("EnquiryForm", () => {
  it("shows validation errors and does not submit invalid data", () => {
    render(<SourceProvider><EnquiryForm /></SourceProvider>);
    fireEvent.click(screen.getByText("Submit enquiry"));
    expect(screen.getByText("Please enter your full name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your phone or WhatsApp number.")).toBeInTheDocument();
    expect(screen.getByText("Please select your interest.")).toBeInTheDocument();
  });
  it("lists the four interest options", () => {
    render(<SourceProvider><EnquiryForm /></SourceProvider>);
    expect(screen.getAllByRole("option")).toHaveLength(5);
  });
});
