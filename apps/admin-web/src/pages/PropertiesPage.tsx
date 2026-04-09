import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@ally-waste/shared-types';
import { apiFetch } from '../api/client';
import { Link } from 'react-router-dom';
import { Building2, MapPin, ChevronRight, Plus, Search, Filter } from 'lucide-react';
import Pagination from '../components/Pagination';

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: () => apiFetch<Property[]>('/properties'),
  });

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    return properties.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : (statusFilter === 'active' ? p.active : !p.active);
      return matchesSearch && matchesStatus;
    });
  }, [properties, searchTerm, statusFilter]);

  const paginatedProperties = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredProperties.slice(startIndex, startIndex + pageSize);
  }, [filteredProperties, page, pageSize]);

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
    setPage(1);
  };

  if (isLoading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ally-green"></div></div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">Error loading properties: {(error as Error).message}</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-ally-navy">Properties</h1>
          <p className="text-slate-500 font-medium">Manage your service locations and asset hierarchy.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-ally-green text-white rounded-xl font-black hover:bg-ally-accent transition-all shadow-lg shadow-ally-green/20 hover:scale-105 active:scale-95 disabled:opacity-50">
          <Plus size={20} />
          <span>Add Property</span>
        </button>
      </header>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search properties by name or address..."
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
            onChange={handleFilter}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {paginatedProperties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedProperties.map((property) => (
              <div key={property.id} className="group bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-ally-green/30 transition-all duration-300 overflow-hidden">
                <div className="p-8 space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-slate-50 rounded-2xl text-ally-navy group-hover:bg-ally-navy group-hover:text-white transition-all duration-300">
                      <Building2 size={24} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      property.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {property.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black text-ally-navy group-hover:text-ally-green transition-colors leading-tight mb-2">{property.name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin size={14} className="shrink-0" />
                      <span className="text-sm font-bold truncate leading-none">{property.address}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{property.timezone}</span>
                    <Link 
                      to={`/properties/${property.id}`} 
                      className="flex items-center gap-1 text-sm font-black text-ally-navy group-hover:text-ally-green transition-all transform group-hover:translate-x-1"
                    >
                      Manage <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination 
            page={page} 
            pageSize={pageSize} 
            total={filteredProperties.length} 
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
          <h3 className="text-xl font-black text-ally-navy">No properties found</h3>
          <p className="text-slate-400 font-medium">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
}
