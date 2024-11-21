'use client';

import { z, ZodObject } from "zod";
import { RenderItemFunction } from "./_shared";

// Mock components for different view types
export function CardViewItems<T extends { id: number, name: string, searchIndex: string }>({ renderItem, schema, items, onItemClick }: { renderItem?: RenderItemFunction<T>, schema: ZodObject<Record<string, z.ZodTypeAny>>, items: T[]; onItemClick: (item: T) => void; }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <div key={item.id} className="p-4 ">
          {/* <h3 className="font-bold">
            <a href="#" onClick={(e) => { e.preventDefault(); onItemClick(item); }} className="text-blue-600 hover:underline"> */}
          {renderItem ? renderItem(item, "card") : item.name}

          {/* </a>
          </h3> */}
          {/* <p>Capital: {item.capital}</p>
        <p>Population: {item.population.toLocaleString()}</p>
        <p>Continent: {item.continent}</p> */}
        </div>
      ))}
    </div>)
}
