/* Seed catalogue used by the admin Manage Services / Add / Update screens. */

export type ServiceStatus = "Active" | "Inactive"

export interface Service {
  id: string
  name: string
  category: string
  description: string
  /** Price in USD. */
  price: number
  /** Estimated duration in minutes. */
  duration: number
  image: string
  status: ServiceStatus
}

export const serviceCategories: string[] = [
  "Hair Care",
  "Skin & Facials",
  "Nails & Manicure",
  "Massage & Spa",
  "Makeup & Styling",
]

export const serviceStatuses: ServiceStatus[] = ["Active", "Inactive"]

export const seedServices: Service[] = [
  {
    id: "signature-haircut",
    name: "Signature Haircut",
    category: "Hair Care",
    description:
      "A precision cut tailored to your face shape, finished with a hot towel and blow-dry styling.",
    price: 45,
    duration: 45,
    image: "/images/hero-salon.png",
    status: "Active",
  },
  {
    id: "balayage-gloss",
    name: "Balayage & Gloss",
    category: "Hair Care",
    description:
      "Hand-painted highlights with a nourishing gloss treatment for a natural, sun-kissed finish.",
    price: 180,
    duration: 150,
    image: "/images/hero-salon.png",
    status: "Active",
  },
  {
    id: "royal-radiance-facial",
    name: "Royal Radiance Facial",
    category: "Skin & Facials",
    description:
      "A deep-cleansing facial with gold-infused serums to restore glow and firmness.",
    price: 95,
    duration: 60,
    image: "/images/hero-salon.png",
    status: "Active",
  },
  {
    id: "luxury-manicure",
    name: "Luxury Manicure",
    category: "Nails & Manicure",
    description:
      "Classic manicure with cuticle care, a relaxing hand massage and a long-lasting gel finish.",
    price: 35,
    duration: 40,
    image: "/images/hero-salon.png",
    status: "Inactive",
  },
  {
    id: "aromatherapy-massage",
    name: "Aromatherapy Massage",
    category: "Massage & Spa",
    description:
      "A full-body relaxation massage with essential oils chosen to match your mood.",
    price: 120,
    duration: 75,
    image: "/images/hero-salon.png",
    status: "Active",
  },
]
