import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="container py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <Skeleton className="mx-auto h-10 w-3/4" />
            <Skeleton className="mx-auto mt-2 h-4 w-1/2" />
          </div>
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <Skeleton className="mx-auto h-8 w-1/4" />
              <Skeleton className="mx-auto mt-2 h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
