import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play, Pause, ChevronRight, CheckCircle, RotateCcw } from "lucide-react";

// Helper lấy info user từ localStorage
function getUser() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.name) return null;
    const avatar = user.avatar || 'https://ugc.same-assets.com/7zP4_sZbv34rMijHgssmeEzsEDxkK-cw.jpeg';
    return { ...user, avatar };
  } catch {
    return null;
  }
}

const BOT = {
  name: "Nhân viên",
  avatar: "https://ugc.same-assets.com/CDFkbAQAhmvkBzjgol89YK5kwQvnPSyR.jpeg",
};

// Các script gốc: text A là user nhập vai, B là bot. format chỉ lưu TEXT, chuyển thành chatList dưới đây
const SCRIPTS = [
  {
    id: "restaurant-basic",
    name: "Nhà hàng - Cơ bản",
    chat: [
      { role: "A", text: "Xin chào! Tôi muốn đặt bàn cho 2 người." },
      { role: "B", text: "Xin chào, bạn muốn ngồi ở khu vực nào?" },
      { role: "A", text: "Gần cửa sổ được không?" },
      { role: "B", text: "Dạ được ạ, mời bạn theo tôi." },
      { role: "A", text: "Xin chào! Tôi muốn đặt bàn cho 2 người." },
      { role: "B", text: "Xin chào, bạn muốn ngồi ở khu vực nào?" },
      { role: "A", text: "Gần cửa sổ được không?" },
      { role: "B", text: "Dạ được ạ, mời bạn theo tôi." },
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
];

const STATUS_ICONS = { sent: "📤", seen: "✅" };
const MSG_SOUND = "https://cdn.pixabay.com/audio/2022/09/27/audio_125bfaea48.mp3";

export default function ChatPage() {
  const navigate = useNavigate();
  const user = getUser() || { name: "Bạn An", avatar: "https://ugc.same-assets.com/7zP4_sZbv34rMijHgssmeEzsEDxkK-cw.jpeg" };
  const [scriptIdx, setScriptIdx] = useState(0);
  const [visible, setVisible] = useState(1);
  const [speed, setSpeed] = useState(4);
  const [typing, setTyping] = useState(false);
  const [enableSound, setEnableSound] = useState(true);
  const [status, setStatus] = useState<"sent" | "seen">("sent");
  const [vibe, setVibe] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement|null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageSoundRef = useRef<HTMLAudioElement|null>(null);

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
  const script = SCRIPTS[scriptIdx].chat.map(m =>
    m.role === 'A'
      ? { ...m, name: user.name, avatar: user.avatar }
      : { ...m, name: BOT.name, avatar: BOT.avatar }
  );

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
    resetChat();
  }, [scriptIdx]);

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
    navigate('/flashcards');
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

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-yellow-50 to-white p-2 sm:p-4">
      <audio ref={audioRef} src={MSG_SOUND} preload="auto" />
      <audio ref={messageSoundRef} src="/sounds/message.mp3" preload="auto" />
      {/* Phone Frame */}
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-xl overflow-hidden border-8 border-gray-800 relative">
        {/* Phone Notch */}
        <div className="h-6 bg-gray-800 flex items-center justify-center">
          <div className="w-20 h-4 bg-gray-700 rounded-full"></div>
        </div>

        {/* Chat Container */}
        <div className="h-[600px] flex flex-col">
          {/* Progress Bar */}
          <div className="p-4 bg-white border-b">
            <Progress value={(visible / script.length) * 100} />
          </div>

          {/* Controls */}
          <div className="bg-gray-100 p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <select
                  className="rounded-md border px-2 py-1 text-sm bg-white"
                  value={scriptIdx}
                  onChange={e=>setScriptIdx(Number(e.target.value))}
                >
                  {SCRIPTS.map((opt, i) => (
                    <option value={i} key={opt.id}>{opt.name}</option>
                  ))}
                </select>
                <select
                  className="rounded-md border px-2 py-1 text-sm bg-white"
                  value={speed}
                  onChange={e=>setSpeed(Number(e.target.value))}
                >
                  <option value={2}>Nhanh</option>
                  <option value={4}>Thường</option>
                  <option value={5}>Chậm</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoPlay(!autoPlay)}
                  className="flex items-center gap-1"
                >
                  {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {autoPlay ? 'Tạm dừng' : 'Tự động'}
                </Button>
                <button
                  className={`p-1.5 rounded-full ${enableSound?'bg-green-100 text-green-600':'bg-gray-200 text-gray-400'}`}
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
            className="flex-1 overflow-y-auto scroll-smooth flex flex-col gap-1 px-2 py-4 bg-gray-50"
          >
            {renderMessages()}
            {typing && (
              <div className={`flex items-end gap-2 mt-2 ${getNextMessageRole() === "A" ? "justify-end" : "justify-start"}`}>
                <img 
                  src={script[visible%script.length]?.avatar} 
                  alt="" 
                  className="w-7 h-7 rounded-full border"
                />
                <div className="text-sm px-3 py-2 bg-gray-100 rounded-2xl">
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
          <div className="flex gap-2 p-2 border-t bg-gray-50 items-center">
            {visible === script.length ? (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={resetChat}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Làm lại
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  Hoàn thành
                  <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  disabled
                  placeholder="Bạn không thể gửi tin nhắn ở chế độ mô phỏng"
                  className="flex-1 px-3 py-1.5 rounded border bg-gray-100 text-sm shadow-sm"
                />
                <span className="text-2xl text-gray-400 cursor-not-allowed ml-2">➤</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
