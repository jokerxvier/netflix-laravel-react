import { useState, useEffect } from "react";
import {type BreadcrumbItem,  type NavItem, type SharedData } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { LogOut, Search, Menu } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Movies',
        href: '/browse',
    },
    {
        title: 'TV Shows',
        href: '/browse',
    }
];


interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}


export function AppHeaderNetflix({ breadcrumbs = [] }: AppHeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
            <>
                <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20 text-white">
                    <div className="flex items-center gap-10 z-50">
                        <Link href="/">
                            <img src="/assets/netflix-logo.png" alt="Netflix Logo" className="w-32 sm:w-40" />
                        </Link>
                        <div className="hidden sm:flex gap-2 items-center">
                            {mainNavItems.map((item, index) => (
                                <Link key={index} href={item.href} className='hover:underline'>
                                    {item.title}
                                </Link>
                            ))}
                                
                        </div>
                    </div>

                    <div className="flex gap-2 items-center z-50">
                        <Link href="/search">
                            <Search className="size-6 cursor-pointer" />
                        </Link>
                        <img src="/assets/avatar2.png" alt="Avatar" className="h-8 rounded cursor-pointer" />
                        <button 
                            onClick={() => router.post('/logout')}
                            className="cursor-pointer"
                        >
                            <LogOut />
                        </button>

                        <div className='sm:hidden'>
                            <Menu className='size-6 cursor-pointer' onClick={toggleMobileMenu} />
                        </div>
                    </div>

                    {/* mobile navbar items */}
                {isMobileMenuOpen && (
                    <div className='w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800'>
                        <Link href={"/browse"} className='block hover:underline p-2 text-white' onClick={toggleMobileMenu}>
                            Movies
                        </Link>
                        <Link href={"/browse"} className="block hover:underline p-2 text-white" onClick={toggleMobileMenu}>
                            Tv Shows
                        </Link>
                        <Link href={"/search"} className="block hover:underline p-2 text-white" onClick={toggleMobileMenu}>
                            Search
                        </Link>
                    </div>
                )}
                </header>
            </>
    );
}
