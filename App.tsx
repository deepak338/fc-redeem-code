import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import NewsPage from './pages/NewsPage';
import Button from './components/Button';
import { LockKeyhole } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'codes' | 'news' | 'admin'>('codes');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === 'admin123') {
      setIsAdminAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'admin':
        if (!isAdminAuthenticated) {
          return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
                <div className="mx-auto bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <LockKeyhole className="text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Restricted Access</h2>
                <p className="text-slate-400 text-sm mb-6">Enter Contributor PIN to access the ingestion dashboard.</p>
                
                <form onSubmit={handleAdminAccess} className="space-y-4">
                  <input 
                    type="password" 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter PIN"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-center text-white tracking-widest focus:ring-2 focus:ring-limelight-400 outline-none transition-all"
                    autoFocus
                  />
                  {pinError && <p className="text-red-500 text-xs">Access Denied</p>}
                  <Button type="submit" className="w-full">Unlock Dashboard</Button>
                </form>
                
                <button 
                  onClick={() => setCurrentView('codes')}
                  className="mt-6 text-xs text-slate-500 hover:text-slate-300 underline"
                >
                  Return to Public Feed
                </button>
              </div>
            </div>
          );
        }
        return <AdminPage onBack={() => setCurrentView('codes')} />;
      case 'news':
        return <NewsPage />;
      case 'codes':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-limelight-400 selection:text-pitch-950">
      <Header currentView={currentView} onChangeView={setCurrentView} />
      
      {renderContent()}

      <footer className="border-t border-slate-900 py-8 text-center text-slate-600 text-sm">
        <div className="max-w-5xl mx-auto px-4">
          <p className="mb-2">FC LootHub is a community tool and is not affiliated with EA Sports.</p>
          <p>&copy; {new Date().getFullYear()} FC LootHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;