const API_BASE_URL = 'http://localhost:8000';

export interface User {
  id: number;
  name: string;
  f_name: string;
  age: number;
  user_email: string;
  password?: string;
}

export interface UserFormData {
  name: string;
  f_name: string;
  age: number;
  user_email: string;
  password?: string;
}

export const api = {
  async getUsers(): Promise<User[]> {
    try {
      // Adding a timestamp ?t= to force the browser to get fresh data every time
      const res = await fetch(`${API_BASE_URL}/users?t=${Date.now()}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          console.log('API returned 404: No users found in database.');
          return [];
        }
        throw new Error(`Server responded with status: ${res.status}`);
      }
      
      const data = await res.json();
      return data["Users in DB"] || [];
    } catch (error) {
      console.error('Fetch error details:', error);
      throw error;
    }
  },

  async addUser(user: UserFormData): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/add_user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error('Failed to add user');
    return res.json();
  },

  async deleteUser(id: number): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/delete_user/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },

  async updateUser(id: number, user: UserFormData): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/user_update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },

  async partialUpdateUser(id: number, data: Partial<UserFormData>): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/single_update/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to patch user');
    return res.json();
  }
};
