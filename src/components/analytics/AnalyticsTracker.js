'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Avoid tracking in local development unless testing explicitly
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return;
    }

    // Exclude admin routes from analytics
    if (pathname && pathname.startsWith('/admin')) {
      return;
    }

    const trackVisit = async () => {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url_path: pathname,
            referrer: document.referrer || 'Direct',
            screenWidth: window.innerWidth
          })
        });
      } catch (err) {
        console.error('Analytics tracking failed', err);
      }
    };

    trackVisit();
  }, [pathname]);

  return null; // Invisible component
}
