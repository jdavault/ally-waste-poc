import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Worker } from '@ally-waste/shared-types';
import { apiFetch } from '../api/client';
import { User, Phone, Truck, CheckCircle2, XCircle, Plus, Search, Filter } from 'lucide-react';
import Pagination from '../components/Pagination';

export default function WorkersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const { data: workers, isLoading, error } = useQuery<Worker[]>({
    queryKey: ['workers'],
    queryFn: () => apiFetch<Worker[]>('/workers'),
  });

  const filteredWorkers = useMemo(() => {
    if (!workers) return [];
    return workers.filter((w) => {
      const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           w.phone.includes(searchTerm) ||
                           (w.vehicleType || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : (statusFilter === 'active' ? w.active : !w.active);
      return matchesSearch && matchesStatus;
    });
  }, [workers, searchTerm, statusFilter]);

  const paginatedWorkers = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredWorkers.slice(startIndex, startIndex + pageSize);
  }, [filteredWorkers, page, pageSize]);

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleFilter = (val: typeof statusFilter) => {
    setStatusFilter(val);
    setPage(1);
  };

  if (isLoading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ally-green"></div></div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">Error loading workers: {(error as Error).message}</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-ally-navy">Field Operators</h1>
          <p className="text-slate-500 font-medium">Manage your workforce and vehicle assignments.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-ally-green text-white rounded-xl font-black hover:bg-ally-accent transition-all shadow-lg shadow-ally-green/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
          <Plus size={20} />
          <span>Add Worker</span>
        </button>
      </header>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, vehicle, or phone..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-ally-navy placeholder:text-slate-400 focus:ring-2 focus:ring-ally-green/50 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
            <Filter size={18} />
          </div>
          <select 
            className="flex-1 md:w-48 px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-ally-navy focus:ring-2 focus:ring-ally-green/50 transition-all outline-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => handleFilter(e.target.value as any)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {paginatedWorkers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedWorkers.map((worker) => (
              <div key={worker.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-ally-navy/20 transition-all duration-300 overflow-hidden group">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-ally-navy group-hover:bg-ally-navy group-hover:text-white transition-all duration-300 shadow-inner">
                        <User size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-ally-navy leading-tight group-hover:text-ally-navy transition-colors">{worker.name}</h3>
                        <div className={`inline-flex items-center gap-1.5 mt-1 text-[10px] font-black uppercase tracking-wider ${
                          worker.active ? 'text-emerald-600' : 'text-slate-400'
                        }`}>
                          {worker.active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {worker.active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 group-hover:bg-white transition-colors">
                      <Phone size={16} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{worker.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 group-hover:bg-white transition-colors">
                      <Truck size={16} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700 capitalize">{worker.vehicleType || 'Standard Truck'}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex gap-3">
                    <button className="flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-ally-navy transition-all border border-transparent hover:border-slate-100 rounded-xl">
                      History
                    </button>
                    <button className="flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-ally-navy hover:text-ally-green transition-all border border-transparent hover:border-slate-100 rounded-xl">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination 
            page={page} 
            pageSize={pageSize} 
            total={filteredWorkers.length} 
            onPageChange={setPage} 
            onPageSizeChange={setPageSize}
            className="mt-8 border-t border-slate-100 pt-6"
          />
        </>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-black text-ally-navy">No operators found</h3>
          <p className="text-slate-400 font-medium">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
