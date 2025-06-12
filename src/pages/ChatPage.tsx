import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play, Pause, ChevronRight, CheckCircle, RotateCcw, X } from "lucide-react";
import { getUser } from "@/lib/user";
import Header from "@/components/Header";
import { motion } from "framer-motion";

// Bot configuration
const BOT = {
  name: "Nhân viên",
  avatar: "https://ugc.same-assets.com/CDFkbAQAhmvkBzjgol89YK5kwQvnPSyR.jpeg",
};

// Location data
const LOCATIONS = {
  restaurant: {
    name: "Nhà hàng",
    description: "Giao tiếp trong nhà hàng và đặt món",
    scripts: [
      {
        id: "restaurant-basic",
        name: "Nhà hàng - Cơ bản",
        chat: [
          { role: "A", text: "Xin chào! Tôi muốn đặt bàn cho 2 người." },
          { role: "B", text: "Xin chào, bạn muốn ngồi ở khu vực nào?" },
          { role: "A", text: "Gần cửa sổ được không?" },
          { role: "B", text: "Dạ được ạ, mời bạn theo tôi." },
        ],
      },
      {
        id: "restaurant-friendly",
        name: "Nhà hàng - Thân thiện",
        chat: [
          { role: "A", text: "Chào buổi tối! Có bàn trống cho hai người không bạn?" },
          { role: "B", text: "Dĩ nhiên rồi! Bạn muốn ngồi gần cửa sổ hay quầy bar?" },
          { role: "A", text: "Mình thích gần cửa sổ hơn!" },
          { role: "B", text: "Ok, mời bạn theo mình!" },
        ],
      },
    ],
  },
  airport: {
    name: "Sân bay",
    description: "Học tiếng Anh trong môi trường sân bay quốc tế",
    scripts: [
      {
        id: "airport-checkin",
        name: "Check-in tại sân bay",
        chat: [
          { role: "A", text: "Good morning! I'd like to check in for my flight." },
          { role: "B", text: "Good morning! May I see your passport and ticket, please?" },
          { role: "A", text: "Here you are. I'd prefer a window seat if possible." },
          { role: "B", text: "I'll check for you. Would you like to check any bags?" },
        ],
      },
      {
        id: "airport-security",
        name: "An ninh sân bay",
        chat: [
          { role: "A", text: "Excuse me, where is the security checkpoint?" },
          { role: "B", text: "It's just around the corner. Please have your boarding pass ready." },
          { role: "A", text: "Do I need to take off my shoes?" },
          { role: "B", text: "Yes, and please remove any metal items from your pockets." },
        ],
      },
    ],
  },
  hotel: {
    name: "Khách sạn",
    description: "Đặt phòng và giao tiếp với nhân viên khách sạn",
    scripts: [
      {
        id: "hotel-checkin",
        name: "Check-in khách sạn",
        chat: [
          { role: "A", text: "Hi, I have a reservation under the name John Smith." },
          { role: "B", text: "Welcome! Let me check that for you. How many nights will you be staying?" },
          { role: "A", text: "Three nights. Do you have a room with a city view?" },
          { role: "B", text: "Yes, we do. I'll upgrade you to a city view room at no extra charge." },
        ],
      },
      {
        id: "hotel-service",
        name: "Dịch vụ khách sạn",
        chat: [
          { role: "A", text: "Hello, I'd like to request room service." },
          { role: "B", text: "Of course! What would you like to order?" },
          { role: "A", text: "Could I get breakfast delivered to my room tomorrow morning?" },
          { role: "B", text: "Certainly! What time would you prefer?" },
        ],
      },
    ],
  },
};

const STATUS_ICONS = { sent: "📤", seen: "✅" };
const MSG_SOUND = "https://cdn.pixabay.com/audio/2022/09/27/audio_125bfaea48.mp3";

