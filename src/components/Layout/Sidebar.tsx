import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Wrench, Ruler, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { logout } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/trucks', icon: Truck, label: 'Caminhões' },
    { to: '/services', icon: Wrench, label: 'Serviços' },
    { to: '/measurements', icon: Ruler, label: 'Medições' },
    { to: '/reports', icon: FileText, label: 'Relatórios' },
  ];

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <>
      <div className="p-4 sm:p-6 border-b border-blue-800">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/logo.png" alt="Jl Omar" className="w-8 h-8" />
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-bold">Jl Omar</h1>
            <p className="text-xs text-blue-200">Sistema de Entre-Eixo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 sm:p-4 overflow-y-auto">
        <ul className="space-y-1 sm:space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-yellow-400 text-blue-900 font-medium'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-2 sm:p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 w-full rounded-lg text-blue-100 hover:bg-blue-800 hover:text-yellow-400 transition-colors text-sm sm:text-base"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </>
  );
}
