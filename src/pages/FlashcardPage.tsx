import React, { useState } from 'react';

const FLASHCARDS = [
  { id: 1, term: 'Reservation', definition: 'Sự đặt bàn/trước chỗ', example: 'I have a reservation for two.' },
  { id: 2, term: 'Menu', definition: 'Thực đơn', example: 'Could I see the menu, please?' },
  { id: 3, term: 'Waiter', definition: 'Nhân viên phục vụ', example: 'The waiter brought our food.' },
  { id: 4, term: 'Bill', definition: 'Hóa đơn', example: 'Could you bring the bill, please?' },
];

export default function FlashcardPage() {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [memorized, setMemorized] = useState<{[key:number]:boolean}>({});

  const card = FLASHCARDS[idx];
  const total = FLASHCARDS.length;
  const done = Object.values(memorized).filter(Boolean).length;

  const handleFlip = () => setFlipped(!flipped);
  const handleMemory = (mem: boolean) => {
    setMemorized({ ...memorized, [card.id]: mem });
    setIdx(idx < total-1 ? idx+1 : idx);
    setFlipped(false);
  };
  const handleComplete = () => {
    if (done === total) window.location.href = '/map';
    else alert('Học hết và đánh dấu tất cả flashcard là Đã nhớ mới hoàn thành!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-t from-pink-50 to-white">
      <h2 className="text-xl font-bold mb-4">Luyện từ vựng – Nhà hàng</h2>
      <div className="w-80 h-48 perspective mb-4">
        <div className={`relative w-full h-full rounded-lg border bg-white flex flex-col items-center justify-center shadow-lg transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}>
          {!flipped ? (
            <div>
              <div className="text-2xl font-semibold">{card.term}</div>
            </div>
          ) : (
            <div>
              <div className="text-gray-700 text-lg mb-2">{card.definition}</div>
              <div className="text-sm text-gray-400 italic">{card.example}</div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mb-2">
        <button className="px-4 py-1 bg-blue-500 rounded text-white" onClick={handleFlip}>{flipped ? 'Mặt trước' : 'Lật'}</button>
        <button className="px-4 py-1 bg-green-500 rounded text-white" onClick={() => handleMemory(true)}>Đã nhớ</button>
        <button className="px-4 py-1 bg-gray-400 rounded text-white" onClick={() => handleMemory(false)}>Chưa nhớ</button>
      </div>
      <div className="mb-2">Flashcard {idx+1} / {total} | Đã nhớ: {done}/{total}</div>
      {idx === total-1 && (
        <button className="mt-4 px-6 py-2 rounded bg-green-600 text-white" onClick={handleComplete}>Hoàn thành Flashcard</button>
      )}
    </div>
  );
}
