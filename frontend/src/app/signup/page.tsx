'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    f_name: '',
    age: '',
    user_email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.addUser({
        ...formData,
        age: parseInt(formData.age, 10)
      });
      // After signup, log them in
      await api.login(formData.user_email, formData.password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: 'var(--surface)',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-md)',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid var(--border)'
      }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>Create Account</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', textAlign: 'center' }}>
          Sign up to access the dashboard.
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>First Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Last Name</label>
              <input type="text" name="f_name" value={formData.f_name} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required style={inputStyle} min="1" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Email</label>
            <input type="email" name="user_email" value={formData.user_email} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '8px'
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  outline: 'none',
  boxSizing: 'border-box' as const
};
