import React, { useState, useMemo } from 'react';
import { Bell, ClipboardList, Calendar, ClipboardCheck, UserCheck, Award, Settings, Trash2, CheckCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { markRead, markAllRead, removeNotification, clearAll, type NotificationType } from '../../store/slices/notificationsSlice';

type Filter = 'all' | 'unread';

const typeMeta: Record<NotificationType, { icon: React.ReactNode; bg: string }> = {
  enrollment:  { icon: <ClipboardList size={16} className="text-amber-600" />,  bg: 'bg-amber-50' },
  batch:       { icon: <Calendar size={16} className="text-pink-600" />,       bg: 'bg-pink-50' },
  assessment:  { icon: <ClipboardCheck size={16} className="text-primary-600" />, bg: 'bg-primary-50' },
  trainer:     { icon: <UserCheck size={16} className="text-violet-600" />,    bg: 'bg-violet-50' },
  certificate: { icon: <Award size={16} className="text-yellow-600" />,        bg: 'bg-yellow-50' },
  system:      { icon: <Settings size={16} className="text-slate-500" />,      bg: 'bg-slate-100' },
};

const NotificationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifs = useAppSelector(s => s.notifications.items);
  const [filter, setFilter] = useState<Filter>('all');

  const unreadCount = notifs.filter(n => n.unread).length;
  const visible = useMemo(
    () => (filter === 'unread' ? notifs.filter(n => n.unread) : notifs),
    [notifs, filter]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell size={20} className="text-primary-600" /> Notifications
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : "You're all caught up."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" icon={<CheckCheck size={14} />} onClick={() => dispatch(markAllRead())}>
              Mark all read
            </Button>
          )}
          {notifs.length > 0 && (
            <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => dispatch(clearAll())}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-100 shadow-sm rounded-xl p-1 w-fit">
        {(['all', 'unread'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
              filter === f ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {f === 'all' ? `All (${notifs.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        {visible.length === 0 ? (
          <EmptyState
            icon={<Bell size={32} />}
            title={filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            subtitle={filter === 'unread' ? "You've read everything — nice." : 'New activity across the LMS will show up here.'}
          />
        ) : (
          visible.map(n => {
            const meta = typeMeta[n.type];
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${n.unread ? 'bg-primary-50/40' : ''}`}
              >
                <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>{n.msg}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {n.unread && (
                    <button
                      onClick={() => dispatch(markRead(n.id))}
                      title="Mark as read"
                      className="p-1.5 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <CheckCheck size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => dispatch(removeNotification(n.id))}
                    title="Remove"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
