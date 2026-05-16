"use client";
import React from 'react'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Star, Search, GitBranch, Github, Layers, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRepositories } from '@/module/repository/hooks/use-repositories';
import { RepositoryListSkeleton } from '@/module/repository/components/repository-skeleton';
import { useConnectRepository } from '@/module/repository/hooks/use-connect-repository';

interface Repository {
    id: number
    name: string
    full_name: string
    description: string | null
    html_url: string
    stargazers_count: number
    language: string | null
    topics: string[]
    isConnected?: boolean
}

const RepositoryPage = () => {

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useRepositories()

    const {mutate:connectRepo} = useConnectRepository()

    const [localConnectingId, setLocalConnectingId] = useState<number | null>(null)

    const [searchQuery, setSearchQuery] = useState("");

    const observerTarget = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            {
                threshold:0.1
            }
        )

        const currentTarget = observerTarget.current
        if (currentTarget) {
            observer.observe(currentTarget)
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget)
            }
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    if (isLoading) {
        return (
            <div className='flex flex-col gap-6 md:gap-8'>
                <div className='flex flex-col mb-4 md:mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-foreground text-xs font-bold uppercase tracking-widest w-fit mb-6 uppercase">
                        <Github className="w-4 h-4 text-primary" />
                        <span>Repositories</span>
                    </div>
                    <h1 className='text-6xl md:text-[5rem] lg:text-[7rem] leading-[0.9] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/30'>
                        Project <br className="hidden md:block"/> Sources.
                    </h1>
                </div>
                <RepositoryListSkeleton />
            </div>
        )
    }

    if (isError) {
        return <div>Failed to load repositories</div>
    }

    const allRepositories = data?.pages.flatMap(page=>page) || []

    const filteredRepositories = allRepositories.filter((repo:Repository) => 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleConnect = (repo:Repository) => {
        setLocalConnectingId(repo.id)
        connectRepo(
            {
                owner:repo.full_name.split("/")[0],
                repo:repo.name,
                githubId:repo.id
            },
            {
                onSettled: () => setLocalConnectingId(null)
            }
        )
    }

  return (
    <div className='flex flex-col gap-6 md:gap-8'>
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12 mb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
            <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-foreground text-xs font-bold uppercase tracking-widest w-fit mb-6 uppercase">
                    <Github className="w-4 h-4 text-primary" />
                    <span>Repositories</span>
                </div>
                <h1 className='text-6xl md:text-[5rem] lg:text-[7rem] leading-[0.9] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/30'>
                    Project <br className="hidden md:block"/> Sources.
                </h1>
                <p className='text-muted-foreground font-semibold text-xl md:text-2xl max-w-2xl mt-6 tracking-tight'>
                    Connect and manage your GitHub repositories to track activity and get AI reviews.
                </p>
            </div>
            
            <div className='relative w-full md:w-96 shrink-0 group flex-10'>
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className='h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors'/>
                </div>
                <Input 
                    placeholder='Find repository...'
                    className='pl-14 h-16 bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20 shadow-2xl text-lg font-medium rounded-full transition-all duration-500'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-2 mt-4'>
            {
                filteredRepositories.map((repo:any, idx:number) => (
                    <div key={repo.id} className='group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 md:p-8 hover:border-primary/50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-2xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom' style={{ animationDelay: `${(idx % 10) * 50}ms`, animationFillMode: 'both' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        <div className="relative z-10 h-full flex flex-col justify-between gap-8">
                            <div className='flex items-start justify-between gap-4'>
                                <div className='space-y-4 flex-1 min-w-0'>
                                    <div className='flex items-center gap-3 flex-wrap'>
                                        <h3 className='text-2xl font-black tracking-tight truncate group-hover:text-primary transition-colors duration-500'>{repo.name}</h3>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="bg-secondary/50 border-border/50 text-[10px] uppercase font-bold tracking-widest py-1 px-3 rounded-full">{repo.language || "Unknown"}</Badge>
                                            {repo.isConnected && <Badge variant="default" className="text-[10px] uppercase font-bold tracking-widest py-1 px-3 rounded-full bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]">Connected</Badge>}
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground/80 font-medium text-sm line-clamp-2 leading-relaxed">{repo.description || "No description provided."}</p>
                                </div>
                            </div>
                            
                            <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-border/30 pt-6'>
                                <div className='flex items-center gap-6 text-sm font-bold'>
                                    <div className='flex items-center gap-2 text-foreground'>
                                        <Star className='h-5 w-5 text-foreground opacity-50 group-hover:opacity-100 group-hover:fill-orange-400 group-hover:text-orange-400 transition-all duration-500'/>
                                        <span className="text-lg tracking-tighter">{repo.stargazers_count}</span>
                                    </div>
                                    <div className='flex items-center gap-2 text-muted-foreground'>
                                        <GitBranch className='h-5 w-5 opacity-50'/>
                                        <span className="tracking-tight">{repo.full_name.split("/")[0]}</span>
                                    </div>
                                </div>
                                <div className='flex gap-3'>
                                    <Button variant="outline" size="lg" asChild className="rounded-2xl border-border/50 hover:bg-secondary font-bold px-6">
                                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className='h-4 w-4 mr-2'/>
                                            GitHub
                                        </a>
                                    </Button>
                                    <Button
                                        onClick={() => handleConnect(repo)}
                                        disabled={localConnectingId === repo.id || repo.isConnected}
                                        variant={repo.isConnected ? "secondary" : "default"}
                                        size="lg"
                                        className={`rounded-2xl font-bold px-8 ${repo.isConnected ? 'opacity-50 pointer-events-none' : 'hover:scale-105 transition-transform duration-300 shadow-[0_10px_40px_-10px_rgba(var(--primary),0.5)]'}`}
                                    >
                                        {localConnectingId === repo.id ? "Syncing..." : repo.isConnected ? "Synced" : "Sync Repo"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>

        <div ref={observerTarget} className='py-12 flex justify-center'>
            {isFetchingNextPage && <div className="p-5 rounded-full bg-secondary border border-border/20 shadow-xl animate-bounce"><Layers className="w-8 h-8 text-primary animate-spin" /></div>}
            {
                !hasNextPage && allRepositories.length > 0 && (
                    <div className="flex w-full items-center gap-6 opacity-30 mt-8">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-border"></div>
                        <p className='text-xs font-bold tracking-[0.3em] uppercase'>End of List</p>
                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-border"></div>
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default RepositoryPage