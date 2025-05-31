import React, { useState } from 'react';

const AVATAR_IMAGES = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  'https://ugc.same-assets.com/7zP4_sZbv34rMijHgssmeEzsEDxkK-cw.jpeg',
  'https://ugc.same-assets.com/b6ST6vvuXzWsLus3E4djQVIYD7z70o1M.jpeg',
  'https://ugc.same-assets.com/wVWA6F0W1Bq9YOiFxA7tQBC68FDb7ddw.jpeg',
  'https://ugc.same-assets.com/CDFkbAQAhmvkBzjgol89YK5kwQvnPSyR.jpeg',
  'https://ugc.same-assets.com/4jsoOxPmfXlG994nbRPnQl0yD77JoL6a.jpeg',
  'https://ugc.same-assets.com/bFNbdFuKwdx09btdiXIAPcomA85JbVkn.jpeg',
];
const HAIR_STYLES = [
  { id: 1, label: 'Ngắn', value: 'short' },
  { id: 2, label: 'Dài', value: 'long' },
  { id: 3, label: 'Búi', value: 'bun' },
];
const HAIR_COLORS = [
  { id: 1, label: 'Đen', value: '#222' },
  { id: 2, label: 'Nâu', value: '#7b493b' },
  { id: 3, label: 'Vàng', value: '#fae97f' },
];
const OUTFITS = [
  { id: 1, label: 'Áo phông', value: 'shirt' },
  { id: 2, label: 'Áo vest', value: 'vest' },
];
const GENDERS = [
  { id: 1, label: 'Nam', value: 'male' },
  { id: 2, label: 'Nữ', value: 'female' },
  { id: 3, label: 'Khác', value: 'neutral' },
];

export default function AvatarPage() {
  const [avatar, setAvatar] = useState({
    gender: 'male',
    hairStyle: 'short',
    hairColor: '#222',
    outfit: 'shirt',
    img: '',
  });
  const handlePick = (key: string, value: string) => {
    setAvatar({ ...avatar, [key]: value });
  };
  const handleSave = () => {
    localStorage.setItem('avatar', JSON.stringify(avatar));
    // update field avatar cho user đang login (nếu có)
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      user.avatar = avatar.img;
      localStorage.setItem('user', JSON.stringify(user));
    }
    window.location.href = '/journeys';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-2 sm:p-4">
      <h2 className="text-2xl font-semibold mb-4">Tạo avatar đại diện</h2>
      <div className="flex flex-col md:flex-row gap-8 items-center w-full max-w-2xl">
        {/* Preview avatar */}
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-2 border-4 border-white shadow overflow-hidden">
            {/* Hiển thị img nếu đã chọn, ngược lại hiển thị emoji */}
            {avatar.img ? (
              <img src={avatar.img} alt="Avatar" className="object-cover w-28 h-28" />
            ) : (
              <span className="text-5xl">{avatar.gender === 'female' ? '👧' : avatar.gender === 'male' ? '👦' : '🧑'}</span>
            )}
          </div>
          <div className="text-gray-500">Tóc: {avatar.hairStyle}, Màu: <span style={{ color: avatar.hairColor }}>{avatar.hairColor}</span></div>
          <div className="text-gray-500 mb-2">Style: {avatar.outfit}</div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <div>
            <p className="font-semibold mb-1">Chọn hình avatar</p>
            <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 md:grid md:grid-cols-5 md:gap-3">
              {AVATAR_IMAGES.map((url, i) => (
                <button
                  type="button"
                  key={url}
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${avatar.img===url?'border-blue-500':'border-gray-200'} bg-white flex-shrink-0`}
                  onClick={()=>handlePick('img', url)}
                  aria-label={`Chọn avatar hình ${i+1}`}
                >
                  <img src={url} alt="avatar" className="object-cover w-12 h-12 rounded-full" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Giới tính</p>
            <div className="flex gap-2">
              {GENDERS.map(g => (
                <button
                  key={g.value}
                  className={`px-3 py-1 rounded ${avatar.gender === g.value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handlePick('gender', g.value)}
                  type="button"
                >{g.label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Kiểu tóc</p>
            <div className="flex gap-2">
              {HAIR_STYLES.map(h => (
                <button
                  key={h.value}
                  className={`px-3 py-1 rounded ${avatar.hairStyle === h.value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handlePick('hairStyle', h.value)}
                  type="button"
                >{h.label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Màu tóc</p>
            <div className="flex gap-2">
              {HAIR_COLORS.map(c => (
                <button
                  key={c.value}
                  className={`w-8 h-8 rounded-full border-2 ${avatar.hairColor === c.value ? 'border-blue-500' : 'border-gray-300'}`}
                  style={{ background: c.value }}
                  onClick={() => handlePick('hairColor', c.value)}
                  type="button"
                />
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold mb-1">Trang phục</p>
            <div className="flex gap-2">
              {OUTFITS.map(o => (
                <button
                  key={o.value}
                  className={`px-3 py-1 rounded ${avatar.outfit === o.value ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handlePick('outfit', o.value)}
                  type="button"
                >{o.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button
        className="mt-8 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow w-full max-w-xs"
        onClick={handleSave}
      >
        Lưu avatar & tiếp tục
      </button>
    </div>
  );
}
