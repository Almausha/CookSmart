import { useState, useEffect } from 'react';
import { Users, Activity, Trash2, ChefHat, Mail, Shield, Clock, Search } from 'lucide-react';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  pantryCount?: number;
  recipesCooked?: number;
  allergens?: string[];
  createdAt: string;
}

interface ActivityItem {
  userName: string;
  userEmail: string;
  recipeTitle: string;
  action: string;
  timestamp: string;
}


// ── Helpers ──────────────────────────────────────────────────────────────────
const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (h > 0) return `${h} hour${h > 1 ? 's' : ''} ago`;
  return `${m} minute${m > 1 ? 's' : ''} ago`;
};

const actionColor: Record<string, string> = {
  created:  '#f97316',
  cooked:   '#4ade80',
  reviewed: '#60a5fa',
};

// ── Shared style tokens (match admin dashboard) ───────────────────────────────
const glass = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '2rem',
};

// ── Sub-components ────────────────────────────────────────────────────────────

const StatPill = ({ label, value }: { label: string; value: string | number }) => (
  <div style={{
    background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '6px 14px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    minWidth: 70,
  }}>
    <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{value}</span>
    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
  </div>
);

const UserCard = ({ user, onDelete }: { user: User; onDelete: (id: string) => void }) => (
  <div style={{
    ...glass,
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    position: 'relative',
    transition: 'border-color 0.2s',
  }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
  >
    {/* Delete button */}
    <button
      onClick={() => onDelete(user._id)}
      title="Delete user"
      style={{
        position: 'absolute', top: 16, right: 16,
        background: 'rgba(249,115,22,0.15)',
        border: '1px solid rgba(249,115,22,0.3)',
        borderRadius: 12,
        padding: 8, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(249,115,22,0.35)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(249,115,22,0.15)')}
    >
      <Trash2 size={16} color="#f97316" />
    </button>

    {/* Name + role */}
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span style={{
          color: '#60a5fa', fontWeight: 900, fontSize: 18,
          fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>{user.name}</span>
        {user.role === 'admin' && (
          <span style={{
            background: 'rgba(249,115,22,0.2)', border: '1px solid rgba(249,115,22,0.5)',
            borderRadius: 8, padding: '2px 8px',
            color: '#f97316', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
          }}>ADMIN</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
        <Mail size={12} />
        {user.email}
      </div>
    </div>

    {/* Stats row */}
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <StatPill label="Pantry"   value={user.pantryCount  ?? 0} />
      <StatPill label="Recipes"  value={user.recipesCooked ?? 0} />
      <StatPill label="Joined"   value={new Date(user.createdAt).getFullYear()} />
    </div>

    {/* Allergens */}
    {user.allergens && user.allergens.length > 0 && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Shield size={13} color="#f97316" />
        <span style={{ color: '#f97316', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Allergen</span>
        {user.allergens.map(a => (
          <span key={a} style={{
            color: 'rgba(255,255,255,0.5)', fontSize: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '2px 10px',
          }}>— {a}</span>
        ))}
      </div>
    )}
  </div>
);

const ActivityRow = ({ item, index, total }: { item: ActivityItem; index: number; total: number }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 0',
    borderBottom: index < total - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 14 }}>
        <span style={{ color: '#fff', fontWeight: 800 }}>{item.userName}</span>
        <span style={{ color: 'rgba(255,255,255,0.45)' }}> {item.action} </span>
        <span style={{ color: actionColor[item.action] ?? '#f97316', fontWeight: 700 }}>
          "{item.recipeTitle}"
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
        <Clock size={11} />
        {timeAgo(item.timestamp)}
      </div>
    </div>
    <button style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '6px 16px',
      color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 800,
      cursor: 'pointer', letterSpacing: '0.05em',
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.2)'; e.currentTarget.style.color = '#f97316'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
    >View</button>
  </div>
);


export default function UsersView() {

  const [users,    setUsers]    = useState<User[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [search,   setSearch]   = useState('');
  const [tab,      setTab]      = useState<'users' | 'activity'>('users');
  const [loading,  setLoading]  = useState(false);

  // ── Replace mock calls with real API once backend is ready ──
  useEffect(() => {
  setLoading(true);
  Promise.all([
    api.get('/admin/users'),
    api.get('/admin/users/activity')
  ])
  .then(([usersRes, activityRes]) => {
    console.log('Users response:', usersRes.data);
    console.log('Activity response:', activityRes.data);
    setUsers(Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users ?? []);
    setActivity(Array.isArray(activityRes.data) ? activityRes.data : []);
  })
  .catch(err => {
    console.error('Error loading data:', err);
    console.error('Error details:', err.response?.data || err.message);
  })
  .finally(() => setLoading(false));
}, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u._id !== id));
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const tabBtn = (label: string, value: typeof tab, icon: React.ReactNode) => (
    <button
      onClick={() => setTab(value)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 22px', borderRadius: 14,
        border: tab === value ? '1px solid rgba(249,115,22,0.5)' : '1px solid rgba(255,255,255,0.08)',
        background: tab === value ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.03)',
        color: tab === value ? '#f97316' : 'rgba(255,255,255,0.5)',
        fontWeight: 800, fontSize: 12, letterSpacing: '0.1em',
        textTransform: 'uppercase', cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {icon}{label}
    </button>
  );

  return (
    <div style={{ color: '#fff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          fontSize: 42, fontWeight: 900, margin: 0,
          letterSpacing: '-0.03em', textTransform: 'uppercase',
          color: '#fff',
        }}>
          User <span style={{ color: '#f97316', fontStyle: 'italic' }}>Management</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', marginTop: 6, fontSize: 14, fontWeight: 500 }}>
          {users.length} registered users · monitoring activity
        </p>
      </div>

      {/* Tabs + Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {tabBtn('All Users', 'users',    <Users size={14} />)}
          {tabBtn('Activity',  'activity', <Activity size={14} />)}
        </div>
        {tab === 'users' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14, padding: '10px 16px',
            minWidth: 260,
          }}>
            <Search size={14} color="rgba(255,255,255,0.4)" />
            <input
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: '#fff', fontSize: 14, width: '100%',
              }}
            />
          </div>
        )}
      </div>

      {/* Users Grid */}
      {tab === 'users' && (
        filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '60px 0' }}>
            <Users size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div style={{ fontWeight: 800, fontSize: 16 }}>No users found</div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {filtered.map(user => (
              <UserCard key={user._id} user={user} onDelete={handleDelete} />
            ))}
          </div>
        )
      )}

      {/* Activity Feed */}
      {tab === 'activity' && (
        <div style={{ ...glass, padding: '8px 32px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 4,
          }}>
            <ChefHat size={18} color="#f97316" />
            <span style={{ fontWeight: 900, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
              Recent User Activity
            </span>
          </div>
          {activity.map((item, i) => (
        <ActivityRow key={i} item={item} index={i} total={activity.length} />
          ))}
        </div>
      )}
    </div>
  );
}