'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Automatically scrolls to top whenever the route changes.
 * Fixes the issue where navigating between same-layout pages (e.g., [slug])
 * preserves scroll position instead of resetting to top.
 */
export default function AutoScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    return null;
}
