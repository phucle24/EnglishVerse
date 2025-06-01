interface AvatarState {
  face: string;
  hair: string;
  clothes: string;
  gender: 'male' | 'female';
  customImage?: string;
}

const AVATAR_STORAGE_KEY = 'avatarState';

export const getAvatarState = (): AvatarState => {
  const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    face: 'face1',
    hair: 'hair1',
    clothes: 'clothes1',
    gender: 'male',
  };
};

export const saveAvatarState = (state: AvatarState) => {
  localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(state));
};

export const getAvatarImage = (): string | undefined => {
  const state = getAvatarState();
  if (state.customImage) {
    return state.customImage;
  }
  return `/avatars/preview/${state.gender}/${state.face}.png`;
}; 