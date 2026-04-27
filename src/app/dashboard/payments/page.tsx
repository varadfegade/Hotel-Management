"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, X } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingsList, setBookingsList] = useState<any[]>([]);
  const [newPayment, setNewPayment] = useState({ bookingId: '', amount: 100 });

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/api/payments');
      setPayments(res.data);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const openModal = async () => {
    try {
      const bRes = await axios.get('/api/bookings');
      setBookingsList(bRes.data);
      if (bRes.data.length > 0) {
        setNewPayment({ ...newPayment, bookingId: bRes.data[0]._id });
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
      if (!newPayment.bookingId) {
        alert('Please select a Booking.');
        return;
      }
      await axios.post('/api/payments', newPayment);
      fetchPayments();
      setIsModalOpen(false);
    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.data?.error?.includes('duplicate')) {
        alert("Payment for this booking might already exist (1:1 relationship constraint).");
      } else {
        alert(err.response?.data?.error || err.message);
      }
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;
    try {
      await axios.delete(`/api/payments/${id}`);
      fetchPayments();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Payments</h1>
        <button 
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Payment
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Booking ID</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading payments...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No payments found.</td></tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{payment.bookingId?._id || 'Unknown'}</td>
                  <td className="px-6 py-4 font-medium text-emerald-400">${payment.amount}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex justify-end">
                    <button 
                      onClick={() => handleDelete(payment._id)}
                      className="text-rose-400 hover:text-rose-300 p-1.5 transition-colors"
                      title="Delete Payment"
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
              <h2 className="text-xl font-bold">Add New Payment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Booking</label>
                <select required value={newPayment.bookingId} onChange={e => setNewPayment({...newPayment, bookingId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500">
                  <option value="" disabled>Select Booking</option>
                  {bookingsList.map(b => <option key={b._id} value={b._id}>{b.guestId?.name} - {b.roomId?.roomType}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Amount ($)</label>
                <input required type="number" min="0" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500" />
              </div>
              <button type="submit" className="w-full py-2 bg-gold-500 text-slate-950 font-bold rounded-lg hover:bg-gold-400 transition-colors mt-4">
                Save Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
