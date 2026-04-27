"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Bed, CalendarCheck, Settings, CreditCard, Activity, ArrowLeft } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: <Activity className="w-5 h-5" /> },
    { name: 'Guests', href: '/dashboard/guests', icon: <Users className="w-5 h-5" /> },
    { name: 'Rooms', href: '/dashboard/rooms', icon: <Bed className="w-5 h-5" /> },
    { name: 'Bookings', href: '/dashboard/bookings', icon: <CalendarCheck className="w-5 h-5" /> },
    { name: 'Services', href: '/dashboard/services', icon: <Settings className="w-5 h-5" /> },
    { name: 'Payments', href: '/dashboard/payments', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Reports', href: '/dashboard/reports', icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950/50 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-slate-900">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Site</span>
          </Link>
        </div>
        <div className="px-6 py-8">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Management</div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-slate-900 text-gold-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-slate-900 flex items-center px-8 bg-slate-950/50">
          <h2 className="text-xl font-semibold">Admin Portal</h2>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
