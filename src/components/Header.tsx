import React from 'react';
import { Menu, Bell, Search, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  pageTitle: string;
  pageSubtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, pageTitle, pageSubtitle }) => {
  const [darkMode, setDarkMode] = React.useState(true);
  const [notifOpen, setNotifOpen] = React.useState(false);

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-100 shadow-sm/60 flex items-center px-6 gap-4 sticky top-0 z-30">
      <button
        onClick={onToggleSidebar}
        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white/5 rounded-lg transition-all"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1">
        <h1 className="text-base font-bold text-slate-900 leading-none">{pageTitle}</h1>
        {pageSubtitle && <p className="text-xs text-slate-500 mt-0.5">{pageSubtitle}</p>}
      </div>

      <div className="relative hidden md:flex items-center">
        <Search size={15} className="absolute left-3 text-slate-500" />
        <input
          type="text"
          placeholder="Quick search..."
          className="bg-slate-100/60 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all w-56"
        />
      </div>

      <button
        onClick={() => setDarkMode(d => !d)}
        className="p-2 text-slate-500 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-all"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="relative">
        <button
          onClick={() => setNotifOpen(o => !o)}
          className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-white/5 rounded-lg transition-all"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-slate-950" />
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 animate-fade-in">
            <div className="px-4 py-3 border-b border-slate-100 shadow-sm flex justify-between items-center">
              <p className="font-semibold text-slate-900 text-sm">Notifications</p>
              <span className="text-xs text-primary-400 cursor-pointer hover:underline">Mark all read</span>
            </div>
            {[
              { msg: 'New user Ananya Reddy registered', time: '2m ago', unread: true },
              { msg: 'Course "React Masterclass" submitted for review', time: '1h ago', unread: true },
              { msg: 'Revenue milestone: ₹2.5L achieved', time: '3h ago', unread: false },
            ].map((n, i) => (
              <div key={i} className={`flex gap-3 px-4 py-3 border-b border-slate-100 shadow-sm/60 hover:bg-slate-50 cursor-pointer transition-colors ${n.unread ? 'bg-primary-600/5' : ''}`}>
                {n.unread && <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />}
                {!n.unread && <div className="w-2 flex-shrink-0" />}
                <div>
                  <p className="text-sm text-slate-200">{n.msg}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
            <div className="px-4 py-3 text-center">
              <span className="text-xs text-primary-400 cursor-pointer hover:underline">View all notifications</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-slate-900 text-xs font-bold cursor-pointer hover:ring-2 hover:ring-primary-500/50 transition-all">
        KP
      </div>
    </header>
  );
};

export default Header;
