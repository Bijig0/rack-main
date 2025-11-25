import Skeleton from "react-loading-skeleton";

export const FormSkeleton = () => (
  <div className="flex flex-col">
    <Skeleton className="w-32 h-7" />
    <Skeleton className="w-full mt-2 h-7" />
    <Skeleton className="mt-4 h-7 w-28" />
    <Skeleton className="w-full mt-2 h-7" />

    <div className="flex flex-row items-center w-full gap-4 mt-12 h-7">
      <Skeleton className="inline w-4 h-4 rounded-full" />
      <Skeleton className="inline w-32 h-7" />
    </div>
    <div className="flex flex-row items-center w-full gap-4 mt-2 h-7">
      <Skeleton className="inline w-4 h-4 rounded-full" />
      <Skeleton className="inline h-7 w-28" />
    </div>

    <Skeleton className="w-32 mt-8 h-7" />
    <Skeleton className="w-full mt-2 h-7" />
    <Skeleton className="mt-4 h-7 w-28" />
    <Skeleton className="w-full mt-2 h-7" />

    <div className="flex flex-row gap-3 mt-6">
      <Skeleton className="w-20 h-8 ml-auto" />
      <Skeleton className="w-20 h-8" />
    </div>
  </div>
);