export default function ChatPage() {
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const user = getUser() || { name: "Bạn An", avatar: "https://ugc.same-assets.com/7zP4_sZbv34rMijHgssmeEzsEDxkK-cw.jpeg" };
  const [scriptIdx, setScriptIdx] = useState(0);
  const [visible, setVisible] = useState(1);
  const [speed, setSpeed] = useState(4);
  const [typing, setTyping] = useState(false);
  const [enableSound, setEnableSound] = useState(true);
  const [status, setStatus] = useState<"sent" | "seen">("sent");
  const [vibe, setVibe] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement|null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageSoundRef = useRef<HTMLAudioElement|null>(null);

  const currentLocation = locationId ? LOCATIONS[locationId as keyof typeof LOCATIONS] : null;
  const currentScript = currentLocation?.scripts[scriptIdx];

  // Reset chat state when location or script changes
  useEffect(() => {
    resetChat();
  }, [locationId, scriptIdx]);

  // Reset chat state
  const resetChat = () => {
    setVisible(1);
    setTyping(false);
    setStatus("sent");
    setAutoPlay(false);
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  };

  // Play message sound
  const playMessageSound = () => {
    if (enableSound && messageSoundRef.current) {
      try {
        messageSoundRef.current.currentTime = 0;
        const playPromise = messageSoundRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Autoplay prevented:', error);
          });
        }
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    }
  };

  // Tạo chat có avatar/tên dựa trên role A = user, B = bot
  const script = currentScript?.chat.map(m =>
    m.role === 'A'
      ? { ...m, name: user.name, avatar: user.avatar }
      : { ...m, name: BOT.name, avatar: BOT.avatar }
  ) || [];

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    // Play sound when new message appears
    playMessageSound();
  }, [visible, scriptIdx]);

  useEffect(() => {
    if (visible < script.length) {
      setTyping(true);
      const timer = setTimeout(() => {
        setTyping(false);
        setVisible((v) => v + 1);
      }, speed * 1000);
      timeoutRef.current = timer;
      return () => clearTimeout(timer);
    }
    setTyping(false);
    setStatus("seen");
  }, [visible, scriptIdx, speed]);

  useEffect(() => {
    if (vibe && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  }, [vibe]);

  // Handle autoplay with proper cleanup
  useEffect(() => {
    if (autoPlay && visible < script.length) {
      autoPlayTimerRef.current = setTimeout(() => {
        setVisible((v) => v + 1);
      }, speed * 1000);
    }
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [autoPlay, visible, script.length, speed]);

  const handleComplete = () => {
    setShowCompletionPopup(true);
  };

  const handleContinueToFlashcards = () => {
    setShowCompletionPopup(false);
    navigate(`/flashcards/${locationId}`);
  };

  const handleReturnToWorldMap = () => {
    setShowCompletionPopup(false);
    navigate('/world-map');
  };

  // Completion Popup Component
  const CompletionPopup = () => {
    if (!showCompletionPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-center relative">
            <button
              onClick={() => setShowCompletionPopup(false)}
              className="absolute top-3 right-3 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-4xl mb-2"
            >
              🎉
            </motion.div>
            <h2 className="text-xl font-bold text-white mb-1">Chúc mừng!</h2>
            <p className="text-green-100 text-sm">Bạn đã hoàn thành cuộc trò chuyện</p>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Bạn có tiếp tục chinh phục FlashCard không?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Tiếp tục học với FlashCard để củng cố từ vựng vừa học!
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinueToFlashcards}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg min-h-[56px] flex items-center justify-center gap-2"
              >
                <span>🚀</span>
                <span>Tiếp tục với FlashCard</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReturnToWorldMap}
                className="w-full bg-gray-100 text-gray-700 py-4 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 min-h-[56px] flex items-center justify-center gap-2"
              >
                <span>🗺️</span>
                <span>Quay lại World Map</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Render message block with improved typing animation
  function renderMessages() {
    let lastRole: string | null = null;
    return script.slice(0, visible).map((msg, i) => {
      const blockFirst = msg.role !== lastRole;
      lastRole = msg.role;
      return (
        <div
          key={i + msg.text}
          className={`flex flex-col items-${msg.role === "A" ? "end" : "start"} w-full animate-slidein mb-1`}
        >
          {blockFirst && (
            <div className={`flex items-center gap-2 mb-0.5 ${msg.role === "A" ? "flex-row-reverse" : ""}`}>
              <img
                src={msg.avatar}
                alt={msg.name}
                className="w-7 h-7 rounded-full border"
              />
              <span className="text-xs text-gray-500 font-semibold">{msg.name}</span>
            </div>
          )}
          <div className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm ${
            msg.role === "A" ? "bg-blue-200" : "bg-green-100"
          } transition-transform duration-500 animate-fadein`}
          >
            {msg.text}
            {i === script.length-1 && status && (
              <span className="ml-2 text-xs text-gray-400">{STATUS_ICONS[status]}</span>
            )}
          </div>
        </div>
      );
    });
  }

  // Get the next message's role for typing indicator
  const getNextMessageRole = () => {
    if (visible < script.length) {
      return script[visible].role;
    }
    return null;
  };

  if (!currentLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Location not found</h1>
          <Button onClick={() => navigate('/world-map')}>Back to World Map</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white">
      <Header />
      
      <div className="flex flex-col items-center p-2 sm:p-4">
        <audio ref={audioRef} src={MSG_SOUND} preload="auto" />
        <audio ref={messageSoundRef} src="/sounds/message.mp3" preload="auto" />
        
        {/* Completion Popup */}
        <CompletionPopup />
        
        {/* Phone Frame */}
        <div className="w-full max-w-md bg-white rounded-[32px] sm:rounded-[40px] shadow-xl overflow-hidden border-4 sm:border-8 border-gray-800 relative">
          {/* Phone Notch */}
          <div className="h-5 sm:h-6 bg-gray-800 flex items-center justify-center">
            <div className="w-16 sm:w-20 h-3 sm:h-4 bg-gray-700 rounded-full"></div>
          </div>

          {/* Chat Container */}
          <div className="h-[600px] sm:h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-3 sm:p-4 bg-white border-b">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 truncate">{currentLocation.name}</h2>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{currentLocation.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="p-3 sm:p-4 bg-white border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Tiến độ</span>
                <span className="text-xs text-gray-600">{visible}/{script.length}</span>
              </div>
              <Progress value={(visible / script.length) * 100} className="h-2" />
            </div>

            {/* Controls */}
            <div className="bg-gray-100 p-2 sm:p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <select
                    className="rounded-md border px-2 py-1.5 text-xs sm:text-sm bg-white flex-1 min-w-0"
                    value={scriptIdx}
                    onChange={e=>setScriptIdx(Number(e.target.value))}
                  >
                    {currentLocation.scripts.map((opt, i) => (
                      <option value={i} key={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                  <select
                    className="rounded-md border px-2 py-1.5 text-xs sm:text-sm bg-white min-w-[80px]"
                    value={speed}
                    onChange={e=>setSpeed(Number(e.target.value))}
                  >
                    <option value={2}>Nhanh</option>
                    <option value={4}>Thường</option>
                    <option value={5}>Chậm</option>
                  </select>
                </div>
               <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoPlay(!autoPlay)}
                    className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1.5 h-auto min-h-[36px]"
                  >
                    {autoPlay ? <Pause className="w-3 h-3 sm:w-4 sm:h-4" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
                    <span className="hidden sm:inline">{autoPlay ? 'Tạm dừng' : 'Tự động'}</span>
                  </Button>
                  <button
                    className={`p-2 rounded-full min-h-[36px] min-w-[36px] flex items-center justify-center text-sm ${enableSound?'bg-green-100 text-green-600':'bg-gray-200 text-gray-400'}`}
                    title={enableSound?'Tắt âm':'Bật âm'}
                    onClick={()=>setEnableSound(!enableSound)}
                    type="button"
                  >🔊</button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto scroll-smooth flex flex-col gap-1 px-2 sm:px-3 py-3 sm:py-4 bg-gray-50"
            >
              {renderMessages()}
              {typing && (
                <div className={`flex items-end gap-2 mt-2 ${getNextMessageRole() === "A" ? "justify-end" : "justify-start"}`}>
                  <img 
                    src={script[visible%script.length]?.avatar} 
                    alt="" 
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border"
                  />
                  <div className="text-xs sm:text-sm px-2 sm:px-3 py-2 bg-gray-100 rounded-2xl">
                    <span className="inline-flex">
                      <span className="animate-bounce delay-100">.</span>
                      <span className="animate-bounce delay-200">.</span>
                      <span className="animate-bounce delay-300">.</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="flex gap-2 p-2 sm:p-3 border-t bg-gray-50 items-center">
              {visible === script.length ? (
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    onClick={resetChat}
                    className="flex items-center gap-2 text-xs sm:text-sm px-3 py-2 h-auto min-h-[44px]"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Làm lại</span>
                    <span className="sm:hidden">↻</span>
                  </Button>
                  <Button
                    onClick={handleComplete}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-xs sm:text-sm min-h-[44px]"
                  >
                    <span>Hoàn thành</span>
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    disabled
                    placeholder="Bạn không thể gửi tin nhắn ở chế độ mô phỏng"
                    className="flex-1 px-3 py-2 rounded border bg-gray-100 text-xs sm:text-sm shadow-sm min-h-[44px]"
                  />
                  <div className="text-xl sm:text-2xl text-gray-400 cursor-not-allowed ml-2 min-h-[44px] flex items-center">➤</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
