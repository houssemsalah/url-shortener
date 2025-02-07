import { Analytics } from './../../../url-shortener-backend/src/analytics/analytics.schema';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:3001';

export const Api = {
  shortenUrl: async (url: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/shorten`, { url }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to shorten URL');
    }
  },

  getUrlHistories: async () => {
    console.log('Fetching URL histories in API...');
    try {
      const response = await axios.get(`${API_BASE_URL}/url/histories`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response in api', response.data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch URL histories');
    }
  }
,
// API to get Analytics
getUrlAnalytics: async (urlId:string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/${urlId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch analytics');
  }
}

};
