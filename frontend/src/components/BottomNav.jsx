import React from 'react';
import { Home, Compass, Plus, Trophy, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Explore', icon: Compass, path: '/explore' },
    { label: 'Create', icon: Plus, isAction: true },
    { label: 'Competitions', icon: Trophy, path: '/competitions/feedants-classical-dance' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 h-14 flex items-center shadow-lg">
      <div className="max-w-md mx-auto w-full flex items-center justify-around px-2">
        {navItems.map((item, idx) => {
          if (item.isAction) {
            return (
              <button
                key={idx}
                onClick={() => alert('Feedants Creator feature: Create competition/performance post')}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-700 to-teal-600 text-white flex items-center justify-center -mt-3 shadow-md hover:scale-105 active:scale-95 transition-all"
                title="Create"
              >
                <Plus className="w-5 h-5" />
              </button>
            );
          }

          const Icon = item.icon;
          const isActive =
            item.path === '/competitions/feedants-classical-dance' ||
            location.pathname === item.path;

          return (
            <button
              key={idx}
              onClick={() => item.path && navigate(item.path)}
              className={`flex flex-col items-center justify-center w-14 py-1 transition-colors ${
                isActive ? 'text-cyan-800 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
