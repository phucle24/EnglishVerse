interface WorkflowState {
  avatar: {
    face: string;
    hair: string;
    clothes: string;
    gender: 'male' | 'female';
    customImage?: string;
  };
  currentLocation: string | null;
  chatProgress: {
    [locationId: string]: {
      completed: boolean;
      score: number;
    };
  };
  flashcardProgress: {
    [locationId: string]: {
      completed: boolean;
      rememberedCards: number[];
    };
  };
}

const WORKFLOW_KEY = 'workflowState';

// Get workflow state
export const getWorkflowState = (): WorkflowState => {
  try {
    const stored = localStorage.getItem(WORKFLOW_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading workflow state:', error);
  }
  
  // Default state
  return {
    avatar: {
      face: 'face1',
      hair: 'hair1',
      clothes: 'clothes1',
      gender: 'male',
    },
    currentLocation: null,
    chatProgress: {},
    flashcardProgress: {}
  };
};

// Save workflow state
export const saveWorkflowState = (state: WorkflowState) => {
  try {
    localStorage.setItem(WORKFLOW_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving workflow state:', error);
  }
};

// Update avatar
export const updateAvatar = (avatar: WorkflowState['avatar']) => {
  const state = getWorkflowState();
  state.avatar = avatar;
  saveWorkflowState(state);
};

// Set current location
export const setCurrentLocation = (locationId: string) => {
  const state = getWorkflowState();
  state.currentLocation = locationId;
  saveWorkflowState(state);
};

// Update chat progress
export const updateChatProgress = (locationId: string, completed: boolean, score: number) => {
  const state = getWorkflowState();
  state.chatProgress[locationId] = { completed, score };
  saveWorkflowState(state);
};

// Update flashcard progress
export const updateFlashcardProgress = (locationId: string, rememberedCards: number[]) => {
  const state = getWorkflowState();
  const totalCards = 10; // Assuming 10 cards per location
  const progress = (rememberedCards.length / totalCards) * 100;
  
  state.flashcardProgress[locationId] = {
    completed: progress === 100,
    rememberedCards
  };
  saveWorkflowState(state);
};

// Check if location is completed
export const isLocationCompleted = (locationId: string): boolean => {
  const state = getWorkflowState();
  const chatProgress = state.chatProgress[locationId];
  const flashcardProgress = state.flashcardProgress[locationId];
  
  return (
    chatProgress?.completed === true &&
    flashcardProgress?.completed === true
  );
};

// Get location progress
export const getLocationProgress = (locationId: string): number => {
  const state = getWorkflowState();
  const chatProgress = state.chatProgress[locationId];
  const flashcardProgress = state.flashcardProgress[locationId];
  
  if (!chatProgress && !flashcardProgress) return 0;
  
  let progress = 0;
  if (chatProgress?.completed) progress += 50;
  
  // Calculate flashcard progress
  if (flashcardProgress) {
    const totalCards = 10; // Assuming 10 cards per location
    const flashcardProgressPercentage = (flashcardProgress.rememberedCards.length / totalCards) * 50;
    progress += flashcardProgressPercentage;
  }
  
  return progress;
}; 