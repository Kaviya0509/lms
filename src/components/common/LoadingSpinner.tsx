import React from 'react';

interface Props { size?: 'sm' | 'md' | 'lg'; text?: string; fullPage?: boolean; }

const sizes = { sm: 'h-5 w-5 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-3' };

const LoadingSpinner: React.FC<Props> = ({ size = 'md', text, fullPage = false }) => {
  const inner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} border-slate-200 border-t-primary-500 rounded-full animate-spin`} />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
  if (fullPage) return <div className="flex items-center justify-center min-h-[60vh]">{inner}</div>;
  return inner;
};

export default LoadingSpinner;
