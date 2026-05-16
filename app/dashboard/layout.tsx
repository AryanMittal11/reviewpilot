import React from 'react'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from '@/components/ui/separator'
import { requireAuth } from '@/module/auth/utils/auth-utils'

const DashboardLayout = async (
    {children}: {children: React.ReactNode}
) => {
    await requireAuth()
  return (
    <SidebarProvider>
        <div className='relative flex min-h-screen w-full bg-background overflow-hidden selection:bg-primary/30'>
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] mix-blend-screen pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            <AppSidebar />
            <SidebarInset className='relative z-10 bg-transparent flex flex-col'>
                <header className='sticky top-0 z-50 flex h-24 shrink-0 items-center gap-4 bg-transparent px-8 backdrop-blur-sm'>
                    <SidebarTrigger className='w-10 h-10 bg-card border border-border shadow-sm rounded-xl flex items-center justify-center hover:bg-secondary hover:scale-105 transition-all' />
                    <Separator orientation='vertical' className='mx-2 h-6 bg-border/50' />
                </header>
                <main className='flex-1 overflow-auto px-4 md:px-8 pb-12 w-full max-w-[1600px] mx-auto'>
                    <div className='animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out'>
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </div>
    </SidebarProvider>
  )
}

export default DashboardLayout