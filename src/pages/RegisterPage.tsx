import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      setLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      setLoading(false);
      return;
    }

    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const emailExists = existingUsers.find((user: any) => user.email === formData.email);
    
    if (emailExists) {
      setError('Email này đã được đăng ký!');
      setLoading(false);
      return;
    }

    // Save user credentials for login validation
    const newUser = {
      email: formData.email,
      name: formData.name,
      password: formData.password, // In real app, this should be hashed
      role: 'A', // Always customer
      avatar: '', // Will be synced from avatar page later
      registeredAt: new Date().toISOString()
    };
    
    // Add to registered users list
    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    
    // Also set as current user for this session
    const currentUser = {
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      avatar: newUser.avatar
    };
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    // Navigate to avatar page
    setTimeout(() => {
      navigate('/avatar');
    }, 1000);
  };

  // Simple Panda SVG Component with different pose for registration
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
        
        {/* Panda Eyes - slightly bigger for friendlier look */}
        <circle cx="50" cy="55" r="5" fill="#fff"/>
        <circle cx="70" cy="55" r="5" fill="#fff"/>
        <circle cx="50" cy="55" r="2.5" fill="#000"/>
        <circle cx="70" cy="55" r="2.5" fill="#000"/>
        
        {/* Small sparkles in eyes for welcome feeling */}
        <circle cx="51" cy="53" r="0.8" fill="#fff"/>
        <circle cx="71" cy="53" r="0.8" fill="#fff"/>
        
        {/* Panda Nose */}
        <ellipse cx="60" cy="68" rx="3" ry="2" fill="#000"/>
        
        {/* Panda Mouth - smiling for registration */}
        <path d="M 55 75 Q 60 80 65 75" stroke="#000" strokeWidth="2" fill="none"/>
        
        {/* Small blush marks for cute look */}
        <ellipse cx="42" cy="65" rx="3" ry="2" fill="#ffb3ba" opacity="0.6"/>
        <ellipse cx="78" cy="65" rx="3" ry="2" fill="#ffb3ba" opacity="0.6"/>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-32 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-200 rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-28 h-28 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
      
      {/* Decorative letters */}
      <div className="absolute top-1/4 left-8 text-6xl font-bold text-blue-300 opacity-30 rotate-12">W</div>
      <div className="absolute bottom-1/3 right-12 text-8xl font-bold text-purple-300 opacity-25 -rotate-12">e</div>
      <div className="absolute top-1/2 left-1/4 text-4xl font-bold text-pink-300 opacity-20 rotate-45">l</div>

      {/* Register Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md relative"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            <span className="text-blue-600">Join</span>{' '}
            <span className="text-green-600">E</span>
            <span className="text-red-600">n</span>
            <span className="text-yellow-600">g</span>
            <span className="text-purple-600">l</span>
            <span className="text-pink-600">i</span>
            <span className="text-blue-600">s</span>
            <span className="text-green-600">h</span>{' '}
            <span className="text-red-600">V</span>
            <span className="text-yellow-600">e</span>
            <span className="text-purple-600">r</span>
            <span className="text-pink-600">s</span>
            <span className="text-blue-600">e</span>
          </h1>
          <p className="text-gray-600 text-sm">Create your account to start learning</p>
        </div>

        {/* Panda Avatar */}
        <PandaAvatar />

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-blue-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300 placeholder-gray-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-blue-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300 placeholder-gray-500"
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
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 bg-blue-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300 placeholder-gray-500"
                placeholder="••••••••"
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

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 bg-blue-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300 placeholder-gray-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {showConfirmPassword ? (
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

          {/* Register Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </motion.button>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 