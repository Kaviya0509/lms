import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, BarChart2, Settings,
  GraduationCap, Bell, ChevronRight, LogOut, ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Users', badge: 3 },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/enrollments', icon: GraduationCap, label: 'Enrollments' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/notifications', icon: Bell, label: 'Notifications', badge: 7 },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => (
  <aside
    className={`fixed left-0 top-0 h-screen bg-slate-950 border-r border-slate-100 shadow-sm/60 flex flex-col z-40 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}
  >
    <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-100 shadow-sm/60 ${collapsed ? 'justify-center' : ''}`}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
        <ShieldCheck size={18} className="text-slate-900" />
      </div>
      {!collapsed && (
        <div>
          <p className="text-slate-900 font-bold text-sm leading-none">LMS Admin</p>
          <p className="text-primary-400 text-xs mt-0.5">Control Panel</p>
        </div>
      )}
    </div>

    <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
      {!collapsed && (
        <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold px-3 mb-3">Main Menu</p>
      )}
      {navItems.map(({ to, icon: Icon, label, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group relative
            ${isActive
              ? 'bg-primary-50 text-primary-700 font-bold border border-primary-100'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
            }
            ${collapsed ? 'justify-center' : ''}`
          }
          title={collapsed ? label : undefined}
        >
          <Icon size={18} className="flex-shrink-0" />
          {!collapsed && <span className="flex-1">{label}</span>}
          {!collapsed && badge !== undefined && (
            <span className="bg-primary-600 text-slate-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {badge}
            </span>
          )}
          {collapsed && badge !== undefined && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
          )}
          {!collapsed && (
            <ChevronRight size={14} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
          )}
        </NavLink>
      ))}
    </nav>

    <div className="border-t border-slate-100 shadow-sm/60 p-3">
      {!collapsed ? (
        <div className="flex items-center gap-3 px-2 py-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            KP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 text-xs font-semibold truncate">Kaviyapriya</p>
            <p className="text-slate-500 text-xs truncate">Super Admin</p>
          </div>
          <button className="text-slate-500 hover:text-red-400 transition-colors" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-slate-900 text-xs font-bold">
            KP
          </div>
        </div>
      )}
    </div>
  </aside>
);

export default Sidebar;
