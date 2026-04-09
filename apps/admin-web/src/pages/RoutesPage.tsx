import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Route, RouteStatus, Property, Worker } from '@ally-waste/shared-types';
import { apiFetch } from '../api/client';
import { Link } from 'react-router-dom';
import { Calendar, User, Building2, ChevronRight, Filter, Search, Plus } from 'lucide-react';
import Pagination from '../components/Pagination';

export default function RoutesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RouteStatus>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: routes, isLoading } = useQuery<Route[]>({
    queryKey: ['routes'],
    queryFn: () => apiFetch<Route[]>('/routes'),
  });

  const { data: properties } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: () => apiFetch<Property[]>('/properties'),
  });

  const { data: workers } = useQuery<Worker[]>({
    queryKey: ['workers'],
    queryFn: () => apiFetch<Worker[]>('/workers'),
  });

  const getPropertyName = (id: string) => properties?.find(p => p.id === id)?.name || 'Unknown Property';
  const getWorkerName = (id: string | null) => id ? workers?.find(w => w.id === id)?.name || 'Unknown Worker' : 'Unassigned';

  const filteredRoutes = useMemo(() => {
    if (!routes) return [];
    return routes.filter((r) => {
      const propName = getPropertyName(r.propertyId).toLowerCase();
      const workerName = getWorkerName(r.workerId).toLowerCase();
      const matchesSearch = propName.includes(searchTerm.toLowerCase()) || 
                           workerName.includes(searchTerm.toLowerCase()) ||
                           r.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [routes, properties, workers, searchTerm, statusFilter]);

  const paginatedRoutes = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredRoutes.slice(startIndex, startIndex + pageSize);
  }, [filteredRoutes, page, pageSize]);

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleFilter = (val: any) => {
    setStatusFilter(val);
    setPage(1);
  };

  if (isLoading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ally-green"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-ally-navy">Service Routes</h1>
          <p className="text-slate-500 font-medium">Schedule and track collection routes across all properties.</p>
        </div>
        <Link to="/properties" className="flex items-center gap-2 px-4 py-2.5 bg-ally-green text-white rounded-xl font-black hover:bg-ally-accent transition-all shadow-lg shadow-ally-green/20 hover:scale-105 active:scale-95">
          <Plus size={20} />
          <span>New Route</span>
        </Link>
      </header>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by property, worker, or ID..."
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
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {Object.values(RouteStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Assigned Worker</th>
                <th className="px-6 py-4">Service Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRoutes.length > 0 ? (
                paginatedRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        route.status === RouteStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 
                        route.status === RouteStatus.IN_PROGRESS ? 'bg-teal-100 text-teal-700' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {route.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400 group-hover:text-ally-green transition-colors">
                          <Building2 size={14} />
                        </div>
                        <span className="font-bold text-ally-navy">{getPropertyName(route.propertyId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-400 group-hover:text-ally-navy transition-colors">
                          <User size={14} />
                        </div>
                        <span className={`text-sm font-bold ${route.workerId ? 'text-slate-700' : 'text-slate-300 italic'}`}>
                          {getWorkerName(route.workerId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} className="text-slate-300" />
                        <span className="text-sm font-bold">{new Date(route.serviceDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/routes/${route.id}`} 
                        className="inline-flex items-center gap-1 text-sm font-black text-ally-navy hover:text-ally-green transition-all transform group-hover:translate-x-1"
                      >
                        Details <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">No routes match your search criteria</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredRoutes.length > 0 && (
          <div className="px-6 border-t border-slate-100">
            <Pagination 
              page={page} 
              pageSize={pageSize} 
              total={filteredRoutes.length} 
              onPageChange={setPage} 
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </section>
    </div>
  );
}
