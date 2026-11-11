import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Haff — Plan & actual', description: 'Plan your day. See where your time went. A private, local time journal.', icons: { icon: '/favicon.svg' } };
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) {return <html lang="en"><body>{children}</body></html>;}
