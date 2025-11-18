import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Wrench, Ruler, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Sidebar() {
  const { logout } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/trucks', icon: Truck, label: 'Caminhões' },
    { to: '/services', icon: Wrench, label: 'Serviços' },
    { to: '/measurements', icon: Ruler, label: 'Medições' },
    { to: '/reports', icon: FileText, label: 'Relatórios' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Truck className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-xl font-bold">TruckControl</h1>
            <p className="text-xs text-slate-400">Sistema de Entre-Eixo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
