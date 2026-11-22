import type { ReactNode } from "react";

import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import { CountryProvider } from "@/context/CountryContext";

export default function StoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CountryProvider>
      <Navbar />

      <main className="min-h-screen">
        {children}
      </main>

      <Footer />
    </CountryProvider>
  );
}
