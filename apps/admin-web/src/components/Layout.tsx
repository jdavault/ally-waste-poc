import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Route, Users, LogOut } from 'lucide-react';

export default function Layout() {
  const { pathname } = useLocation();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/properties', label: 'Properties', icon: Building2 },
    { to: '/routes', label: 'Routes', icon: Route },
    { to: '/workers', label: 'Workers', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-ally-gray">
      {/* Sidebar */}
      <aside className="w-64 bg-ally-navy text-white flex flex-col fixed inset-y-0 left-0 shadow-xl z-20">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight flex items-center">
              <span className="text-ally-green group-hover:text-ally-accent transition-colors">Ally</span>
              <span className="ml-1">Waste</span>
            </span>
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">Admin Operations</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-ally-green text-white shadow-lg shadow-ally-green/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-ally-green'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white transition-colors group">
            <LogOut className="w-5 h-5 group-hover:text-red-400" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
