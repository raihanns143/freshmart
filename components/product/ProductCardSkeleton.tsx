import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("product-card group", className)}>
      <div className="product-card-image">
        <Skeleton className="w-full h-full rounded-none" />
        <Skeleton className="absolute top-3 right-3 w-8 h-8 rounded-full z-10 bg-white/60" />
      </div>
      <div className="p-4 flex flex-col h-[152px]">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-auto" />
        <div className="flex items-center gap-1.5 mt-2 mb-3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="w-9 h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
