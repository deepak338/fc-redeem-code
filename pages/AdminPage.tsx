
import React, { useState, useRef, useEffect } from 'react';
import { addCode, runAutoDiscovery } from '../services/codeService';
import { addNews } from '../services/newsService';
import { CodeStatus, RewardType, NewsCategory } from '../types';
import Button from '../components/Button';
import { ArrowLeft, Plus, Bot, Terminal, Radio, Server, ShieldAlert, Newspaper, Ticket, Trophy, Flame, Zap, Star } from 'lucide-react';

interface AdminPageProps {
  onBack: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'CODES' | 'NEWS'>('CODES');

  // Code Form State
  const [codeForm, setCodeForm] = useState({
    code: '',
    reward: '',
    rewardType: RewardType.GEMS,
    expiresInDays: '',
  });

  // News Form State
  const [newsForm, setNewsForm] = useState({
    title: '',
    date: '',
    category: NewsCategory.UPCOMING,
    description: '',
    iconType: 'TROPHY' as 'TROPHY' | 'FLAME' | 'ZAP' | 'STAR',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto-Scraper State
  const [scraperRunning, setScraperRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const expiresAt = codeForm.expiresInDays
        ? new Date(Date.now() + parseInt(codeForm.expiresInDays) * 86400000).toISOString()
        : null;

      await addCode({
        code: codeForm.code.toUpperCase(),
        reward: codeForm.reward,
        rewardType: codeForm.rewardType,
        expiresAt,
        status: CodeStatus.ACTIVE,
        author: 'Admin',
        source: 'Manual Entry',
        isSystemVerified: true,
      });

      setSuccess(true);
      setCodeForm({ code: '', reward: '', rewardType: RewardType.GEMS, expiresInDays: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to add code", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await addNews({
        title: newsForm.title,
        date: newsForm.date,
        category: newsForm.category,
        description: newsForm.description,
        iconType: newsForm.iconType,
      });

      setSuccess(true);
      setNewsForm({
        title: '',
        date: '',
        category: NewsCategory.UPCOMING,
        description: '',
        iconType: 'TROPHY',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to add news", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunScraper = async () => {
    if (scraperRunning) return;
    setScraperRunning(true);
    setLogs(['> Initializing FC LootHub Ingestion Layer...', '> Loading Docker containers...']);

    try {
      await runAutoDiscovery((msg) => {
        setLogs(prev => [...prev, `> ${msg}`]);
      });
      setLogs(prev => [...prev, '> PROCESS COMPLETE. Database updated.']);
    } catch (e) {
      setLogs(prev => [...prev, `> ERROR: ${e}`]);
    } finally {
      setScraperRunning(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Hub
          </button>

          <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('CODES')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'CODES' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Ticket size={14} /> Manage Codes
            </button>
            <button
              onClick={() => setActiveTab('NEWS')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'NEWS' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Newspaper size={14} /> Manage News
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column: Input Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Plus className="text-slate-200" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{activeTab === 'CODES' ? 'Add Recruit Code' : 'Add News Update'}</h2>
                <p className="text-slate-400 text-xs">Manual database injection</p>
              </div>
            </div>

            {activeTab === 'CODES' ? (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Redeem Code</label>
                  <input
                    type="text"
                    required
                    value={codeForm.code}
                    onChange={e => setCodeForm({ ...codeForm, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-limelight-400 outline-none font-mono"
                    placeholder="e.g. NEWCODE"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Reward</label>
                  <input
                    type="text"
                    required
                    value={codeForm.reward}
                    onChange={e => setCodeForm({ ...codeForm, reward: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-limelight-400 outline-none"
                    placeholder="e.g. 500 Gems"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
                    <select
                      value={codeForm.rewardType}
                      onChange={e => setCodeForm({ ...codeForm, rewardType: e.target.value as RewardType })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-limelight-400 outline-none"
                    >
                      <option value={RewardType.GEMS}>Gems</option>
                      <option value={RewardType.COINS}>Coins</option>
                      <option value={RewardType.PACK}>Pack</option>
                      <option value={RewardType.PLAYER}>Player</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Expires (Days)</label>
                    <input
                      type="number"
                      min="0"
                      value={codeForm.expiresInDays}
                      onChange={e => setCodeForm({ ...codeForm, expiresInDays: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-limelight-400 outline-none"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" isLoading={loading} className="w-full">
                    Add Code
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleNewsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Headline</label>
                  <input
                    type="text"
                    required
                    value={newsForm.title}
                    onChange={e => setNewsForm({ ...newsForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-limelight-400 outline-none"
                    placeholder="e.g. TOTY 26 Leak"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Display Date</label>
                    <input
                      type="text"
                      required
                      value={newsForm.date}
                      onChange={e => setNewsForm({ ...newsForm, date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-limelight-400 outline-none"
                      placeholder="e.g. Jan 15 or 'Live Now'"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
                    <select
                      value={newsForm.category}
                      onChange={e => setNewsForm({ ...newsForm, category: e.target.value as NewsCategory })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-limelight-400 outline-none"
                    >
                      <option value={NewsCategory.UPCOMING}>Upcoming</option>
                      <option value={NewsCategory.CURRENT_EVENT}>Current Event</option>
                      <option value={NewsCategory.EVENT}>Event</option>
                      <option value={NewsCategory.LEAK}>Leak</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Icon Style</label>
                  <div className="flex gap-2">
                    {(['TROPHY', 'FLAME', 'ZAP', 'STAR'] as const).map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setNewsForm({ ...newsForm, iconType: icon })}
                        className={`flex-1 py-2 rounded-lg border flex items-center justify-center transition-all ${newsForm.iconType === icon ? 'bg-limelight-400/20 border-limelight-400 text-limelight-400' : 'bg-slate-950 border-slate-700 text-slate-500 hover:border-slate-500'}`}
                      >
                        {icon === 'TROPHY' && <Trophy size={16} />}
                        {icon === 'FLAME' && <Flame size={16} />}
                        {icon === 'ZAP' && <Zap size={16} />}
                        {icon === 'STAR' && <Star size={16} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Description</label>
                  <textarea
                    required
                    value={newsForm.description}
                    onChange={e => setNewsForm({ ...newsForm, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-limelight-400 outline-none leading-relaxed h-24 resize-none"
                    placeholder="Enter news details..."
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" isLoading={loading} className="w-full">
                    Publish News
                  </Button>
                </div>
              </form>
            )}

            {success && (
              <div className="mt-4 text-xs text-green-400 text-center animate-pulse bg-green-500/10 py-2 rounded-lg border border-green-500/20">
                Data successfully written to local database.
              </div>
            )}
          </div>

          {/* Right Column: AI Automation / Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="p-2 bg-limelight-400/10 rounded-lg animate-pulse">
                <Bot className="text-limelight-400" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Auto-Discovery Engine</h2>
                <p className="text-slate-400 text-xs">Multi-source scraper & verification</p>
              </div>
            </div>

            <div className="flex-1 bg-black rounded-lg border border-slate-700 p-4 font-mono text-xs overflow-hidden flex flex-col relative min-h-[300px]">
              <div className="absolute top-2 right-2 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <div className="mb-2 text-slate-500 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Terminal size={12} />
                <span>system_logs.log</span>
              </div>
              <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-1 scrollbar-hide text-slate-300">
                {logs.length === 0 && <span className="text-slate-600 italic">System Idle. Waiting for trigger...</span>}
                {logs.map((log, i) => (
                  <div key={i} className="break-all">
                    <span className="text-limelight-500 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                    {log}
                  </div>
                ))}
                {scraperRunning && <div className="animate-pulse">_</div>}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Radio size={12} className="text-green-500" />
                    <span>Twitter/X API: <strong>Connected</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Server size={12} className="text-green-500" />
                    <span>YouTube Sync: <strong>Active</strong></span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-xs text-slate-400 justify-end">
                    <ShieldAlert size={12} className="text-blue-500" />
                    <span>EA Protection: <strong>Bypassed</strong></span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleRunScraper}
                isLoading={scraperRunning}
                variant="secondary"
                className="w-full bg-slate-800 hover:bg-slate-700 text-limelight-400 border-slate-700"
              >
                {scraperRunning ? 'Ingesting Data...' : 'Run Auto-Discovery Protocol'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
