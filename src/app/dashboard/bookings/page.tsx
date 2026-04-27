"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, X } from 'lucide-react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestsList, setGuestsList] = useState<any[]>([]);
  const [roomsList, setRoomsList] = useState<any[]>([]);
  
  const [newBooking, setNewBooking] = useState({
    guestId: '',
    roomId: '',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nights: 3,
    discount: 0
  });

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      setBookings(res.data);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openModal = async () => {
    try {
      const gRes = await axios.get('/api/guests');
      const rRes = await axios.get('/api/rooms');
      setGuestsList(gRes.data);
      setRoomsList(rRes.data);
      if (gRes.data.length > 0 && rRes.data.length > 0) {
        setNewBooking({
          ...newBooking,
          guestId: gRes.data[0]._id,
          roomId: rRes.data[0]._id
        });
      }
      setIsModalOpen(true);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newBooking.guestId || !newBooking.roomId) {
        alert('Please select a Guest and a Room.');
        return;
      }
      await axios.post('/api/bookings', newBooking);
      fetchBookings();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await axios.delete(`/api/bookings/${id}`);
      fetchBookings();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <button 
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Booking
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
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading bookings...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No bookings found.</td></tr>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Booking</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Guest</label>
                <select required value={newBooking.guestId} onChange={e => setNewBooking({...newBooking, guestId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500">
                  <option value="" disabled>Select Guest</option>
                  {guestsList.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Room</label>
                <select required value={newBooking.roomId} onChange={e => setNewBooking({...newBooking, roomId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500">
                  <option value="" disabled>Select Room</option>
                  {roomsList.map(r => <option key={r._id} value={r._id}>{r.roomType} (Floor {r.floor})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Check-In Date</label>
                <input required type="date" value={newBooking.checkInDate} onChange={e => setNewBooking({...newBooking, checkInDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Check-Out Date</label>
                <input required type="date" value={newBooking.checkOutDate} onChange={e => setNewBooking({...newBooking, checkOutDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Nights</label>
                  <input required type="number" min="1" value={newBooking.nights} onChange={e => setNewBooking({...newBooking, nights: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Discount (%)</label>
                  <input required type="number" min="0" max="100" value={newBooking.discount} onChange={e => setNewBooking({...newBooking, discount: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500" />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-gold-500 text-slate-950 font-bold rounded-lg hover:bg-gold-400 transition-colors mt-4">
                Save Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
