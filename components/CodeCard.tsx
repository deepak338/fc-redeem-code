import React, { useState } from 'react';
import { ExternalLink, Check, AlertTriangle, Globe, ShieldCheck, Twitter, MessageCircle } from 'lucide-react';
import { LootCode, CodeStatus, RewardType } from '../types';
import { REDEEM_URL } from '../constants';
import Button from './Button';

interface CodeCardProps {
  data: LootCode;
}

const CodeCard: React.FC<CodeCardProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAndRedeem = async () => {
    try {
      await navigator.clipboard.writeText(data.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      window.open(REDEEM_URL, '_blank');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Status Badge Logic
  const getStatusColor = () => {
    switch (data.status) {
      case CodeStatus.ACTIVE: return 'text-limelight-400 bg-limelight-400/10 border-limelight-400/20';
      case CodeStatus.LIMITED: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case CodeStatus.EXPIRED: return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400';
    }
  };

  // Border accent based on reward type
  const getBorderAccent = () => {
     switch (data.rewardType) {
        case RewardType.GEMS: return 'border-l-purple-500';
        case RewardType.PLAYER: return 'border-l-limelight-400';
        case RewardType.PACK: return 'border-l-blue-500';
        default: return 'border-l-slate-600';
     }
  };

  // Icon based on source
  const getSourceIcon = () => {
    const s = data.source?.toLowerCase() || '';
    if (s.includes('twitter') || s.includes('x ')) return <Twitter size={12} />;
    if (s.includes('reddit') || s.includes('discord')) return <MessageCircle size={12} />;
    return <Globe size={12} />;
  };

  return (
    <div className={`relative group bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-5 shadow-lg transition-all hover:border-slate-700 hover:shadow-xl hover:-translate-y-1 overflow-hidden border-l-4 ${getBorderAccent()}`}>
      
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-limelight-400/5 rounded-full blur-3xl pointer-events-none group-hover:bg-limelight-400/10 transition-colors"></div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
           {/* Header: Reward & Status */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded border ${getStatusColor()}`}>
              {data.status === CodeStatus.ACTIVE && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>}
              {data.status}
            </span>
            {data.isSystemVerified && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-400/20 bg-blue-400/10 text-blue-300">
                <ShieldCheck size={10} /> Auto-Verified
              </span>
            )}
            <span className="text-xs text-slate-500 font-mono">
                {data.expiresAt ? `Exp: ${new Date(data.expiresAt).toLocaleDateString()}` : 'No Expiry'}
            </span>
          </div>
          
          {/* Main Code Display */}
          <h3 className="text-2xl font-display font-bold text-white tracking-wide mb-1 select-all">
            {data.code}
          </h3>
          <p className="text-slate-400 text-sm flex items-center gap-1.5">
            {data.rewardType === RewardType.GEMS && <span className="text-purple-400">♦</span>}
            {data.rewardType === RewardType.COINS && <span className="text-yellow-400">●</span>}
            {data.reward}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col justify-center min-w-[160px]">
           <Button 
            onClick={handleCopyAndRedeem}
            variant={data.status === CodeStatus.EXPIRED ? 'secondary' : 'primary'}
            className="w-full shadow-lg"
           >
             {copied ? (
               <><Check size={18} className="mr-2" /> Copied!</>
             ) : (
               <><ExternalLink size={18} className="mr-2" /> Redeem</>
             )}
           </Button>
           <p className="text-[10px] text-center text-slate-500 mt-2">
             Opens redeem.fcmobile.com
           </p>
        </div>
      </div>

      <div className="h-px bg-slate-800 my-4" />

      {/* Footer: Source & Info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Source Attribution */}
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            {getSourceIcon()}
            <span className="font-mono">{data.source || 'Unknown Source'}</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-600 font-mono">
           ID: {data.id}
        </div>
      </div>

      {data.status === CodeStatus.EXPIRED && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center z-10">
           <div className="bg-red-500/10 border border-red-500/50 px-4 py-2 rounded-full text-red-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2 transform -rotate-6 shadow-2xl backdrop-blur-md">
             <AlertTriangle size={16} /> Expired
           </div>
        </div>
      )}
    </div>
  );
};

export default CodeCard;