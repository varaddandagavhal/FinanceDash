import { useState, useEffect } from 'react';
import { UserPlus, UserMinus, ShieldCheck, Mail } from 'lucide-react';
import api from './api';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'analyst' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      setShowAddForm(false);
      setNewUser({ name: '', email: '', role: 'analyst' });
      fetchUsers();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      await api.put(`/users/${id}`, { status: status === 'active' ? 'inactive' : 'active' });
      fetchUsers();
    } catch (err) { alert('Action failed'); }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          Active Personnel
        </h3>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)} 
            className="flex items-center gap-2 bg-emerald-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-sm transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> Add Member
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-zinc-900 border border-emerald-500/20 p-6 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Name</label>
              <input 
                type="text" required
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-emerald-500/50"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Email</label>
              <input 
                type="email" required
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-emerald-500/50"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Role</label>
              <select 
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-emerald-500/50"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="analyst">Analyst</option>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-emerald-500 text-zinc-950 font-bold py-3 rounded-xl text-sm">Create</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-3 bg-zinc-800 rounded-xl text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="text-zinc-600 italic">Accessing system database...</div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="p-6 bg-zinc-900 border border-zinc-900 rounded-3xl group hover:border-emerald-500/30 transition-all shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  {user.role === 'admin' ? <ShieldCheck className="text-emerald-500" /> : <Mail className="text-zinc-600" />}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-inner ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {user.status}
                </span>
              </div>
              <h4 className="text-lg font-bold mb-1">{user.name}</h4>
              <p className="text-zinc-500 text-xs mb-6 uppercase font-mono tracking-widest">{user.role}</p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleStatus(user._id, user.status)}
                  className="flex-1 text-[10px] uppercase font-bold py-2 bg-zinc-950 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  Toggle Status
                </button>
                <button 
                    onClick={() => alert('Role management mock')}
                    className="p-2 bg-zinc-950 border border-zinc-800 rounded-xl hover:bg-emerald-500/20 hover:text-emerald-400 group-hover:border-emerald-500/40 transition-all"
                >
                    <UserMinus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-zinc-600 italic">No users in registry.</p>
        )}
      </div>
    </div>
  );
}
