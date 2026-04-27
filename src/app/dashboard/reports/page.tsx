"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { DollarSign, Home, Users, CalendarDays, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  const [revenue, setRevenue] = useState(0);
  const [occupancy, setOccupancy] = useState<any>({});
  const [guestHistory, setGuestHistory] = useState<any[]>([]);
  const [popularRooms, setPopularRooms] = useState<any[]>([]);
  const [pendingCheckouts, setPendingCheckouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [revRes, occRes, histRes, popRes, pendRes] = await Promise.all([
          axios.get('/api/reports/revenue'),
          axios.get('/api/reports/occupancy'),
          axios.get('/api/reports/guest-history'),
          axios.get('/api/reports/popular-rooms'),
          axios.get('/api/reports/pending-checkouts'),
        ]);

        setRevenue(revRes.data.totalRevenue);
        setOccupancy(occRes.data);
        setGuestHistory(histRes.data);
        setPopularRooms(popRes.data);
        setPendingCheckouts(pendRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Generating Reports...</div>;
  }

  return (
    <div className="space-y-12 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Executive Reports</h1>
      </div>

      {/* 1. Total Revenue & 3. Room Occupancy Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-emerald-900/20 border border-emerald-900/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-medium text-emerald-400/80">Total Revenue</h3>
          </div>
          <div className="text-4xl font-bold text-white">${revenue.toLocaleString()}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
        >
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-slate-400">Available Rooms</h3>
          </div>
          <div className="text-3xl font-bold text-white">{occupancy.Available || 0}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
        >
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-medium text-slate-400">Occupied Rooms</h3>
          </div>
          <div className="text-3xl font-bold text-white">{occupancy.Occupied || 0}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
        >
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-medium text-slate-400">Maintenance</h3>
          </div>
          <div className="text-3xl font-bold text-white">{occupancy.Maintenance || 0}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 4. Popular Room Types */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-gold-400" />
            <h2 className="text-xl font-bold">Popular Room Types</h2>
          </div>
          <div className="space-y-4">
            {popularRooms.length === 0 ? (
              <p className="text-slate-500 text-sm">No data available.</p>
            ) : (
              popularRooms.map((room, idx) => (
                <div key={room._id} className="flex items-center justify-between p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                      #{idx + 1}
                    </div>
                    <span className="font-medium text-slate-200">{room._id}</span>
                  </div>
                  <div className="text-sm font-medium text-gold-400">{room.bookingCount} Bookings</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 5. Pending Check-outs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-6">
          <div className="flex items-center gap-3 mb-6">
            <CalendarDays className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl font-bold">Pending Check-outs</h2>
          </div>
          <div className="space-y-4">
            {pendingCheckouts.length === 0 ? (
              <p className="text-slate-500 text-sm">No pending check-outs.</p>
            ) : (
              pendingCheckouts.map((booking) => (
                <div key={booking._id} className="p-4 rounded-lg bg-slate-950/50 border border-slate-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-slate-200">{booking.guestId?.name || 'Unknown Guest'}</span>
                    <span className="text-xs font-medium px-2 py-1 bg-rose-500/10 text-rose-400 rounded-md border border-rose-500/20">
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400">Room: {booking.roomId?.roomType || 'Unknown'}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 2. Guest Stay History */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold">Guest Stay History</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Guest Name</th>
              <th className="px-6 py-4 font-medium">Room Type</th>
              <th className="px-6 py-4 font-medium">Check-In Date</th>
              <th className="px-6 py-4 font-medium">Check-Out Date</th>
              <th className="px-6 py-4 font-medium">Nights Stayed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {guestHistory.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No stay history found.</td></tr>
            ) : (
              guestHistory.map((record) => (
                <tr key={record._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{record.guestId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-slate-400">{record.roomId?.roomType || 'Unknown'}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(record.checkInDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(record.checkOutDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-400">{record.nights}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
