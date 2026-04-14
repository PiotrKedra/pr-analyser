import type { Metadata } from 'next';
import { Inter, PT_Serif } from 'next/font/google';
import { Header } from '@/features/_root/components/Header';
import { Footer } from '@/features/_root/components/Footer';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const ptSerif = PT_Serif({
  variable: '--font-pt-serif',
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PR Analyser',
  description: 'Analyze GitHub PR quality with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ptSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
