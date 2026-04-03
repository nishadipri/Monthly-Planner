import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { RegisterServiceWorker } from '@/components/pwa/register-sw';
import './globals.css';

const robotoSlab = localFont({
  src: [
    {
      path: '../legacy/font/RobotoSlab-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../legacy/font/RobotoSlab-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../legacy/font/RobotoSlab-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-roboto-slab',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Monthly Planner',
  description: 'Modern local-first monthly planner with offline-ready basics.',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${robotoSlab.variable} appFont`}>
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
