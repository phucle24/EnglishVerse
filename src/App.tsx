// Instructions: Cấu hình React Router cho tất cả các page vừa tạo, gom flow Onboarding, WorldMap, Chat, Flashcard đầy đủ.

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AvatarPage from './pages/AvatarPage';
import JourneySelectionPage from './pages/JourneySelectionPage';
import WorldMapPage from './pages/WorldMapPage';
import ChatPage from './pages/ChatPage';
import FlashcardPage from './pages/FlashcardPage';
import TestPage from './pages/TestPage';
import DashboardPage from './pages/DashboardPage';
import AdminLayout from './pages/admin/layout';
import JourneysPage from './pages/admin/journeys/page';
import AreasPage from './pages/admin/areas/page';
import ChatScriptsPage from './pages/admin/chat-scripts/page';
import FlashcardsPage from './pages/admin/flashcards/page';
import UsersPage from './pages/admin/users/page';


// Mock data for demonstration
const mockUser = {
  username: "John Doe",
  avatar: "/avatars/default.png",
  currentJourney: "City Adventure",
  completedAreas: 2,
  totalAreas: 5,
  xp: 150,
  badges: ["First Chat", "Vocabulary Master"],
};

const mockJourneys = [
  {
    id: "1",
    title: "City Adventure",
    description: "Learn English through city exploration",
    icon: "/icons/city.png",
    totalAreas: 5,
    completedAreas: 2,
    isLocked: false,
  },
  {
    id: "2",
    title: "Business English",
    description: "Master business communication",
    icon: "/icons/business.png",
    totalAreas: 4,
    completedAreas: 0,
    isLocked: false,
  },
  {
    id: "3",
    title: "Travel English",
    description: "Essential phrases for travelers",
    icon: "/icons/travel.png",
    totalAreas: 3,
    completedAreas: 0,
    isLocked: true,
  },
];

const mockAreas = [
  {
    id: "1",
    name: "Restaurant",
    description: "Order food and chat with staff",
    icon: "/icons/restaurant.png",
    position: { x: 20, y: 30 },
    isUnlocked: true,
    skills: ["Ordering", "Small Talk"],
    completed: true,
  },
  {
    id: "2",
    name: "Airport",
    description: "Navigate through the airport",
    icon: "/icons/airport.png",
    position: { x: 50, y: 40 },
    isUnlocked: true,
    skills: ["Check-in", "Security"],
    completed: true,
  },
  {
    id: "3",
    name: "Hotel",
    description: "Check-in and room service",
    icon: "/icons/hotel.png",
    position: { x: 80, y: 30 },
    isUnlocked: false,
    skills: ["Booking", "Complaints"],
    completed: false,
  },
];

const mockMessages = [
  {
    id: "1",
    sender: "A",
    content: "Hello! Welcome to our restaurant.",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    sender: "B",
    content: "Thank you! I'd like to see the menu, please.",
    timestamp: "10:01 AM",
  },
  {
    id: "3",
    sender: "A",
    content: "Here's our menu. Would you like to try our special dish?",
    timestamp: "10:02 AM",
  },
];

const mockFlashcards = [
  {
    id: "1",
    front: "Reservation",
    back: {
      meaning: "An arrangement to have something held for someone",
      example: "I'd like to make a reservation for two at 7 PM.",
      audioUrl: "/audio/reservation.mp3",
    },
    isMemorized: false,
  },
  {
    id: "2",
    front: "Appetizer",
    back: {
      meaning: "A small dish served before the main course",
      example: "Would you like to order an appetizer while you wait?",
      audioUrl: "/audio/appetizer.mp3",
    },
    isMemorized: false,
  },
];

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Main App Routes */}
          <Route path="/avatar" element={<AvatarPage />} />
          <Route path="/journeys" element={<JourneySelectionPage />} />
          <Route path="/world-map" element={<WorldMapPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat/:locationId" element={<ChatPage />} />
          <Route path="/flashcards/:locationId" element={<FlashcardPage />} />
          
          {/* Test Route */}
          <Route path="/test" element={<TestPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="journeys" replace />} />
            <Route path="journeys" element={<JourneysPage />} />
            <Route path="areas" element={<AreasPage />} />
            <Route path="chat-scripts" element={<ChatScriptsPage />} />
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
