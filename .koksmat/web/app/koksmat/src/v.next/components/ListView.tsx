'use client';
import { z, ZodObject } from "zod";
import { getFieldCaption } from "../lib/zod";

export function ListView<T extends { id: number; name: string; searchIndex: string }>({
  schema,
  items,
  onItemClick,
}: {
  schema: ZodObject<Record<string, z.ZodTypeAny>>;
  items: T[];
  onItemClick: (item: T) => void;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="p-2 border rounded-md">
          <h3 className="font-bold">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onItemClick(item);
              }}
              className="text-blue-600 hover:underline"
            >
              {item.name}
            </a>
          </h3>
          <ul className="mt-2 space-y-1">
            {Object.entries(item)
              .filter(([key]) => key !== "id" && key !== "name" && key !== "searchIndex") // Omit "id" and "name"
              .map(([key, value]) => {

                const description = getFieldCaption(schema.shape[key]?.description!, key);
                return (
                  <li key={key} className="text-sm">
                    <strong>{description}:</strong> {value?.toString()}
                  </li>
                );
              })}
          </ul>
        </li>
      ))}
    </ul>
  );
}
