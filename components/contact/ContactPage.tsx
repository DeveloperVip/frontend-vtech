import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-3 text-base text-gray-500">
            Have a question or project in mind? Fill in the form below and we&apos;ll get
            back to you as soon as possible.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <ContactForm />
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-gray-400">
          We typically respond within 1–2 business days.
        </p>
      </div>
    </main>
  );
}
