import { getAvatarState } from './avatar';
import { getWorkflowState, updateAvatar } from './workflow';

interface User {
  email: string;
  name: string;
  role: string;
  avatar: string;
}

const USER_STORAGE_KEY = 'user';

// Get user with synchronized avatar
export const getUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (!userJson) return null;
    
    const user = JSON.parse(userJson);
    if (!user || !user.name) return null;

    // Sync avatar from avatar state or workflow state
    let avatarUrl = user.avatar;
    
    // Try to get avatar from workflow state first
    const workflowState = getWorkflowState();
    if (workflowState.avatar.customImage) {
      avatarUrl = workflowState.avatar.customImage;
    } else {
      // Fallback to avatar state
      const avatarState = getAvatarState();
      if (avatarState.customImage) {
        avatarUrl = avatarState.customImage;
      } else {
        avatarUrl = `/avatars/preview/${avatarState.gender}/${avatarState.face}.png`;
      }
    }

    return {
      ...user,
      avatar: avatarUrl || 'https://ugc.same-assets.com/7zP4_sZbv34rMijHgssmeEzsEDxkK-cw.jpeg'
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Save user data
export const saveUser = (user: User) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// Update user avatar and sync with workflow state
export const updateUserAvatar = (avatarUrl: string) => {
  try {
    const user = getUser();
    if (user) {
      user.avatar = avatarUrl;
      saveUser(user);
      
      // Also update workflow state with custom image
      const workflowState = getWorkflowState();
      workflowState.avatar.customImage = avatarUrl;
      updateAvatar(workflowState.avatar);
    }
  } catch (error) {
    console.error('Error updating user avatar:', error);
  }
};

// Sync avatar from avatar state to user state
export const syncAvatarToUser = () => {
  try {
    const user = getUser();
    if (!user) return;

    const avatarState = getAvatarState();
    let avatarUrl = user.avatar;

    if (avatarState.customImage) {
      avatarUrl = avatarState.customImage;
    } else {
      avatarUrl = `/avatars/preview/${avatarState.gender}/${avatarState.face}.png`;
    }

    // Update user and workflow state
    updateUserAvatar(avatarUrl);
  } catch (error) {
    console.error('Error syncing avatar:', error);
  }
}; 