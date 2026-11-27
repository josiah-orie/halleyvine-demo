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

/** An image plus its real pixel size, so the page can keep its proportions without cropping. */
export type ImageAsset = { src: string; width: number; height: number };
export type FloorPlan = ImageAsset;

/** One card in "More than just an apartment". */
export type Amenity = { title: string; text?: string; intro?: string; items?: string[] };

export const site = {
  name: "Halleyvine Residence – Off Lagos-Calabar Coastal road",
  shortName: "Halleyvine",
  domain: "halleyvine.online",
  headline: "A new way to live in Sangotedo.",
  title: "Halleyvine Residence | A new way to live in Sangotedo",
  description:
    "Comprising of thoughtfully designed apartments for comfortable modern living",
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
      { src: "/images/hero-9.jpg", alt: "Halleyvine Residence exterior view" },
      { src: "/images/hero-10.jpg", alt: "Halleyvine Residence exterior view" },
    ] as { src: string; alt: string }[],
    /** Milliseconds each slide stays on screen before fading to the next. */
    intervalMs: 5000,
    imageAlt: "Halleyvine Residence exterior",
    subcopy:
      "Comprising of thoughtfully designed apartments for comfortable modern living.",
    cta: "Start Here",
  },

  intro: {
    title: "A home for your next chapter",
    // width/height = the file's pixel size. The frame takes this shape, so the whole image shows (no cropping).
    // If you replace intro.jpg with a different size, update these two numbers.
    image: { src: "/images/intro.jpg", width: 2400, height: 1792 } as ImageAsset | null,
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
    image: "/images/living.jpg" as string | null, // PLACEHOLDER: "/images/living.jpg"
    imageAlt: "Halleyvine Residence lifestyle and amenities",
    intro: "A residential experience built around comfort, convenience and modern living.",
    // Each card has a title, then any of: `text` (a sentence), `intro` (a lead-in line) and `items` (a bulleted list).
    amenities: [
      { title: "Contemporary layouts", text: "Apartments planned for comfortable everyday living." },
      {
        title: "Lifestyle amenities",
        items: [
          "Gated access with CCTV surveillance",
          "Solar-powered perimeter lighting",
          "A clubhouse with a concierge, gym, mini mart, pharmacare, estate facility office and café",
        ],
      },
      {
        title: "Convenient location",
        intro: "With light traffic, drive time estimates are:",
        items: [
          "25 mins to VI (Eko Hotel)",
          "8 mins to Novare Mall",
          "20 mins to Ziba Beach Resort",
          "12 mins to Giwa Gardens Resort",
          "10 mins to Sangotedo Market",
          "15 mins to Lagos Business School",
          "9 mins to Lufasi Park",
        ],
      },
      { title: "Ownership options", text: "1, 2 & 3-bed apartments with 4-bed semi-detached with 1room BQ Eligible for mortgage purchases too" },
    ] as Amenity[],
  },

  location: {
    title: "Discover Sangotedo",
    image: "/images/novare-mall.jpg" as string | null, // PLACEHOLDER: Novare Mall photo, "/images/novare-mall.jpg"
    imageAlt: "Novare Mall, Sangotedo",
    // PLACEHOLDER: replace with the exact project coordinates / address.
    mapQuery: "Sangotedo, Lagos, Nigeria",
    text: "The Halleyvine Residences' strategic positioning in Sangotedo, puts it at a halfway point between  the bustling city life constantly developing along the Lekki-Epe expressway and to the just completed Lagos-Calabar coastal road. " +
        "Other notable landmarks within a 6km radius (estimated 20min drive) include Ziba Resort, Giwa Gardens Resort, Lagos Business School, Sangotedo market and the Lufasi Natural Park to name a few. Despite being constantly overlooked as a location of good value, " +
        "Sangotedo has over the past decade, still grown by a 3x value appreciation higher than Lekki 1.",
    // PLACEHOLDER: add the verified distance/drive time to the Lekki-Epe Expressway and the coastal road.
    coastalCallout: {
      title: "Constantly over looked as a location of value, ",
      text: "Sangotedo has over the past decade, still grown by 3x value appreciation higher than Lekki 1.",
    },
  },

  enquiry: {
    title: "Let's help you explore Halleyvine.",
    subtitle: "Tell us a little about what you are looking for.",
    /** Shown on its own line below the subtitle, in smaller text. */
    note: "Our team will share the relevant information with you.",
  },

  whatsapp: {
    title: "Prefer a direct conversation?",
    /** Line below the title; tapping it on a phone dials the number in `phone`. */
    call: "Call 0809 019 4101",
    phone: "+2348090194101",
    cta: "Chat with us on WhatsApp",
    /**
     * Pre-filled WhatsApp message. The campaign code is added after it as "(Ref: code)" when the visitor came from a QR code.
     * After the enquiry form, the follow-up button also adds the visitor's name and interest.
     */
    message:
      "Hi, I came across your Halleyvine webpage and are interested. Are you available for a quick chat to share more information about it?",
  },
};
