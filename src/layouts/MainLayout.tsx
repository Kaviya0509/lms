import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ToastContainer from '../components/common/Toast';
import { useAppSelector, useAppDispatch } from '../hooks/useAppDispatch';
import { setSidebarCollapsed } from '../store/slices/uiSlice';

const MainLayout: React.FC = () => {
  const collapsed = useAppSelector(s => s.ui.sidebarCollapsed);
  const dispatch  = useAppDispatch();

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#fdf1ee' }}>
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => dispatch(setSidebarCollapsed(true))}
        />
      )}

      <Sidebar />

      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300
        ${collapsed ? 'lg:ml-16' : 'lg:ml-72'} ml-0`}>
        <Header />
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto min-h-0">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="min-h-full flex flex-col"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
