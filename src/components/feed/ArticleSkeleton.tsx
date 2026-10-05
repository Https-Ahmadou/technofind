export function ArticleSkeleton() {
  return (
    <div className="card flex gap-4 p-4">
      <div className="flex flex-col flex-1 gap-2.5">
        <div className="flex gap-2">
          <div className="skeleton h-4 w-16 rounded-full" />
          <div className="skeleton h-4 w-20 rounded-full" />
        </div>
        <div className="skeleton h-4 w-full rounded-md" />
        <div className="skeleton h-4 w-4/5 rounded-md" />
        <div className="skeleton h-3 w-full rounded-md hidden sm:block" />
        <div className="flex gap-2 mt-1">
          <div className="skeleton h-3 w-14 rounded" />
          <div className="skeleton h-3 w-10 rounded" />
        </div>
      </div>
      <div className="skeleton w-28 h-[88px] rounded-xl shrink-0" />
    </div>
  );
}

export function FeedSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleSkeleton key={i} />
      ))}
    </div>
  );
}
