'use client';

import { User } from '@/lib/api';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return '??';
    const parts = name.trim().split(/\s+/).filter(part => part.length > 0);
    if (parts.length === 0) return '??';
    return parts.map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const status = user.age > 40 ? 'ON LEAVE' : 'ACTIVE';
  const statusColor = status === 'ACTIVE' ? 'var(--primary)' : 'var(--on-leave)';
  const badgeBg = status === 'ACTIVE' ? 'var(--primary-light)' : '#F7FAFC';

  return (
    <div className="user-card animate-fade-in" style={{
      backgroundColor: 'var(--surface)',
      padding: '16px 20px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      border: '1px solid var(--border)',
      transition: 'var(--transition-fast)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '18px'
        }}>
          {getInitials(user.name)}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
          <h3 style={{ 
            fontSize: '16px', 
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }} title={user.name}>{user.name}</h3>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
            {user.f_name} • {user.age} yrs
          </p>
          
          <p style={{ 
            color: 'var(--primary)', 
            fontSize: '12px', 
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            opacity: 0.8
          }}>
            {user.user_email}
          </p>

          <span style={{ 
            color: statusColor, 
            fontSize: '10px', 
            fontWeight: '800',
            textTransform: 'uppercase',
            marginTop: '4px'
          }}>
            {status}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => onEdit(user)}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
          }}
          title="Edit"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button 
          onClick={() => onDelete(user.id)}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            color: 'var(--danger)',
          }}
          title="Delete"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
