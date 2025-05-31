// Instructions: Cấu hình React Router cho tất cả các page vừa tạo, gom flow Onboarding, WorldMap, Chat, Flashcard đầy đủ.

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AvatarPage from './pages/AvatarPage';
import JourneySelectionPage from './pages/JourneySelectionPage';
import WorldMapPage from './pages/WorldMapPage';
import ChatPage from './pages/ChatPage';
import FlashcardPage from './pages/FlashcardPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} /> {/* Stub chung cho MVP */}
        <Route path="/avatar" element={<AvatarPage />} />
        <Route path="/journeys" element={<JourneySelectionPage />} />
        <Route path="/map" element={<WorldMapPage />} />
        {/* areaId hiện hard-code là 1 vì chỉ demo area đầu, thực tế sẽ truyền param */}
        <Route path="/areas/:areaId/chat" element={<ChatPage />} />
        <Route path="/areas/:areaId/flashcards" element={<FlashcardPage />} />
      </Routes>
    </Router>
  );
}
