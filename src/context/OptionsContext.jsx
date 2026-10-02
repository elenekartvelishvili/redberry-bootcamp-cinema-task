import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { request } from '../api/client';

const OptionsContext = createContext(null);
export const useOptions = () => useContext(OptionsContext);

export function OptionsProvider({ children }) {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await request('/filter-options');
      setOptions(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <OptionsContext.Provider value={{ options, loading, error, reload: load }}>
      {children}
    </OptionsContext.Provider>
  );
}