import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { RegisterForm } from "@/features/auth/ui/register-form";

export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Регистрация</CardTitle>
          <CardDescription>Создайте новый аккаунт</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Уже есть аккаунт?&nbsp;
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Войти
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
