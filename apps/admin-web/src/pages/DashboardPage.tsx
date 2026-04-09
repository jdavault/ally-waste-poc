import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Route, RouteStatus } from '@ally-waste/shared-types';
import { apiFetch } from '../api/client';
import { Link } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, CheckCircle, Clock, AlertTriangle, Building2 } from 'lucide-react';
import Pagination from '../components/Pagination';

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { data: routes, isLoading } = useQuery<Route[]>({
    queryKey: ['routes'],
    queryFn: () => apiFetch<Route[]>('/routes'),
  });

  const stats = {
    total: routes?.length || 0,
    pending: routes?.filter(r => r.status === RouteStatus.PENDING).length || 0,
    inProgress: routes?.filter(r => r.status === RouteStatus.IN_PROGRESS).length || 0,
    completed: routes?.filter(r => r.status === RouteStatus.COMPLETED).length || 0,
  };

  const paginatedRoutes = useMemo(() => {
    if (!routes) return [];
    const startIndex = (page - 1) * pageSize;
    return [...routes]
      .sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime())
      .slice(startIndex, startIndex + pageSize);
  }, [routes, page, pageSize]);

  if (isLoading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ally-green"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-ally-navy">Operations Overview</h1>
          <p className="text-slate-500 font-medium">Monitoring real-time service delivery and logistics.</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 text-sm font-bold text-slate-700">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </header>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Routes', value: stats.total, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'In Progress', value: stats.inProgress, icon: LayoutDashboard, color: 'text-ally-accent', bg: 'bg-teal-50' },
          { label: 'Completed Today', value: stats.completed, icon: CheckCircle, color: 'text-ally-green', bg: 'bg-emerald-50' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black text-ally-navy">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Table */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h5 className="font-black text-ally-navy uppercase tracking-tight">Recent Activity</h5>
            <Link to="/routes" className="text-xs font-bold text-ally-green hover:text-ally-accent transition-colors">View All Routes</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase font-black text-slate-400">
                <tr>
                  <th className="px-6 py-4">Route ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Service Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRoutes.length > 0 ? (
                  paginatedRoutes.map(route => (
                    <tr key={route.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <Link to={`/routes/${route.id}`} className="font-mono text-xs text-slate-500 hover:text-ally-green transition-colors font-bold">
                          {route.id.substring(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          route.status === RouteStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 
                          route.status === RouteStatus.IN_PROGRESS ? 'bg-teal-100 text-teal-700' : 
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {route.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-slate-700">
                        {new Date(route.serviceDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-medium">No recent activity found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {routes && routes.length > 0 && (
            <div className="px-6 border-t border-slate-100">
              <Pagination 
                page={page} 
                pageSize={pageSize} 
                total={routes.length} 
                onPageChange={setPage} 
                onPageSizeChange={setPageSize}
                pageSizeOptions={[5, 10, 20]}
              />
            </div>
          )}
        </section>
        
        {/* Quick Actions & Insights */}
        <aside className="space-y-6">
          <div className="bg-ally-navy p-6 rounded-2xl text-white shadow-lg shadow-ally-navy/20">
            <h5 className="font-black uppercase tracking-tight mb-4 text-slate-300">Quick Operations</h5>
            <div className="space-y-3">
              <Link to="/routes" className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
                <span className="font-bold text-sm">Assign New Route</span>
                <TrendingUp size={16} className="text-ally-green group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/properties" className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
                <span className="font-bold text-sm">Property Lookup</span>
                <Building2 size={16} className="text-ally-green group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <div className="flex items-center gap-3 text-amber-700 mb-2">
              <AlertTriangle size={20} />
              <h5 className="font-black uppercase tracking-tight">System Notice</h5>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed font-medium">
              3 units reported <strong>Active Issues</strong> in the last 24 hours. Review event logs for details.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
