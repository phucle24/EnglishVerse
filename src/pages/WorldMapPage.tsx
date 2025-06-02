import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { getJourneyProgress, getLocationProgress, getCompletionPercentage } from '@/lib/journey-progress';

interface Location {
  id: string;
  name: string;
  description: string;
  icon: string;
  position: { x: number; y: number };
  skills: string[];
}

// Mock data for locations
const LOCATIONS: Location[] = [
  {
    id: 'restaurant',
    name: 'Nhà hàng',
    description: 'Giao tiếp trong nhà hàng và đặt món',
    icon: '🍽️',
    position: { x: 30, y: 40 },
    skills: ['Giao tiếp tại nhà hàng', 'Đặt món', 'Thanh toán']
  },
  {
    id: 'airport',
    name: 'Sân bay',
    description: 'Học tiếng Anh trong môi trường sân bay quốc tế',
    icon: '✈️',
    position: { x: 50, y: 30 },
    skills: ['Check-in', 'Hải quan', 'Hướng dẫn sân bay']
  },
  {
    id: 'hotel',
    name: 'Khách sạn',
    description: 'Đặt phòng và giao tiếp với nhân viên khách sạn',
    icon: '🏨',
    position: { x: 70, y: 35 },
    skills: ['Đặt phòng', 'Dịch vụ khách sạn', 'Thanh toán']
  }
];

const WorldMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({ completed: 0, total: LOCATIONS.length });
  const [locationProgress, setLocationProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initialize progress for each location
    const progress: Record<string, number> = {};
    LOCATIONS.forEach(location => {
      const locationData = getLocationProgress(location.id);
      progress[location.id] = getCompletionPercentage(
        locationData.completedLessons,
        locationData.totalLessons
      );
    });
    setLocationProgress(progress);

    // Calculate overall progress
    const completedCount = Object.values(progress).filter(p => p === 100).length;
    setProgress({
      completed: completedCount,
      total: LOCATIONS.length
    });
  }, []);

  const handleLocationClick = (locationId: string) => {
    navigate(`/chat/${locationId}`);
  };

  const completionPercentage = getCompletionPercentage(progress.completed, progress.total);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">World Map</h1>
          <div className="flex items-center gap-4">
            <Progress value={completionPercentage} className="flex-1" />
            <span className="text-sm font-medium text-gray-600">
              {completionPercentage}% Complete
            </span>
          </div>
        </div>

        {/* Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 relative aspect-[4/3]">
            <div className="absolute inset-0 p-6">
              {/* Map Image */}
              <img
                src="/images/world-map.png"
                alt="World Map"
                className="w-full h-full object-contain"
              />

              {/* Location Markers */}
              {LOCATIONS.map((location) => (
                <motion.button
                  key={location.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => handleLocationClick(location.id)}
                  className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg transition-transform hover:scale-110 ${
                    locationProgress[location.id] === 100
                      ? 'bg-green-500/20'
                      : locationProgress[location.id] > 0
                      ? 'bg-yellow-500/20'
                      : 'bg-blue-500/20'
                  }`}
                  style={{
                    left: `${location.position.x}%`,
                    top: `${location.position.y}%`
                  }}
                >
                  {location.icon}
                  {locationProgress[location.id] === 100 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Progress Sidebar */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Locations</h2>
            <div className="space-y-4">
              {LOCATIONS.map((location) => (
                <div
                  key={location.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => handleLocationClick(location.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-800">{location.name}</h3>
                      <p className="text-sm text-gray-500">{location.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {locationProgress[location.id] || 0}%
                    </span>
                  </div>
                  <Progress value={locationProgress[location.id] || 0} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMapPage;
