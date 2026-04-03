import { useState, useEffect } from 'react';
import { Trash2, Search, Filter } from 'lucide-react';
import api from './api';

export default function RecordsTable() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', category: '' });

  const role = localStorage.getItem('user-role') || 'admin';

  useEffect(() => {
    fetchRecords();
  }, [filters]); // Re-fetch when filters change!

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // Using the dynamic backend filters we built in Step 3!
      let query = '/records?';
      if (filters.type) query += `type=${filters.type}&`;
      if (filters.category) query += `category=${filters.category}&`;

      const response = await api.get(query);
      setRecords(response.data);
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('Confirm deletion?')) return;
    try {
      await api.delete(`/records/${id}`);
      fetchRecords();
    } catch (err) {
      alert('Permission Denied!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex gap-4 p-4 bg-zinc-900/40 border border-zinc-900 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search category..." 
            className="w-full bg-zinc-950 border border-zinc-800 p-3 pl-12 rounded-xl text-sm focus:outline-none focus:border-emerald-500/50"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          />
        </div>
        <select 
          className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-sm text-zinc-400 focus:outline-none focus:border-emerald-500/50"
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900 border-b border-zinc-800">
              <th className="p-5 text-zinc-400 font-medium uppercase tracking-wider text-xs">Date</th>
              <th className="p-5 text-zinc-400 font-medium uppercase tracking-wider text-xs">Category</th>
              <th className="p-5 text-zinc-400 font-medium uppercase tracking-wider text-xs">Type</th>
              <th className="p-5 text-zinc-400 font-medium uppercase tracking-wider text-xs text-right">Amount</th>
              {role === 'admin' && <th className="p-5 text-zinc-400 font-medium uppercase tracking-wider text-xs text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {loading ? (
               <tr><td colSpan="5" className="p-12 text-center text-zinc-500 animate-pulse">Loading data...</td></tr>
            ) : records.length > 0 ? (
              records.map((rec) => (
                <tr key={rec._id} className="hover:bg-zinc-900/80 transition-colors">
                  <td className="p-5 text-zinc-400">{new Date(rec.date).toLocaleDateString()}</td>
                  <td className="p-5"><span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg text-xs capitalize text-zinc-300">{rec.category}</span></td>
                  <td className="p-5">
                    <span className={rec.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}>{rec.type}</span>
                  </td>
                  <td className="p-5 text-right font-mono font-bold">${rec.amount.toLocaleString()}</td>
                  {role === 'admin' && (
                    <td className="p-5 text-center">
                      <button onClick={() => deleteRecord(rec._id)} className="p-2 text-zinc-600 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-20 text-center text-zinc-600">No matching records.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
