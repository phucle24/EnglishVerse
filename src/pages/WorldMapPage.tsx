import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Trophy, CheckCircle2 } from 'lucide-react';
import {
  getJourneyProgress,
  getLocationProgress,
  isLocationUnlocked,
  getCompletionPercentage
} from '@/lib/journey-progress';

interface Location {
  id: string;
  name: string;
  description: string;
  icon: string;
  position: { x: number; y: number };
  status: 'locked' | 'unlocked' | 'completed';
  requiredProgress: number;
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
    status: 'unlocked',
    requiredProgress: 0,
    skills: ['Giao tiếp tại nhà hàng', 'Đặt món', 'Thanh toán']
  },
  {
    id: 'airport',
    name: 'Sân bay',
    description: 'Học tiếng Anh trong môi trường sân bay quốc tế',
    icon: '✈️',
    position: { x: 50, y: 30 },
    status: 'locked',
    requiredProgress: 100,
    skills: ['Check-in', 'Hải quan', 'Hướng dẫn sân bay']
  },
  {
    id: 'hotel',
    name: 'Khách sạn',
    description: 'Đặt phòng và giao tiếp với nhân viên khách sạn',
    icon: '🏨',
    position: { x: 70, y: 35 },
    status: 'locked',
    requiredProgress: 200,
    skills: ['Đặt phòng', 'Dịch vụ khách sạn', 'Thanh toán']
  }
];

const WorldMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [journeyId, setJourneyId] = useState<string>('');
  const [progress, setProgress] = useState({
    completed: 0,
    total: LOCATIONS.length
  });
  const [locationProgress, setLocationProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    // Get selected journey from localStorage
    const selectedJourney = localStorage.getItem('selectedJourney');
    if (selectedJourney) {
      setJourneyId(selectedJourney);
      const journeyProgress = getJourneyProgress(selectedJourney);
      setProgress({
        completed: journeyProgress.completedLocations.length,
        total: journeyProgress.totalLocations || LOCATIONS.length
      });

      // Load progress for each location
      const progress: Record<string, number> = {};
      LOCATIONS.forEach(location => {
        const locationData = getLocationProgress(location.id);
        progress[location.id] = (locationData.completedLessons / locationData.totalLessons) * 100 || 0;
      });
      setLocationProgress(progress);
    }
  }, []);

  // Handle location click
  const handleLocationClick = (location: Location) => {
    if (location.status === 'locked') return;
    setSelectedLocation(location);
    setShowTooltip(true);
  };

  // Handle location start
  const handleStartLocation = (locationId: string) => {
    navigate(`/location/${locationId}`);
  };

  // Calculate completion percentage
  const completionPercentage = getCompletionPercentage(progress.completed, progress.total);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Bản đồ thế giới ảo
            </h1>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">
                {progress.completed}/{progress.total} khu vực
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Map */}
          <div className="lg:col-span-2 relative aspect-[16/9] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 bg-[url('/images/world-map.jpg')] bg-cover bg-center opacity-20" />

            {/* Location Markers */}
            {LOCATIONS.map((location) => (
              <motion.div
                key={location.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${location.position.x}%`,
                  top: `${location.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                whileHover={{ scale: 1.1 }}
                onClick={() => handleLocationClick(location)}
              >
                <div className={`text-4xl ${location.status === 'locked' ? 'opacity-50' : ''}`}>
                  {location.icon}
                </div>
                {location.status === 'locked' && (
                  <div className="absolute -top-2 -right-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Location Tooltip */}
            <AnimatePresence>
              {showTooltip && selectedLocation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl max-w-sm w-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{selectedLocation.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {selectedLocation.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedLocation.description}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kỹ năng chính:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartLocation(selectedLocation.id)}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Bắt đầu
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Sidebar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Tiến độ học tập
            </h2>
            <div className="space-y-4">
              {LOCATIONS.map((location) => (
                <div key={location.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {locationProgress[location.id] === 100 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : location.status === 'unlocked' ? (
                      <span className="text-yellow-500">🟡</span>
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {location.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(locationProgress[location.id] || 0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${locationProgress[location.id] || 0}%` }}
                      />
                    </div>
                  </div>
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
