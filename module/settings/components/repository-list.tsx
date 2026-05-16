"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConnectedRepositories, disconnectRepository, disconnectAllRepositories } from "@/module/settings/actions";
import { toast } from "sonner";
import { ExternalLink, Trash2, AlertTriangle, Github, Link2Off } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";

export function RepositoryList() {
    const queryClient = useQueryClient();

    const [disconnectAllOpen, setDisconnectAllOpen] = useState(false);

    const {data:repositories, isLoading} = useQuery({
        queryKey:["connected-repositories"],
        queryFn: async () => await getConnectedRepositories(),
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false
    })

    const disconnectMutation = useMutation({
        mutationFn: async (repositoryId: string) => {
            return await disconnectRepository(repositoryId)
        },
        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({queryKey: ["connected-repositories"]})
                queryClient.invalidateQueries({ queryKey: ["dashboard-stats"]})
                toast.success("Repository disconnected successfully")
            } else {
                toast.error(result?.error || "Failed to disconnect repository")
            }
        },
    })

    const disconnectAllMutation = useMutation({
        mutationFn: async () => {
            return await disconnectAllRepositories()
        },
        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({queryKey: ["connected-repositories"]})
                queryClient.invalidateQueries({ queryKey: ["dashboard-stats"]})
                toast.success(`Disconnected ${result.count} repositories`)
                setDisconnectAllOpen(false)
            } else {
                toast.error(result?.error || "Failed to disconnect repositories")
            }
        },
    })

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-3xl font-black tracking-tight mb-2">Connected Repositories</h3>
                        <p className="text-muted-foreground font-medium">Manage your linked GitHub projects.</p>
                    </div>
                </div>
                <div className="animate-pulse space-y-4 mt-6">
                    <div className="h-24 bg-secondary/50 rounded-2xl"></div>
                    <div className="h-24 bg-secondary/50 rounded-2xl"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h3 className="text-3xl font-black tracking-tight mb-2">Connected Repositories</h3>
                    <p className="text-muted-foreground font-medium">Manage your linked GitHub projects and their access.</p>
                </div>
                
                {repositories && repositories.length > 0 && (
                    <AlertDialog open={disconnectAllOpen} onOpenChange={setDisconnectAllOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="lg" className="rounded-xl font-bold bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-0 shadow-none hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all">
                                <Link2Off className="h-5 w-5 mr-3" />
                                Disconnect All
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl border-border/50">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-3 text-2xl font-bold">
                                    <div className="p-3 bg-destructive/20 text-destructive rounded-full">
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    Disconnect All?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-base mt-2">
                                    This will disconnect all <strong>{repositories.length}</strong> repositories and delete all associated AI reviews.
                                    This action is permanent and cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-6">
                                <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => disconnectAllMutation.mutate()}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold"
                                    disabled={disconnectAllMutation.isPending}
                                >
                                    {disconnectAllMutation.isPending ? "Disconnecting..." : "Yes, Disconnect All"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            <div className="mt-4">
                {!repositories || repositories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/50 rounded-3xl bg-secondary/10">
                        <div className="p-4 bg-secondary/50 rounded-full mb-4">
                            <Github className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-xl font-bold tracking-tight mb-2">No repositories connected.</p>
                        <p className="text-muted-foreground mb-6">Link a repository to start getting automated code reviews.</p>
                        <Button asChild className="rounded-xl font-bold px-6">
                            <a href="/dashboard/repository">Find Repositories</a>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {repositories.map((repo) => (
                            <div
                                key={repo.id}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-secondary/20 border border-border/30 rounded-2xl hover:bg-secondary/40 hover:border-border/60 transition-all duration-300 gap-4"
                            >
                                <div className="flex-1 min-w-0 flex items-center gap-4">
                                    <div className="p-3 bg-background rounded-xl border border-border/50 shadow-sm group-hover:scale-105 transition-transform">
                                        <Github className="h-6 w-6 text-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-black text-lg tracking-tight truncate">{repo.fullName}</h3>
                                            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0 rounded-full px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest hidden sm:inline-flex">
                                                Connected
                                            </Badge>
                                        </div>
                                        <a 
                                            href={repo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors mt-1 w-fit"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            View on GitHub
                                        </a>
                                    </div>
                                </div>
                                
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0 h-12 w-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-3xl border-border/50">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-2xl font-bold">Disconnect Repository?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-base mt-2">
                                                This will disconnect <strong>{repo.fullName}</strong> and delete all associated AI reviews.
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="mt-6">
                                            <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => disconnectMutation.mutate(repo.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold"
                                                disabled={disconnectMutation.isPending}
                                            >
                                                {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}