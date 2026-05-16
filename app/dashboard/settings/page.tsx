"use client"
import { ProfileForm } from '@/module/settings/components/profile-form'
import { RepositoryList } from '@/module/settings/components/repository-list'
import { Settings as SettingsIcon } from 'lucide-react'
import React from 'react'

const SettingPage = () => {
  return (
    <div className='flex flex-col gap-6 md:gap-8 pb-12'>
        <div className='flex flex-col mb-4 md:mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000'>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-foreground text-xs font-bold uppercase tracking-widest w-fit mb-6 uppercase">
                <SettingsIcon className="w-4 h-4 text-primary" />
                <span>Configuration</span>
            </div>
            <h1 className='text-6xl md:text-[5rem] lg:text-[7rem] leading-[0.9] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/30'>
                Platform <br className="hidden md:block"/> Controls.
            </h1>
            <p className='text-muted-foreground font-semibold text-xl md:text-2xl max-w-2xl mt-6 tracking-tight'>
                Manage your account settings and connected repositories.
            </p>
        </div>
        
        <div className="grid gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            {/* The components below might be basic Shadcn cards, so we can wrap them in nice containers or they can just render normally as they are part of module/settings. Let's render them inside sleek wrappers. */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 p-6 md:p-10 hover:border-primary/30 transition-colors duration-500 shadow-sm">
                <ProfileForm />
            </div>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/50 p-6 md:p-10 hover:border-primary/30 transition-colors duration-500 shadow-sm">
                <RepositoryList />
            </div>
        </div>
    </div>
  )
}

export default SettingPage