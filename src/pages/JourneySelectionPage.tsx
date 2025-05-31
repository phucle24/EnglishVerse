// Instructions: Chuyển card hành trình thành thẻ <button> thay cho div có role button và tabindex.

import React, { useState } from 'react';

const journeys = [
  {
    id: 1,
    title: 'Phiêu lưu thành phố đa văn hoá',
    description: 'Khám phá giao tiếp đời thường trong đô thị hiện đại.',
    thumbnail: '/journey-city.png',
  },
  {
    id: 2,
    title: 'Khám phá sân bay quốc tế',
    description: 'Thực hành hội thoại khi du lịch nước ngoài.',
    thumbnail: '/journey-airport.png',
  },
];

export default function JourneySelectionPage() {
  const [selected, setSelected] = useState<number|null>(null);

  const handleStart = () => {
    if (selected != null) {
      localStorage.setItem('journey', selected.toString());
      window.location.href = '/map';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-t from-green-50 to-white p-4">
      <h2 className="text-2xl font-bold mb-6">Chọn hành trình của bạn</h2>
      <div className="flex flex-wrap gap-8 justify-center">
        {journeys.map(j => (
          <button
            key={j.id}
            className={`w-64 rounded-lg border-2 shadow p-4 flex flex-col items-center transition-all ${selected === j.id ? 'border-blue-600 shadow-lg scale-105' : 'border-gray-200'}`}
            onClick={() => setSelected(j.id)}
            type="button"
            style={{ background: '#fff', cursor: 'pointer' }}
          >
            <div className="w-24 h-24 bg-gray-100 mb-3 rounded">
              <span className="text-5xl inline-block pt-5">🚩</span>
            </div>
            <div className="font-semibold text-lg mt-1">{j.title}</div>
            <div className="text-sm text-gray-500 mt-1 text-center">{j.description}</div>
            <button
              className={`mt-4 px-4 py-2 rounded text-white font-medium transition-colors ${selected === j.id ? 'bg-blue-600' : 'bg-gray-400'}`}
              disabled={selected !== j.id}
              onClick={handleStart}
              type="button"
            >
              Bắt đầu hành trình này
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}
