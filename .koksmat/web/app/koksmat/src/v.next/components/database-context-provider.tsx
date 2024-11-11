import React, { createContext, useContext, useState, useCallback } from 'react';
import { z } from 'zod';
import { kVerbose, kWarn, kInfo, kError } from "@/lib/koksmat-logger-client";


// Create the context
interface KoksmatDatabaseContextType {
  messageProvider: MessageProvider;
  tokenProvider: TokenProvider;
  setMessageProvider: (provider: MessageProvider) => void;
  table: <T extends z.ZodObject<any>>(tableName: string, schema: T, isVirtual?: boolean) => DatabaseHandlerType<T>;
}

const KoksmatDatabaseContext = createContext<KoksmatDatabaseContextType | undefined>(undefined);

interface KoksmatDatabaseProviderProps {
  children: React.ReactNode;
  initialMessageProvider: MessageProvider;
  tokenProvider: TokenProvider;
}

// Create the provider component
export const KoksmatDatabaseProvider: React.FC<KoksmatDatabaseProviderProps> = ({ children, initialMessageProvider, tokenProvider }) => {
  const [messageProvider, setMessageProvider] = useState<MessageProvider>(initialMessageProvider);

  const useTable = useCallback(<T extends z.ZodObject<any>>(
    tableName: string,
    schema: T,
    isVirtual: boolean = false
  ): DatabaseHandlerType<T> => {
    return {
      read: async (id: number) => {
        kInfo("provider", `Reading record ${id} from ${tableName}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({

          subject: 'read',
          targetData: { table: tableName, isVirtual },
          payload: { id },
        }, token);
      },
      create: async (data: z.infer<T>) => {
        kInfo("provider", `Creating new record in ${tableName}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({

          subject: 'create',
          targetData: { table: tableName, isVirtual },
          payload: { data },
        }, token);
      },
      update: async (id: number, data: z.infer<T>) => {
        kInfo("provider", `Updating record ${id} in ${tableName}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({

          subject: 'update',
          targetData: { table: tableName, isVirtual },
          payload: { id, data },
        }, token);
      },
      patch: async (id: number, data: Partial<z.infer<T>>) => {
        kInfo("provider", `Patching record ${id} in ${tableName}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({

          subject: 'patch',
          targetData: { table: tableName, isVirtual },
          payload: { id, data },
        }, token);
      },
      delete: async (id: number, hardDelete: boolean = false) => {
        kInfo("provider", `Deleting record ${id} in ${tableName}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({

          subject: 'delete',
          targetData: { table: tableName, isVirtual },
          payload: { id, hardDelete },
        }, token);
      },
      restore: async (id: number) => {
        kInfo("provider", `Restoring record ${id} in ${tableName}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({

          subject: 'restore',
          targetData: { table: tableName, isVirtual },
          payload: { id },
        }, token);
      },
    };
  }, [messageProvider]);

  return (
    <KoksmatDatabaseContext.Provider value={{ messageProvider, setMessageProvider, table: useTable, tokenProvider }}>
      {children}
    </KoksmatDatabaseContext.Provider>
  );
};

// Create a custom hook to use the context
export const useKoksmatDatabase = () => {
  const context = useContext(KoksmatDatabaseContext);
  if (context === undefined) {
    throw new Error('useKoksmatDatabase must be used within a KoksmatDatabaseProvider');
  }
  return context;
};

// Example usage

import { DatabaseHandlerType, MessageProvider, TokenProvider } from '../lib/database-handler';
import { ComponentDoc } from '@/components/component-documentation-hub';

// Form-based message provider
const formMessageProvider: MessageProvider = {
  send: async (message) => {

    return new Promise((resolve) => {
      const response = window.prompt(`${message.subject} operation for ${message.targetData.table}:\n${JSON.stringify(message.payload, null, 2)}\n\nEnter response:`, 'OK');
      resolve({ success: true, response });
    });
  }
};

// In-memory message provider
const inMemoryMessageProvider: MessageProvider = {
  send: async (message) => {

    kInfo("provider", `In-memory operation: ${message.subject} for ${message.targetData.table}`);
    return { success: true, response: 'Default response' };
  }
};

export const examplesKoksmatDatabase: ComponentDoc[] = [
  {
    id: 'KoksmatDatabase',
    name: 'KoksmatDatabase',
    description: 'A context provider for managing database operations with switchable message providers.',
    usage: `
import { KoksmatDatabaseProvider, useKoksmatDatabase } from './KoksmatDatabase';
import { z } from 'zod';

// Wrap your app with the provider
const App = () => (
  <KoksmatDatabaseProvider initialMessageProvider={formMessageProvider}>
    <YourComponents />
  </KoksmatDatabaseProvider>
);

// Use the context in your components
const YourComponent = () => {
  const { messageProvider, setMessageProvider, useTable } = useKoksmatDatabase();

  // Define a schema and use a table
  const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
  });

  const userTable = useTable('users', UserSchema);

  // Use the table operations
  const handleCreateUser = async () => {
    const newUser = { name: 'John Doe', email: 'john@example.com' };
    const result = await userTable.create(newUser);
    console.log('Created user:', result);
  };

  const toggleMessageProvider = () => {
    setMessageProvider(
      messageProvider === formMessageProvider ? inMemoryMessageProvider : formMessageProvider
    );
  };

  return (
    <div>
      <h1>User Management</h1>
      <button onClick={handleCreateUser}>Create User</button>
      <button onClick={toggleMessageProvider}>
        Toggle Message Provider ({messageProvider === formMessageProvider ? 'Form' : 'In-Memory'})
      </button>
    </div>
  );
};
`,
    example: (
      <KoksmatDatabaseProvider initialMessageProvider={formMessageProvider} tokenProvider={{ getToken: async () => "a.b.c" }}>
        <div>KoksmatDatabase Provider (See usage for example)</div>
      </KoksmatDatabaseProvider>
    ),
  }
];

async function getToken(tokenProvider: TokenProvider) {

  const token = await tokenProvider.getToken();
  if (!token) {
    kError("provider", "No token provided", __dirname, __filename);
    throw new Error("No token provided");
  }
  return token
}
