export enum CodeStatus {
  ACTIVE = 'ACTIVE',
  LIMITED = 'LIMITED',
  EXPIRED = 'EXPIRED',
}

export enum RewardType {
  GEMS = 'GEMS',
  COINS = 'COINS',
  PACK = 'PACK',
  PLAYER = 'PLAYER',
}

export interface LootCode {
  id: string;
  code: string;
  reward: string;
  rewardType: RewardType;
  expiresAt: string | null; // ISO string
  createdAt: string; // ISO string
  status: CodeStatus;
  upvotes: number;
  downvotes: number;
  author: string;
  source?: string; // e.g. "Twitter", "Reddit", "Discord"
  sourceUrl?: string;
  isSystemVerified?: boolean; // Verified by the automated engine
  lastVerifiedAt?: string;
}


export interface CodeStats {
  successRate: number; // 0-100
  totalVotes: number;
}

export enum NewsCategory {
  UPCOMING = 'UPCOMING',
  CURRENT_EVENT = 'CURRENT EVENT',
  EVENT = 'EVENT',
  LEAK = 'LEAK',
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: NewsCategory;
  iconType: 'TROPHY' | 'FLAME' | 'ZAP' | 'STAR';
  url?: string;
  thumbnailUrl?: string;
}
