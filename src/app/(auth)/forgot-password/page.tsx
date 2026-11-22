import Link from "next/link";

// The project has no password-reset API yet, so this page explains how to get
// help instead of showing a form that cannot work.
export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5 py-16">
      <div className="w-full max-w-md border border-sand bg-white p-8 text-center sm:p-12">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-wine-700 font-serif text-2xl italic text-white">
            H
          </span>
          <span className="font-serif text-xl">H Super Store.</span>
        </Link>

        <h1 className="mt-8 text-3xl">Forgot your password?</h1>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          Automatic password reset isn&apos;t available yet. Send us a message
          from the contact page and we&apos;ll help you get back into your
          account.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link href="/contact" className="btn-primary">
            Contact us
          </Link>

          <Link href="/login" className="btn-outline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
