'use client';

import { useState } from 'react';
import { api, UserFormData } from '@/lib/api';

interface UserFormProps {
  onSuccess: () => void;
}

export default function UserForm({ onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    f_name: '',
    age: 0,
    user_email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addUser(formData);
      setFormData({ name: '', f_name: '', age: 0, user_email: '', password: '' });
      onSuccess();
    } catch (err) {
      alert('Error adding user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card register-form animate-fade-in" style={{
      backgroundColor: 'var(--surface)',
      padding: '32px',
      borderRadius: '24px',
      boxShadow: 'var(--shadow-md)',
      width: '100%',
      maxWidth: 'var(--sidebar-width)'
    }}>
      <h2 style={{ fontSize: '22px', marginBottom: '8px', letterSpacing: '-0.02em' }}>Add Visitor</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
        Add a new visitor profile to the system.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{ padding: '10px 14px' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="f_name">Father's Name</label>
          <input
            id="f_name"
            type="text"
            placeholder="e.g. Michael Doe"
            value={formData.f_name}
            onChange={(e) => setFormData({ ...formData, f_name: e.target.value })}
            required
            style={{ padding: '10px 14px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              placeholder="e.g. 25"
              value={formData.age || ''}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
              required
              style={{ padding: '10px 14px' }}
            />
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label htmlFor="status">Status</label>
            <select id="status" defaultValue="Active" style={{ padding: '10px 14px' }}>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="e.g. john@example.com"
            value={formData.user_email}
            onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
            required
            style={{ padding: '10px 14px' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            style={{ padding: '10px 14px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="submit-button"
          style={{
            marginTop: '8px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '16px',
            boxShadow: '0 4px 14px rgba(79, 110, 247, 0.4)',
            transition: 'var(--transition-fast)'
          }}
        >
          {loading ? 'Adding...' : 'Add Visitor'}
        </button>
      </form>
    </div>
  );
}
