"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Loader2, ExternalLink, RefreshCw, CreditCard, Sparkles, Zap, ShieldCheck } from "lucide-react"

import { checkout, customer } from "@/lib/auth-client"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getSubscriptionData, syncSubscriptionStatus } from "@/module/payment/action"
import { Spinner } from "@/components/ui/spinner"

const PLAN_FEATURES = {
    free: [
        { name: "Up to 5 repositories", included: true },
        { name: "Up to 5 reviews per repository", included: true },
        { name: "Basic code reviews", included: true },
        { name: "Community support", included: true },
        { name: "Advanced analytics", included: false },
        { name: "Priority support", included: false },
    ],
    pro: [
        { name: "Unlimited repositories", included: true },
        { name: "Unlimited reviews", included: true },
        { name: "Advanced code reviews", included: true },
        { name: "Community support", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Priority support", included: true },
    ]
}

export default function SubscriptionPage() {
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [portalLoading, setPortalLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const searchParams = useSearchParams();
    const success = searchParams.get("success");

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["subscription-data"],
        queryFn: getSubscriptionData,
        refetchOnWindowFocus: true,
    })

    useEffect(() => {
        if (success === "true") {
            const sync = async () => {
                try {
                    await syncSubscriptionStatus()
                    refetch()
                } catch (error) {
                    console.error("Failed to sync subscription on success return", error)
                }
            }
            sync()
        }
    }, [success, refetch])

    if (isLoading) {
        return (
            <div className='flex flex-col gap-6 md:gap-8'>
                <div className='flex flex-col mb-4 md:mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-foreground text-xs font-bold uppercase tracking-widest w-fit mb-6 uppercase">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span>Plans & Billing</span>
                    </div>
                    <h1 className='text-6xl md:text-[5rem] lg:text-[7rem] leading-[0.9] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/30'>
                        Upgrade <br className="hidden md:block"/> Workflow.
                    </h1>
                </div>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Spinner />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className='flex flex-col mb-4'>
                    <h1 className='text-6xl md:text-[5rem] lg:text-[7rem] leading-[0.9] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/30'>
                        Upgrade <br className="hidden md:block"/> Workflow.
                    </h1>
                </div>
                <Alert variant="destructive" className="rounded-3xl border-destructive/50 bg-destructive/10">
                    <AlertTitle className="font-bold">Error Loading Data</AlertTitle>
                    <AlertDescription className="font-medium">
                        Failed to load subscription data. Please try again.
                        <Button variant="outline" size="sm" className="ml-4 rounded-xl border-destructive/50 bg-destructive/20 hover:bg-destructive text-destructive-foreground hover:text-white" onClick={() => refetch()}>
                            Retry Sync
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    if (!data?.user) {
        return (
            <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className='flex flex-col mb-4'>
                    <h1 className='text-6xl md:text-[5rem] lg:text-[7rem] leading-[0.9] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/30'>
                        Upgrade <br className="hidden md:block"/> Workflow.
                    </h1>
                </div>
                <div className="p-12 text-center bg-card rounded-3xl border border-border/50">
                    <p className="text-xl font-bold tracking-tight text-muted-foreground">Please sign in to view subscription options.</p>
                </div>
            </div>
        )
    }

    const currentTier = data.user.subscriptionTier as "FREE" | "PRO";
    const isPro = currentTier === "PRO";
    const isActive = data.user.subscriptionStatus === "ACTIVE";

    const handleSync = async () => {
        try {
            setSyncLoading(true)
            const result = await syncSubscriptionStatus()

            if (result.success) {
                toast.success("Subscription status updated")
                refetch()
            } else {
                toast.error("Failed to sync subscription")
            }
        } catch (error) {
            toast.error("Failed to sync subscription")
        } finally {
            setSyncLoading(false)
        }
    }

    const handleUpgrade = async () => {
        try {
            setCheckoutLoading(true)

            await checkout({
                slug:"pro"
            })
        } catch (error) {
            console.error("Failed to initiate checkout: ", error)
        } finally {
            setCheckoutLoading(false)
        }
    }

    const handleManageSubscription = async () => {
        try {
            setPortalLoading(true);
            await customer.portal();
        } catch (error) {
            console.error("Failed to open portal: ", error)
        } finally {
            setPortalLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-foreground text-xs font-bold uppercase tracking-widest w-fit mb-6 uppercase">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span>Plans & Billing</span>
                    </div>
                    <h1 className='text-6xl md:text-[5rem] lg:text-[7rem] leading-[0.9] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/30'>
                        Upgrade <br className="hidden md:block"/> Workflow.
                    </h1>
                    <p className='text-muted-foreground font-semibold text-xl md:text-2xl max-w-2xl mt-6 tracking-tight'>
                        Choose the perfect plan to accelerate your development process.
                    </p>
                </div>

                <div className="shrink-0 mb-4 md:mb-0">
                    <Button variant="outline" size="lg" className="rounded-2xl font-bold bg-secondary/50 border-border/50 hover:bg-secondary px-6" onClick={handleSync} disabled={syncLoading}>
                        {syncLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <RefreshCw className="h-5 w-5 mr-2 text-primary" />}
                        Sync Status
                    </Button>
                </div>
            </div>

            {success === "true" && (
                <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-4 animate-in fade-in zoom-in duration-500">
                    <div className="p-2 bg-emerald-500 rounded-full text-white shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        <Check className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-emerald-500 font-bold text-xl tracking-tight mb-1">Success! Subscription Upgraded</h3>
                        <p className="text-emerald-500/80 font-medium tracking-tight">Your subscription has been updated successfully. Changes may take a few minutes to reflect.</p>
                    </div>
                </div>
            )}

            {/* Current Usage */}
            {data.limits && (
                <div className="group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                    <div className="absolute top-[-50%] right-[-10%] w-[50%] h-[200%] bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                Current Plan Usage
                            </h3>
                            <p className="text-muted-foreground font-medium mt-1">Real-time status of your active limits</p>
                        </div>
                        {isPro ? (
                            <Badge className="bg-primary hover:bg-primary text-primary-foreground py-2 px-6 rounded-full text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(var(--primary),0.5)] border-0 self-start md:self-auto">
                                Pro Plan Active
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-secondary px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest border-border/50 text-foreground self-start md:self-auto">
                                Free Plan Active
                            </Badge>
                        )}
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2 relative z-10">
                        <div className="p-6 rounded-2xl bg-secondary/30 border border-border/20 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-bold tracking-tight text-lg">Repositories Connected</span>
                                <Badge variant={data.limits.repositories.canAdd ? "default" : "destructive"} className="px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold">
                                    {data.limits.repositories.current} / {data.limits.repositories.limit ?? "∞"}
                                </Badge>
                            </div>
                            <div className="h-3 bg-card rounded-full overflow-hidden border border-border/20">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out ${data.limits.repositories.canAdd ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)]"}`}
                                    style={{
                                        width: data.limits.repositories.limit
                                            ? `${Math.min((data.limits.repositories.current / data.limits.repositories.limit) * 100, 100)}%`
                                            : "0%"
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-secondary/30 border border-border/20 backdrop-blur-sm flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold tracking-tight text-lg">Reviews per Repository</span>
                                <Badge variant="outline" className="bg-background px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold border-border/50 text-foreground">
                                    {isPro ? "Unlimited" : "5 per repo"}
                                </Badge>
                            </div>
                            <p className="font-medium text-muted-foreground/80 tracking-tight">
                                {isPro ? "You have no limits on AI code reviews." : "Free tier limits you to 5 automated code reviews per connected repository."}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Plans Grid */}
            <div className="grid gap-6 md:grid-cols-2 mt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
                {/* Free Plan */}
                <div className={`relative overflow-hidden rounded-[2.5rem] bg-card border ${!isPro ? "border-primary/50 ring-4 ring-primary/10 shadow-[0_0_40px_rgba(var(--primary),0.1)]" : "border-border/50"} p-8 md:p-12 transition-all duration-500 flex flex-col h-full`}>
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h3 className="text-3xl font-black tracking-tight mb-2">Hobbyist</h3>
                                <p className="text-muted-foreground font-medium">Perfect for individuals getting started</p>
                            </div>
                            {!isPro && (
                                <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border-0 rounded-full px-4 py-1.5 uppercase font-bold tracking-widest text-[10px]">
                                    Active Plan
                                </Badge>
                            )}
                        </div>
                        <div className="mb-10">
                            <span className="text-5xl md:text-6xl font-black tracking-tighter">$0</span>
                            <span className="text-muted-foreground font-bold tracking-tight ml-2">/month</span>
                        </div>
                        
                        <div className="space-y-4 mb-12 flex-1">
                            {PLAN_FEATURES.free.map((feature, i) => (
                                <div key={i} className={`flex items-center gap-4 ${!feature.included ? "opacity-50 grayscale" : ""}`}>
                                    <div className={`p-1.5 rounded-full ${feature.included ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                                        {feature.included ? <Check className="w-4 h-4 font-bold" /> : <X className="w-4 h-4 font-bold" />}
                                    </div>
                                    <span className="font-semibold tracking-tight text-foreground/80">{feature.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button variant="outline" size="lg" className="w-full rounded-2xl h-14 font-black tracking-widest uppercase border-border/50 mt-auto opacity-70 cursor-default">
                        {!isPro ? "Current Plan" : "Downgrade"}
                    </Button>
                </div>

                {/* Pro Plan */}
                <div className={`group relative overflow-hidden rounded-[2.5rem] bg-card border ${isPro ? "border-primary/50 ring-4 ring-primary/10 shadow-[0_0_40px_rgba(var(--primary),0.15)]" : "border-border/50 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2"} p-8 md:p-12 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col h-full`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity duration-700 group-hover:scale-110 pointer-events-none">
                        <img src="/logo.png" alt="" className="h-40 w-auto object-contain" />
                    </div>
                    
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h3 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
                                    Professionals
                                    {isPro && <Zap className="w-6 h-6 text-primary fill-primary animate-pulse" />}
                                </h3>
                                <p className="text-muted-foreground font-medium">For serious developers and teams</p>
                            </div>
                            {isPro && (
                                <Badge className="bg-primary text-primary-foreground hover:bg-primary border-0 rounded-full px-4 py-1.5 uppercase font-bold tracking-widest text-[10px] shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                                    Active Plan
                                </Badge>
                            )}
                        </div>
                        <div className="mb-10">
                            <span className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">₹99.99</span>
                            <span className="text-muted-foreground font-bold tracking-tight ml-2">/month</span>
                        </div>
                        
                        <div className="space-y-4 mb-12 flex-1">
                            {PLAN_FEATURES.pro.map((feature, i) => (
                                <div key={i} className={`flex items-center gap-4 ${!feature.included ? "opacity-50 grayscale" : ""}`}>
                                    <div className={`p-1.5 rounded-full ${feature.included ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.4)] text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                                        {feature.included ? <Check className="w-4 h-4 font-bold" /> : <X className="w-4 h-4 font-bold" />}
                                    </div>
                                    <span className="font-semibold tracking-tight text-foreground">{feature.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto">
                            {isPro && isActive ? (
                                <Button
                                    className="w-full rounded-2xl h-14 font-black tracking-widest uppercase bg-secondary text-foreground hover:bg-secondary/80 outline outline-1 outline-border/50 border-0"
                                    onClick={handleManageSubscription}
                                    disabled={portalLoading}
                                >
                                    {portalLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-3 animate-spin text-primary" />
                                            Opening Portal...
                                        </>
                                    ) : (
                                        <>
                                            Manage Subscription
                                            <ExternalLink className="h-5 w-5 ml-3 opacity-50" />
                                        </>
                                    )}
                                </Button>
                            ):(
                                <Button
                                    className="w-full rounded-2xl h-14 font-black tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] hover:scale-[1.02] transition-all duration-300 border-0"
                                    onClick={handleUpgrade}
                                    disabled={checkoutLoading}
                                >
                                    {checkoutLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Upgrade to Pro"
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}