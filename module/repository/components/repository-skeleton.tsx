export function RepositoryCardSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 p-8 md:p-10 transition-all duration-500 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
                <div className="space-y-4 flex-1 w-full">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-48 bg-secondary/50 rounded-lg animate-pulse" />
                        <div className="h-6 w-20 bg-secondary/50 rounded-full animate-pulse" />
                    </div>
                    <div className="h-5 w-3/4 max-w-md bg-secondary/30 rounded-lg animate-pulse" />
                </div>
                <div className="flex gap-3">
                    <div className="h-12 w-12 bg-secondary/50 rounded-xl animate-pulse" />
                    <div className="h-12 w-32 bg-secondary/50 rounded-2xl animate-pulse" />
                </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-border/30 flex flex-wrap items-center justify-between gap-4">
                <div className="h-5 w-24 bg-secondary/50 rounded-lg animate-pulse" />
                <div className="h-5 w-32 bg-secondary/50 rounded-lg animate-pulse" />
            </div>
        </div>
    )
}

export function RepositoryListSkeleton() {
    return (
        <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ animationDelay: `${i * 150}ms` }} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                    <RepositoryCardSkeleton />
                </div>
            ))}
        </div>
    )
}