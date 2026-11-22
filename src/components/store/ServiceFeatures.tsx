import Link from "next/link";
import {
  FiHeadphones,
  FiRefreshCcw,
  FiMapPin,
  FiGlobe,
} from "react-icons/fi";

// Only Customer Support has a real destination (/contact) in this project.
// The other three had links to pages that do not exist, so they are plain text.
const services = [
  {
    title: "Customer Support",
    description: "Mon - Sat, 9am - 6pm",
    icon: FiHeadphones,
    href: "/contact",
    linkText: "Contact us",
  },
  {
    title: "Easy Exchange",
    description: "14 days easy exchange",
    icon: FiRefreshCcw,
  },
  {
    title: "Store Locator",
    description: "Find your nearest store",
    icon: FiMapPin,
  },
  {
    title: "Worldwide Delivery",
    description: "T&C Applied",
    icon: FiGlobe,
  },
];

export default function ServiceFeatures() {
  return (
    <section className="mt-10 w-full border-y border-sand bg-cream px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4">
        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <div
              key={service.title}
              className={`flex items-start justify-center gap-4 px-2 md:px-4 ${
                index !== 0 ? "md:border-l md:border-sand" : ""
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ivory text-wine-700">
                <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <h3 className="font-serif text-base text-brand">{service.title}</h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {service.description}
                </p>

                {service.href && service.linkText && (
                  <Link
                    href={service.href}
                    className="link-underline mt-2 text-xs font-medium text-wine-700"
                  >
                    {service.linkText}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
