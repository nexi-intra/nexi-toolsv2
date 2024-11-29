'use client';
import { Country } from "./item-viewer";

export const KanbanView = ({ items, onItemClick }: { items: Country[]; onItemClick: (id: number) => void; }) => {
  const continents = Array.from(new Set(items.map(item => item.continent)));
  return (
    <div className="flex space-x-4 overflow-x-auto">
      {continents.map((continent) => (
        <div key={continent} className="flex-shrink-0 w-64 p-4 border rounded-md">
          <h3 className="font-bold mb-2">{continent}</h3>
          <div className="space-y-2">
            {items.filter((item) => item.continent === continent).map((item) => (
              <div key={item.id} className="p-2 bg-gray-100 rounded-md">
                <div className="font-semibold">
                  <a href="#" onClick={(e) => { e.preventDefault(); onItemClick(item.id); }} className="text-blue-600 hover:underline">
                    {item.name}
                  </a>
                </div>
                <div className="text-sm">Capital: {item.capital}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
