import React, { useState } from 'react';
import { Bell, UserPlus, BookOpen, DollarSign, AlertTriangle, Check, Trash2, BellOff, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';

interface NotifItem {
  id: string;
  type: 'user' | 'course' | 'payment' | 'system';
  message: string;
  time: string;
  read: boolean;
}

const initialNotifs: NotifItem[] = [
  { id: '1', type: 'user',    message: 'New user Ananya Reddy registered as a student.', time: '2 min ago', read: false },
  { id: '2', type: 'course',  message: 'Course "UI/UX Design Bootcamp" submitted for review by Priya Nair.', time: '1 hr ago', read: false },
  { id: '3', type: 'payment', message: 'Payment of ₹4,999 received from Aarav Sharma (React Masterclass).', time: '3 hr ago', read: false },
  { id: '4', type: 'system',  message: 'Server backup completed successfully. All data is up to date.', time: '5 hr ago', read: true },
  { id: '5', type: 'user',    message: 'User Vikram Das account has been suspended by an admin.', time: '1 day ago', read: true },
  { id: '6', type: 'payment', message: 'Revenue milestone reached: ₹2.5 Lakh total earnings!', time: '2 days ago', read: true },
  { id: '7', type: 'course',  message: '"Machine Learning Fundamentals" has reached 900 enrollments.', time: '3 days ago', read: true },
];

const typeConfig: Record<string, { icon: React.ReactNode; iconBg: string; badge: string; label: string }> = {
  user:    { icon: <UserPlus size={15} />, iconBg: 'bg-primary-500 text-white', badge: 'bg-primary-50 text-primary-700 border-primary-200', label: 'User' },
  course:  { icon: <BookOpen size={15} />, iconBg: 'bg-amber-500 text-white', badge: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Course' },
  payment: { icon: <DollarSign size={15} />, iconBg: 'bg-emerald-500 text-white', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Payment' },
  system:  { icon: <AlertTriangle size={15} />, iconBg: 'bg-red-500 text-white', badge: 'bg-red-50 text-red-700 border-red-200', label: 'System' },
};

const Notifications: React.FC = () => {
  const [notifs, setNotifs] = useState<NotifItem[]>(initialNotifs);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifs.filter(n => !n.read).length;
  const displayed = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const remove = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));

  return (
    <div className="flex flex-col gap-5 h-full max-w-3xl">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell size={20} className="text-primary-500" /> Notifications
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Stay on top of system activity and alerts</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" icon={<Check size={14} />} onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', count: notifs.length, color: 'bg-slate-50 border-slate-200', num: 'text-slate-700' },
          { label: 'Unread', count: unreadCount, color: 'bg-primary-50 border-primary-200', num: 'text-primary-600' },
          { label: 'Payments', count: notifs.filter(n => n.type === 'payment').length, color: 'bg-emerald-50 border-emerald-200', num: 'text-emerald-600' },
          { label: 'System', count: notifs.filter(n => n.type === 'system').length, color: 'bg-red-50 border-red-200', num: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className={`flex flex-col items-center justify-center py-3 rounded-2xl border ${s.color}`}>
            <p className={`text-2xl font-extrabold ${s.num}`}>{s.count}</p>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all border ${
              filter === f
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {f === 'all' ? `All (${notifs.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20 bg-white border border-slate-100 shadow-sm rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-4">
              <BellOff size={28} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">All caught up!</p>
            <p className="text-sm text-slate-400 mt-1">No {filter === 'unread' ? 'unread ' : ''}notifications right now.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {displayed.map(n => {
              const cfg = typeConfig[n.type];
              return (
                <div
                  key={n.id}
                  className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 group ${
                    n.read
                      ? 'bg-white border-slate-100 shadow-sm'
                      : 'bg-white border-primary-200 shadow-md shadow-primary-500/5'
                  }`}
                >
                  {!n.read && (
                    <span className="absolute top-4 left-4 w-2 h-2 rounded-full bg-primary-500 ring-4 ring-primary-100 translate-x-[-6px] translate-y-[-2px]" />
                  )}

                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${cfg.iconBg}`}>
                    {cfg.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                      {!n.read && (
                        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wide flex items-center gap-1">
                          <Sparkles size={9} /> New
                        </span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${n.read ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => remove(n.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
