import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClubOS – Manage Clubs, Events, Tasks and Budgets",
  description:
    "ClubOS is a powerful platform to manage clubs, events, members, tasks, and budgets. Invite members, assign tasks, track attendance, and more.",
  keywords:
    "club management, event management, task assignment, student clubs, club platform, budget tracking, attendance, ClubOS",
  authors: [{ name: "ClubOS Team", url: "https://clubos.vercel.app" }],
  creator: "ClubOS",
  openGraph: {
    title: "ClubOS – Club, Event & Member Management Platform",
    description:
      "Simplify your club operations with ClubOS. Manage tasks, events, attendance, budgets, and more from a modern dashboard.",
    url: "https://clubos.vercel.app",
    siteName: "ClubOS",
    images: [
      {
        url: "https://clubos.vercel.app/og-image.png", // replace with actual hosted OG image
        width: 1200,
        height: 630,
        alt: "ClubOS App Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClubOS – Club & Event Management Platform",
    description:
      "Join and manage your clubs efficiently. Create events, assign tasks, track attendance, and control budgets.",
    images: ["https://clubos.vercel.app/og-image.png"],
    creator: "@fahimalif077", // optional
  },
  metadataBase: new URL("https://clubos.vercel.app"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#ec4899",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        {children}
         <Toaster position="top-right" />
        <Footer/>
      </body>
    </html>
  );
}
