import React from 'react';

import { Toaster } from 'react-hot-toast';

import  Header  from '../components/Header.tsx';
import  TabNavigation  from '../components/TabNavigation.tsx';
import UrlForm from '../components/UrlForm.tsx';
import UrlHistory from '../components/UrlHistory.tsx';
import FeaturesCards from '../components/FeaturesCards.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/reduxStore.ts';

const MainContent = () => {
  const activeTab = useSelector((state: RootState) => state.url.activeTab);

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
      <TabNavigation />
      <div className="p-6">
        {activeTab === 'shorten' ? <UrlForm /> : <UrlHistory />}
      </div>
    </div>
  );
};

const UrlShortenerLayout = () => {
  return (

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full mx-auto space-y-8">
          <Header />
          <MainContent />
          <FeaturesCards />
        </div>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
  
  );
};

export default UrlShortenerLayout;