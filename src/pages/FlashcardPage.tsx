import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, ChevronLeft, ChevronRight, Trophy, Star, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// Types
type Category = 'restaurant' | 'travel' | 'business' | 'default';

interface Flashcard {
  id: number;
  word: string;
  meaning: string;
  example: string;
  image: string;
  category: Category;
  difficulty: 'easy' | 'medium' | 'hard';
  mastered: boolean;
  phonetic?: string;
}

// Helper to get user info
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

// Mock flashcards data
const FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    word: "reservation",
    meaning: "Đặt chỗ trước",
    example: "I'd like to make a reservation for two.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
    category: "restaurant",
    difficulty: "easy",
    mastered: false
  },
  {
    id: 2,
    word: "appetizer",
    meaning: "Món khai vị",
    example: "Would you like to order an appetizer?",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500",
    category: "restaurant",
    difficulty: "medium",
    mastered: false
  },
  // Add more flashcards here
];

// Encouragement messages
const ENCOURAGEMENTS = [
  "Đỉnh cao!",
  "Tuyệt vời!",
  "Tiến bộ rõ rệt rồi đó!",
  "Bạn giỏi quá!",
  "Sắp xong rồi!",
  "Quá xuất sắc!",
  "Không thể tin được!",
  "Thật ấn tượng!"
];

// Category gradients
const CATEGORY_GRADIENTS: Record<Category, string> = {
  restaurant: "from-orange-400 via-red-500 to-yellow-500",
  travel: "from-blue-400 via-indigo-500 to-purple-500",
  business: "from-gray-400 via-slate-500 to-zinc-500",
  default: "from-green-400 via-emerald-500 to-teal-500"
};

export default function FlashcardPage() {
  const navigate = useNavigate();
  const { locationId } = useParams<{ locationId: string }>();
  const user = getUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragement, setEncouragement] = useState("");
  const [progress, setProgress] = useState(0);
  const [phonetic, setPhonetic] = useState("");
  const [rememberedCards, setRememberedCards] = useState<Set<number>>(new Set());
  const [showCongrats, setShowCongrats] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentCard = FLASHCARDS[currentIndex];

  // Fetch phonetic transcription
  useEffect(() => {
    const fetchPhonetic = async () => {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentCard?.word}`);
        const data = await response.json();
        if (data[0]?.phonetic) {
          setPhonetic(data[0].phonetic);
        }
      } catch (error) {
        console.error('Error fetching phonetic:', error);
      }
    };

    if (currentCard?.word) {
      fetchPhonetic();
    }
  }, [currentCard?.word]);

  // Handle card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Handle mastery
  const handleMastered = () => {
    const newRememberedCards = new Set(rememberedCards);
    newRememberedCards.add(currentIndex);
    setRememberedCards(newRememberedCards);

    // Update progress
    const newProgress = ((currentIndex + 1) / FLASHCARDS.length) * 100;
    setProgress(newProgress);

    // Show encouragement
    const randomEncouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
    setEncouragement(randomEncouragement);
    setShowEncouragement(true);

    // Check if all cards are remembered
    if (newRememberedCards.size === FLASHCARDS.length) {
      // Show confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Show congrats popup
      setShowCongrats(true);
    } else {
      // Move to next card after delay
      setTimeout(() => {
        setShowEncouragement(false);
        if (currentIndex < FLASHCARDS.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setIsFlipped(false);
        }
      }, 2000);
    }
  };

  // Handle navigation
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < FLASHCARDS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  // Play pronunciation
  const playPronunciation = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  };

  // Handle navigation from congrats popup
  const handleBackToJourney = () => {
    navigate('/journeys');
  };

  const handleReview = () => {
    setShowCongrats(false);
    setCurrentIndex(0);
    setRememberedCards(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4">
      {/* User Profile Section */}
      <div className="max-w-2xl mx-auto mb-4 sm:mb-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-3 sm:p-4 shadow-lg flex items-center gap-3 sm:gap-4">
          <img src={user?.avatar} alt={user?.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-xs sm:text-sm text-gray-600">Tiến độ: {Math.round(progress)}%</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <span className="text-xs sm:text-sm font-medium">Level 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-4 sm:mb-8">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard Container */}
      <div className="max-w-2xl mx-auto">
        <div className="relative aspect-[4/3] perspective-1000">
          <motion.div
            className="w-full h-full relative preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            {/* Front of card */}
            <div className={`absolute w-full h-full backface-hidden rounded-3xl shadow-2xl bg-gradient-to-br ${CATEGORY_GRADIENTS[currentCard?.category || 'default']} p-4 sm:p-8`}>
              <div className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/20 rounded-full text-white text-xs sm:text-sm backdrop-blur-sm">
                    {currentCard?.difficulty}
                  </span>
                  <button
                    onClick={playPronunciation}
                    className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-4">{currentCard?.word}</h2>
                  {phonetic && (
                    <p className="text-sm sm:text-base text-white/80 mb-2 sm:mb-4"> {phonetic} </p>
                  )}
                  <img
                    src={currentCard?.image}
                    alt={currentCard?.word}
                    className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-2xl object-cover shadow-lg"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={handleFlip}
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm text-sm sm:text-base"
                  >
                    Lật thẻ
                  </Button>
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div className={`absolute w-full h-full backface-hidden rounded-3xl shadow-2xl bg-gradient-to-br ${CATEGORY_GRADIENTS[currentCard?.category || 'default']} p-4 sm:p-8 rotate-y-180`}>
              <div className="h-full flex flex-col justify-between">
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">{currentCard?.meaning}</h3>
                  <p className="text-sm sm:text-base text-white/90 italic">{currentCard?.example}</p>
                </div>
                <div className="flex justify-center gap-2 sm:gap-4">
                  <Button
                    onClick={handleFlip}
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm text-sm sm:text-base"
                  >
                    Quay lại
                  </Button>
                  <Button
                    onClick={handleMastered}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base"
                  >
                    Đã nhớ
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center gap-2 sm:gap-4 mt-4 sm:mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-white/80 hover:bg-white/90 text-gray-800 p-2 sm:p-3"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex === FLASHCARDS.length - 1}
            className="bg-white/80 hover:bg-white/90 text-gray-800 p-2 sm:p-3"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>

      {/* Encouragement Message */}
      <AnimatePresence>
        {showEncouragement && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-[70%] left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-lg rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-lg max-w-[90%] sm:max-w-none"
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <span className="text-base sm:text-lg font-semibold text-gray-800">{encouragement}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Congrats Popup */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Chúc mừng!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Bạn đã hoàn thành tất cả thẻ từ vựng
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleBackToJourney}
                  className="w-full"
                >
                  Quay lại hành trình
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReview}
                  className="w-full"
                >
                  Xem lại các thẻ
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio element for pronunciation */}
      <audio ref={audioRef} src={`https://api.dictionaryapi.dev/media/pronunciations/en/${currentCard?.word}-us.mp3`} />
    </div>
  );
}
