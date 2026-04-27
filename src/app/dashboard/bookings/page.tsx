"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleInsert = async () => {
    try {
      // Need a guest and room to make a booking
      const gRes = await axios.get('/api/guests');
      const rRes = await axios.get('/api/rooms');
      
      if (gRes.data.length === 0 || rRes.data.length === 0) {
        alert('Please create at least one Guest and one Room first.');
        return;
      }

      await axios.post('/api/bookings', {
        guestId: gRes.data[0]._id,
        roomId: rRes.data[0]._id,
        checkInDate: new Date(),
        checkOutDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        nights: 3,
        discount: 10
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await axios.delete(`/api/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <button 
          onClick={handleInsert}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Booking (Q3)
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Guest</th>
              <th className="px-6 py-4 font-medium">Room</th>
              <th className="px-6 py-4 font-medium">Check-In</th>
              <th className="px-6 py-4 font-medium">Nights</th>
              <th className="px-6 py-4 font-medium">Discount</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading bookings...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No bookings found.</td></tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{booking.guestId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-slate-400">{booking.roomId?.roomType || 'Unknown'}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-slate-400">{booking.nights}</td>
                  <td className="px-6 py-4 text-emerald-400">{booking.discount}%</td>
                  <td className="px-6 py-4 flex justify-end">
                    <button 
                      onClick={() => handleDelete(booking._id)}
                      className="text-rose-400 hover:text-rose-300 p-1.5 transition-colors"
                      title="Delete Booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
