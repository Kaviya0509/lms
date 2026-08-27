import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Menu, Bell, Search, LogOut, User, Settings, BookOpen, GraduationCap, UserCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { markRead, markAllRead } from '../../store/slices/notificationsSlice';
import { getInitials } from '../../utils/helpers';
import Breadcrumb from './Breadcrumb';

interface SearchResult {
  id: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
  route: string;
}

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user     = useAppSelector(s => s.auth.user);
  const courses  = useAppSelector(s => s.courses.items);
  const trainees = useAppSelector(s => s.trainees.items);
  const trainers = useAppSelector(s => s.trainers.items);

  const notifs = useAppSelector(s => s.notifications.items);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQ, setSearchQ]       = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const unread = notifs.filter(n => n.unread).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQ.trim() || searchQ.length < 2) return [];
    const q = searchQ.toLowerCase();
    const results: SearchResult[] = [];

    courses.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) {
        results.push({
          id: `course-${c.id}`,
          label: c.name,
          sub: `Course · ${c.code}`,
          icon: <BookOpen size={14} className="text-primary-600" />,
          route: '/courses',
        });
      }
    });

    trainees.forEach(t => {
      if (t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)) {
        results.push({
          id: `trainee-${t.id}`,
          label: t.name,
          sub: `Trainee · ${t.email}`,
          icon: <GraduationCap size={14} className="text-emerald-600" />,
          route: '/trainees',
        });
      }
    });

    trainers.forEach(t => {
      if (t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)) {
        results.push({
          id: `trainer-${t.id}`,
          label: t.name,
          sub: `Trainer · ${t.email}`,
          icon: <UserCheck size={14} className="text-violet-600" />,
          route: '/trainers',
        });
      }
    });

    return results.slice(0, 7);
  }, [searchQ, courses, trainees, trainers]);

  const handleResultClick = (route: string) => {
    navigate(route);
    setSearchQ('');
    setSearchOpen(false);
  };

  const handleMarkAllRead = () => dispatch(markAllRead());

  const closeAll = () => { setNotifOpen(false); setProfileOpen(false); };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center px-3 sm:px-5 gap-3 sm:gap-4 sticky top-0 z-30 flex-shrink-0">

      <button onClick={() => dispatch(toggleSidebar())}
        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex-shrink-0">
        <Menu size={20} />
      </button>

      <div className="flex-1 hidden md:block">
        <Breadcrumb />
      </div>

      <div ref={searchRef} className="relative hidden lg:flex items-center">
        <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none z-10" />
        <input
          type="text"
          value={searchQ}
          onChange={e => { setSearchQ(e.target.value); setSearchOpen(true); closeAll(); }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search courses, students..."
          className="bg-slate-50 border border-slate-200 rounded-full pl-9 pr-9 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all w-72 shadow-sm"
        />
        {searchQ && (
          <button onClick={() => { setSearchQ(''); setSearchOpen(false); }}
            className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={14} />
          </button>
        )}

        <AnimatePresence>
          {searchOpen && searchQ.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute top-12 left-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              {searchResults.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <Search size={20} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No results for <strong>"{searchQ}"</strong></p>
                </div>
              ) : (
                <>
                  <div className="px-4 pt-3 pb-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="pb-2">
                    {searchResults.map(r => (
                      <button
                        key={r.id}
                        onClick={() => handleResultClick(r.route)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {r.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{r.label}</p>
                          <p className="text-[11px] text-slate-400 truncate">{r.sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 ml-auto lg:ml-2">

        <button
          onClick={() => { navigate('/settings'); closeAll(); }}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
          title="Settings"
        >
          <Settings size={20} />
        </button>

        <div className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); setSearchOpen(false); }}
            className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
            title="Notifications"
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50"
              >
                <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
                  <p className="font-semibold text-slate-900 text-sm">
                    Notifications {unread > 0 && <span className="ml-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{unread}</span>}
                  </p>
                  {unread > 0 && (
                    <button onClick={handleMarkAllRead} className="text-xs text-primary-600 hover:underline font-medium cursor-pointer">
                      Mark all read
                    </button>
                  )}
                </div>
                {notifs.length === 0 ? (
                  <p className="px-4 py-8 text-center text-xs text-slate-400">You're all caught up.</p>
                ) : notifs.slice(0, 5).map(n => (
                  <div key={n.id}
                    onClick={() => dispatch(markRead(n.id))}
                    className={`flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${n.unread ? 'bg-primary-50/50' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-primary-500' : 'bg-transparent'}`} />
                    <div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{n.msg}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-3 text-center bg-slate-50 rounded-b-2xl border-t border-slate-100">
                  <button
                    onClick={() => { navigate('/notifications'); setNotifOpen(false); }}
                    className="text-xs text-primary-600 font-medium hover:underline cursor-pointer"
                  >
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-6 bg-slate-200 mx-1 sm:mx-2 hidden sm:block" />

        <div className="relative">
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); setSearchOpen(false); }}
            className="flex items-center gap-2 sm:gap-3 pl-1 pr-1 py-1 hover:bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-200"
          >
            <div className="hidden md:block text-right">
              <p className="text-slate-900 text-sm font-semibold leading-none">{user?.name ?? 'Elena Rodriguez'}</p>
              <p className="text-slate-500 text-[11px] mt-1">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-100 border-2 border-white shadow-sm flex items-center justify-center text-primary-600 text-sm font-bold flex-shrink-0">
              {getInitials(user?.name ?? 'Elena Rodriguez')}
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                className="absolute right-0 top-14 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-slate-900 text-sm font-bold">{user?.name ?? 'Elena Rodriguez'}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{user?.email ?? 'elena@teqcertify.com'}</p>
                </div>
                <div className="py-1">
                  {[
                    { icon: User,     label: 'Profile',  action: () => navigate('/profile')  },
                    { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
                  ].map(item => (
                    <button key={item.label}
                      onClick={() => { item.action(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <item.icon size={16} className="text-slate-500" /> {item.label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-100 py-1 bg-slate-50">
                  <button
                    onClick={() => dispatch(logout())}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
