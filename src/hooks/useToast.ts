import { useAppDispatch } from './useAppDispatch';
import { addToast } from '../store/slices/uiSlice';
import type { ToastMessage } from '../types';

export const useToast = () => {
  const dispatch = useAppDispatch();
  const toast = (msg: Omit<ToastMessage, 'id'>) => dispatch(addToast(msg));
  return {
    success: (message: string) => toast({ type: 'success', message, duration: 3000 }),
    error:   (message: string) => toast({ type: 'error',   message, duration: 4000 }),
    warning: (message: string) => toast({ type: 'warning', message, duration: 3500 }),
    info:    (message: string) => toast({ type: 'info',    message, duration: 3000 }),
  };
};
