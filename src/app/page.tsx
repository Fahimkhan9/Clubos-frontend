import CTASection from '@/components/landingpage/CTASection'
import FeaturesSection from '@/components/landingpage/FeaturesSection'
import HeroSection from '@/components/landingpage/HeroSection'
import HowItWorks from '@/components/landingpage/HowItWorks'
import React from 'react'
import type { Metadata } from "next";

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

function HomePage() {
  return (
    <>
    <HeroSection/>
    <FeaturesSection/>
    <HowItWorks/>
    <CTASection/>
    </>
  )
}

export default HomePage