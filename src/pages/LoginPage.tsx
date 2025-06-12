// Instructions: Khi đăng nhập, lưu user info vào localStorage: role='A', name người dùng nhập, avatar (tuỳ chọn từ avatar họ pick ở trang AvatarPage). Luôn đóng vai 'khách'.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validation
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      setLoading(false);
      return;
    }

    // Check against registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      setError('Email hoặc mật khẩu không đúng!');
      setLoading(false);
      return;
    }

    // Set current user session
    const currentUser = {
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar || ''
    };
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    // Navigate to journeys for existing users (since they already have account)
    setTimeout(() => {
      navigate('/journeys');
    }, 1000);
  };

  // Simple Panda SVG Component
  const PandaAvatar = () => (
    <div className="w-24 h-24 mx-auto mb-8">
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* Panda Head */}
        <circle cx="60" cy="60" r="35" fill="#ffffff" stroke="#000" strokeWidth="2"/>
        
        {/* Panda Ears */}
        <circle cx="45" cy="35" r="12" fill="#000"/>
        <circle cx="75" cy="35" r="12" fill="#000"/>
        
        {/* Panda Eye patches */}
        <ellipse cx="50" cy="50" rx="8" ry="12" fill="#000"/>
        <ellipse cx="70" cy="50" rx="8" ry="12" fill="#000"/>
        
        {/* Panda Eyes */}
        <circle cx="50" cy="55" r="4" fill="#fff"/>
        <circle cx="70" cy="55" r="4" fill="#fff"/>
        <circle cx="50" cy="55" r="2" fill="#000"/>
        <circle cx="70" cy="55" r="2" fill="#000"/>
        
        {/* Panda Nose */}
        <ellipse cx="60" cy="68" rx="3" ry="2" fill="#000"/>
        
        {/* Panda Mouth */}
        <path d="M 55 75 Q 60 78 65 75" stroke="#000" strokeWidth="2" fill="none"/>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-50 to-yellow-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-32 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-200 rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-28 h-28 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
      
      {/* Decorative S shapes */}
      <div className="absolute top-1/4 left-8 text-6xl font-bold text-yellow-300 opacity-30 rotate-12">S</div>
      <div className="absolute bottom-1/3 right-12 text-8xl font-bold text-pink-300 opacity-25 -rotate-12">h</div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md relative"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            <span className="text-orange-600">Welcome to</span>
          </h1>
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-blue-600">English</span>{' '}
            <span className="text-green-600">V</span>
            <span className="text-red-600">e</span>
            <span className="text-yellow-600">r</span>
            <span className="text-purple-600">s</span>
            <span className="text-pink-600">e</span>
          </h2>
          <p className="text-gray-600 text-sm">Sign in to continue your learning journey</p>
        </div>

        {/* Panda Avatar */}
        <PandaAvatar />

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-orange-100 border-0 rounded-2xl focus:ring-2 focus:ring-orange-300 focus:outline-none transition-all duration-300 placeholder-gray-500"
              placeholder="your@email.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-orange-100 border-0 rounded-2xl focus:ring-2 focus:ring-orange-300 focus:outline-none transition-all duration-300 placeholder-gray-500"
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-2xl font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>

          {/* Forgot Password & Register Links */}
          <div className="space-y-2 text-center pt-4">
            <button
              type="button"
              className="block w-full text-gray-500 text-sm hover:text-gray-700 transition-colors duration-300"
            >
              Forgot password?
            </button>
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-300"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
