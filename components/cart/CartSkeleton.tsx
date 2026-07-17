import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="section-container">
        <Skeleton className="h-9 w-64 mb-8" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Skeleton className="w-full sm:w-24 h-48 sm:h-24 rounded-xl flex-shrink-0" />
                <div className="flex-1 w-full">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4 mb-3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-8 w-32 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <Skeleton className="h-7 w-48 mb-6" />
              <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-100">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="flex justify-between items-end mb-8">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-14 w-full rounded-xl mb-4" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
