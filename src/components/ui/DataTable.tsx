import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import type { TableColumn } from '../../types';

interface DataTableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  actions?: (row: T) => React.ReactNode;
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data found',
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(v => String(v ?? '').toLowerCase().includes(q))
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <div className="flex flex-col gap-4">
      {searchable && (
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full max-w-sm bg-slate-100/60 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
          />
        </div>
      )}
      <div className="overflow-auto max-h-[calc(100vh-220px)] rounded-xl border border-slate-100 shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_0_#f1f5f9]">
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3 text-left cursor-pointer hover:text-slate-700 transition-colors select-none"
                  onClick={() => handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <span className="flex flex-col">
                      <ChevronUp size={10} className={sortKey === col.key && sortDir === 'asc' ? 'text-primary-400' : 'text-slate-700'} />
                      <ChevronDown size={10} className={sortKey === col.key && sortDir === 'desc' ? 'text-primary-400' : 'text-slate-700'} />
                    </span>
                  </div>
                </th>
              ))}
              {actions && <th className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center text-slate-500 py-12 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : sorted.map((row, i) => (
              <tr key={i} className="border-b border-slate-100 shadow-sm/60 hover:bg-slate-100/30 transition-colors duration-150">
                {columns.map(col => (
                  <td key={String(col.key)} className={`px-4 py-3.5 text-sm text-slate-700 ${col.className || ''}`}>
                    {col.render
                      ? col.render(row[String(col.key) as keyof T], row)
                      : String(row[String(col.key) as keyof T] ?? '-')
                    }
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3.5 text-right">{actions(row)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 text-right">
        Showing {sorted.length} of {data.length} records
      </p>
    </div>
  );
}

export default DataTable;
