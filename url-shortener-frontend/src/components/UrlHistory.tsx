import React, { useEffect, useState } from 'react';
import { ClipboardIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Api } from '../services/apiService.ts';
import AnalyticsView from './AnalyticsView.tsx';

interface Url {
    _id: string;
    originalUrl: string;
    shortId: string;
    createdAt: string;
    clicks: number;
}

const UrlHistoryItem = ({ item, onCopy }: { item: Url; onCopy: (text: string) => void }) => {
    const [showAnalytics, setShowAnalytics] = useState(false);
    
    return (
        <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.originalUrl}</p>
                    <p className="text-sm text-blue-600 truncate">{'http://localhost:3001/'+item.shortId}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Created: {new Date(item.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Visited: {item.clicks} times
                    </p>
                    <button
                        onClick={() => setShowAnalytics(!showAnalytics)}
                        className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                    >
                        {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                    </button>
                </div>
                <button
                    onClick={() => onCopy('http://localhost:3001/'+item.shortId)}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600"
                >
                    <ClipboardIcon className="h-5 w-5" />
                </button>
            </div>
            {showAnalytics && <div className="mt-4"><AnalyticsView urlId={item.shortId} /></div>}
        </div>
    );
};

const UrlHistory = () => {
    const [shortenedUrls, setShortenedUrls] = useState<Url[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUrlHistories = async () => {
            setIsLoading(true);
            try {
                const response = await Api.getUrlHistories();
                if (!response || !Array.isArray(response)) {
                    throw new Error('Invalid response format');
                }
                const sortedUrls = response.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setShortenedUrls(sortedUrls);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch URL histories';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUrlHistories();
    }, []);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy!');
        }
    };

    if (isLoading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>;
    if (shortenedUrls.length === 0) return <div className="text-center p-4 text-gray-500">No URLs found</div>;

    return (
        <div className="space-y-4">
            {shortenedUrls.map((item) => (
                <UrlHistoryItem key={item.shortId} item={item} onCopy={copyToClipboard} />
            ))}
        </div>
    );
};

export default UrlHistory;