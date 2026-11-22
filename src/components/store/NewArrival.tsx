import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function NewArrival() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
      <Reveal>
        <div className="flex flex-col items-center justify-between gap-6 border-y border-sand py-10 text-center md:flex-row md:text-left">
          <h2 className="text-3xl sm:text-4xl">New arrivals</h2>

          <p className="max-w-md text-sm leading-7 text-gray-600 md:text-base">
            Shop the newest pieces across women, men and kids. The latest
            additions appear first in the shop.
          </p>

          {/* /new-arrivals is not a route in this project; the shop lists newest first */}
          <Link href="/products" className="btn-primary shrink-0">
            Shop new arrivals
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
