import React, { useState } from 'react';
import { Gift, Lock, Newspaper, List } from 'lucide-react';

interface HeaderProps {
  currentView: 'codes' | 'news' | 'admin';
  onChangeView: (view: 'codes' | 'news' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onChangeView }) => {
  const [clickCount, setClickCount] = useState(0);
  
  // Unlock admin if logo is clicked 5 times or if we are already in admin view
  const showAdmin = clickCount >= 5 || currentView === 'admin';

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (currentView !== 'codes') {
      onChangeView('codes');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo - Secret Trigger */}
          <div className="flex items-center gap-2 select-none cursor-pointer group" onClick={handleLogoClick}>
            <div className="relative">
              <div className="absolute -inset-1 bg-limelight-400 rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-pitch-950 rounded-lg p-1.5 border border-limelight-400/30">
                 <Gift className="h-6 w-6 text-limelight-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-white leading-none">
                FC <span className="text-limelight-400">LOOT</span>HUB
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-widest hidden sm:block">COMMUNITY TRACKER</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-full border border-white/5">
            <button 
              onClick={() => onChangeView('codes')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentView === 'codes' 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List size={14} />
              Codes
            </button>
            <button 
              onClick={() => onChangeView('news')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentView === 'news' 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Newspaper size={14} />
              News
            </button>
          </nav>

          {/* Admin Access - Hidden by default */}
          <div className="flex items-center justify-end w-8">
            {showAdmin ? (
              <button 
                onClick={() => onChangeView('admin')}
                className={`p-2 rounded-full transition-colors ${currentView === 'admin' ? 'text-limelight-400 bg-limelight-400/10' : 'text-slate-600 hover:text-slate-400'}`}
                title="Contributor Access"
              >
                <Lock size={16} />
              </button>
            ) : (
              <div className="w-8 h-8" /> /* Spacer to maintain layout balance */
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;