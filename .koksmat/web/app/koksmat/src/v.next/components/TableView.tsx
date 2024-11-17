'use client';

import { z, ZodObject } from 'zod';
import { useCallback } from 'react';
import { getFieldCaption } from '../lib/zod';

export function TableView<T extends { id: number; name: string; searchIndex: string }>({
  schema,
  items,
  onItemClick,
}: {
  schema: ZodObject<Record<string, z.ZodTypeAny>>;
  items: T[];
  onItemClick: (item: T) => void;
}) {
  const fields = useCallback(() => {
    if (schema && typeof schema.shape === 'object') {
      return Object.entries(schema.shape).filter(([key]) => key !== 'id' && key !== 'searchIndex'); // Exclude 'id' and 'searchIndex'
    }
    return [];
  }, [schema]);

  if (!schema || typeof schema.shape !== 'object') {
    return <div>Invalid schema provided</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {fields().map(([key, field]) => (
              <th key={key} className="border p-2 text-nowrap">
                {getFieldCaption((field as any).description, key)} {/* Use description or key */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              {fields().map(([key], fieldIndex) => (
                <td key={key} className="border p-2">
                  {fieldIndex === 0 && onItemClick ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onItemClick(item);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      {item[key as keyof T]?.toString()}
                    </a>
                  ) : (
                    item[key as keyof T]?.toString()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
