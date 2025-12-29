import React, { useEffect, useState } from 'react';
import { Calendar, Flame, Trophy, Star, Zap, Twitter, ExternalLink, Clock } from 'lucide-react';
import { getNews } from '../services/newsService';
import { NewsItem, NewsCategory } from '../types';

const NewsPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        setNewsItems(data);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const getIcon = (type: string) => {
    const size = 24;
    switch (type) {
      case 'TROPHY': return <Trophy className="text-yellow-400" size={size} />;
      case 'FLAME': return <Flame className="text-red-400" size={size} />;
      case 'ZAP': return <Zap className="text-blue-400" size={size} />;
      case 'STAR': return <Star className="text-limelight-400" size={size} />;
      default: return <Star className="text-white" size={size} />;
    }
  };

  const getStyles = (category: NewsCategory) => {
    switch (category) {
      case NewsCategory.UPCOMING: return { color: "border-l-yellow-500", bg: "bg-yellow-500/10" };
      case NewsCategory.CURRENT_EVENT: return { color: "border-l-red-500", bg: "bg-red-500/10" };
      case NewsCategory.EVENT: return { color: "border-l-blue-500", bg: "bg-blue-500/10" };
      case NewsCategory.LEAK: return { color: "border-l-purple-500", bg: "bg-purple-500/10" };
      default: return { color: "border-l-slate-500", bg: "bg-slate-500/10" };
    }
  };

  const dailyEvents = [
    { name: "Zlatan Chronicles", type: "One-time", reward: "Icon Zlatan" },
    { name: "Hero Chronicles", type: "Daily", reward: "Hero Tokens" },
    { name: "Beckham Chronicles", type: "One-time", reward: "Icon Beckham" },
    { name: "Football Centre", type: "Weekly", reward: "TOTW Players" },
  ];

  const roadmap2026 = [
    { date: "Jan 15", event: "TOTY (Team of the Year)" },
    { date: "Feb 27", event: "Carnival & Ramadan" },
    { date: "Mar 06", event: "Code:Neon" },
    { date: "Mar 13", event: "LALIGA Rivals" },
    { date: "Mar 27", event: "UCL: Road to the Final" },
    { date: "Apr 29", event: "TOTS (Team of the Season)" },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5 bg-slate-900/50 py-12">
        <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            SEASON 10 <span className="text-limelight-400">NEWS & ROADMAP</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Stay ahead of the market. Track the FC Mobile 26 schedule, daily resets, and upcoming major promos like TOTY.
          </p>

          <a
            href="https://x.com/EASFCMobile"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 rounded-full text-xs font-bold hover:bg-[#1DA1F2]/20 transition-all"
          >
            <Twitter size={14} />
            Follow @EASFCMOBILE for Live Updates
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="text-limelight-400" size={20} /> Featured Updates
          </h2>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-limelight-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500 animate-pulse">Loading intel...</p>
            </div>
          ) : (
            <>
              {newsItems.map((news) => {
                const style = getStyles(news.category);
                return (
                  <div key={news.id} className={`bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 shadow-lg hover:border-slate-700 transition-all ${style.color} border-l-4 group relative`}>
                    {news.url && (
                      <a href={news.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" aria-label={`View ${news.title}`} />
                    )}
                    <div className="flex items-start gap-4">
                      {news.thumbnailUrl ? (
                        <div className="w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-950">
                          <img src={news.thumbnailUrl} alt="" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className={`p-3 rounded-lg border border-white/5 ${style.bg}`}>
                          {getIcon(news.iconType)}
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-limelight-400 transition-colors line-clamp-1">{news.title}</h3>
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-950 text-slate-400 rounded border border-slate-800 shrink-0 ml-2">
                            {news.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                          <Calendar size={12} /> {news.date}
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                          {news.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {newsItems.length === 0 && (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                  <p className="text-slate-500">No recent news updates.</p>
                </div>
              )}
            </>
          )}

          {/* Daily Grind Table */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <Clock size={16} /> Daily & Weekly Grind
            </h3>
            <div className="overflow-hidden rounded-lg border border-slate-800">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950 text-slate-200 font-display uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 font-medium">Event Name</th>
                    <th className="px-4 py-3 font-medium">Frequency</th>
                    <th className="px-4 py-3 font-medium text-right">Key Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                  {dailyEvents.map((event, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{event.name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded ${event.type === 'Daily' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {event.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-limelight-400">{event.reward}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Roadmap */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-pitch-900 to-slate-900 border border-limelight-500/20 rounded-xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calendar size={120} className="text-white" />
            </div>

            <h3 className="text-lg font-display font-bold text-white mb-6 relative z-10">
              2026 ROADMAP
            </h3>

            <div className="space-y-0 relative z-10">
              {roadmap2026.map((item, i) => (
                <div key={i} className="flex gap-4 relative pb-6 last:pb-0">
                  {/* Timeline Line */}
                  {i !== roadmap2026.length - 1 && (
                    <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-slate-800"></div>
                  )}

                  {/* Date Bubble */}
                  <div className="flex-shrink-0 w-10 h-10 bg-slate-950 border border-slate-700 rounded-full flex flex-col items-center justify-center text-[10px] font-bold text-slate-300 shadow-sm z-10">
                    <span className="text-xs">{item.date.split(' ')[0]}</span>
                    <span className="text-[9px] text-slate-500">{item.date.split(' ')[1]}</span>
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <h4 className="text-sm font-bold text-white">{item.event}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Upcoming Season 10</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-center">
            <p className="text-blue-300 text-xs leading-relaxed">
              *Dates based on official leaks and previous season patterns. Subject to change by EA.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewsPage;