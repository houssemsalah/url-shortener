import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Api } from '../services/apiService.ts';
import { setLoading, setError, addShortenedUrl } from '../stores/urlSlice.ts';
import { RootState } from '../stores/reduxStore';
import { toast } from 'react-hot-toast';

const UrlShortenerForm = () => {
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.url);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setError(''));
    
    if (!validateUrl(url)) {
      dispatch(setError('Please enter a valid URL'));
      return;
    }

    dispatch(setLoading(true));
    try {
      const data = await Api.shortenUrl(url);
      dispatch(addShortenedUrl({
        original: url,
        shortened: data.shortUrl,
        createdAt: new Date().toISOString(),
      }));
      setUrl('');
      toast.success('URL shortened successfully!');
    } catch (err) {
      dispatch(setError(err.message));
      toast.error('Failed to shorten URL');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LinkIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter your long URL here..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        />
        {url && (
          <button
            type="button"
            onClick={() => setUrl('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <span className="text-sm">Clear</span>
          </button>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
      >
        {loading ? (
          <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
        ) : (
          'Shorten URL'
        )}
      </button>
    </form>
  );
};

  
  export default UrlShortenerForm;