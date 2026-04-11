import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusDesk | Next-Gen Support Ticket Platform",
  description: "Intelligent, multi-tenant support tracking for modern SaaS teams. Resolve tickets faster and delight your customers.",
  openGraph: {
    title: "NexusDesk | Next-Gen Support Ticket Platform",
    description: "Intelligent, multi-tenant support tracking for modern SaaS teams. Resolve tickets faster and delight your customers.",
    siteName: "NexusDesk",
    type: "website",
  }
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster theme="dark" richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
