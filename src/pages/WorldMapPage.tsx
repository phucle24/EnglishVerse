import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { getWorkflowState, getLocationProgress as getWorkflowLocationProgress } from '@/lib/workflow';
import { MapPin, Plane, Hotel, Utensils } from 'lucide-react';
import Header from '@/components/Header';

interface Location {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  skills: string[];
}

// Mock data for locations
const LOCATIONS: Location[] = [
  {
    id: 'restaurant',
    name: 'Nhà hàng',
    description: 'Giao tiếp trong nhà hàng và đặt món',
    icon: <Utensils className="w-6 h-6" />,
    position: { x: 30, y: 40 },
    skills: ['Giao tiếp tại nhà hàng', 'Đặt món', 'Thanh toán']
  },
  {
    id: 'airport',
    name: 'Sân bay',
    description: 'Học tiếng Anh trong môi trường sân bay quốc tế',
    icon: <Plane className="w-6 h-6" />,
    position: { x: 50, y: 30 },
    skills: ['Check-in', 'Hải quan', 'Hướng dẫn sân bay']
  },
  {
    id: 'hotel',
    name: 'Khách sạn',
    description: 'Đặt phòng và giao tiếp với nhân viên khách sạn',
    icon: <Hotel className="w-6 h-6" />,
    position: { x: 70, y: 35 },
    skills: ['Đặt phòng', 'Dịch vụ khách sạn', 'Thanh toán']
  }
];

const WorldMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({ completed: 0, total: LOCATIONS.length });
  const [locationProgress, setLocationProgress] = useState<Record<string, number>>({});
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  useEffect(() => {
    // Initialize progress for each location using workflow state
    const progress: Record<string, number> = {};
    LOCATIONS.forEach(location => {
      const locationWorkflowProgress = getWorkflowLocationProgress(location.id);
      progress[location.id] = locationWorkflowProgress;
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

  const completionPercentage = Math.round((progress.completed / progress.total) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <div className="max-w-6xl mx-auto p-4">
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
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-3 sm:p-6 relative aspect-[4/3] overflow-hidden">
            <div className="absolute inset-0">
              {/* Fantasy Map Background - CSS Gradient instead of image */}
              <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-100 opacity-90 relative">
                {/* Additional map-like decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-40 blur-sm"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-50 blur-sm"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 blur-sm"></div>
                <div className="absolute bottom-10 right-10 w-18 h-18 bg-yellow-200 rounded-full opacity-40 blur-sm"></div>
                
                {/* Map grid lines for authentic look */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-gray-400"></div>
                    ))}
                  </div>
                </div>
                
                {/* Decorative compass */}
                <div className="absolute top-4 right-4 w-8 h-8 sm:w-12 sm:h-12 text-gray-600 opacity-30">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>

              {/* Location Markers */}
              {LOCATIONS.map((location) => (
                <motion.div
                  key={location.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute"
                  style={{
                    left: `${location.position.x}%`,
                    top: `${location.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <motion.button
                    onClick={() => handleLocationClick(location.id)}
                    onMouseEnter={() => setHoveredLocation(location.id)}
                    onMouseLeave={() => setHoveredLocation(null)}
                    className={`relative group p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 min-h-[56px] min-w-[56px] sm:min-h-[64px] sm:min-w-[64px] flex items-center justify-center ${
                      locationProgress[location.id] === 100
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : locationProgress[location.id] > 0
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl">
                      {location.icon}
                    </div>
                    {locationProgress[location.id] === 100 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm border-2 border-white"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Tooltip - Hidden on mobile, shown on hover for desktop */}
                  <AnimatePresence>
                    {hoveredLocation === location.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-xl p-3 sm:p-4 z-10 hidden sm:block"
                      >
                        <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">{location.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{location.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {location.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Progress Sidebar */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Locations</h2>
            <div className="space-y-3 sm:space-y-4">
              {LOCATIONS.map((location) => (
                <motion.div
                  key={location.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-blue-500 active:border-blue-600 transition-colors cursor-pointer min-h-[80px] sm:min-h-[auto]"
                  onClick={() => handleLocationClick(location.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="text-lg sm:text-xl flex-shrink-0">{location.icon}</div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">{location.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{location.description}</p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 font-medium">
                      {locationProgress[location.id] || 0}%
                    </span>
                  </div>
                  <Progress value={locationProgress[location.id] || 0} className="h-2" />
                  
                  {/* Mobile-only skills tags */}
                  <div className="flex flex-wrap gap-1 mt-2 sm:hidden">
                    {location.skills.slice(0, 2).map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {location.skills.length > 2 && (
                      <span className="text-xs text-gray-500">+{location.skills.length - 2}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Mobile Call-to-Action */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 sm:hidden">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">💡 Gợi ý</h3>
              <p className="text-xs text-gray-600">Nhấn vào các địa điểm trên bản đồ hoặc danh sách để bắt đầu học!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMapPage;
