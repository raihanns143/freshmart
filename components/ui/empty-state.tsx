import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 w-full", className)}>
      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-8">{description}</p>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        {primaryAction && (
          primaryAction.href ? (
            <Link
              href={primaryAction.href}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-secondary active:scale-[0.98] transition-all"
            >
              {primaryAction.label}
            </Link>
          ) : (
            <button
              onClick={primaryAction.onClick}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-secondary active:scale-[0.98] transition-all"
            >
              {primaryAction.label}
            </button>
          )
        )}
        
        {secondaryAction && (
          secondaryAction.href ? (
            <Link
              href={secondaryAction.href}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-gray-700 font-semibold px-8 py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
            >
              {secondaryAction.label}
            </Link>
          ) : (
            <button
              onClick={secondaryAction.onClick}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-gray-700 font-semibold px-8 py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
            >
              {secondaryAction.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
