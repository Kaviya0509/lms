import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, BookOpen, Calendar, MapPin, ClipboardList,
  CheckSquare, Award, BarChart2, Settings, ChevronDown, ChevronRight,
  GraduationCap, UserCheck, Globe, Monitor,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppDispatch';
import { setSidebarCollapsed } from '../../store/slices/uiSlice';
import logoImg from '../../assets/logo.png';

interface NavItem { label: string; path: string; icon: React.ElementType; badge?: number; end?: boolean; }
interface NavGroup { label: string; icon: React.ElementType; items: NavItem[]; }

const navGroups: NavGroup[] = [
  {
    label: 'Users', icon: Users,
    items: [
      { label: 'Trainers', path: '/trainers', icon: UserCheck },
      { label: 'Trainees', path: '/trainees', icon: GraduationCap },
    ],
  },
  {
    label: 'Courses', icon: BookOpen,
    items: [
      { label: 'All Courses', path: '/courses', icon: BookOpen, end: true },
      { label: 'Online Courses', path: '/courses/online', icon: Monitor },
      { label: 'Offline Courses', path: '/courses/offline', icon: Globe },
    ],
  },
];

const singleNavItems = [
  { label: 'Batches & Schedules', path: '/batches', icon: Calendar },
  { label: 'Locations', path: '/locations', icon: MapPin },
  { label: 'Enrollments', path: '/enrollments', icon: ClipboardList, badge: 18 },
  { label: 'Attendance', path: '/attendance', icon: CheckSquare },
  { label: 'Assessments', path: '/assessments', icon: ClipboardList },
  { label: 'Certificates', path: '/certificates', icon: Award },
  { label: 'Reports', path: '/reports', icon: BarChart2 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const collapsed = useAppSelector(s => s.ui.sidebarCollapsed);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Users: true, Courses: true });

  const handleItemClick = () => {
    if (window.innerWidth < 1024) {
      dispatch(setSidebarCollapsed(true));
    }
  };

  const toggleGroup = (label: string) => setOpenGroups(p => ({ ...p, [label]: !p[label] }));
  const isGroupActive = (group: NavGroup) => group.items.some(i => location.pathname.startsWith(i.path));

  return (
    <aside className={`fixed inset-y-0 left-0 bg-white border-r border-slate-200 flex flex-col z-40 transition-all duration-300
      ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-72'}`}>

      <div className={`flex items-center px-4 py-4 border-b border-slate-100 flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        <div className="h-8 flex items-center overflow-hidden transition-all duration-300" style={{ width: collapsed ? '32px' : '127px' }}>
          <img src={logoImg} alt="TeqCertify" className="h-8 max-w-none" style={{ width: '127px', objectFit: 'cover', objectPosition: 'left' }} />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <NavLink to="/" end
          onClick={handleItemClick}
          className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-[#DE896A] text-white font-bold shadow-sm' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          title={collapsed ? 'Dashboard' : undefined}
        >
          <LayoutDashboard size={18} className="flex-shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <div className="mt-4 mb-2">
           {!collapsed && <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Learning</p>}
        </div>

        {navGroups.map(group => (
          <div key={group.label} className="mb-1">
            <button
              onClick={() => {
                if (collapsed) {
                  navigate(group.items[0].path);
                  handleItemClick();
                } else {
                  toggleGroup(group.label);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${collapsed ? 'justify-center' : 'justify-between'} ${isGroupActive(group) ? 'font-bold text-primary-700 bg-primary-50/60' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              title={collapsed ? group.label : undefined}
            >
              <div className="flex items-center gap-3">
                <group.icon size={18} className="flex-shrink-0" />
                {!collapsed && <span>{group.label}</span>}
              </div>
              {!collapsed && (
                <motion.div animate={{ rotate: openGroups[group.label] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} className="text-slate-500" />
                </motion.div>
              )}
            </button>
            <AnimatePresence>
              {!collapsed && openGroups[group.label] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  className="overflow-hidden ml-4 pl-4 border-l border-slate-200 mt-1 space-y-1">
                  {group.items.map(item => (
                    <NavLink key={item.path} to={item.path} end={item.end}
                      onClick={handleItemClick}
                      className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-[#DE896A] text-white font-bold shadow-sm' : 'font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                      <item.icon size={16} className="flex-shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {!collapsed && <div className="mt-4 mb-2 px-3 pt-3"><p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">System</p></div>}

        {singleNavItems.map(item => (
          <NavLink key={item.path} to={item.path}
            onClick={handleItemClick}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${collapsed ? 'justify-center' : 'justify-between'} ${isActive ? 'bg-[#DE896A] text-white font-bold shadow-sm' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            title={collapsed ? item.label : undefined}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </div>
            {!collapsed && item.badge !== undefined && (
              <span className="bg-primary-100 text-primary-700 text-xs font-semibold rounded-full px-2 py-0.5 min-w-[24px] text-center">
                {item.badge}
              </span>
            )}
            {!collapsed && !item.badge && <ChevronRight size={14} className="text-slate-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
