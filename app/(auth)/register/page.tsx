import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account – Raihans Shop",
  description: "Join Raihans Shop and start getting fresh groceries delivered fast.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
