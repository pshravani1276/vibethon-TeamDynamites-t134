// src/components/Skeleton.tsx
"use client";

export function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-white/10 rounded-lg ${className}`} />
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 space-y-4 animate-pulse">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-3 w-32" />
        </div>
    );
}

export function LeaderboardSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3 animate-pulse">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                </div>
            ))}
        </div>
    );
}

export function QuizSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2 w-full" />
            </div>
            <div className="bg-white/5 rounded-2xl p-8 space-y-6">
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-16 rounded" />
                        <Skeleton className="h-5 w-20 rounded" />
                    </div>
                    <Skeleton className="h-7 w-3/4" />
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function PlaygroundSkeleton() {
    return (
        <div className="max-w-6xl mx-auto space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-64" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
                <Skeleton className="h-96 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
            </div>
        </div>
    );
}

export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="inline-block w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                <div className="text-white/60 text-sm">Loading...</div>
            </div>
        </div>
    );
}
