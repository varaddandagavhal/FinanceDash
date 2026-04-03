import { useState, useEffect } from 'react';
import { LayoutDashboard, Wallet, CreditCard, Users, ArrowUpCircle, ArrowDownCircle, DollarSign, Plus } from 'lucide-react';
import api from './api';
import RecordsTable from './RecordsTable';
import UsersList from './UsersList';
import AddRecordForm from './AddRecordForm';

function App() {
  const [view, setView] = useState('overview'); // 'overview' or 'records'
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryTotals: []
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await api.get('/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-900 p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold mb-8 flex items-center gap-2 tracking-tight group cursor-default">
          <div className="bg-emerald-500/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5 text-emerald-500" />
          </div>
          FinanceDash
        </h1>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => { setView('overview'); fetchSummary(); }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'overview' ? 'bg-zinc-900 text-emerald-400 font-medium' : 'text-zinc-500 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => setView('records')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'records' ? 'bg-zinc-900 text-emerald-400 font-medium' : 'text-zinc-500 hover:text-white'}`}
          >
            <CreditCard className="w-5 h-5" /> Records
          </button>
          <button 
            onClick={() => { if (localStorage.getItem('user-role') === 'admin') setView('users'); }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              view === 'users' ? 'bg-zinc-900 text-emerald-400 font-medium' : 
              localStorage.getItem('user-role') === 'admin' ? 'text-zinc-500 hover:text-white' : 'text-zinc-500/30 cursor-not-allowed opacity-50'
            }`}
          >
            <Users className="w-5 h-5" /> Users (Admin)
          </button>
        </nav>

        {/* Role Switcher at Bottom */}
        <div className="mt-auto pt-6 border-t border-zinc-900">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Switch Role</label>
          <select 
            value={localStorage.getItem('user-role') || 'admin'}
            onChange={(e) => {
              localStorage.setItem('user-role', e.target.value);
              window.location.reload(); 
            }}
            className="w-full bg-zinc-900 text-sm p-3 rounded-xl border border-zinc-800 text-zinc-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="admin">🔴 Admin (Full Access)</option>
            <option value="analyst">🟡 Analyst (Edit Records)</option>
            <option value="viewer">🟢 Viewer (Read Only)</option>
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950 to-zinc-950">
        
        {view === 'overview' ? (
          <>
            <header className="mb-12">
              <h2 className="text-4xl font-bold tracking-tight mb-2">Overview</h2>
              <p className="text-zinc-500 opacity-80">Track your income and spending at a glance.</p>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card 
                title="Total Income" 
                value={summary.totalIncome} 
                icon={<ArrowUpCircle className="text-emerald-500" />} 
                color="text-emerald-400"
                loading={loading}
              />
              <Card 
                title="Total Expenses" 
                value={summary.totalExpense} 
                icon={<ArrowDownCircle className="text-rose-500" />} 
                color="text-rose-400"
                loading={loading}
              />
              <Card 
                title="Available Balance" 
                value={summary.balance} 
                icon={<DollarSign className="text-sky-500" />} 
                color="text-zinc-100"
                loading={loading}
              />
            </div>

            {/* Breakdown */}
            <div className="max-w-xl">
              <h3 className="text-lg font-bold mb-6 text-zinc-300">Category Breakdown</h3>
              <div className="space-y-4">
                {summary.categoryTotals.map((cat, i) => (
                  <div key={i} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-900 group">
                    <span className="capitalize text-zinc-400 group-hover:text-zinc-200 transition-colors">{cat.category}</span>
                    <span className="font-mono font-bold">${cat.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : view === 'records' ? (
          <>
            <header className="mb-12 flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-2">Records</h2>
                <p className="text-zinc-500 opacity-80">Full audit log of your financial history.</p>
              </div>
              {localStorage.getItem('user-role') === 'admin' && (
                <button 
                  onClick={() => setShowForm(!showForm)} 
                  className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95"
                >
                  <Plus className={showForm ? 'rotate-45 transition-transform' : 'transition-transform'} /> {showForm ? 'Cancel' : 'New Record'}
                </button>
              )}
            </header>

            {showForm && (
              <AddRecordForm 
                onRecordAdded={() => { setView('records'); /* List auto-refreshes in useEffect */ }}
                onClose={() => setShowForm(false)}
              />
            )}
            
            <RecordsTable />
          </>
        ) : (
          <>
            <header className="mb-12">
              <h2 className="text-4xl font-bold tracking-tight mb-2">User Registry</h2>
              <p className="text-zinc-500 opacity-80">Manage personnel roles and access status.</p>
            </header>
            <UsersList />
          </>
        )}
      </main>
    </div>
  );
}

const Card = ({ title, value, icon, color, loading }) => (
  <div className="p-10 bg-zinc-900/80 border border-zinc-900 rounded-3xl shadow-2xl relative group hover:border-zinc-800 transition-all backdrop-blur-sm">
    <div className="flex justify-between items-center mb-6">
      <p className="text-zinc-500 uppercase text-xs font-black tracking-widest leading-none">{title}</p>
      <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-inner">
        {icon}
      </div>
    </div>
    {loading ? (
      <div className="h-10 bg-zinc-950 rounded-xl animate-pulse w-3/4"></div>
    ) : (
      <h3 className={`text-4xl font-black font-mono tracking-tighter ${color}`}>
        ${value.toLocaleString()}
      </h3>
    )}
  </div>
);

export default App;
