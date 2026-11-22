/**
 * Single source of truth for the six storefront collections.
 * Routes match the existing /men page and the ShopByCategory tabs.
 * Category matching is name-based, exactly like the original Men page.
 */
export type CollectionSlug =
  | "men"
  | "women"
  | "kids"
  | "fragrance"
  | "jewellery"
  | "accessories";

export interface CollectionConfig {
  slug: CollectionSlug;
  href: string;
  label: string;
  title: string;
  description: string;
  /** Lower-case category-name prefixes that belong to this collection */
  prefixes: string[];
  heroImage: string;
  fallbackImage: string;
}

const photo = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const collections: CollectionConfig[] = [
  {
    slug: "men",
    href: "/men",
    label: "Men",
    title: "Men's Collection",
    description:
      "Considered tailoring and everyday essentials, cut for comfort and made to last.",
    prefixes: ["men"],
    heroImage: photo("photo-1617137968427-85924c800a22", 2000),
    fallbackImage: photo("photo-1617137968427-85924c800a22", 900),
  },
  {
    slug: "women",
    href: "/women",
    label: "Women",
    title: "Women's Collection",
    description:
      "Graceful silhouettes and rich fabrics for every occasion, from morning to evening.",
    prefixes: ["women"],
    heroImage: photo("photo-1483985988355-763728e1935b", 2000),
    fallbackImage: photo("photo-1483985988355-763728e1935b", 900),
  },
  {
    slug: "kids",
    href: "/kids",
    label: "Kids",
    title: "Kids' Collection",
    description:
      "Soft, easy styles for babies, girls and boys that keep up with every adventure.",
    prefixes: ["kid", "children", "boys", "girls"],
    heroImage: photo("photo-1503919005314-30d93d07d823", 2000),
    fallbackImage: photo("photo-1503919005314-30d93d07d823", 900),
  },
  {
    slug: "fragrance",
    href: "/fragrance",
    label: "Fragrance",
    title: "Fragrance",
    description:
      "Signature scents that linger: warm woods, soft florals and fresh citrus.",
    prefixes: ["fragrance", "perfume"],
    heroImage: photo("photo-1541643600914-78b084683601", 2000),
    fallbackImage: photo("photo-1541643600914-78b084683601", 900),
  },
  {
    slug: "jewellery",
    href: "/jewellery",
    label: "Jewellery",
    title: "Jewellery",
    description:
      "Finishing touches in gold and stone, made to be worn daily and kept for years.",
    prefixes: ["jewel"],
    heroImage: photo("photo-1515562141207-7a88fb7ce338", 2000),
    fallbackImage: photo("photo-1515562141207-7a88fb7ce338", 900),
  },
  {
    slug: "accessories",
    href: "/accessories",
    label: "Accessories",
    title: "Accessories",
    description:
      "Bags, watches and small details that complete an outfit.",
    prefixes: ["accessor", "bag"],
    heroImage: photo("photo-1584917865442-de89df76afd3", 2000),
    fallbackImage: photo("photo-1584917865442-de89df76afd3", 900),
  },
];

export function getCollection(slug: CollectionSlug): CollectionConfig {
  return collections.find((item) => item.slug === slug) ?? collections[0];
}

export function categoryNameOf(category: unknown): string {
  if (category && typeof category === "object" && "name" in category) {
    const name = (category as { name?: unknown }).name;
    return typeof name === "string" ? name : "";
  }
  return "";
}

export function matchesCollection(
  category: unknown,
  collection: CollectionConfig
): boolean {
  const name = categoryNameOf(category).trim().toLowerCase();
  if (!name) return false;
  return collection.prefixes.some((prefix) => name.startsWith(prefix));
}
