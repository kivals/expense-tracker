"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { register } from "@/features/auth/api/auth-api";
import { registerSchema, type RegisterFormValues } from "@/features/auth/model/schemas";
import { useAuth } from "@/features/auth/model/auth-context";
import { ApiError } from "@/shared/api/client";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";

export function RegisterForm() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", agreeToTerms: false as never },
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    try {
      const { accessToken, user } = await register(values);
      setAuth(accessToken, user);
      router.push("/");
    } catch (err) {
      setServerError(
        err instanceof ApiError ? err.message : "Произошла ошибка. Попробуйте снова.",
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Минимум 8 символов" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreeToTerms"
          render={({ field }) => (
            <FormItem>
              <label className="flex items-center gap-2 cursor-pointer">
                <FormControl>
                  <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <span className="text-sm leading-snug">
                  Согласен с{" "}
                  <Link
                    href="/terms"
                    className="text-primary underline-offset-4 hover:underline"
                    target="_blank"
                  >
                    пользовательским соглашением
                  </Link>{" "}
                  и{" "}
                  <Link
                    href="/privacy"
                    className="text-primary underline-offset-4 hover:underline"
                    target="_blank"
                  >
                    политикой обработки данных
                  </Link>
                </span>
              </label>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && (
          <p className="text-destructive text-sm">{serverError}</p>
        )}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>
    </Form>
  );
}
