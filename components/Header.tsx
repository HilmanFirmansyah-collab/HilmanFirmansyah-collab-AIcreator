import React from 'react';
import { Youtube, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-500">
          <Youtube size={32} fill="currentColor" />
          <span className="text-white font-bold text-xl tracking-tight">Creator<span className="text-red-500">Studio</span> AI</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Sparkles size={16} className="text-yellow-500" />
          <span>Powered by Gemini</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
