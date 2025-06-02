// Types
export interface JourneyProgress {
  journeyId: string;
  completedLocations: string[];
  totalLocations: number;
}

export interface LocationProgress {
  locationId: string;
  completedLessons: number;
  totalLessons: number;
}

// Helper functions
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
    totalLessons: 0
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
  totalLessons: number
): void => {
  const progress: LocationProgress = {
    locationId,
    completedLessons,
    totalLessons
  };
  localStorage.setItem(`location_${locationId}_progress`, JSON.stringify(progress));
};

export const getCompletionPercentage = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}; 