"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('/api/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleInsert = async () => {
    try {
      await axios.post('/api/rooms', {
        roomType: ['Deluxe', 'Suite', 'Standard'][Math.floor(Math.random() * 3)],
        price: Math.floor(Math.random() * 300) + 100,
        status: 'Available',
        floor: Math.floor(Math.random() * 5) + 1
      });
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(`/api/rooms/${id}/status`, { status: newStatus });
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    try {
      await axios.delete(`/api/rooms/${id}`);
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <button 
          onClick={handleInsert}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Room (Q2)
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Room Type</th>
              <th className="px-6 py-4 font-medium">Floor</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading rooms...</td></tr>
            ) : rooms.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No rooms found.</td></tr>
            ) : (
              rooms.map((room) => (
                <tr key={room._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{room.roomType}</td>
                  <td className="px-6 py-4 text-slate-400">Floor {room.floor}</td>
                  <td className="px-6 py-4 text-slate-400">${room.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      room.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      room.status === 'Occupied' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center justify-end gap-2">
                    {room.status !== 'Occupied' ? (
                      <button 
                        onClick={() => handleUpdateStatus(room._id, 'Occupied')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 text-slate-200 text-xs font-medium rounded hover:bg-slate-700 transition-colors"
                        title="Update Status to Occupied (Q7)"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Mark Occupied
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUpdateStatus(room._id, 'Available')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 text-xs font-medium rounded hover:bg-emerald-900/60 transition-colors"
                        title="Revert Status to Available"
                      >
                        <XCircle className="w-3 h-3" />
                        Make Available
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(room._id)}
                      className="text-rose-400 hover:text-rose-300 p-1.5 transition-colors"
                      title="Delete Room"
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
