import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb skeleton */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="section-container">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      
      {/* Main product area */}
      <div className="section-container py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Images skeleton */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="aspect-square rounded-xl" />
            </div>
          </div>
          
          {/* Details skeleton */}
          <div className="w-full lg:w-1/2 flex flex-col py-2">
            <Skeleton className="h-5 w-24 mb-3" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-4 w-32 mb-6" />
            <div className="flex items-center gap-4 mb-8">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
            
            <Skeleton className="h-20 w-full rounded-2xl mb-8" />
            
            <div className="space-y-4 mb-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            
            <Skeleton className="h-14 w-full rounded-xl mb-4" />
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
