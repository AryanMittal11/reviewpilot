"use client"
import { signIn } from "@/lib/auth-client"
import { GithubIcon, Sparkles } from "lucide-react"
import { useState } from "react"

const LoginUI = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleGithubLogin = async () => {
        setIsLoading(true)
        try {
            await signIn.social({
                provider:"github"
            })
        } catch (error) {
            console.error("Login error:", error)
            setIsLoading(false)
        }
    }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-10"></div>
        
        {/* Animated Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/30 blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-20 w-full max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Left side - Typography Hero */}
            <div className="flex flex-col animate-in fade-in slide-in-from-left-12 duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-foreground text-xs font-bold uppercase tracking-widest w-fit mb-8 shadow-sm">
                    <img src="/logo.png" alt="ReviewPilot" className="h-6 w-auto object-contain" />
                    <span>ReviewPilot Platform</span>
                </div>
                
                <h1 className="text-6xl sm:text-7xl lg:text-[6rem] leading-[0.9] font-black tracking-tighter mb-8">
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">Review</span><br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">Code</span><br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/30">Faster.</span>
                </h1>
                
                <p className="text-xl sm:text-2xl font-medium text-muted-foreground max-w-xl tracking-tight leading-relaxed">
                    Supercharge your team's workflow with intelligent, automated code reviews that catch bugs before they merge.
                </p>
            </div>

            {/* Right side - Login Bento Box */}
            <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[3rem] blur-2xl transform scale-110"></div>
                
                <div className="relative bg-card/40 backdrop-blur-3xl border border-border/50 rounded-[3rem] p-8 sm:p-12 shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000"></div>
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="bg-transparent flex items-center justify-center mb-10 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500 overflow-visible">
                            <img src="/logo.png" alt="ReviewPilot Logo" className="h-32 w-auto object-contain drop-shadow-2xl" />
                        </div>
                        
                        <h2 className="text-4xl font-black tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-muted-foreground font-medium text-lg mb-12">Login to access your dashboard</p>
                        
                        <button
                            onClick={handleGithubLogin}
                            disabled={isLoading}
                            className="w-full relative group/btn"
                        >
                            <div className="absolute inset-0 bg-primary rounded-2xl blur opacity-40 group-hover/btn:opacity-60 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center gap-4 w-full py-5 px-6 bg-foreground text-background rounded-2xl font-black text-lg tracking-wide uppercase hover:scale-[1.02] transition-all duration-300">
                                <GithubIcon size={24} />
                                {isLoading ? "Authenticating..." : "Continue with GitHub"}
                            </div>
                        </button>
                        
                        <div className="mt-12 space-y-4">
                            <p className="text-sm font-medium text-muted-foreground">
                                By continuing, you agree to our <a href="#" className="text-foreground hover:text-primary transition-colors underline decoration-border underline-offset-4">Terms of Service</a> and <a href="#" className="text-foreground hover:text-primary transition-colors underline decoration-border underline-offset-4">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default LoginUI