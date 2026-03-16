'use client';

import { useContactForm } from '@/hooks/useContactForm';
import InputField from '@/components/ui/InputField';
import TextareaField from '@/components/ui/TextareaField';

export default function ContactForm() {
  const { form, isLoading, isSuccess, onSubmit } = useContactForm();
  const {
    register,
    formState: { errors },
  } = form;

  if (isSuccess) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-3 text-4xl">✅</div>
        <h3 className="mb-2 text-xl font-semibold text-green-800">Message Sent!</h3>
        <p className="text-sm text-green-700">
          Thank you for reaching out. We&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {/* Row: Full Name + Email */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <InputField
          id="fullName"
          label="Full Name"
          placeholder="John Doe"
          autoComplete="name"
          required
          disabled={isLoading}
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <InputField
          id="email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          autoComplete="email"
          required
          disabled={isLoading}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      {/* Row: Phone + Subject */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <InputField
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="+84 900 000 000"
          autoComplete="tel"
          disabled={isLoading}
          error={errors.phone?.message}
          {...register('phone')}
        />
        <InputField
          id="subject"
          label="Subject"
          placeholder="How can we help?"
          required
          disabled={isLoading}
          error={errors.subject?.message}
          {...register('subject')}
        />
      </div>

      {/* Message */}
      <TextareaField
        id="message"
        label="Message"
        placeholder="Tell us more about your inquiry..."
        required
        disabled={isLoading}
        error={errors.message?.message}
        {...register('message')}
      />

      {/* Submit */}
      <div className="flex items-center justify-end">
        <button type="submit" className="btn-primary min-w-[160px]" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Sending…
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </div>
    </form>
  );
}
