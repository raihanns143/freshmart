"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, User, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import axios from "axios";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormType = z.infer<typeof registerSchema>;

const passwordChecks = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormType>({ resolver: zodResolver(registerSchema) });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormType) => {
    setIsLoading(true);
    try {
      await axios.post("/api/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.error || "Registration failed"
          : "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-[480px] p-8 sm:p-10 flex flex-col items-center">

        {/* Logo */}
        <Link href="/" className="mb-6 flex justify-center focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg">
          <Image
            src="/logo.png"
            alt="FreshMart Logo"
            width={160}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Create your account</h1>
        <p className="text-gray-500 text-sm mb-8 text-center">Join thousands of happy customers</p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">

          {/* Name */}
          <div className="w-full text-left">
            <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="reg-name"
                {...register("name")}
                className={cn(
                  "w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
                  errors.name && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                )}
                placeholder="Karim Rahman"
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1.5">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="w-full text-left">
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="reg-email"
                {...register("email")}
                type="email"
                className={cn(
                  "w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
                  errors.email && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                )}
                placeholder="karim@example.com"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="w-full text-left">
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="reg-password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className={cn(
                  "w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
                  errors.password && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                )}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-primary rounded-lg transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                </button>
              </div>
            </div>
            {/* Password strength */}
            {password && (
              <div className="mt-2 space-y-1">
                {passwordChecks.map((check) => (
                  <div key={check.label} className="flex items-center gap-1.5">
                    <CheckCircle2
                      className={cn(
                        "w-3.5 h-3.5",
                        check.test(password) ? "text-blue-500" : "text-gray-300"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs",
                        check.test(password) ? "text-blue-600" : "text-gray-400"
                      )}
                    >
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {errors.password && (
              <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="w-full text-left">
            <label htmlFor="reg-confirm" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="reg-confirm"
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                className={cn(
                  "w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
                  errors.confirmPassword && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                )}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-primary rounded-lg transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                </button>
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-4 rounded-xl hover:bg-secondary active:scale-[0.98] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-5">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:text-primary/80 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
