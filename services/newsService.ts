import { NewsItem, NewsCategory } from '../types';
import { MOCK_NEWS } from '../constants';

const NEWS_STORAGE_KEY = 'fc_loot_news';
const YOUTUBE_CACHE_KEY = 'fc_loot_youtube_cache_v4';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

const initializeStorage = () => {
    if (typeof window === 'undefined') return [...MOCK_NEWS];

    const stored = localStorage.getItem(NEWS_STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(MOCK_NEWS));
        return [...MOCK_NEWS];
    }
    return JSON.parse(stored);
};

const fetchYouTubeNews = async (): Promise<NewsItem[]> => {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!apiKey) {
        console.warn('YouTube API Key is missing');
        return [];
    }

    // Check cache
    const cached = localStorage.getItem(YOUTUBE_CACHE_KEY);
    if (cached) {
        try {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        } catch (e) {
            console.error("Error parsing YouTube cache", e);
            localStorage.removeItem(YOUTUBE_CACHE_KEY);
        }
    }

    try {
        const CHANNEL_ID = 'UCDK7jNQhLIYAiYqe-lWpZVQ'; // EA SPORTS FC MOBILE Official Channel
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/activities?part=snippet,contentDetails&channelId=${CHANNEL_ID}&maxResults=10&key=${apiKey}`
        );

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('YouTube API request failed', response.status, errorBody);
            return [];
        }

        const data = await response.json();

        const youtubeNews: NewsItem[] = data.items
            .filter((item: any) => item.snippet.type === 'upload' || item.snippet.type === 'playlistItem')
            .map((item: any) => {
                const videoId = item.contentDetails?.upload?.videoId || item.contentDetails?.playlistItem?.resourceId?.videoId;
                const title = item.snippet.title.toLowerCase();

                let category = NewsCategory.CURRENT_EVENT;
                if (title.includes('trailer') || title.includes('teaser') || title.includes('coming soon')) {
                    category = NewsCategory.UPCOMING;
                } else if (title.includes('leak')) {
                    category = NewsCategory.LEAK;
                } else if (title.includes('live')) {
                    category = NewsCategory.EVENT;
                }

                return {
                    id: videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    date: new Date(item.snippet.publishedAt).toLocaleDateString(),
                    category: category,
                    iconType: 'FLAME',
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url
                };
            })
            .filter((item: NewsItem) => item.id); // Filter out any failed mappings

        localStorage.setItem(YOUTUBE_CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: youtubeNews
        }));

        return youtubeNews;

    } catch (error) {
        console.error('Error fetching YouTube news:', error);
        return [];
    }
};

export const getNews = async (): Promise<NewsItem[]> => {
    const localNews = initializeStorage();
    const youtubeNews = await fetchYouTubeNews();

    // Merge: YouTube news first, then local news
    return [...youtubeNews, ...localNews];
};

export const addNews = async (newsData: Omit<NewsItem, 'id'>): Promise<NewsItem> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newNews: NewsItem = {
        ...newsData,
        id: Math.random().toString(36).substr(2, 9),
    };

    const currentNews = initializeStorage();
    const updatedNews = [newNews, ...currentNews];
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(updatedNews));

    return newNews;
};

export const deleteNews = async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const currentNews = initializeStorage();
    const updatedNews = currentNews.filter(n => n.id !== id);
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(updatedNews));
};
