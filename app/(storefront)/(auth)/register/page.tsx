import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account – FreshMart",
  description: "Join FreshMart and start getting fresh groceries delivered fast.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
