"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ guests: 0, rooms: 0, bookings: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [gRes, rRes, bRes] = await Promise.all([
          axios.get('/api/guests'),
          axios.get('/api/rooms'),
          axios.get('/api/bookings')
        ]);
        setStats({
          guests: gRes.data.length,
          rooms: rRes.data.length,
          bookings: bRes.data.length
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Guests', value: stats.guests },
    { label: 'Rooms Available', value: stats.rooms }, // Simplified logic for demo
    { label: 'Active Bookings', value: stats.bookings },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
          >
            <div className="text-sm font-medium text-slate-400 mb-2">{stat.label}</div>
            <div className="text-4xl font-semibold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800">
        <h2 className="text-xl font-semibold mb-4">Welcome to LuxeStays Admin</h2>
        <p className="text-slate-400 leading-relaxed max-w-2xl">
          Use the navigation menu on the left to manage guests, rooms, bookings, and services. 
          The interface is designed for high-efficiency operations, allowing quick inserts and updates to the system.
        </p>
      </div>
    </div>
  );
}
