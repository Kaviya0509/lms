export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
};

export const formatDateTime = (date: string | Date | undefined): string => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
};

export const getInitials = (name: string): string =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export const getAvatarColor = (name: string): string => {
  const colors = ['from-primary-500 to-violet-600','from-emerald-500 to-teal-600','from-amber-500 to-orange-600','from-pink-500 to-rose-600','from-cyan-500 to-blue-600'];
  return colors[name.charCodeAt(0) % colors.length];
};

export const statusColor = (status: string): string => {
  const map: Record<string, string> = {
    active: 'success', published: 'success', approved: 'success', issued: 'success', completed: 'success', present: 'success',
    inactive: 'neutral', archived: 'neutral', revoked: 'neutral', cancelled: 'neutral',
    pending: 'warning', review: 'warning', late: 'warning', upcoming: 'warning', configuration: 'warning',
    draft: 'neutral', offline: 'info', online: 'info',
    rejected: 'danger', dropped: 'danger', absent: 'danger', flagged: 'danger', suspended: 'danger',
  };
  return map[status] ?? 'neutral';
};

export const pluralize = (count: number, word: string): string =>
  `${count} ${word}${count !== 1 ? 's' : ''}`;

export const truncate = (str: string, len: number): string =>
  str.length > len ? `${str.slice(0, len)}...` : str;

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};
