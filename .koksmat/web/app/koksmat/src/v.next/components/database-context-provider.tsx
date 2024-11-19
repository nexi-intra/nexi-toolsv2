import React, { createContext, useContext, useState, useCallback } from 'react';
import { z } from 'zod';
import { kVerbose, kWarn, kInfo, kError } from "@/lib/koksmat-logger-client";

const createResponseSchema = z.object({
  id: z.number(),
  comments: z.string().optional(),
});
// Create the context
interface KoksmatDatabaseContextType {
  messageProvider: MessageProvider;
  tokenProvider: TokenProvider;
  setMessageProvider: (provider: MessageProvider) => void;
  table: <T extends z.ZodObject<any>>(tableName: string, databaseName: string, schema: T, isVirtual?: boolean) => DatabaseHandlerType<T>;

}

const KoksmatDatabaseContext = createContext<KoksmatDatabaseContextType | undefined>(undefined);

interface KoksmatDatabaseProviderProps {
  children: React.ReactNode;
  initialMessageProvider: MessageProvider;
  tokenProvider: TokenProvider;
}
//TODO: Isolate the implementation of the  provider
// Create the provider component
export const KoksmatDatabaseProvider: React.FC<KoksmatDatabaseProviderProps> = ({ children, initialMessageProvider, tokenProvider }) => {
  const [messageProvider, setMessageProvider] = useState<MessageProvider>(initialMessageProvider);

  const useTable = useCallback(<T extends z.ZodObject<any>>(

    tableName: string,
    databaseName: string,
    schema: T,
    isVirtual: boolean = false
  ): DatabaseHandlerType<T> => {
    return {

      create: async (data: z.infer<T>) => {

        kInfo("provider", `Creating new record in ${tableName}`);
        // Validate data using safeParse
        const result = schema.safeParse({ ...data, tenant: "", searchindex: "" });
        if (!result.success) {
          kVerbose("provider", "Validation failed", data);
          kError("provider", "Validation error in create operation", result.error);
          throw result.error;
        }
        const parsedData = result.data;
        const token = await getToken(tokenProvider);
        const response = await messageProvider.send({

          subject: 'create',
          message:
          {
            messageType: 'crudOperation',
            targetDatabase: { tableName: tableName, isVirtual, databaseName },
            record: { data: parsedData }
          },

        }, token);
        const parsedResponse = createResponseSchema.safeParse(response.data.Result);
        if (!parsedResponse.success) {
          kError("provider", "Error parsing response", parsedResponse.error);
          throw new Error("Error parsing response");
        }

        kInfo(
          "provider",
          "Create operation completed successfully, id:",
          parsedResponse.data.id
        );
        return parsedResponse.data.id;
      },
      update: async (id: number, data: z.infer<T>) => {
        kInfo("provider", `Updating record ${id} in ${tableName}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({

          subject: 'update',
          message:
          {
            messageType: 'crudOperation',
            targetDatabase: { tableName: tableName, isVirtual, databaseName },
            record: { id, data }
          },
        }, token);
      },
      read: async (id: number) => {
        kInfo("provider", `Reading record ${id} from ${tableName}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({

          subject: 'read',
          message: {
            messageType: 'crudOperation',
            targetDatabase: { tableName: tableName, isVirtual, databaseName },
            record: { id }
          },
        }, token);
      },
      patch: async (id: number, data: Partial<z.infer<T>>) => {
        kInfo("provider", `Patching record ${id} in ${tableName}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({

          subject: 'patch',
          message:
          {
            messageType: 'crudOperation',
            targetDatabase: { tableName: tableName, isVirtual, databaseName },
            record: { id, data }
          },
        }, token);
      },
      delete: async (id: number, hardDelete: boolean = false) => {
        kInfo("provider", `Deleting record ${id} in ${tableName}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({

          subject: 'delete',
          message:
          {
            messageType: 'crudOperation',
            targetDatabase: { tableName: tableName, isVirtual, databaseName },
            record: { id, hardDelete }
          },
        }, token);
      },
      restore: async (id: number) => {
        kInfo("provider", `Restoring record ${id} in ${tableName}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({

          subject: 'restore',
          message:
          {
            messageType: 'crudOperation',
            targetDatabase: { tableName: tableName, isVirtual, databaseName },
            record: { id }
          },
        }, token);
      },
      query: async (queryname: string) => {
        kVerbose("provider", `Querying ${queryname}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({
          subject: 'query',
          message:
          {
            messageType: "query",
            name: queryname,
          },
        }, token);
      },
      execute: async (queryname: string, data: any) => {
        kVerbose("provider", `Executing ${queryname}`);
        const token = await getToken(tokenProvider);
        return messageProvider.send({
          subject: 'execute',
          message:
          {
            messageType: "action",
            name: queryname,
            parameters: data,
          },
        }, token);
      }
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

//import { DatabaseHandlerType, MessageProvider, TokenProvider } from '../lib/database-handler';
import { ComponentDoc } from '@/components/component-documentation-hub';
import { DatabaseHandlerType, MessageProvider, TokenProvider } from '../lib/database-handler';

// Form-based message provider


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

      <div>KoksmatDatabase Provider (See usage for example)</div>

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
