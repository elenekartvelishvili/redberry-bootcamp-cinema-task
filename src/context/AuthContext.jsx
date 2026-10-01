import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { request, getToken, setToken, setUnauthorizedHandler } from '../api/client';


const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);


const unwrap = (res) => res?.data ?? res;

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(!!getToken()); 
  const [modal, setModal] = useState(null); 
  const pendingAction = useRef(null); 

  const loadUser = useCallback(async () => {
    const res = await request('/me');
    const me = unwrap(res);
    setUser(me.user ?? me);
  }, []);


  useEffect(() => {
    if (!getToken())  return;
    loadUser()
      .catch(() => setToken(null)) 
      .finally(() => setLoading(false));
  }, [loadUser]);


  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null);
      setUser(null);
      setModal('login');
    });
  }, []);


  const closeModal = useCallback(() => {
    pendingAction.current = null;
    setModal(null);
  }, []);

  const finishAuth = async (res) => {
    const data = unwrap(res);
    setToken(data.token);
    await loadUser();
    setModal(null);


    const action = pendingAction.current;
    pendingAction.current = null;
    if (action) action();
  };


  const login = async (credentials) => {
    const res = await request('/login', { method: 'POST', body: credentials });
    await finishAuth(res);
  };


  const register = async (formData) => {
    const res = await request('/register', { method: 'POST', body: formData });
    await finishAuth(res);
  };

  const logout = async () => {
    try {
      await request('/logout', { method: 'POST' });
    } finally {
      setToken(null);
      setUser(null);
    }
  };


  const requireAuth = useCallback(
    (action) => {
      if (user) return action();
      pendingAction.current = action;
      setModal('login');
    },
    [user]
  );


  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    modal,
    openLogin: () => setModal('login'),
    openRegister: () => setModal('register'),
    closeModal,
    login,
    register,
    logout,
    requireAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}