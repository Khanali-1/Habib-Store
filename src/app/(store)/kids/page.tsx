import type { Metadata } from "next";
import CollectionPage from "@/components/store/CollectionPage";
import { getCollection } from "@/lib/collections";

const collection = getCollection("kids");

export const metadata: Metadata = {
  title: `${collection.title} | H Store`,
  description: collection.description,
};

export default function Page() {
  return <CollectionPage slug="kids" />;
}
