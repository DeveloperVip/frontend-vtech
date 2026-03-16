'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { contactSchema, type ContactFormData } from '@/validations/contactSchema';
import { submitContactForm, type ApiErrorResponse } from '@/services/contactService';

export type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export const useContactForm = () => {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [serverMessage, setServerMessage] = useState<string>('');

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
    mode: 'onTouched', // validate on blur, then on change after first touch
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitState('loading');
    setServerMessage('');

    try {
      const result = await submitContactForm(data);

      setSubmitState('success');
      setServerMessage(result.message);
      toast.success(result.message);
      form.reset();
    } catch (err) {
      const apiError = err as ApiErrorResponse;

      setSubmitState('error');
      setServerMessage(apiError.message || 'An unexpected error occurred.');

      // Map server-side field errors back into react-hook-form
      if (apiError.errors) {
        Object.entries(apiError.errors).forEach(([field, message]) => {
          form.setError(field as keyof ContactFormData, {
            type: 'server',
            message,
          });
        });
      } else {
        toast.error(apiError.message || 'Failed to send your message. Please try again.');
      }
    }
  };

  return {
    form,
    submitState,
    serverMessage,
    isLoading: submitState === 'loading',
    isSuccess: submitState === 'success',
    onSubmit: form.handleSubmit(onSubmit),
  };
};
