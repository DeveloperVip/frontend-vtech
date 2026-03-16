import apiClient, { ApiErrorResponse, ApiResponse } from './apiClient';
import type { ContactFormData } from '@/validations/contactSchema';

export interface ContactSubmitResult {
  id: number;
  fullName: string;
  email: string;
  subject: string;
  createdAt: string;
}

/**
 * Submit the contact form to the backend API
 */
export const submitContactForm = async (
  data: ContactFormData,
): Promise<ApiResponse<ContactSubmitResult>> => {
  const response = await apiClient.post<ApiResponse<ContactSubmitResult>>('/contacts', data);
  return response.data;
};

export type { ApiErrorResponse };
