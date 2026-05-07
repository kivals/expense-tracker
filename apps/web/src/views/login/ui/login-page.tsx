import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { LoginForm } from "@/features/auth/ui/login-form";

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Вход</CardTitle>
          <CardDescription>Войдите в свой аккаунт</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Нет аккаунта?&nbsp;
          <Link href="/register" className="text-primary underline-offset-4 hover:underline">
            Зарегистрируйтесь
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
