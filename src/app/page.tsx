"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">LuxeStays</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-900 font-semibold text-sm hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Staff Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 text-center max-w-4xl pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LuxeStays Enterprise v2.0 is live
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Manage your luxury property with <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">precision.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The all-in-one platform for boutique hotels and luxury resorts. Handle guests, bookings, and services seamlessly in one unified interface.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 text-white font-semibold text-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 group">
                Enter Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 border border-slate-800 text-white font-semibold text-lg hover:bg-slate-800 transition-all">
                Book a Demo
              </button>
            </div>
          </motion.div>
        </div>

        {/* Features Preview */}
        <div className="container mx-auto px-6 mt-32 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="w-6 h-6 text-emerald-400" />, title: "Secure Operations", desc: "Enterprise-grade security for all guest data and payment processing." },
              { icon: <Clock className="w-6 h-6 text-blue-400" />, title: "Real-time Sync", desc: "Instant updates across all staff devices for room statuses and bookings." },
              { icon: <Star className="w-6 h-6 text-gold-400" />, title: "Premium Experience", desc: "Deliver 5-star service with intelligent guest preference tracking." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center mb-6 shadow-inner border border-slate-800">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-12 text-center text-slate-500 text-sm">
        <p>© 2026 LuxeStays Management Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}
