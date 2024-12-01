'use client';

import { z, ZodObject } from "zod";
import { RenderItemFunction } from "./_shared";

// Mock components for different view types
export function CardViewItems<T extends { id: number, name: string, searchIndex: string }>({ renderItem, schema, items, onItemClick }: { renderItem?: RenderItemFunction<T>, schema: ZodObject<Record<string, z.ZodTypeAny>>, items: T[]; onItemClick: (item: T) => void; }) {
  return (
    <div className="flex flex-wrap">
      {items.sort((a, b) => {
        return a.name.localeCompare(b.name)
      }).map((item) => (
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
