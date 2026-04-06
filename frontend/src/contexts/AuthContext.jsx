import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/me/');
      setUser(response.data);
    } catch (error) {
      console.error('Session expired or invalid', error);
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await api.post('/login/', { username, password });
    const { access, refresh } = response.data;
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
