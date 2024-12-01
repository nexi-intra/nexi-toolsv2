import React, { createContext, useContext, useCallback, useMemo, useState, useSyncExternalStore } from 'react';

type Record = any; // You might want to define a more specific type for your records

interface DatabaseCache {
  [tableName: string]: {
    [id: number]: Record;
  };
}

interface DatabaseCacheContextType {
  getRecord: (tableName: string, id: number) => Record | undefined;
  setRecord: (tableName: string, id: number, record: Record) => void;
  useRecord: (tableName: string, id: number) => Record | undefined;
}

const DatabaseCacheContext = createContext<DatabaseCacheContextType | null>(null);

export const DatabaseCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cacheVersion, setCacheVersion] = useState(0);
  const [subscribers, setSubscribers] = useState<{ [key: string]: Set<() => void> }>({});

  const cache = useMemo<DatabaseCache>(() => ({}), []);

  const getRecord = useCallback((tableName: string, id: number) => {
    return cache[tableName]?.[id];
  }, [cache]);

  const setRecord = useCallback((tableName: string, id: number, record: Record) => {
    if (!cache[tableName]) {
      cache[tableName] = {};
    }
    cache[tableName][id] = record;
    setCacheVersion(v => v + 1);

    // Notify subscribers
    const key = `${tableName}:${id}`;
    subscribers[key]?.forEach(callback => callback());
  }, [cache, subscribers]);

  const useRecord = (tableName: string, id: number) => {
    const key = `${tableName}:${id}`;

    const subscribe = useCallback((callback: () => void) => {
      setSubscribers(prev => {
        const newSubscribers = new Set(prev[key] || []);
        newSubscribers.add(callback);
        return { ...prev, [key]: newSubscribers };
      });

      return () => {
        setSubscribers(prev => {
          const newSubscribers = new Set(prev[key] || []);
          newSubscribers.delete(callback);
          return { ...prev, [key]: newSubscribers };
        });
      };
    }, [key]);

    const getSnapshot = useCallback(() => getRecord(tableName, id), [tableName, id, getRecord]);

    return useSyncExternalStore(subscribe, getSnapshot);
  };

  const contextValue = useMemo<DatabaseCacheContextType>(() => ({
    getRecord,
    setRecord,
    useRecord,
  }), [getRecord, setRecord, useRecord]);

  return (
    <DatabaseCacheContext.Provider value={contextValue}>
      {children}
    </DatabaseCacheContext.Provider>
  );
};

export const useDatabaseCache = () => {
  const context = useContext(DatabaseCacheContext);
  if (!context) {
    throw new Error('useDatabaseCache must be used within a DatabaseCacheProvider');
  }
  return context;
};

