import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/themeProvider';
import { LanguageProvider } from '@/lib/languageContext';

export const metadata: Metadata = {
  title: 'MOHAMMAD ZIHAD — 02 / CINEMATIC DEVELOPER HERO',
  description: 'Creative Full-Stack Developer · Software Engineer · Digital Architect. Award-winning digital portfolio featuring cinematic editorial direction, interactive 3D engineering, and high-performance full-stack architectures.',
  keywords: [
    'MOHAMMAD ZIHAD',
    'Creative Full-Stack Developer',
    'Software Engineer',
    'Digital Architect',
    'WebGL',
    'Three.js',
    'Matter.js',
    'Next.js 16',
    'React 19',
    'Tailwind CSS',
    'Supabase',
    'Dhaka Bangladesh'
  ],
  authors: [{ name: 'MOHAMMAD ZIHAD' }],
  icons: {
    icon: [{ url: '/api/favicon', sizes: 'any' }],
  },
  openGraph: {
    title: 'MOHAMMAD ZIHAD — 02 / CINEMATIC DEVELOPER HERO',
    description: 'Creative Full-Stack Developer · Software Engineer · Digital Architect',
    url: 'https://zihadportfolio.dev',
    siteName: 'MOHAMMAD ZIHAD Portfolio',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#101114',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#0c0c0e] text-[#F4F1E9] selection:bg-[#f5a623]/25 selection:text-[#ffd166]">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
