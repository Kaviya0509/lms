import React from 'react';
import { Palette } from 'lucide-react';

const themes = [
  {
    name: 'Claude Terracotta',
    primary: '#d97757',
    vars: {
      '--color-primary-50': '#fdf3f0',
      '--color-primary-100': '#fae1d9',
      '--color-primary-500': '#d97757',
      '--color-primary-600': '#c86653',
    }
  },
  {
    name: 'Ocean Blue',
    primary: '#0ea5e9',
    vars: {
      '--color-primary-50': '#f0f9ff',
      '--color-primary-100': '#e0f2fe',
      '--color-primary-500': '#0ea5e9',
      '--color-primary-600': '#0284c7',
    }
  },
  {
    name: 'Emerald Green',
    primary: '#10b981',
    vars: {
      '--color-primary-50': '#ecfdf5',
      '--color-primary-100': '#d1fae5',
      '--color-primary-500': '#10b981',
      '--color-primary-600': '#059669',
    }
  },
  {
    name: 'Amethyst Purple',
    primary: '#8b5cf6',
    vars: {
      '--color-primary-50': '#f5f3ff',
      '--color-primary-100': '#ede9fe',
      '--color-primary-500': '#8b5cf6',
      '--color-primary-600': '#7c3aed',
    }
  }
];

export const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const applyTheme = (themeVars: Record<string, string>) => {
    const root = document.documentElement;
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-white p-3 rounded-2xl shadow-xl border border-slate-200/60 mb-2 flex flex-col gap-2 w-48 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <p className="text-xs font-bold text-slate-500 uppercase px-2 mb-1">Color Theme</p>
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => applyTheme(theme.vars)}
              className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer"
            >
              <div
                className="w-5 h-5 rounded-full shadow-sm border border-slate-200 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: theme.primary }}
              />
              <span className="text-xs font-semibold text-slate-700">{theme.name}</span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200/80 flex items-center justify-center text-slate-700 hover:text-primary-600 hover:border-primary-500 transition-all cursor-pointer hover:scale-105 active:scale-95"
      >
        <Palette className="w-5 h-5" strokeWidth={2} />
      </button>
    </div>
  );
};
