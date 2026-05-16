"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "@/module/settings/actions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, Mail, Save, Loader2 } from "lucide-react";

export function ProfileForm() {
    const queryClient = useQueryClient();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const {data:profile, isLoading} = useQuery({
        queryKey:["user-profile"],
        queryFn:async() => await getUserProfile(),
        staleTime:1000 * 60 * 5,
        refetchOnWindowFocus:false
    });

    useEffect(() => {
        if (profile) {
            setName(profile.name || ""),
            setEmail(profile.email || "")
        }
    }, [profile])

    const updateMutation = useMutation ({
        mutationFn: async (data: {name: string; email: string}) => {
            return await updateUserProfile(data)
        },
        onSuccess:(result) => {
            if (result?.success) {
                queryClient.invalidateQueries({queryKey:["user-profile"]})
                toast.success("Profile updated successfully")
            }
        },
        onError:() => toast.error("Failed to  update profile")
    })

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({name, email})
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-2xl font-black tracking-tight mb-2">Profile Details</h3>
                    <p className="text-muted-foreground font-medium">Loading your profile information...</p>
                </div>
                <div className="animate-pulse space-y-6 mt-4">
                    <div className="h-14 bg-secondary/50 rounded-2xl"></div>
                    <div className="h-14 bg-secondary/50 rounded-2xl"></div>
                    <div className="h-12 w-32 bg-primary/20 rounded-xl mt-8"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 relative z-10">
            <div>
                <h3 className="text-3xl font-black tracking-tight mb-2">Profile Details</h3>
                <p className="text-muted-foreground font-medium">Update your personal information and email address.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
                <div className="space-y-4">
                    <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                    </Label>
                    <Input 
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={updateMutation.isPending}
                        className="h-14 px-6 rounded-2xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 shadow-sm text-lg font-medium transition-all"
                    />
                </div>
                
                <div className="space-y-4">
                    <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                    </Label>
                    <Input 
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={updateMutation.isPending}
                        className="h-14 px-6 rounded-2xl bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 shadow-sm text-lg font-medium transition-all"
                    />
                </div>
                
                <div className="pt-4">
                    <Button 
                        type="submit" 
                        disabled={updateMutation.isPending}
                        size="lg"
                        className="h-14 px-8 rounded-2xl font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] hover:scale-[1.02] transition-all duration-300"
                    >
                        {updateMutation.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                Saving Changes
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-3" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}