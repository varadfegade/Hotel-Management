"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function GuestsPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGuests = async () => {
    try {
      const res = await axios.get('/api/guests');
      setGuests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleInsert = async () => {
    try {
      await axios.post('/api/guests', {
        name: `Guest ${Math.floor(Math.random() * 1000)}`,
        email: `guest${Math.floor(Math.random() * 1000)}@example.com`,
        phone: '1234567890',
        address: '123 Luxury Ave'
      });
      fetchGuests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAddress = async (id: string) => {
    const newAddress = prompt('Enter new address:');
    if (!newAddress) return;
    try {
      await axios.put(`/api/guests/${id}/address`, { address: newAddress });
      fetchGuests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;
    try {
      await axios.delete(`/api/guests/${id}`);
      fetchGuests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Guests</h1>
        <button 
          onClick={handleInsert}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Guest (Q1)
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
                      title="Update Address (Q8)"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(guest._id)}
                      className="text-rose-400 hover:text-rose-300 transition-colors"
                      title="Delete Guest (Q10)"
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
