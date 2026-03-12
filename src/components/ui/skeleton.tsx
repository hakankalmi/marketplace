import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-brand bg-brand-border/50',
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-brand-surface rounded-brand border border-brand-border overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

/** Featured company skeleton — larger, horizontal */
function FeaturedSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row bg-brand-surface rounded-2xl border-2 border-brand-border/40 overflow-hidden">
      <Skeleton className="w-full sm:w-48 h-36 sm:h-auto rounded-none" />
      <div className="flex-1 p-5 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-6 w-16 rounded-xl" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/** List item skeleton — compact row */
function ListItemSkeleton() {
  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-brand-surface rounded-xl border border-brand-border">
      <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-14 rounded-lg hidden sm:block" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {/* Featured skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-36" />
        <FeaturedSkeleton />
        <FeaturedSkeleton />
      </div>
      {/* List skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: Math.max(count - 2, 4) }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
