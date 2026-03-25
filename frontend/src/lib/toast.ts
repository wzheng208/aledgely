import axios from 'axios';
import { toast } from 'sonner';

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong.',
) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | undefined;

    return data?.message ?? data?.error ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export const appToast = {
  success(message: string) {
    toast.success(message);
  },

  error(error: unknown, fallback = 'Something went wrong.') {
    toast.error(getErrorMessage(error, fallback));
  },

  created(entity: string) {
    toast.success(`${entity} created successfully.`);
  },

  updated(entity: string) {
    toast.success(`${entity} updated successfully.`);
  },

  deleted(entity: string) {
    toast.success(`${entity} deleted successfully.`);
  },

  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error?: string;
    },
  ) {
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: (error) => getErrorMessage(error, messages.error),
    });

    return promise;
  },
};
