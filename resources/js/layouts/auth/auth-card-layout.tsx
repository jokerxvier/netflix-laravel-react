import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="hero-bg flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <header className='max-w-6xl mx-auto flex items-center justify-between p-4'>
                <img src='/assets/netflix-logo.png' alt='logo' className='w-52' />
            </header>
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-9 w-9 items-center justify-center">
                        <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-xl shadow-m text-white">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-center text-white text-2xl font-bold mb-4">{title}</CardTitle>
                            <CardDescription className="text-center text-gray-300">{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
