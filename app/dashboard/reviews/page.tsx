"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, CheckCircle2, XCircle, Code2, Sparkles, FolderGit2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/module/review/actions";
import { formatDistanceToNow } from "date-fns";

export default function ReviewsPage() {
    const {data:reviews, isLoading} = useQuery({
        queryKey:["reviews"],
        queryFn:async () => {
            return await getReviews()
        }
    });

    if (isLoading) {
        return (
            <div className='flex flex-col gap-6 md:gap-8'>
                <div className='flex flex-col mb-4 md:mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-foreground text-xs font-bold uppercase tracking-widest w-fit mb-6 uppercase">
                        <Code2 className="w-4 h-4 text-primary" />
                        <span>Code Reviews</span>
                    </div>
                    <h1 className='text-6xl md:text-[5rem] lg:text-[7rem] leading-[0.9] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/30'>
                        AI <br className="hidden md:block"/> Insights.
                    </h1>
                </div>
                <div className="grid gap-6">
                    {[1,2,3].map((i) => (
                        <div key={i} className="h-64 rounded-3xl bg-card border border-border/20 shadow-sm animate-pulse"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-12">
            <div className='flex flex-col mb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-foreground text-xs font-bold uppercase tracking-widest w-fit mb-6 uppercase">
                    <Code2 className="w-4 h-4 text-primary" />
                    <span>Code Reviews</span>
                </div>
                <h1 className='text-6xl md:text-[5rem] lg:text-[7rem] leading-[0.9] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/30'>
                    AI <br className="hidden md:block"/> Insights.
                </h1>
                <p className='text-muted-foreground font-semibold text-xl md:text-2xl max-w-2xl mt-6 tracking-tight'>
                    Review history and automated feedback on your pull requests.
                </p>
            </div>

            {
                reviews?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 md:p-24 rounded-3xl bg-card border border-border/50 shadow-sm text-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                        <div className="w-24 h-24 mb-6 rounded-full bg-secondary/50 flex items-center justify-center shadow-inner">
                            <FolderGit2 className="w-10 h-10 text-muted-foreground opacity-50" />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight mb-2">No Reviews Yet</h3>
                        <p className="text-muted-foreground text-lg max-w-sm mb-8">Connect a repository and open a pull request to get your first AI-powered code review.</p>
                        <Button size="lg" className="rounded-full font-bold px-8" asChild>
                            <a href="/dashboard/repository">Connect Repository</a>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        {reviews?.map((review:any, idx:number) => (
                            <div key={review.id} className="group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 md:p-8 hover:border-primary/50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-2xl hover:-translate-y-1" style={{ animationDelay: `${(idx % 10) * 100}ms`, animationFillMode: 'both' }}>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h2 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors duration-500">{review.prTitle}</h2>
                                                
                                                {review.status === "completed" && (
                                                    <Badge variant="default" className="gap-1.5 py-1 px-3 rounded-full text-[10px] uppercase font-bold tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Completed
                                                    </Badge>
                                                )}
                                                {review.status === "failed" && (
                                                    <Badge variant="destructive" className="gap-1.5 py-1 px-3 rounded-full text-[10px] uppercase font-bold tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        Failed
                                                    </Badge>
                                                )}
                                                {review.status === "pending" && (
                                                    <Badge variant="secondary" className="gap-1.5 py-1 px-3 rounded-full text-[10px] uppercase font-bold tracking-widest bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        Processing
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground font-semibold flex items-center gap-2">
                                                <FolderGit2 className="w-4 h-4 opacity-50" />
                                                <span>{review.repository.fullName}</span>
                                                <span className="opacity-30">&bull;</span>
                                                <span>PR #{review.prNumber}</span>
                                                <span className="opacity-30">&bull;</span>
                                                <span className="text-sm opacity-80">{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                                            </p>
                                        </div>

                                        <Button variant="outline" size="icon" className="shrink-0 rounded-xl h-12 w-12 border-border/50 bg-secondary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300" asChild>
                                            <a href={review.prUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-5 w-5" />
                                            </a>
                                        </Button>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 p-4 rounded-full bg-primary/10 border border-primary/20 shadow-sm opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity duration-500 z-10 hidden md:flex">
                                            <img src="/logo.png" alt="ReviewPilot" className="h-8 w-auto object-contain" />
                                        </div>
                                        <div className="bg-background/50 backdrop-blur-sm border border-border/30 rounded-2xl p-6 relative overflow-hidden group-hover:border-primary/20 transition-colors duration-500">
                                            <pre className="whitespace-pre-wrap text-sm font-mono text-muted-foreground leading-relaxed">
                                                {review.review.substring(0, 400)}
                                                {review.review.length > 400 && <span className="text-foreground font-bold">...</span>}
                                            </pre>
                                            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background/80 to-transparent pointer-events-none"></div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <Button variant="ghost" className="rounded-xl font-bold bg-primary/5 hover:bg-primary hover:text-primary-foreground transition-colors px-6 text-primary" asChild>
                                            <a href={review.prUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                Read Full Review
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}