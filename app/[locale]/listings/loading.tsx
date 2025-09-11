import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="mb-6 h-10 w-1/4" />

      <div className="mb-8 rounded-lg bg-gray-50 p-6 shadow-md">
        <Skeleton className="mb-4 h-8 w-1/5" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Skeleton className="mb-1 h-5 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="mb-1 h-5 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="mb-1 h-5 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="mb-1 h-5 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Skeleton className="mt-6 h-10 w-32" />
      </div>

      <Skeleton className="mb-4 h-9 w-1/3" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4 shadow-sm">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-1 h-4 w-1/4" />
            <Skeleton className="mt-2 h-8 w-1/2" />
            <Skeleton className="mt-1 h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
