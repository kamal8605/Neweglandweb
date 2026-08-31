"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

export function CategorySidebar() {
  const { data: categories, isLoading } = useCategories();
  const [showAll, setShowAll] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Record<number, boolean>>({});

  if (isLoading) {
    return <div className="animate-pulse bg-white p-4 h-64 rounded-md border border-gray-200"></div>;
  }

  const allCats = categories ?? [];
  const topLevelCats = allCats.filter((c: any) => !c.parent_id);
  
  // Show first 5 categories, hide rest behind toggle
  const visibleCats = showAll ? topLevelCats : topLevelCats.slice(0, 5);
  const hasMore = topLevelCats.length > 5;

  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
      <div className="font-bold text-gray-900 mb-4 text-lg border-b pb-2">
        Categories
      </div>
      
      <ul className="space-y-1">
        {visibleCats.map((cat) => {
          const subcats = allCats.filter((c: any) => c.parent_id === cat.id);
          const isExpanded = expandedCats[cat.id];
          
          return (
            <li key={cat.id} className="border-t border-gray-100 first:border-0 pt-2 pb-2">
              <div className="flex items-center justify-between">
                <Link href={`/category/${cat.id}`} className="text-gray-700 hover:text-brand-orange text-sm font-medium transition-colors flex-1 py-1">
                  {cat.name}
                </Link>
                {subcats.length > 0 && (
                  <button 
                    onClick={(e) => toggleExpand(cat.id, e)}
                    className="p-1 text-gray-400 hover:text-brand-orange transition-colors"
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}
              </div>
              
              {isExpanded && subcats.length > 0 && (
                <ul className="pl-4 mt-2 space-y-1 mb-2 border-l-2 border-brand-orange/20 ml-1">
                  {subcats.map((subcat) => (
                    <li key={subcat.id}>
                      <Link href={`/category/${subcat.id}`} className="block py-1 px-2 text-sm text-gray-600 hover:text-brand-orange hover:bg-orange-50 rounded-sm transition-colors">
                        {subcat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <button 
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-brand-orange hover:text-orange-700 text-sm font-medium w-full text-left py-2 border-t border-gray-100 flex items-center justify-between"
        >
          {showAll ? "Show Less Categories" : "Show All Categories"}
          <ChevronRight size={14} className={`transform transition-transform ${showAll ? "rotate-90" : ""}`} />
        </button>
      )}
    </div>
  );
}
