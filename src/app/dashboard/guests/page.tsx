"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

export default function GuestsPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '', address: '' });

  const fetchGuests = async () => {
    try {
      const res = await axios.get('/api/guests');
      setGuests(res.data);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/guests', newGuest);
      fetchGuests();
      setIsModalOpen(false);
      setNewGuest({ name: '', email: '', phone: '', address: '' });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleUpdateAddress = async (id: string) => {
    const newAddress = prompt('Enter new address:');
    if (!newAddress) return;
    try {
      await axios.put(`/api/guests/${id}/address`, { address: newAddress });
      fetchGuests();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;
    try {
      await axios.delete(`/api/guests/${id}`);
      fetchGuests();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Guests</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Guest
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Address</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading guests...</td></tr>
            ) : guests.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No guests found.</td></tr>
            ) : (
              guests.map((guest) => (
                <tr key={guest._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{guest.name}</td>
                  <td className="px-6 py-4 text-slate-400">{guest.email}</td>
                  <td className="px-6 py-4 text-slate-400">{guest.phone}</td>
                  <td className="px-6 py-4 text-slate-400">{guest.address}</td>
                  <td className="px-6 py-4 flex items-center justify-end gap-3">
                    <button 
                      onClick={() => handleUpdateAddress(guest._id)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      title="Update Address"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(guest._id)}
                      className="text-rose-400 hover:text-rose-300 transition-colors"
                      title="Delete Guest"
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
              <h2 className="text-xl font-bold">Add New Guest</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                <input required type="text" value={newGuest.name} onChange={e => setNewGuest({...newGuest, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                <input required type="email" value={newGuest.email} onChange={e => setNewGuest({...newGuest, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                <input required type="text" value={newGuest.phone} onChange={e => setNewGuest({...newGuest, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Address</label>
                <input required type="text" value={newGuest.address} onChange={e => setNewGuest({...newGuest, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500" />
              </div>
              <button type="submit" className="w-full py-2 bg-gold-500 text-slate-950 font-bold rounded-lg hover:bg-gold-400 transition-colors mt-4">
                Save Guest
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

