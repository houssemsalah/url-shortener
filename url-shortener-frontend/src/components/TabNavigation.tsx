import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../stores/urlSlice.ts';
import { RootState } from '../stores/reduxStore.ts';

const TabNavigation = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.url.activeTab);

  return (
    <div className="flex border-b">
      {['shorten', 'history'].map((tab) => (
        <button
          key={tab}
          onClick={() => dispatch(setActiveTab(tab as 'shorten' | 'history'))}
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === tab
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)} URL
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
