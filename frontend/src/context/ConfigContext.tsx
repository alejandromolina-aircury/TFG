
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPublicFrontendConfig } from '../services/api';

interface Config {
  restaurant_name: string;
  restaurant_address: string;
  restaurant_phone: string;
  restaurant_email: string;
  specialties?: any;
}

interface ConfigContextType {
  config: Config;
  loading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>({
    restaurant_name: 'Mesón Marinero',
    restaurant_address: 'Calle del Puerto, 12 — Alicante',
    restaurant_phone: '965 00 00 00',
    restaurant_email: 'info@mesonmarinero.es'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getPublicFrontendConfig();
        if (data) {
          setConfig({
            restaurant_name: data.restaurant_name || 'Mesón Marinero',
            restaurant_address: data.restaurant_address || 'Calle del Puerto, 12 — Alicante',
            restaurant_phone: data.restaurant_phone || '965 00 00 00',
            restaurant_email: data.restaurant_email || 'info@mesonmarinero.es',
            specialties: data.specialties
          });
        }
      } catch (error) {
        console.error('Error fetching public config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
