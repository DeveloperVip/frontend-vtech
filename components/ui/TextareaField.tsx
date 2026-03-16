'use client';

import clsx from 'clsx';

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export default function TextareaField({
  label,
  error,
  required,
  id,
  ...props
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-primary-500">*</span>}
      </label>
      <textarea
        id={id}
        rows={5}
        className={clsx('input-field resize-none', error && 'input-error')}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
