import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import type { TableColumn } from '../../types';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import Select from './Select';

interface DataTableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  loading?: boolean;
  pageSize?: number;
  actions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  headerRight?: React.ReactNode;
}

function DataTable<T extends Record<string, unknown>>({
  columns, data, searchable = true, searchPlaceholder = 'Search...', loading = false,
  pageSize = 10, actions, onRowClick, headerRight,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [colFilters, setColFilters] = useState<Record<string, string>>({});
  const [showColFilters, setShowColFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = data;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(row => Object.values(row).some(v => String(v ?? '').toLowerCase().includes(q)));
    }
    Object.entries(colFilters).forEach(([key, val]) => {
      if (!val) return;
      const q = val.toLowerCase();
      result = result.filter(row => {
        const rawVal = row[key];
        return String(rawVal ?? '').toLowerCase().includes(q);
      });
    });
    return result;
  }, [data, search, colFilters]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const activeFiltersCount = Object.values(colFilters).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {(searchable || headerRight) && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {searchable && (
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder={searchPlaceholder}
                  className="bg-white border border-slate-200 shadow-sm rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all w-64"
                />
              </div>
            )}
            <button 
              type="button"
              onClick={() => setShowColFilters(!showColFilters)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all shadow-sm cursor-pointer
                ${showColFilters 
                  ? 'bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100/70' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-primary-600 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={() => { setColFilters({}); setPage(1); }}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all shadow-sm cursor-pointer"
              >
                <X size={13} />
                <span>Clear</span>
              </button>
            )}
          </div>
          {headerRight && <div className="ml-auto">{headerRight}</div>}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-auto scrollbar-hide rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-[0_1px_0_0_#e2e8f0]">
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable !== false && handleSort(String(col.key))}
                  className={`text-[11px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3 text-left whitespace-nowrap ${col.sortable !== false ? 'cursor-pointer hover:text-slate-800 select-none' : ''} transition-colors`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable !== false && (
                      <span className="flex flex-col leading-none">
                        <ChevronUp size={10} className={sortKey === col.key && sortDir === 'asc' ? 'text-primary-600' : 'text-slate-300'} />
                        <ChevronDown size={10} className={sortKey === col.key && sortDir === 'desc' ? 'text-primary-600' : 'text-slate-300'} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-5 py-3 text-right">Actions</th>}
            </tr>
            {showColFilters && (
              <tr className="bg-slate-50/50 border-b border-slate-200">
                {columns.map(col => {
                  const isActionOrEmpty = !col.key || col.filterable === false;
                  if (isActionOrEmpty) return <td key={`filter-${String(col.key)}`} className="px-5 py-2" />;

                  return (
                    <td key={`filter-${String(col.key)}`} className="px-5 py-2">
                      {col.filterOptions ? (
                        <Select
                          value={colFilters[String(col.key)] || ''}
                          onChange={val => {
                            setColFilters(prev => ({ ...prev, [String(col.key)]: val }));
                            setPage(1);
                          }}
                          options={[{ value: '', label: 'All' }, ...col.filterOptions]}
                          placeholder="All"
                          className="w-full"
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={colFilters[String(col.key)] || ''}
                          onChange={e => {
                            setColFilters(prev => ({ ...prev, [String(col.key)]: e.target.value }));
                            setPage(1);
                          }}
                          className="w-full bg-white border border-slate-200 shadow-sm rounded-lg px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        />
                      )}
                    </td>
                  );
                })}
                {actions && <td key="filter-actions-col" className="px-5 py-2" />}
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="py-16 text-center">
                <LoadingSpinner />
              </td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="py-12">
                <EmptyState title="No records found" subtitle={search ? `No results for "${search}"` : 'No data available'} />
              </td></tr>
            ) : paginated.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={`transition-colors duration-150 ${onRowClick ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/50'}`}
              >
                {columns.map(col => (
                  <td key={String(col.key)} className={`px-5 py-3.5 text-sm text-slate-700 leading-relaxed ${col.className || ''}`}>
                    {col.render
                      ? col.render(row[String(col.key) as keyof T], row)
                      : String(row[String(col.key) as keyof T] ?? '—')}
                  </td>
                ))}
                {actions && <td className="px-5 py-3.5 text-right" onClick={e => e.stopPropagation()}>{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500 mt-1 px-1">
          <span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}</span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
              return p > 0 && p <= totalPages ? (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors shadow-sm ${p === page ? 'bg-primary-600 text-white border border-primary-600' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >{p}</button>
              ) : null;
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
