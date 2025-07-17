"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-purple-700 text-white p-6 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">ClubOS</h1>
          <button className="md:hidden" onClick={toggleSidebar}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link href="/dashboard"  className={`px-4 py-2 rounded-lg transition ${
    pathname === "/dashboard"
      ? "bg-white text-purple-700 font-semibold"
      : "bg-purple-600 hover:bg-purple-500 text-white"
  }`}>🏠 Dashboard</Link>
          <Link href="/dashboard/events"  className={`px-4 py-2 rounded-lg transition ${
    pathname === "/dashboard/events"
      ? "bg-white text-purple-700 font-semibold"
      : "bg-purple-600 hover:bg-purple-500 text-white"
  }`}>📅 Events</Link>
          <Link href="/dashboard/clubs"  className={`px-4 py-2 rounded-lg transition ${
    pathname === "/dashboard/clubs"
      ? "bg-white text-purple-700 font-semibold"
      : "bg-purple-600 hover:bg-purple-500 text-white"
  }`}>🏫 Clubs</Link>
          <Link href="/dashboard/profile"  className={`px-4 py-2 rounded-lg transition ${
    pathname === "/dashboard/profile"
      ? "bg-white text-purple-700 font-semibold"
      : "bg-purple-600 hover:bg-purple-500 text-white"
  }`}>🙍‍♂️ Profile</Link>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow md:hidden">
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <div className="w-6 h-6" /> {/* Placeholder for spacing */}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
