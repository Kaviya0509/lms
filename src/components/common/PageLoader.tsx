import React from 'react';
import { motion } from 'framer-motion';

interface PageLoaderProps {
  text?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ text = 'Loading...' }) => {
  return (
    <motion.div
      key="page-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#fdf1ee]/80 backdrop-blur-[2px] z-50"
    >
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
        <img
          src="/favicon.png"
          alt="Loading"
          className="absolute w-8 h-8 object-contain animate-pulse"
        />
      </div>
      {text && (
        <p className="text-[10px] font-bold text-primary-500/70 uppercase tracking-widest mt-4">
          {text}
        </p>
      )}
    </motion.div>
  );
};

export default PageLoader;
