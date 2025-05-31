import React, { useState, useRef, useEffect } from "react";

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

const STATUS_ICONS = { sent: "📤", seen: "✅✅" };
const MSG_SOUND = "https://cdn.pixabay.com/audio/2022/09/27/audio_125bfaea48.mp3";

export default function ChatPage() {
  const user = getUser() || { name: "Bạn An", avatar: "https://ugc.same-assets.com/7zP4_sZbv34rMijHgssmeEzsEDxkK-cw.jpeg" };
  const [scriptIdx, setScriptIdx] = useState(0);
  const [visible, setVisible] = useState(1); // số tin nhắn hiện tại
  const [speed, setSpeed] = useState(1.5); // giây/tin nhắn
  const [typing, setTyping] = useState(false);
  const [enableSound, setEnableSound] = useState(true);
  const [status, setStatus] = useState<"sent" | "seen">("sent");
  const [vibe, setVibe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement|null>(null);

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
    if (enableSound && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    setVibe(true);
    setTimeout(() => setVibe(false), 200);
  }, [visible, scriptIdx]);

  useEffect(() => {
    if (visible < script.length) {
      setTyping(true);
      timeoutRef.current = setTimeout(() => {
        setTyping(false);
        setVisible((v) => v + 1);
      }, speed * 1000);
      return () => timeoutRef.current && clearTimeout(timeoutRef.current);
    }
    setTyping(false);
    setStatus("seen");
  }, [visible, scriptIdx, speed]);

  useEffect(() => {
    setVisible(1);
    setTyping(false);
    setStatus("sent");
  }, [scriptIdx]);

  useEffect(() => {
    if (vibe && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  }, [vibe]);

  // Render message block: hiện avatar và tên bên trên block mới (khi A/B đổi vai)
  function renderMessages() {
    let lastRole = null;
    return script.slice(0, visible).map((msg, i) => {
      const blockFirst = msg.role !== lastRole;
      lastRole = msg.role;
      return (
        <div
          key={i + msg.text}
          className={`flex flex-col items-${msg.role === "A" ? "start" : "end"} w-full animate-slidein mb-1`}
        >
          {blockFirst && (
            <div className="flex items-center gap-2 mb-0.5">
              <img
                src={msg.avatar}
                alt={msg.name}
                className="w-7 h-7 rounded-full border"
              />
              <span className="text-xs text-gray-500 font-semibold">{msg.name}</span>
            </div>
          )}
          <div className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm ${
            msg.role === "A" ? "bg-blue-200 self-start" : "bg-green-100 self-end"
          } transition-transform duration-500 animate-fadein`}
          >
            {msg.text}
            {i === visible-1 && typing && (
              <span className="ml-2 text-gray-400 animate-pulse">...</span>
            )}
            {/* trạng thái gửi/đã xem, icon gửi */}
            {i === script.length-1 && status && (
              <span className="ml-2 text-xs text-gray-400">{STATUS_ICONS[status]}</span>
            )}
          </div>
        </div>
      );
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-yellow-50 to-white p-2 sm:p-4">
      <audio ref={audioRef} src={MSG_SOUND} preload="auto" />
      <div className={
        `w-full max-w-md bg-white rounded-lg border shadow relative ${vibe ? "ring-2 ring-pink-300 animate-vibrate" : ""}`
      }>
        <div className="bg-gray-100 p-2 flex items-center justify-between">
          <div className="flex gap-1 items-center">
            <select
              className="rounded border px-1 py-0.5 text-xs"
              value={scriptIdx}
              onChange={e=>setScriptIdx(Number(e.target.value))}
            >
              {SCRIPTS.map((opt, i) => (
                <option value={i} key={opt.id}>{opt.name}</option>
              ))}
            </select>
            <span className="ml-2">Tốc độ</span>
            <select
              className="rounded border px-1 py-0.5 text-xs"
              value={speed}
              onChange={e=>setSpeed(Number(e.target.value))}
            >
              <option value={1}>Nhanh</option>
              <option value={1.5}>Thường</option>
              <option value={2}>Chậm</option>
            </select>
          </div>
          <button
            className={`ml-2 text-base px-2 py-0.5 rounded-full ${enableSound?'bg-green-100 text-green-600':'bg-gray-200 text-gray-400'}`}
            title={enableSound?'Tắt âm':'Bật âm'}
            onClick={()=>setEnableSound(!enableSound)}
            type="button"
          >🔊</button>
        </div>
        <div
          ref={containerRef}
          className="h-[420px] max-h-[70vh] overflow-y-auto scroll-smooth flex flex-col gap-1 px-2 py-4 bg-gray-50"
        >
          {renderMessages()}
          {/* Hiệu ứng đang nhập cuối */}
          {typing && (
            <div className="flex items-end gap-2 mt-2">
              <img src={script[visible%script.length]?.avatar} alt="" className="w-7 h-7 rounded-full border" />
              <span className="text-sm px-3 py-2 bg-gray-100 rounded-2xl animate-pulse">...</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 p-2 border-t bg-gray-50 items-center">
          <input
            type="text"
            disabled
            placeholder="Bạn không thể gửi tin nhắn ở chế độ mô phỏng"
            className="flex-1 px-3 py-1.5 rounded border bg-gray-100 text-sm shadow-sm"
          />
          <span className="text-2xl text-gray-400 cursor-not-allowed ml-2">➤</span>
        </div>
      </div>
    </div>
  );
}
