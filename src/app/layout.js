import './globals.css';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';

export const metadata = {
  title: 'Ashish | Ak',
  description: 'Personal portfolio, projects and collaboration hub for Ashish.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsTracker />
        <main>{children}</main>
      </body>
    </html>
  );
}
