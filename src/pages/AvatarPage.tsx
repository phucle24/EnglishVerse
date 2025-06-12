import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { saveAvatarState } from '@/lib/avatar';
import { updateAvatar } from '@/lib/workflow';
import { updateUserAvatar } from '@/lib/user';

// Types
interface AvatarOption {
  id: string;
  name: string;
  icon: string;
  preview: string;
}

interface AvatarState {
  face: string;
  hair: string;
  clothes: string;
  gender: 'male' | 'female';
  customImage?: string;
}

// Mock data
const FACES: AvatarOption[] = [
  { id: 'face1', name: 'Round Face', icon: '👶', preview: '/avatars/faces/round.png' },
  { id: 'face2', name: 'Oval Face', icon: '👨', preview: '/avatars/faces/oval.png' },
  { id: 'face3', name: 'Square Face', icon: '👩', preview: '/avatars/faces/square.png' },
];

const HAIRSTYLES: AvatarOption[] = [
  { id: 'hair1', name: 'Short Hair', icon: '💇‍♂️', preview: '/avatars/hair/short.png' },
  { id: 'hair2', name: 'Long Hair', icon: '💇‍♀️', preview: '/avatars/hair/long.png' },
  { id: 'hair3', name: 'Curly Hair', icon: '👨‍🦱', preview: '/avatars/hair/curly.png' },
];

const CLOTHES: AvatarOption[] = [
  { id: 'clothes1', name: 'Casual', icon: '👕', preview: '/avatars/clothes/casual.png' },
  { id: 'clothes2', name: 'Formal', icon: '👔', preview: '/avatars/clothes/formal.png' },
  { id: 'clothes3', name: 'Sport', icon: '🎽', preview: '/avatars/clothes/sport.png' },
];

const AvatarPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarState, setAvatarState] = useState<AvatarState>({
    face: 'face1',
    hair: 'hair1',
    clothes: 'clothes1',
    gender: 'male',
  });
  const [activeTab, setActiveTab] = useState('face');
  const [isCustomImage, setIsCustomImage] = useState(false);

  // Handle option selection
  const handleOptionSelect = (category: keyof AvatarState, value: string) => {
    setAvatarState(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Handle gender toggle
  const handleGenderToggle = () => {
    setAvatarState(prev => ({
      ...prev,
      gender: prev.gender === 'male' ? 'female' : 'male'
    }));
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarState(prev => ({
          ...prev,
          customImage: e.target?.result as string
        }));
        setIsCustomImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle remove custom image
  const handleRemoveCustomImage = () => {
    setAvatarState(prev => ({
      ...prev,
      customImage: undefined
    }));
    setIsCustomImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle save
  const handleSave = () => {
    // Save to all avatar systems
    saveAvatarState(avatarState);
    
    // Update workflow state
    updateAvatar(avatarState);
    
    // Update user avatar if custom image is uploaded
    if (avatarState.customImage) {
      updateUserAvatar(avatarState.customImage);
    } else {
      // Generate avatar URL for standard avatar
      const avatarUrl = `/avatars/preview/${avatarState.gender}/${avatarState.face}.png`;
      updateUserAvatar(avatarUrl);
    }
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Navigate to next page
    navigate('/journeys');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Create Your Avatar
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your character to start your learning journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:max-w-5xl mx-auto">
          {/* Avatar Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {avatarState.customImage ? (
                <img
                  src={avatarState.customImage}
                  alt="Custom Avatar"
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={`/avatars/preview/${avatarState.gender}/${avatarState.face}.png`}
                  alt="Avatar Preview"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Image Upload Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {!isCustomImage ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Upload Image
                </button>
              ) : (
                <button
                  onClick={handleRemoveCustomImage}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove Image
                </button>
              )}
            </div>
          </motion.div>

          {/* Customization Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 gap-2 mb-6">
                <TabsTrigger value="face">Face</TabsTrigger>
                <TabsTrigger value="hair">Hair</TabsTrigger>
                <TabsTrigger value="clothes">Clothes</TabsTrigger>
              </TabsList>

              <TabsContent value="face">
                <div className="grid grid-cols-3 gap-4">
                  {FACES.map(face => (
                    <motion.button
                      key={face.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOptionSelect('face', face.id)}
                      disabled={isCustomImage}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        avatarState.face === face.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } ${isCustomImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="text-4xl mb-2">{face.icon}</div>
                      <div className="text-sm font-medium">{face.name}</div>
                    </motion.button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="hair">
                <div className="grid grid-cols-3 gap-4">
                  {HAIRSTYLES.map(hair => (
                    <motion.button
                      key={hair.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOptionSelect('hair', hair.id)}
                      disabled={isCustomImage}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        avatarState.hair === hair.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } ${isCustomImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="text-4xl mb-2">{hair.icon}</div>
                      <div className="text-sm font-medium">{hair.name}</div>
                    </motion.button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="clothes">
                <div className="grid grid-cols-3 gap-4">
                  {CLOTHES.map(clothes => (
                    <motion.button
                      key={clothes.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOptionSelect('clothes', clothes.id)}
                      disabled={isCustomImage}
                      className={`p-4 rounded-xl border-2 transition-colors ${
                        avatarState.clothes === clothes.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      } ${isCustomImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="text-4xl mb-2">{clothes.icon}</div>
                      <div className="text-sm font-medium">{clothes.name}</div>
                    </motion.button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Gender Control */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Gender</span>
                <button
                  onClick={handleGenderToggle}
                  disabled={isCustomImage}
                  className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                    isCustomImage ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {avatarState.gender === 'male' ? '👨' : '👩'}
                </button>
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="w-full mt-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              Save & Continue
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarPage;
