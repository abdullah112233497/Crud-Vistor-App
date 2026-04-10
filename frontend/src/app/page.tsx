'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import UserForm from '@/components/UserForm';
import UserCard from '@/components/UserCard';
import BottomNav from '@/components/BottomNav';
import EditModal from '@/components/EditModal';
import { api, User } from '@/lib/api';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchUsers = useCallback(async () => {
    try {
      console.log('Fetching users from API...');
      const data = await api.getUsers();
      console.log('Successfully fetched users:', data);
      setUsers(data);
    } catch (err) {
      console.error('CRITICAL: Failed to fetch users from backend:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateSuccess = () => {
    setEditingUser(null);
    fetchUsers();
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div className="main-container">
        {/* Left Side: Form */}
        <div className="form-sidebar">
          <UserForm onSuccess={fetchUsers} />
        </div>

        {/* Right Side: List */}
        <div className="directory-container" style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 8px'
            }}>
              <h2 style={{ fontSize: '22px', letterSpacing: '-0.02em' }}>Visitors Directory</h2>
              <div style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '800'
              }}>
                {filteredUsers.length} VISITORS
              </div>
            </div>

            <div style={{ padding: '0 8px' }}>
              <input 
                type="text" 
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </div>
          </div>

          <div className="user-list" style={{
            overflowY: 'auto',
            paddingRight: '8px',
            flex: 1
          }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Loading customers...
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 40px', 
                backgroundColor: 'var(--surface)',
                borderRadius: '16px',
                border: '1px dashed var(--border)',
                color: 'var(--text-muted)'
              }}>
                No customers found. Add one on the left!
              </div>
            )}
          </div>
        </div>
      </div>

      {editingUser && (
        <EditModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onSuccess={handleUpdateSuccess} 
        />
      )}
    </main>
  );
}
