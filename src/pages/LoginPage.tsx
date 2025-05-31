// Instructions: Khi đăng nhập, lưu user info vào localStorage: role='A', name người dùng nhập, avatar (tuỳ chọn từ avatar họ pick ở trang AvatarPage). Luôn đóng vai 'khách'.

import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Stub: mock đăng nhập, luôn gán vai Khách
    if (email && password && name) {
      const user = {
        email,
        name,
        role: 'A', // luôn là khách
        avatar: '', // sẽ sync sau nếu có ở AvatarPage
      };
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/avatar';
    } else {
      setError('Vui lòng nhập đầy đủ thông tin!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form
        className="w-full max-w-xs bg-white rounded-lg shadow p-6 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center mb-2">Đăng nhập</h1>
        <input
          type="text"
          placeholder="Tên của bạn (vai khách)"
          className="border p-2 rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-center text-sm">{error}</div>}
        <button
          className="w-full px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <div className="flex justify-between text-xs mt-2">
          <a href="/register" className="underline text-blue-500">Chưa có tài khoản? Đăng ký</a>
          <button type="button" className="underline text-gray-400 cursor-not-allowed" disabled style={{ background: 'none', border: 'none' }}>
            Quên mật khẩu?
          </button>
        </div>
      </form>
    </div>
  );
}
