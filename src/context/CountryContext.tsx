
"use client";

// React ke required functions import kar rahe hain
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// CountryCode mein sirf ye 7 country codes allowed hain
export type CountryCode = "PK" | "FR" | "US" | "IT" | "ES" | "OM" | "SA";

// Countries ka data store kar rahe hain
export const countries = [
  { code: "PK", name: "Pakistan", flag: "🇵🇰", currency: "PKR", symbol: "Rs." },
  { code: "FR", name: "France", flag: "🇫🇷", currency: "EUR", symbol: "€" },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", symbol: "$" },
  { code: "IT", name: "Italy", flag: "🇮🇹", currency: "EUR", symbol: "€" },
  { code: "ES", name: "Spain", flag: "🇪🇸", currency: "EUR", symbol: "€" },
  { code: "OM", name: "Oman", flag: "🇴🇲", currency: "OMR", symbol: "OMR" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR", symbol: "SAR" },
] as const; // Exact values preserve karta hai aur TypeScript mein readonly banata hai

// Context ke andar kis type ka data hoga, wo define kar rahe hain
type CountryContextType = {
  selectedCountry: CountryCode; // Currently selected country ka code
  setSelectedCountry: (country: CountryCode) => void; // Country change karne wala function
  selectedCountryInfo: (typeof countries)[number]; // Selected country ka complete object
};

// React Context create kar rahe hain
// Initially iska value undefined hoga
const CountryContext = createContext<CountryContextType | undefined>(
  undefined
);

// Provider component: iske andar jo components honge unko country data milega
export function CountryProvider({ children }: { children: ReactNode }) {

  // Default selected country Pakistan hai
  const [selectedCountry, setSelectedCountryState] =
    useState<CountryCode>("PK");

  // Component pehli baar load hone par saved country check hogi
  useEffect(() => {

    // Browser ke localStorage se saved country nikal rahe hain
    const savedCountry = localStorage.getItem("h-store-country");

    // Check kar rahe hain ke saved country hamari list mein exist karti hai ya nahi
    const isValidCountry = countries.some(
      (country) => country.code === savedCountry
    );

    // Agar country valid hai toh usko state mein set kar do
    if (isValidCountry) {
      setSelectedCountryState(savedCountry as CountryCode);
    }
  }, []); // Empty array ka matlab component mount hone par effect chalega

  // Ye custom function country change aur localStorage mein save karega
  const setSelectedCountry = (country: CountryCode) => {

    // React ki state mein selected country update karo
    setSelectedCountryState(country);

    // Nayi country browser ke localStorage mein save karo
    localStorage.setItem("h-store-country", country);
  };

  // Selected country ke code se uski complete information find karo
  const selectedCountryInfo =
    countries.find((country) => country.code === selectedCountry) ??

    // Agar country nahi milti toh first country (Pakistan) use karo
    countries[0];

  // Ye data Provider ke andar maujood sabhi child components ko milega
  return (
    <CountryContext.Provider
      value={{
        selectedCountry, // Current country
        setSelectedCountry, // Country change karne ka function
        selectedCountryInfo, // Country ki complete information
      }}
    >
      {children}
    </CountryContext.Provider>
  );
}

// Custom hook: kisi bhi child component mein country data access karne ke liye
export function useCountry() {

  // Context se data receive kar rahe hain
  const context = useContext(CountryContext);

  // Agar component CountryProvider ke bahar hai toh error show karo
  if (!context) {
    throw new Error("useCountry must be used inside CountryProvider");
  }

  // Context ka complete data return kar do
  return context;
}
