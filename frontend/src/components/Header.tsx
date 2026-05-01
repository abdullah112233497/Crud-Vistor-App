'use client';

import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header style={{
      height: 'var(--header-height)',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 clamp(16px, 5vw, 40px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          backgroundColor: 'var(--primary)',
          width: '8px',
          height: '24px',
          borderRadius: '4px'
        }} />
        <h1 style={{ 
          fontSize: 'clamp(18px, 2vw, 22px)', 
          fontWeight: '900', 
          color: 'var(--text-main)',
          letterSpacing: '-0.03em',
          textTransform: 'uppercase'
        }}>
          Visitors Entry System
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            textAlign: 'right',
            display: 'none',
            sm: 'block'
          }}>
            <p style={{ fontSize: '12px', fontWeight: '700', margin: 0 }}>System Admin</p>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0 }}>Active Now</p>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid white',
            boxShadow: 'var(--shadow-md)',
            backgroundColor: 'var(--primary-light)'
          }}>
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Admin"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            padding: '8px 16px',
            borderRadius: '8px',
            color: 'var(--text-main)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Logout
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          p { display: none; }
        }
      `}</style>
    </header>
  );
}
