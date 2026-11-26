/**
 * Single source of truth for page copy and data.
 * Items marked PLACEHOLDER must be replaced with verified information before launch
 * (see docs/DEPLOYMENT.md, "Placeholders checklist").
 */

export const INTEREST_OPTIONS = [
  { value: "brochure", label: "Request brochure" },
  { value: "pricing", label: "Request pricing and payment details" },
  { value: "units", label: "Explore available units (2 and 3 bedroom)" },
  { value: "inspection", label: "Book a private inspection" },
] as const;

export type InterestValue = (typeof INTEREST_OPTIONS)[number]["value"];

export type FloorPlan = { src: string; width: number; height: number };

export const site = {
  name: "Halleyvine Residence",
  shortName: "Halleyvine",
  domain: "halleyvine.online",
  headline: "A new way to live in Sangotedo.",
  title: "Halleyvine Residence | A new way to live in Sangotedo",
  description:
    "Discover Halleyvine Residence: thoughtfully designed apartments for comfortable, modern living in Sangotedo, Lagos.",
  /** Header logo. width/height are the file's real pixel size (used for the aspect ratio). Set to null to show the text name. */
  logo: { src: "/images/logo.png", alt: "Halleyvine", width: 1119, height: 819 } as { src: string; alt: string; width: number; height: number } | null,
  /** Developer credit, shown in the footer. Set `logo` to null to show the name only. */
  developer: {
    name: "Chateau Royal Real Estate Limited",
    logo: { src: "/images/logo-chateau-royal.png", width: 301, height: 160 } as { src: string; width: number; height: number } | null,
  },
  whatsappDefaultNumber: "2348090194101",
  whatsappDisplay: "0809 019 4101",

  hero: {
    // Slideshow images, shown in this order. Files live in /public/images and follow hero-1.jpg, hero-2.jpg, ...
    // To add one: save public/images/hero-3.jpg and add a line below. An empty list shows a placeholder.
    images: [
      { src: "/images/hero-1.jpg", alt: "Halleyvine Residence exterior" },
      { src: "/images/hero-3.jpg", alt: "Halleyvine Residence exterior view" },
      { src: "/images/hero-4.jpg", alt: "Halleyvine Residence exterior view" },
      { src: "/images/hero-5.jpg", alt: "Halleyvine Residence exterior view" },
      { src: "/images/hero-6.jpg", alt: "Halleyvine Residence exterior view" },
      { src: "/images/hero-7.jpg", alt: "Halleyvine Residence exterior view" },
      { src: "/images/hero-8.jpg", alt: "Halleyvine Residence exterior view" },
    ] as { src: string; alt: string }[],
    /** Milliseconds each slide stays on screen before fading to the next. */
    intervalMs: 5000,
    imageAlt: "Halleyvine Residence exterior",
    subcopy:
      "Discover Halleyvine Residence, thoughtfully designed apartments for comfortable modern living.",
    cta: "Explore Halleyvine",
  },

  intro: {
    title: "A home for your next chapter",
    image: "/images/intro.jpg" as string | null, // PLACEHOLDER: "/images/intro.jpg"
    imageAlt: "Halleyvine Residence living space",
    // PLACEHOLDER copy drawn only from the brief; replace with the approved project description.
    body: [
      "Halleyvine Residence offers a contemporary residential experience designed around comfort, convenience and modern living.",
      "Set in the developing community of Sangotedo, it brings together modern apartment layouts and lifestyle amenities, with property options available for ownership.",
    ],
  },

  apartments: {
    title: "Find a space that fits your plans",
    subtitle: "Choose the layout that suits how you live.",
    units: [
      {
        id: "two-bed",
        name: "Two-bedroom apartment",
        bedrooms: 2,
        // width/height = the file's pixel size (keeps the plan's proportions). Set to null to show a placeholder.
        floorPlan: { src: "/plans/two-bed.jpg", width: 2276, height: 1280 } as FloorPlan | null,
        details: ["Two bedrooms", "Contemporary layout", "Size and finishes: to be confirmed"], // PLACEHOLDER details
      },
      {
        id: "three-bed",
        name: "Three-bedroom apartment",
        bedrooms: 3,
        floorPlan: { src: "/plans/three-bed.jpg", width: 2800, height: 1340 } as FloorPlan | null,
        details: ["Three bedrooms", "Contemporary layout", "Size and finishes: to be confirmed"], // PLACEHOLDER details
      },
    ],
  },

  living: {
    title: "More than just an apartment",
    image: null as string | null, // PLACEHOLDER: "/images/living.jpg"
    imageAlt: "Halleyvine Residence lifestyle and amenities",
    intro: "A residential experience built around comfort, convenience and modern living.",
    // PLACEHOLDER: replace with the CONFIRMED amenities list only.
    amenities: [
      { title: "Contemporary layouts", text: "Apartments planned for comfortable everyday living." },
      { title: "Lifestyle amenities", text: "Confirmed facilities to be listed here." },
      { title: "Convenient location", text: "In the developing community of Sangotedo." },
      { title: "Ownership options", text: "Available property options for ownership." },
    ],
  },

  location: {
    title: "Discover Sangotedo",
    image: null as string | null, // PLACEHOLDER: Novare Mall photo, "/images/novare-mall.jpg"
    imageAlt: "Novare Mall, Sangotedo",
    // PLACEHOLDER: replace with the exact project coordinates / address.
    mapQuery: "Sangotedo, Lagos, Nigeria",
    text: "Halleyvine Residence sits in Sangotedo, a developing residential location in Lagos, close to the Novare Mall, one of the area's best known landmarks.",
    // PLACEHOLDER: add the verified distance/drive time to the Lekki-Epe Expressway and the coastal road.
    coastalCallout: {
      title: "Close to the coastal road",
      text: "Distance and access details to be confirmed.",
    },
  },

  enquiry: {
    title: "Let's help you explore Halleyvine.",
    subtitle: "Tell us a little about what you are looking for. Our team will share the relevant information with you.",
  },

  whatsapp: {
    title: "Prefer a direct conversation?",
    cta: "Chat with us on WhatsApp",
  },
};
