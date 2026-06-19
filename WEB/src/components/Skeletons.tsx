import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function ComplaintCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 w-full">
      <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DashboardBannerSkeleton() {
  return (
    <div className="w-full h-32 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
      <Skeleton className="h-8 w-1/2 rounded mb-2" />
      <Skeleton className="h-4 w-1/3 rounded" />
    </div>
  );
}

export function ActionGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <Skeleton className="w-10 h-10 rounded-xl mb-3" />
          <Skeleton className="h-4 w-24 rounded mb-2" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}
