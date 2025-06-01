// Instructions: Chuyển card hành trình thành thẻ <button> thay cho div có role button và tabindex.

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getJourneyProgress } from '@/lib/journey-progress';

interface Journey {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  totalLocations: number;
}

const JOURNEYS: Journey[] = [
  {
    id: 'cultural-city',
    title: 'Phiêu lưu thành phố đa văn hoá',
    description: 'Khám phá và giao tiếp trong môi trường đa văn hóa của thành phố quốc tế',
    icon: '🌆',
    image: '/journeys/cultural-city.jpg',
    totalLocations: 5
  },
  {
    id: 'business-startup',
    title: 'Khởi nghiệp kinh doanh nước ngoài',
    description: 'Học cách giao tiếp và đàm phán trong môi trường kinh doanh quốc tế',
    icon: '💼',
    image: '/journeys/business-startup.jpg',
    totalLocations: 4
  },
  {
    id: 'airport-adventure',
    title: 'Khám phá sân bay quốc tế',
    description: 'Trải nghiệm và học cách giao tiếp tại sân bay quốc tế',
    icon: '✈️',
    image: '/journeys/airport.jpg',
    totalLocations: 3
  }
];

const JourneySelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [journeyProgress, setJourneyProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load progress for each journey
    const progress: Record<string, number> = {};
    JOURNEYS.forEach(journey => {
      const journeyData = getJourneyProgress(journey.id);
      progress[journey.id] = (journeyData.completedLocations.length / journey.totalLocations) * 100;
    });
    setJourneyProgress(progress);
  }, []);

  const handleJourneySelect = (journeyId: string) => {
    // Save selected journey to localStorage
    localStorage.setItem('selectedJourney', journeyId);
    // Navigate to world map
    navigate('/world-map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Chọn Hành Trình Của Bạn
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Khám phá và học tiếng Anh qua các tình huống thực tế
          </p>
        </motion.div>

        {/* Journey Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {JOURNEYS.map((journey) => (
            <motion.div
              key={journey.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer"
              onClick={() => handleJourneySelect(journey.id)}
            >
              <div className="relative h-48">
                <img
                  src={journey.image}
                  alt={journey.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 text-4xl">
                  {journey.icon}
                </div>
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${journeyProgress[journey.id] || 0}%` }}
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {journey.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {journey.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{journey.totalLocations} khu vực</span>
                  <span>{Math.round(journeyProgress[journey.id] || 0)}% hoàn thành</span>
                </div>
              </div>
            </motion.div>
          ))}
          
        </div>
      </div>
    </div>
  );
};

export default JourneySelectionPage;
