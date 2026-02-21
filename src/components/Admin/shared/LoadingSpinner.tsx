"use client";

import { FiMail, FiUsers, FiFileText, FiMapPin, FiBookOpen, FiBarChart2, FiSettings } from 'react-icons/fi';

interface LoadingSpinnerProps {
  message?: string;
  icon?: 'mail' | 'users' | 'file' | 'map' | 'book' | 'chart' | 'settings';
}

const iconMap = {
  mail: FiMail,
  users: FiUsers,
  file: FiFileText,
  map: FiMapPin,
  book: FiBookOpen,
  chart: FiBarChart2,
  settings: FiSettings,
};

export default function LoadingSpinner({ message = "Chargement...", icon = 'mail' }: LoadingSpinnerProps) {
  const Icon = iconMap[icon];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
          <Icon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-green-600 animate-pulse" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
