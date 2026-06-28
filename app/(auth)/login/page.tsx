import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In – FreshMart",
  description: "Sign in to your FreshMart account to access your orders and wishlist.",
};

export default function LoginPage() {
  return <LoginForm />;
}
