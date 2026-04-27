"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, X } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [usages, setUsages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', cost: 20 });
  
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [newUsage, setNewUsage] = useState({ bookingId: '', serviceId: '', quantity: 1 });

  const fetchData = async () => {
    try {
      const [sRes, uRes] = await Promise.all([
        axios.get('/api/services'),
        axios.get('/api/bookingservices')
      ]);
      setServices(sRes.data);
      setUsages(uRes.data);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/services', newService);
      fetchData();
      setIsServiceModalOpen(false);
      setNewService({ name: '', cost: 20 });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`/api/services/${id}`);
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  const openUsageModal = async () => {
    try {
      const bRes = await axios.get('/api/bookings');
      setBookingsList(bRes.data);
      if (bRes.data.length > 0 && services.length > 0) {
        setNewUsage({
          ...newUsage,
          bookingId: bRes.data[0]._id,
          serviceId: services[0]._id
        });
      }
      setIsUsageModalOpen(true);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleSaveUsage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newUsage.bookingId || !newUsage.serviceId) {
        alert('Please select a Booking and a Service.');
        return;
      }
      await axios.post('/api/bookingservices', newUsage);
      fetchData();
      setIsUsageModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteUsage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this usage record?')) return;
    try {
      await axios.delete(`/api/bookingservices/${id}`);
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="space-y-12">
      {/* Services Catalog */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Service Catalog</h2>
          <button 
            onClick={() => setIsServiceModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
              <th className="px-6 py-4 font-medium">Service Name</th>
              <th className="px-6 py-4 font-medium text-right">Cost</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No services found.</td></tr>
            ) : (
              services.map((service) => (
                <tr key={service._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{service.name}</td>
                  <td className="px-6 py-4 text-slate-400 text-right">${service.cost}</td>
                  <td className="px-6 py-4 flex justify-end">
                    <button 
                      onClick={() => handleDeleteService(service._id)}
                      className="text-rose-400 hover:text-rose-300 p-1.5 transition-colors"
                      title="Delete Service"
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

      {/* Service Usages */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Service Usage Records</h2>
          <button 
            onClick={openUsageModal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 font-semibold rounded-lg hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Record Usage
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Booking ID</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Quantity</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : usages.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No usages recorded.</td></tr>
              ) : (
                usages.map((usage) => (
                  <tr key={usage._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{usage.bookingId?._id || 'Unknown'}</td>
                    <td className="px-6 py-4 font-medium text-slate-200">{usage.serviceId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-slate-400">{usage.quantity}</td>
                    <td className="px-6 py-4 flex justify-end">
                      <button 
                        onClick={() => handleDeleteUsage(usage._id)}
                        className="text-rose-400 hover:text-rose-300 transition-colors"
                        title="Delete Record"
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

      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Service</h2>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                <input required type="text" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Cost ($)</label>
                <input required type="number" min="0" value={newService.cost} onChange={e => setNewService({...newService, cost: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500" />
              </div>
              <button type="submit" className="w-full py-2 bg-gold-500 text-slate-950 font-bold rounded-lg hover:bg-gold-400 transition-colors mt-4">
                Save Service
              </button>
            </form>
          </div>
        </div>
      )}

      {isUsageModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Record Service Usage</h2>
              <button onClick={() => setIsUsageModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveUsage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Booking</label>
                <select required value={newUsage.bookingId} onChange={e => setNewUsage({...newUsage, bookingId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500">
                  <option value="" disabled>Select Booking</option>
                  {bookingsList.map(b => <option key={b._id} value={b._id}>{b.guestId?.name} - {b.roomId?.roomType}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Service</label>
                <select required value={newUsage.serviceId} onChange={e => setNewUsage({...newUsage, serviceId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500">
                  <option value="" disabled>Select Service</option>
                  {services.map(s => <option key={s._id} value={s._id}>{s.name} (${s.cost})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Quantity</label>
                <input required type="number" min="1" value={newUsage.quantity} onChange={e => setNewUsage({...newUsage, quantity: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500" />
              </div>
              <button type="submit" className="w-full py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors mt-4">
                Save Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
