"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/api/payments');
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleInsert = async () => {
    try {
      const bRes = await axios.get('/api/bookings');
      if (bRes.data.length === 0) {
        alert('Please create at least one Booking first.');
        return;
      }
      // Assuming payment is roughly related to the booking
      await axios.post('/api/payments', {
        bookingId: bRes.data[0]._id, // 1:1 relationship
        amount: Math.floor(Math.random() * 500) + 100
      });
      fetchPayments();
    } catch (err: any) {
      if (err.response?.status === 400) {
        alert("Payment for this booking might already exist (1:1 relationship constraint). Try deleting DB or creating a new booking.");
      }
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;
    try {
      await axios.delete(`/api/payments/${id}`);
      fetchPayments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Payments</h1>
        <button 
          onClick={handleInsert}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-slate-950 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Payment (Q6)
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
              <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Loading payments...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No payments found.</td></tr>
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
    </div>
  );
}
