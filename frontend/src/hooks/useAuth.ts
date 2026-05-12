'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

export function useLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      login(data.token, data.email);
      toast.success('Login successful!');
      router.push('/dashboard');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.register(email, password),
    onSuccess: (data) => {
      login(data.token, data.email);
      toast.success('Registration successful!');
      router.push('/dashboard');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(message);
    },
  });
}
