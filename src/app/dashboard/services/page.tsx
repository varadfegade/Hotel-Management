"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [usages, setUsages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [sRes, uRes] = await Promise.all([
        axios.get('/api/services'),
        axios.get('/api/bookingservices')
      ]);
      setServices(sRes.data);
      setUsages(uRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInsertService = async () => {
    try {
      await axios.post('/api/services', {
        name: ['Spa', 'Room Service', 'Laundry', 'Gym'][Math.floor(Math.random() * 4)],
        cost: Math.floor(Math.random() * 100) + 20
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`/api/services/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleInsertUsage = async () => {
    try {
      const bRes = await axios.get('/api/bookings');
      if (bRes.data.length === 0 || services.length === 0) {
        alert('Please ensure you have at least one booking and one service available.');
        return;
      }
      await axios.post('/api/bookingservices', {
        bookingId: bRes.data[0]._id,
        serviceId: services[0]._id,
        quantity: 1
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUsage = async (id: string) => {
    try {
      await axios.delete(`/api/bookingservices/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12">
      {/* Services Catalog */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Service Catalog</h2>
          <button 
            onClick={handleInsertService}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Service (Q4)
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
            onClick={handleInsertUsage}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 font-semibold rounded-lg hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Record Usage (Q5)
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
                        title="Delete Record (Q9)"
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
    </div>
  );
}
