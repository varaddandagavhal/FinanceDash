import { useState } from 'react';
import api from './api';
import { X, CheckCircle } from 'lucide-react';

export default function AddRecordForm({ onRecordAdded, onClose }) {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/records', formData);
      onRecordAdded(); // Refresh the parent table
      onClose(); // Hide form
    } catch (err) {
      console.error('Submit error:', err);
      alert('Error creating record: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-zinc-900 border border-emerald-500/30 p-8 rounded-3xl shadow-2xl mb-8 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          New Entry
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-zinc-950 rounded-xl transition-colors">
          <X className="w-5 h-5 text-zinc-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Amount ($)</label>
          <input 
            type="number" 
            required
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-lg focus:outline-none focus:border-emerald-500/50"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Type</label>
          <select 
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="expense">📉 Expense</option>
            <option value="income">📈 Income</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Category</label>
          <input 
            type="text" 
            required
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50"
            placeholder="e.g. Salary, Rent, Food"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Date</label>
          <input 
            type="date" 
            required
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-emerald-500/50 text-zinc-400"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          className="md:col-span-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] mt-2"
        >
          CREATE RECORD
        </button>
      </form>
    </div>
  );
}
