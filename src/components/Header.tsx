import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, User, Menu, X } from 'lucide-react';
import { getUser } from '@/lib/user';

interface HeaderProps {
  className?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'success' | 'info' | 'warning';
}

// Mock notifications data
const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Chúc mừng!',
    message: 'Bạn đã hoàn thành bài học tại Nhà hàng',
    time: '5 phút trước',
    read: false,
    type: 'success'
  },
  {
    id: '2',
    title: 'Thử thách mới',
    message: 'Khám phá bài học mới tại Sân bay',
    time: '1 giờ trước',
    read: false,
    type: 'info'
  },
  {
    id: '3',
    title: 'Nhắc nhở',
    message: 'Đã 3 ngày bạn chưa học! Hãy tiếp tục hành trình',
    time: '1 ngày trước',
    read: true,
    type: 'warning'
  }
];

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const user = getUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  const handleAvatarClick = () => {
    navigate('/dashboard');
  };

  const handleLogoClick = () => {
    navigate('/world-map');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '🎉';
      case 'warning': return '⚠️';
      default: return '💡';
    }
  };

  const NotificationTooltip = () => (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <h3 className="font-semibold text-lg">Thông báo</h3>
        <p className="text-blue-100 text-sm">{unreadCount} thông báo chưa đọc</p>
      </div>
      
      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {NOTIFICATIONS.length > 0 ? (
          NOTIFICATIONS.map((notification) => (
            <motion.div
              key={notification.id}
              whileHover={{ backgroundColor: '#f8fafc' }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer active:bg-gray-100 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-1 flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate pr-2">{notification.title}</h4>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-1">{notification.message}</p>
                  <p className="text-gray-400 text-xs">{notification.time}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Không có thông báo mới</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t">
        <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors py-2 rounded-lg hover:bg-blue-50 active:bg-blue-100">
          Xem tất cả thông báo
        </button>
      </div>
    </motion.div>
  );

  return (
    <header className={`bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer min-w-0"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                E
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold">
                  <span className="text-blue-600">English</span>{' '}
                  <span className="text-purple-600">Verse</span>
                </h1>
              </div>
            </div>
          </motion.div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* User Greeting */}
            <div className="text-gray-700 hidden lg:block">
              <span className="text-sm">Xin chào, </span>
              <span className="font-medium text-gray-900">{user?.name || 'Guest'}</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.div>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && <NotificationTooltip />}
              </AnimatePresence>
            </div>

            {/* User Avatar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAvatarClick}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-gray-200 bg-white overflow-hidden"
            >
              <div className="py-4 space-y-4">
                {/* User Info */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 mx-4 rounded-xl"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold text-lg">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">Xin chào, {user?.name || 'Guest'}</p>
                    <p className="text-sm text-gray-500">Nhấn để xem dashboard</p>
                  </div>
                </motion.div>

                {/* Mobile Buttons */}
                <div className="space-y-2 px-4">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleAvatarClick();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors min-h-[56px]"
                  >
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Dashboard</span>
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="w-full flex items-center justify-between p-4 text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors min-h-[56px]"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">Thông báo</span>
                    </div>
                    {unreadCount > 0 && (
                      <div className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </div>
                    )}
                  </motion.button>
                </div>

                {/* Mobile Notifications */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 pt-4 mx-4"
                    >
                      <h4 className="font-semibold text-gray-900 px-0 mb-3">Thông báo gần đây</h4>
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {NOTIFICATIONS.slice(0, 3).map((notification, index) => (
                          <motion.div 
                            key={notification.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="px-0"
                          >
                            <div className={`p-4 rounded-xl border transition-colors active:bg-gray-50 ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                              <div className="flex items-start gap-3">
                                <span className="text-lg flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</span>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-gray-900 text-sm mb-1">{notification.title}</h5>
                                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{notification.message}</p>
                                  <p className="text-gray-400 text-xs">{notification.time}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop for closing notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};

export default Header; 