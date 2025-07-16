'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Left: Brand name */}
        <Link href="/" className="text-2xl font-bold text-primary">
          Club<span className="text-pink-500">OS</span>
        </Link>

        {/* Right: Links and Button */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/clubs" className="text-gray-700 hover:text-primary font-medium">
            Clubs
          </Link>
          <Link href="/events" className="text-gray-700 hover:text-primary font-medium">
            Events
          </Link>
          <Link href="/dashboard" className="text-gray-700 hover:text-primary font-medium">
            Dashboard
          </Link>
          <Button className="bg-primary text-white hover:bg-purple-700">
            Sign In
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/clubs" className="block text-gray-700 hover:text-primary font-medium">
            Clubs
          </Link>
          <Link href="/events" className="block text-gray-700 hover:text-primary font-medium">
            Events
          </Link>
          <Link href="/dashboard" className="block text-gray-700 hover:text-primary font-medium">
            Dashboard
          </Link>
          <Button className="w-full bg-primary text-white hover:bg-purple-700">
            Sign In
          </Button>
        </div>
      )}
    </header>
  );
}
