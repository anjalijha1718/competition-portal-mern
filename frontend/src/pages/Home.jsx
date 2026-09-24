import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to the Classical Dance competition screen
    navigate('/competitions/feedants-classical-dance', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="flex items-center gap-2 text-cyan-800 text-sm font-bold">
        <div className="w-5 h-5 border-2 border-cyan-700/30 border-t-cyan-700 rounded-full animate-spin" />
        <span>Loading Feedants Competition...</span>
      </div>
    </div>
  );
};
