export const A = "/assets"

export type Product = {
  slug: string
  name: string
  collection: "Calm" | "Playful"
  image: string
  price: number
  description: string
}

export const products: Product[] = [
  {
    slug: "veil-of-spring",
    name: "Veil of Spring",
    collection: "Calm",
    image: "88bb3.png",
    price: 250,
    description:
      "Nature brings calm through a field of soft botanicals, rendered in powdery blush, sage and warm ivory.",
  },
  {
    slug: "lavender-hush",
    name: "Lavender Hush",
    collection: "Calm",
    image: "4b133.png",
    price: 250,
    description:
      "Delicate stems and blooms settle into a quiet rhythm, bringing a composed softness to bedrooms and retreats.",
  },
  {
    slug: "soft-unfurl",
    name: "Soft Unfurl",
    collection: "Calm",
    image: "f0b0a.png",
    price: 200,
    description:
      "A large-scale botanical study with pencil-fine detail and an airy sense of movement.",
  },
  {
    slug: "jungle-jamboree",
    name: "Jungle Jamboree",
    collection: "Playful",
    image: "d9f80.png",
    price: 250,
    description:
      "A lush illustrated world where curious creatures and tropical leaves turn a room into a story.",
  },
  {
    slug: "little-wanderers",
    name: "Little Wanderers",
    collection: "Playful",
    image: "5b08b.png",
    price: 250,
    description:
      "Tiny hand-drawn characters wander across an open ground, made for imaginative nurseries and playrooms.",
  },
  {
    slug: "little-mischief",
    name: "Little Mischief",
    collection: "Playful",
    image: "4d797.png",
    price: 250,
    description:
      "A light-hearted scatter of friendly forms and small surprises in a softly coloured repeat.",
  },
  {
    slug: "sweet-escape",
    name: "Sweet Escape",
    collection: "Playful",
    image: "ba47b.png",
    price: 250,
    description:
      "A dreamy fairytale landscape of castles, clouds and balloons, painted in an almost weightless palette.",
  },
]

export const articles = [
  {
    image: "45774.png",
    label: "DESIGN NOTES / 6 MIN READ",
    title: "Pattern scale: small detail, big difference",
    copy: "How to think about motif size, wall proportions and the feeling they create in the room.",
  },
  {
    image: "f8d45.png",
    label: "MATERIALS / 6 MIN READ",
    title: "The quiet character of textured walls",
    copy: "A closer look at tactile finishes and why your lighting belongs in the material conversation.",
  },
  {
    image: "c4c45.png",
    label: "COLOUR STORIES / 8 MIN READ",
    title: "A palette built around peacock teal",
    copy: "Pair rich botanicals with timber, warm neutrals and considered accents.",
  },
  {
    image: "6900b.png",
    label: "STUDIO JOURNAL / 7 MIN READ",
    title: "What to bring to a studio visit",
    copy: "Measurements, photographs and your moodboard: a useful starting point for exploring walls.",
  },
  {
    image: "f8750.png",
    label: "MATERIALS / 5 MIN READ",
    title: "Architectural rhythm with wall panels",
    copy: "Explore the relationship between linear surfaces, proportions and the rest of your room.",
  },
  {
    image: "8aa54.png",
    label: "FOR DESIGNERS / 4 MIN READ",
    title: "From a moodboard to a sample palette",
    copy: "A considered way to organise patterns and textures before the final specification.",
  },
]
