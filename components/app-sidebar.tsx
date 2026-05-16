"use client";
import React from 'react'
import { Github, BookOpen, Settings, Moon, Sun, LogOut, LayoutGrid, Code2, CreditCard, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu, 
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator
} from "@/components/ui/sidebar"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import Logout from '@/module/auth/components/logout';

export const AppSidebar = () => {

    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname()

    const {data:session} = useSession();

    useEffect(() => {
        setMounted(true)
    }, [])

    const navigationItems = [
        {
            title: "Overview",
            url: "/dashboard",
            icon: LayoutGrid,
        },
        {
            title: "Repositories",
            url: "/dashboard/repository",
            icon: Github,
        },
        {
            title: "Code Reviews",
            url: "/dashboard/reviews",
            icon: Code2,
        },
        {
            title: "Subscription",
            url: "/dashboard/subscription",
            icon: CreditCard,
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
        },
    ]

    const isActive = (url:string) => {
        if (url === "/dashboard") return pathname === "/dashboard";
        return pathname === url || pathname.startsWith(url + "/")
    }

    if (!mounted || !session) return null

    const user = session.user;
    const userName = user.name || "Guest"
    const userEmail = user.email || ""
    const userAvatar = user.image || ""
    const userInitials = userName.split(" ").map((n) => n[0]).join("").toUpperCase()

    return (
        <Sidebar variant="inset" className="border-r-0 bg-transparent py-4 pl-4 ">
            <div className="flex bg-card h-full rounded-[2rem] border border-border shadow-2xl flex-col relative z-10">
                {/* Background Glow Container - overflow-hidden is here so it doesn't clip dropdowns outside */}
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </div>

                <SidebarHeader className='pt-8 px-6 bg-transparent relative z-10'>
                    <div className='flex items-center gap-3 mb-2'>
                        <div className='flex items-center justify-center bg-transparent'>
                            <img src="/logo.png" alt="ReviewPilot Logo" className="h-12 w-auto object-contain" />
                        </div>
                        <h2 className='text-lg font-black tracking-tight'>ReviewPilot</h2>
                    </div>
                </SidebarHeader>

                <SidebarContent className='px-4 py-8 bg-transparent gap-2 relative z-10'>
                    <p className='text-[10px] font-bold text-muted-foreground/60 px-4 mb-2 uppercase tracking-widest'>Main Menu</p>
                    <SidebarMenu className='gap-2'>
                        {
                            navigationItems.map((item) => {
                                const active = isActive(item.url);
                                return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        className={`h-12 px-4 rounded-2xl transition-all duration-300 relative group overflow-hidden ${active ? 
                                            "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        <Link href={item.url} className='flex items-center gap-4 z-10 relative'>
                                            <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                                            <span className='text-sm font-bold tracking-wide'>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )})
                        }
                    </SidebarMenu>
                </SidebarContent>

                <SidebarFooter className='mt-auto p-4 bg-transparent relative z-20'>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                    size="lg"
                                    className='h-16 px-3 rounded-2xl bg-secondary/50 hover:bg-secondary transition-all duration-300 border border-transparent outline-none ring-0'
                                    >
                                        <Avatar className='h-10 w-10 rounded-xl shrink-0'>
                                            <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                                            <AvatarFallback className='rounded-xl bg-background text-foreground font-bold'>{userInitials}</AvatarFallback>
                                        </Avatar>
                                        <div className='grid flex-1 text-left leading-tight min-w-0 ml-2'>
                                            <span className='truncate font-bold text-sm'>{userName}</span>
                                            <span className='truncate text-[10px] text-muted-foreground tracking-wider'>{userEmail}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                className='w-72 rounded-3xl bg-card border-border shadow-2xl p-3 z-50'
                                align='end'
                                side='right'
                                sideOffset={20}
                                >
                                    <div className='flex items-center gap-4 px-3 py-4 mb-2'>
                                        <Avatar className='h-12 w-12 rounded-2xl shrink-0'>
                                            <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                                            <AvatarFallback className='rounded-2xl text-lg'>{userInitials}</AvatarFallback>
                                        </Avatar>
                                        <div className='flex-1 min-w-0'>
                                            <p className='font-bold text-base truncate'>{userName}</p>
                                            <p className='text-xs text-muted-foreground truncate'>{userEmail}</p>
                                        </div>
                                    </div>
                                    <div className='space-y-1'>
                                        <DropdownMenuItem asChild className='rounded-xl cursor-pointer'>
                                            <button
                                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                            className='w-full px-4 py-3 flex items-center gap-3 transition-colors text-sm font-bold'
                                            >
                                                <div className="p-2 rounded-lg bg-secondary">
                                                    {theme === "dark" ? <Sun className='w-4 h-4'/> : <Moon className='w-4 h-4'/>}
                                                </div>
                                                <span>{theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
                                            </button>
                                        </DropdownMenuItem>
                                        <SidebarSeparator className="my-2" />
                                        <DropdownMenuItem asChild className='cursor-pointer px-4 py-3 rounded-xl hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive text-destructive transition-colors font-bold'>
                                            <div className='w-full flex items-center gap-3' onClick={(e) => e.stopPropagation()}>
                                                <div className="p-2 rounded-lg bg-background/50">
                                                    <LogOut className='w-4 h-4 shrink-0'/>
                                                </div>
                                                <Logout>Sign Out</Logout>
                                            </div>
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </div>
        </Sidebar>
    )
}