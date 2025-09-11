import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="container space-y-6 py-6">
      <div>
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-md p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}
