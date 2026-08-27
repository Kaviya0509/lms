import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'enrollment' | 'batch' | 'assessment' | 'trainer' | 'certificate' | 'system';

export interface NotificationItem {
  id: string;
  msg: string;
  time: string;
  unread: boolean;
  type: NotificationType;
}

interface NotificationsState {
  items: NotificationItem[];
}

const initialState: NotificationsState = {
  items: [
    { id: '1', msg: 'Ananya Reddy enrollment pending approval', time: '3m ago', unread: true, type: 'enrollment' },
    { id: '2', msg: 'FSWD Batch session starting in 1 hour', time: '45m ago', unread: true, type: 'batch' },
    { id: '3', msg: 'Karthik Raja completed ML course assessment', time: '2h ago', unread: false, type: 'assessment' },
    { id: '4', msg: 'New trainer Dr. Arun Kumar onboarded', time: '1d ago', unread: false, type: 'trainer' },
    { id: '5', msg: '12 certificates issued for Data Science Batch 4', time: '1d ago', unread: false, type: 'certificate' },
    { id: '6', msg: 'Priya Menon requested enrollment in UI/UX Design', time: '2d ago', unread: false, type: 'enrollment' },
    { id: '7', msg: 'Scheduled maintenance completed successfully', time: '3d ago', unread: false, type: 'system' },
  ],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markRead(state, action: PayloadAction<string>) {
      const n = state.items.find(i => i.id === action.payload);
      if (n) n.unread = false;
    },
    markAllRead(state) {
      state.items.forEach(n => { n.unread = false; });
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearAll(state) {
      state.items = [];
    },
  },
});

export const { markRead, markAllRead, removeNotification, clearAll } = notificationsSlice.actions;
export default notificationsSlice.reducer;
