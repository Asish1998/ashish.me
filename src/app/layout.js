import './globals.css';

export const metadata = {
  title: 'Ashish | Ak',
  description: 'Personal portfolio, projects and collaboration hub for Ashish.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
