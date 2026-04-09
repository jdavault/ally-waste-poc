import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Property, Building, Unit, PickupSchedule } from '@ally-waste/shared-types';
import { apiFetch } from '../api/client';
import { Building2, Clock, ChevronRight, MapPin, Calendar, Info } from 'lucide-react';

export default function PropertyDetailPage() {
  const { id } = useParams();

  const { data: property, isLoading: loadingProp } = useQuery<Property>({
    queryKey: ['properties', id],
    queryFn: () => apiFetch<Property>(`/properties/${id}`),
  });

  const { data: buildings, isLoading: loadingBuildings } = useQuery<Building[]>({
    queryKey: ['properties', id, 'buildings'],
    queryFn: () => apiFetch<Building[]>(`/properties/${id}/buildings`),
  });

  const { data: schedules, isLoading: loadingSchedules } = useQuery<PickupSchedule[]>({
    queryKey: ['properties', id, 'schedules'],
    queryFn: () => apiFetch<PickupSchedule[]>(`/properties/${id}/schedules`),
  });

  if (loadingProp || loadingBuildings || loadingSchedules) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ally-green"></div></div>;
  if (!property) return <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">Property not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
        <Link to="/properties" className="hover:text-ally-green transition-colors">Properties</Link>
        <ChevronRight size={14} />
        <span className="text-slate-600">{property.name}</span>
      </nav>

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-ally-navy">{property.name}</h1>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              property.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {property.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <MapPin size={18} className="text-ally-green" />
            <span>{property.address}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            Edit Details
          </button>
          <button className="px-4 py-2 bg-ally-green text-white rounded-xl font-bold hover:bg-ally-accent transition-colors shadow-lg shadow-ally-green/20">
            Create Route
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Buildings Column */}
        <div className="lg:col-span-3 space-y-6">
          <h3 className="text-xl font-black text-ally-navy flex items-center gap-2">
            <Building2 size={24} className="text-ally-green" />
            Buildings ({buildings?.length || 0})
          </h3>
          
          <div className="space-y-4">
            {buildings?.map((building) => (
              <BuildingItem key={building.id} building={building} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-sm font-black text-ally-navy uppercase tracking-widest mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-ally-green" />
              Pickup Schedules
            </h4>
            <div className="space-y-4">
              {schedules?.map((schedule) => (
                <div key={schedule.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">Standard Pickup</span>
                    {schedule.active && <span className="w-2 h-2 rounded-full bg-ally-green shadow-sm shadow-ally-green/50"></span>}
                  </div>
                  <p className="text-sm font-bold text-ally-navy mb-1">{schedule.daysOfWeek.join(', ')}</p>
                  <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase">
                    <Clock size={12} />
                    <span>{schedule.timeWindowStart} - {schedule.timeWindowEnd}</span>
                  </div>
                </div>
              ))}
              {(!schedules || schedules.length === 0) && (
                <p className="text-xs text-slate-400 font-medium italic">No schedules defined</p>
              )}
            </div>
          </section>

          <section className="bg-ally-navy p-6 rounded-2xl text-white shadow-lg shadow-ally-navy/10">
            <div className="flex items-center gap-2 mb-3">
              <Info size={18} className="text-ally-accent" />
              <h4 className="text-sm font-black uppercase tracking-widest">Operational Notes</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Access codes and specific building instructions are managed at the individual building level. 
              Click on a building to manage its units and service notes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function BuildingItem({ building }: { building: Building }) {
  const { data: units, isLoading } = useQuery<Unit[]>({
    queryKey: ['buildings', building.id, 'units'],
    queryFn: () => apiFetch<Unit[]>(`/buildings/${building.id}/units`),
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h4 className="font-black text-ally-navy text-lg">{building.name}</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Building Asset ID: {building.id.substring(0, 8).toUpperCase()}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-ally-navy">{units?.length || 0}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase block tracking-tighter">Units</span>
        </div>
      </div>
      
      <div className="p-0">
        {isLoading ? (
          <div className="p-4 flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ally-green"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/30 text-[10px] uppercase font-black text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Unit #</th>
                  <th className="px-6 py-3">Floor</th>
                  <th className="px-6 py-3">Notes / Instructions</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {units?.map((unit) => (
                  <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-ally-navy">{unit.unitNumber}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-500">{unit.floor || '1'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {unit.serviceNotes || <span className="text-slate-300 italic">None</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        unit.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {unit.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
