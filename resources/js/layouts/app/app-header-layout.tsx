import { AppContent } from '@/components/app-content';
import { AppHeaderNetflix } from '@/components/app-header-netflix';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import { AppFooter } from '@/components/app-footer';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell>
            <AppContent>{children}</AppContent>
            <AppFooter />
        </AppShell>
    );
}
