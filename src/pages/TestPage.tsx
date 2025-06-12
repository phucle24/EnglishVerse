import React, { useState, useEffect } from 'react';
import { getUser, updateUserAvatar } from '@/lib/user';
import { getWorkflowState, updateFlashcardProgress } from '@/lib/workflow';
import { getSimpleJourneyProgress } from '@/lib/progress';
import { Button } from '@/components/ui/button';

const TestPage: React.FC = () => {
  const [user, setUser] = useState(getUser());
  const [workflowState, setWorkflowState] = useState(getWorkflowState());
  const [journeyProgress, setJourneyProgress] = useState(getSimpleJourneyProgress());

  const refreshData = () => {
    setUser(getUser());
    setWorkflowState(getWorkflowState());
    setJourneyProgress(getSimpleJourneyProgress());
  };

  const testAvatarUpdate = () => {
    const testAvatarUrl = "https://via.placeholder.com/150/0000FF/FFFFFF?text=Test";
    updateUserAvatar(testAvatarUrl);
    refreshData();
  };

  const testFlashcardProgress = () => {
    // Simulate completing all 10 flashcards for restaurant location
    const rememberedCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    updateFlashcardProgress('restaurant', rememberedCards);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Page - Fixes Verification</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Avatar Sync Test</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold">Current User Avatar:</h3>
              {user?.avatar && (
                <img 
                  src={user.avatar} 
                  alt="User avatar" 
                  className="w-20 h-20 rounded-full mt-2 border"
                />
              )}
              <p className="text-sm text-gray-600 mt-1">
                {user?.avatar || 'No avatar set'}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">Workflow Avatar:</h3>
              <p className="text-sm text-gray-600">
                Custom Image: {workflowState.avatar.customImage ? 'Set' : 'Not set'}
              </p>
              <p className="text-sm text-gray-600">
                Generated: /avatars/preview/{workflowState.avatar.gender}/{workflowState.avatar.face}.png
              </p>
            </div>

            <Button onClick={testAvatarUpdate} className="w-full">
              Test Avatar Update
            </Button>
          </div>

          {/* Progress Test */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Progress Update Test</h2>
            
            <div className="mb-4">
              <h3 className="font-semibold">Journey Progress:</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                {JSON.stringify(journeyProgress, null, 2)}
              </pre>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold">Workflow Flashcard Progress:</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                {JSON.stringify(workflowState.flashcardProgress, null, 2)}
              </pre>
            </div>

            <Button onClick={testFlashcardProgress} className="w-full">
              Test Flashcard Completion (Restaurant)
            </Button>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Raw Data</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">User Data:</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Workflow State:</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(workflowState, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Journey Progress:</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(journeyProgress, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button 
            onClick={refreshData} 
            variant="outline"
            className="mr-4"
          >
            Refresh Data
          </Button>
          <Button 
            onClick={() => window.location.href = '/world-map'}
            variant="outline"
          >
            Go to World Map
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 