interface UserProgress {
  level: number;
  xp: number;
  completedLocations: string[];
  currentStreak: number;
  badges: string[];
}

interface JourneyProgress {
  [locationId: string]: number;
}

const USER_PROGRESS_KEY = 'userProgress';
const JOURNEY_PROGRESS_KEY = 'journeyProgress';

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

// Get journey progress
export const getJourneyProgress = (): JourneyProgress => {
  try {
    const stored = localStorage.getItem(JOURNEY_PROGRESS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading journey progress:', error);
  }
  return {};
};

// Save journey progress
export const saveJourneyProgress = (progress: JourneyProgress) => {
  try {
    localStorage.setItem(JOURNEY_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving journey progress:', error);
  }
};

// Update location progress
export const updateLocationProgress = (locationId: string, progress: number) => {
  const journeyProgress = getJourneyProgress();
  journeyProgress[locationId] = progress;
  saveJourneyProgress(journeyProgress);

  // If progress is 100%, add to completed locations
  if (progress === 100) {
    const userProgress = getUserProgress();
    if (!userProgress.completedLocations.includes(locationId)) {
      userProgress.completedLocations.push(locationId);
      saveUserProgress(userProgress);
    }
  }
};

// Check if location is unlocked
export const isLocationUnlocked = (locationId: string, requiredLevel: number): boolean => {
  const userProgress = getUserProgress();
  const journeyProgress = getJourneyProgress();
  
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