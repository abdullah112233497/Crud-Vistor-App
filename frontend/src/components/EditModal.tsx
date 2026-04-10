'use client';

import { useState, useEffect } from 'react';
import { api, User, UserFormData } from '@/lib/api';

interface EditModalProps {
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditModal({ user, onClose, onSuccess }: EditModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    f_name: '',
    age: 0,
    user_email: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        f_name: user.f_name,
        age: user.age,
        user_email: user.user_email,
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateUser(user.id, formData);
      onSuccess();
    } catch (err) {
      alert('Error updating user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="animate-fade-in" style={{
        backgroundColor: 'var(--surface)',
        padding: '32px',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px' }}>Edit User</h2>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', color: 'var(--text-muted)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Father's Name</label>
            <input
              type="text"
              value={formData.f_name}
              onChange={(e) => setFormData({ ...formData, f_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              value={formData.age || ''}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.user_email}
              onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button 
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
