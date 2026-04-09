import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Route, RouteStop, RouteStatus, RouteStopStatus, EventLog, Worker, Property } from '@ally-waste/shared-types';
import { apiFetch } from '../api/client';
import { ChevronRight, Clock, MapPin, User, Building2, CheckCircle2, AlertCircle, History } from 'lucide-react';

export default function RouteDetailPage() {
  const { id } = useParams();

  const { data: route, isLoading: loadingRoute } = useQuery<Route>({
    queryKey: ['routes', id],
    queryFn: () => apiFetch<Route>(`/routes/${id}`),
  });

  const { data: stops, isLoading: loadingStops } = useQuery<RouteStop[]>({
    queryKey: ['routes', id, 'stops'],
    queryFn: () => apiFetch<RouteStop[]>(`/routes/${id}/stops`),
  });

  const { data: events, isLoading: loadingEvents } = useQuery<EventLog[]>({
    queryKey: ['routes', id, 'events'],
    queryFn: () => apiFetch<EventLog[]>(`/routes/${id}/events`),
  });

  const { data: properties } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: () => apiFetch<Property[]>('/properties'),
    enabled: !!route,
  });

  const { data: workers } = useQuery<Worker[]>({
    queryKey: ['workers'],
    queryFn: () => apiFetch<Worker[]>('/workers'),
    enabled: !!route,
  });

  if (loadingRoute || loadingStops || loadingEvents) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ally-green"></div></div>;
  if (!route) return <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">Route not found</div>;

  const property = properties?.find(p => p.id === route.propertyId);
  const worker = workers?.find(w => w.id === route.workerId);

  const completedStops = stops?.filter(s => s.status === RouteStopStatus.COMPLETED).length || 0;
  const totalStops = stops?.length || 0;
  const progress = totalStops > 0 ? (completedStops / totalStops) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
        <Link to="/routes" className="hover:text-ally-green transition-colors">Routes</Link>
        <ChevronRight size={14} />
        <span className="text-slate-600">Route Details</span>
      </nav>

      {/* Header */}
      <header className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
              route.status === RouteStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 
              route.status === RouteStatus.IN_PROGRESS ? 'bg-teal-100 text-teal-700' : 
              'bg-slate-100 text-slate-600'
            }`}>
              {route.status}
            </span>
            <h1 className="text-2xl font-mono font-bold text-slate-400">{route.id.substring(0, 12).toUpperCase()}</h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            <div className="flex items-center gap-3 text-ally-navy">
              <Building2 size={20} className="text-ally-green" />
              <span className="font-black truncate">{property?.name || 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-3 text-ally-navy">
              <User size={20} className="text-ally-green" />
              <span className="font-black">{worker?.name || 'Unassigned'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <Clock size={20} className="text-slate-300" />
              <span className="font-bold">{new Date(route.serviceDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <MapPin size={20} className="text-slate-300" />
              <span className="font-bold text-xs truncate">{property?.address}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center md:items-end gap-2 min-w-[200px]">
          <div className="text-sm font-black text-slate-400 uppercase tracking-tighter">Route Progress</div>
          <div className="text-4xl font-black text-ally-navy">{Math.round(progress)}%</div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
            <div 
              className="h-full bg-ally-green transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {completedStops} / {totalStops} Stops Completed
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stops List */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
            <h3 className="font-black text-ally-navy uppercase tracking-tight">Stop Hierarchy</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Seq</th>
                  <th className="px-6 py-4">Unit / Building</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Completed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stops?.sort((a, b) => a.sequence - b.sequence).map((stop) => (
                  <tr key={stop.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-black text-slate-400 text-xs">#{stop.sequence}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                          <Home size={16} />
                        </div>
                        <div>
                          <p className="font-black text-ally-navy leading-none mb-1">Unit {stop.unitId.substring(0, 4).toUpperCase()}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Building Bld-{stop.buildingId.substring(0, 4)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        stop.status === RouteStopStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 
                        stop.status === RouteStopStatus.ISSUE ? 'bg-orange-100 text-orange-700' : 
                        stop.status === RouteStopStatus.MISSED ? 'bg-red-100 text-red-700' : 
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {stop.status === RouteStopStatus.COMPLETED && <CheckCircle2 size={12} />}
                        {stop.status === RouteStopStatus.ISSUE && <AlertCircle size={12} />}
                        {stop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-500">
                      {stop.completedAt ? new Date(stop.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
            <History size={18} className="text-ally-green" />
            <h3 className="font-black text-ally-navy uppercase tracking-tight">Event Timeline</h3>
          </div>
          <div className="p-6 flex-1 overflow-y-auto max-h-[600px] space-y-6">
            {events?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((event) => (
              <div key={event.id} className="relative pl-8 pb-6 border-l-2 border-slate-100 last:pb-0 last:border-l-transparent">
                <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                  event.eventType.includes('STARTED') ? 'bg-teal-500' :
                  event.eventType.includes('COMPLETED') ? 'bg-ally-green' :
                  event.eventType.includes('ISSUE') || event.eventType.includes('MISSED') ? 'bg-orange-500' :
                  'bg-slate-400'
                }`} />
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <h5 className="text-sm font-black text-ally-navy uppercase tracking-tight">{event.eventType.replace(/_/g, ' ')}</h5>
                <p className="text-xs font-medium text-slate-500 mt-1">{JSON.stringify(event.payload).substring(0, 100)}</p>
              </div>
            ))}
            {(!events || events.length === 0) && (
              <p className="text-center text-slate-400 text-sm font-medium py-12">No events logged for this route.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
