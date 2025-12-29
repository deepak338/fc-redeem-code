import React, { useEffect, useState } from 'react';
import { getCodes } from '../services/codeService';
import CodeCard from '../components/CodeCard';
import { LootCode } from '../types';
import { RefreshCw, Filter } from 'lucide-react';

const HomePage: React.FC = () => {
  const [codes, setCodes] = useState<LootCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE'>('ACTIVE');

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const data = await getCodes();
      setCodes(data);
    } catch (error) {
      console.error("Failed to fetch codes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const displayedCodes = filter === 'ALL' ? codes : codes.filter(c => c.status !== 'EXPIRED');

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/5 bg-slate-900/50 py-16 sm:py-20">
         <div className="absolute inset-0 bg-hero-pattern opacity-50"></div>
         <div className="relative mx-auto max-w-5xl px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-display font-bold tracking-tight text-white sm:text-5xl mb-4">
              FC MOBILE REDEEM CODES
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 leading-relaxed">
              Looking for free rewards? You're in the right place. We track and verify active codes instantly.
              Unlock <span className="text-limelight-400 font-medium">Gems, Coins, and Players</span> to build your Ultimate Team.
            </p>
         </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* Controls */}
        <div className="flex items-center justify-between mb-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-xl">
           <div className="flex gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setFilter('ACTIVE')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'ACTIVE' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Active Only
              </button>
              <button 
                onClick={() => setFilter('ALL')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Show All
              </button>
           </div>
           
           <button 
             onClick={fetchCodes}
             className="text-slate-400 hover:text-limelight-400 transition-colors p-2"
             title="Refresh Codes"
           >
             <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>

        {/* Code Grid */}
        <div className="space-y-4">
          {loading && codes.length === 0 ? (
            <div className="text-center py-20">
               <div className="animate-spin h-10 w-10 border-4 border-limelight-500 border-t-transparent rounded-full mx-auto mb-4"></div>
               <p className="text-slate-500 animate-pulse">Scanning for loot...</p>
            </div>
          ) : (
            <>
              {displayedCodes.map((code) => (
                <CodeCard key={code.id} data={code} />
              ))}
              
              {displayedCodes.length === 0 && (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
                  <p className="text-slate-500">No active codes found right now.</p>
                  <p className="text-sm text-slate-600 mt-2">Check back later or check the "Show All" filter.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;