interface UserProgress {
  level: number;
  xp: number;
  completedLocations: string[];
  currentStreak: number;
  badges: string[];
}

interface SimpleJourneyProgress {
  [locationId: string]: number;
}

export interface JourneyProgress {
  journeyId: string;
  completedLocations: string[];
  totalLocations: number;
}

export interface LocationProgress {
  locationId: string;
  completedLessons: number;
  totalLessons: number;
  isUnlocked: boolean;
}

const USER_PROGRESS_KEY = 'userProgress';
const SIMPLE_JOURNEY_PROGRESS_KEY = 'journeyProgress';

// Get user progress
export const getUserProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(USER_PROGRESS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading user progress:', error);
  }
  
  // Default progress
  return {
    level: 1,
    xp: 0,
    completedLocations: [],
    currentStreak: 0,
    badges: []
  };
};

// Save user progress
export const saveUserProgress = (progress: UserProgress) => {
  try {
    localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
};

// Get simple journey progress (for WorldMapPage)
export const getSimpleJourneyProgress = (): SimpleJourneyProgress => {
  try {
    const stored = localStorage.getItem(SIMPLE_JOURNEY_PROGRESS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading journey progress:', error);
  }
  return {};
};

// Save simple journey progress
export const saveSimpleJourneyProgress = (progress: SimpleJourneyProgress) => {
  try {
    localStorage.setItem(SIMPLE_JOURNEY_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving journey progress:', error);
  }
};

// Update location progress for WorldMapPage
export const updateSimpleLocationProgress = (locationId: string, progress: number) => {
  const journeyProgress = getSimpleJourneyProgress();
  journeyProgress[locationId] = progress;
  saveSimpleJourneyProgress(journeyProgress);

  // If progress is 100%, add to completed locations
  if (progress === 100) {
    const userProgress = getUserProgress();
    if (!userProgress.completedLocations.includes(locationId)) {
      userProgress.completedLocations.push(locationId);
      saveUserProgress(userProgress);
    }
  }
};

// Check if location is unlocked (simplified version)
export const isSimpleLocationUnlocked = (locationId: string, requiredLevel: number): boolean => {
  const userProgress = getUserProgress();
  const journeyProgress = getSimpleJourneyProgress();
  
  // If location is completed, it's unlocked
  if (userProgress.completedLocations.includes(locationId)) {
    return true;
  }

  // Check if user has required level
  if (userProgress.level < requiredLevel) {
    return false;
  }

  // Check if previous location is completed
  const locations = Object.keys(journeyProgress).sort();
  const currentIndex = locations.indexOf(locationId);
  
  if (currentIndex <= 0) {
    return true; // First location is always unlocked
  }

  const previousLocation = locations[currentIndex - 1];
  return journeyProgress[previousLocation] === 100;
};

// Helper functions for detailed journey tracking
export const getJourneyProgress = (journeyId: string): JourneyProgress => {
  const savedProgress = localStorage.getItem(`journey_${journeyId}_progress`);
  if (savedProgress) {
    return JSON.parse(savedProgress);
  }
  return {
    journeyId,
    completedLocations: [],
    totalLocations: 0
  };
};

export const getLocationProgress = (locationId: string): LocationProgress => {
  const savedProgress = localStorage.getItem(`location_${locationId}_progress`);
  if (savedProgress) {
    return JSON.parse(savedProgress);
  }
  return {
    locationId,
    completedLessons: 0,
    totalLessons: 0,
    isUnlocked: false
  };
};

export const updateJourneyProgress = (journeyId: string, locationId: string): void => {
  const progress = getJourneyProgress(journeyId);
  if (!progress.completedLocations.includes(locationId)) {
    progress.completedLocations.push(locationId);
    localStorage.setItem(`journey_${journeyId}_progress`, JSON.stringify(progress));
  }
};

export const updateLocationProgress = (
  locationId: string,
  completedLessons: number,
  totalLessons: number,
  isUnlocked: boolean
): void => {
  const progress: LocationProgress = {
    locationId,
    completedLessons,
    totalLessons,
    isUnlocked
  };
  localStorage.setItem(`location_${locationId}_progress`, JSON.stringify(progress));
};

export const isLocationUnlocked = (locationId: string): boolean => {
  const progress = getLocationProgress(locationId);
  return progress.isUnlocked;
};

export const getCompletionPercentage = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}; 