import React from 'react';
import { GlobeAltIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: GlobeAltIcon,
    title: "Global Access",
    description: "Access your shortened URLs from anywhere in the world"
  },
  {
    icon: ChartBarIcon,
    title: "Usage Analytics",
    description: "Track clicks and engagement with detailed analytics"
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure & Reliable",
    description: "Enterprise-grade security and 99.9% uptime guarantee"
  }
];

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4">
      <Icon className="h-6 w-6 text-primary-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeatureCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
    {features.map((feature, index) => (
      <FeatureCard key={index} {...feature} />
    ))}
  </div>
);

export default FeatureCards;