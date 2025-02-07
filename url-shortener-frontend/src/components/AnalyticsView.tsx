import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MapIcon, Phone, ClockIcon } from 'lucide-react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Api } from '../services/apiService.ts';

interface AnalyticsData {
  totalVisits: number;
  locations: Record<string, number>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
  timeStats: Record<string, number>;
}

const AnalyticsCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex items-center mb-4">
      <Icon className="h-5 w-5 text-primary-600 mr-2" />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

const AnalyticsView = ({ urlId }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await Api.getUrlAnalytics(urlId);

     setData(response);  } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [urlId]);

  if (loading) return <div className="text-center p-4">Loading analytics...</div>;
  if (!data) return <div className="text-center p-4">No analytics data available</div>;

  const timeData = Object.entries(data.timeStats).map(([hour, count]) => ({
    hour: `${hour}:00`,
    visits: count
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsCard title="Locations" icon={MapIcon}>
          <div className="space-y-2">
            {Object.entries(data.locations)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([location, count]) => (
                <div key={location} className="flex justify-between">
                  <span className="text-sm">{location.replace(':', ', ')}</span>
                  <span className="text-sm font-medium">{count} visits</span>
                </div>
              ))}
          </div>
        </AnalyticsCard>

        <AnalyticsCard title="Devices" icon={Phone}>
          <div className="space-y-2">
            {Object.entries(data.devices).map(([device, count]) => (
              <div key={device} className="flex justify-between">
                <span className="text-sm capitalize">{device}</span>
                <span className="text-sm font-medium">{count} visits</span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        <AnalyticsCard title="Browsers" icon={GlobeAltIcon}>
          <div className="space-y-2">
            {Object.entries(data.browsers).map(([browser, count]) => (
              <div key={browser} className="flex justify-between">
                <span className="text-sm">{browser}</span>
                <span className="text-sm font-medium">{count} visits</span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        <AnalyticsCard title="Visit Times" icon={ClockIcon}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timeData}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>
    </div>
  );
};
export default AnalyticsView;