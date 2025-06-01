// Instructions: Chuyển card hành trình thành thẻ <button> thay cho div có role button và tabindex.

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Lock, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserProgress, getJourneyProgress, isLocationUnlocked } from "@/lib/progress";
import { getWorkflowState, setCurrentLocation, getLocationProgress } from "@/lib/workflow";

// Types
interface Location {
  id: string;
  name: string;
  description: string;
  icon: string;
  position: { x: number; y: number };
  status: "locked" | "unlocked" | "completed";
  progress: number;
  xp: number;
  requiredLevel: number;
}

interface UserProgress {
  level: number;
  xp: number;
  completedLocations: string[];
  currentStreak: number;
  badges: string[];
}

// Mock data
const LOCATIONS: Location[] = [
  {
    id: "airport",
    name: "Sân bay quốc tế",
    description: "Học tiếng Anh trong môi trường sân bay quốc tế",
    icon: "✈️",
    position: { x: 20, y: 30 },
    status: "unlocked",
    progress: 0,
    xp: 100,
    requiredLevel: 1
  },
  {
    id: "restaurant",
    name: "Nhà hàng",
    description: "Giao tiếp trong nhà hàng và đặt món",
    icon: "🍽️",
    position: { x: 50, y: 40 },
    status: "locked",
    progress: 0,
    xp: 150,
    requiredLevel: 2
  },
  {
    id: "hotel",
    name: "Khách sạn",
    description: "Đặt phòng và giao tiếp với nhân viên khách sạn",
    icon: "🏨",
    position: { x: 80, y: 35 },
    status: "locked",
    progress: 0,
    xp: 200,
    requiredLevel: 3
  }
];

// Helper to get user info
function getUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.name) return null;
    const avatar = user.avatar || 'https://ugc.same-assets.com/7zP4_sZbv34rMijHgssmeEzsEDxkK-cw.jpeg';
    return { ...user, avatar };
  } catch {
    return null;
  }
}

export default function JourneySelectionPage() {
  const navigate = useNavigate();
  const user = getUser();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [userProgress, setUserProgress] = useState(getUserProgress());
  const [journeyProgress, setJourneyProgress] = useState(getJourneyProgress());
  const [workflowState, setWorkflowState] = useState(getWorkflowState());

  // Update progress when component mounts
  useEffect(() => {
    setUserProgress(getUserProgress());
    setJourneyProgress(getJourneyProgress());
    setWorkflowState(getWorkflowState());
  }, []);

  // Handle location selection
  const handleLocationClick = (location: Location) => {
    if (!isLocationUnlocked(location.id, location.requiredLevel)) {
      // Show locked message
      return;
    }
    setSelectedLocation(location);
    setShowTooltip(true);
  };

  // Handle journey start
  const handleStartJourney = (locationId: string) => {
    setCurrentLocation(locationId);
    navigate(`/chat/${locationId}`);
  };

  // Calculate progress
  const totalProgress = (userProgress.completedLocations.length / LOCATIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('/images/map-bg.jpg')] bg-cover bg-center opacity-10" />

      {/* User Profile Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-lg flex items-center gap-4">
          <img src={user?.avatar} alt={user?.name} className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-sm text-gray-600">Level {userProgress.level} • {userProgress.xp} XP</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">{userProgress.badges.length} Badges</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">{userProgress.currentStreak} Day Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="max-w-7xl mx-auto">
        <div className="relative aspect-[16/9] bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
          {/* Map SVG */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Map Background */}
            <rect width="100" height="100" fill="url(#mapGradient)" />
            
            {/* Location Markers */}
            {LOCATIONS.map((location) => {
              const isUnlocked = isLocationUnlocked(location.id, location.requiredLevel);
              const locationProgress = getLocationProgress(location.id);
              
              return (
                <g
                  key={location.id}
                  className="cursor-pointer transform hover:scale-110 transition-transform"
                  onClick={() => handleLocationClick(location)}
                >
                  <motion.circle
                    cx={location.position.x}
                    cy={location.position.y}
                    r="3"
                    fill={locationProgress === 100 ? "#22c55e" : isUnlocked ? "#3b82f6" : "#94a3b8"}
                    className="hover:animate-pulse"
                    whileHover={{ scale: 1.2 }}
                  />
                  <text
                    x={location.position.x}
                    y={location.position.y - 4}
                    textAnchor="middle"
                    className="text-2xl"
                  >
                    {location.icon}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Location Tooltip */}
          <AnimatePresence>
            {showTooltip && selectedLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-4 left-4 right-4 md:absolute md:bottom-auto md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-4 md:p-6 shadow-xl md:max-w-sm w-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{selectedLocation.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{selectedLocation.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedLocation.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative w-full overflow-hidden rounded-full bg-primary/20 h-2">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${getLocationProgress(selectedLocation.id)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{getLocationProgress(selectedLocation.id)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">{selectedLocation.xp} XP</span>
                  </div>
                  <button
                    onClick={() => handleStartJourney(selectedLocation.id)}
                    disabled={!isLocationUnlocked(selectedLocation.id, selectedLocation.requiredLevel)}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-9 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {!isLocationUnlocked(selectedLocation.id, selectedLocation.requiredLevel) ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Level {selectedLocation.requiredLevel}
                      </>
                    ) : getLocationProgress(selectedLocation.id) === 100 ? (
                      'Xem lại'
                    ) : (
                      'Bắt đầu'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Sidebar */}
        <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Tiến độ học tập</h3>
          <div className="space-y-4">
            {LOCATIONS.map((location) => (
              <div key={location.id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {location.status === "completed" ? (
                    <span className="text-green-500">✅</span>
                  ) : location.status === "unlocked" ? (
                    <span className="text-yellow-500">🟡</span>
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{location.name}</span>
                    <span className="text-xs text-gray-500">{location.progress}%</span>
                  </div>
                  <Progress value={location.progress} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
