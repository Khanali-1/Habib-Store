import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-brand px-4 py-2.5 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center text-center text-xs sm:text-sm">
        <p>
          <span className="font-bold text-pink-200">
            FREE SHIPPING
          </span>{" "}
          on selected orders
        </p>

        <Link
          href="/products"
          className="ml-4 hidden font-semibold text-white transition hover:text-pink-200 sm:inline"
        >
          Explore Offers →
        </Link>
      </div>
    </div>
  );
}