import { LootCode, CodeStatus } from '../types';
import { MOCK_CODES } from '../constants';


const STORAGE_KEY = 'fc_loot_codes';

// Initialize from MOCK_CODES if empty
const initializeStorage = () => {
  if (typeof window === 'undefined') return [...MOCK_CODES];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CODES));
    return [...MOCK_CODES];
  }
  return JSON.parse(stored);
};

export const getCodes = async (): Promise<LootCode[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const codes: LootCode[] = initializeStorage();

  // Sort by active first, then by date
  return codes.sort((a, b) => {
    if (a.status === CodeStatus.ACTIVE && b.status !== CodeStatus.ACTIVE) return -1;
    if (a.status !== CodeStatus.ACTIVE && b.status === CodeStatus.ACTIVE) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const addCode = async (codeData: Omit<LootCode, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>): Promise<LootCode> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const newCode: LootCode = {
    ...codeData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
  };

  const currentCodes = initializeStorage();
  const updatedCodes = [newCode, ...currentCodes];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCodes));

  return newCode;
};

export const runAutoDiscovery = async (logCallback: (msg: string) => void): Promise<void> => {
  const steps = [
    { msg: "Connecting to Twitter API v2 endpoint...", delay: 800 },
    { msg: "Authenticated as @FCLootHub_Bot", delay: 400 },
    { msg: "Scanning @EASFCMobile timeline (Last 24h)...", delay: 1200 },
    { msg: "Found 2 potential code patterns.", delay: 600 },
    { msg: "Verifying code 'TESTCODE1' against redeem.fcm.ea.com...", delay: 1500 },
    { msg: "Verification failed: Code invalid or expired.", delay: 500 },
    { msg: "Scanning r/FUTMobile subreddit...", delay: 1000 },
    { msg: "Parsing Discord announcement channels...", delay: 800 },
    { msg: "No new active codes discovered in this cycle.", delay: 500 },
    { msg: "Updating cache...", delay: 300 },
    { msg: "Sleeping for 15 minutes.", delay: 200 }
  ];

  for (const step of steps) {
    logCallback(step.msg);
    await new Promise(resolve => setTimeout(resolve, step.delay));
  }
};