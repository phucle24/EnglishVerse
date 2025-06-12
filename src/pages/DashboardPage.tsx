import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Trophy, 
  BookOpen, 
  Clock, 
  Target, 
  Settings,
  Edit3,
  Camera,
  LogOut
} from 'lucide-react';
import { getUser } from '@/lib/user';
import { getWorkflowState } from '@/lib/workflow';
import Header from '@/components/Header';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState('profile');

  // Mock user statistics
  const stats = {
    totalLessons: 12,
    completedLessons: 8,
    currentStreak: 5,
    totalHours: 24,
    level: 'Intermediate',
    nextLevel: 'Advanced',
    progressToNext: 75
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('registeredUsers');
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/avatar');
  };

  const TabButton = ({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl transition-all duration-200 min-h-[44px] text-sm sm:text-base whitespace-nowrap ${
        activeTab === id
          ? 'bg-blue-500 text-white shadow-lg'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </motion.button>
  );

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = 'blue' 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color?: string 
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-gray-600 text-xs sm:text-sm mb-1 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-xl bg-${color}-100 text-${color}-600 flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Quản lý thông tin cá nhân và theo dõi tiến độ học tập</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <TabButton id="profile" label="Hồ sơ" icon={<User className="w-4 h-4" />} />
          <TabButton id="progress" label="Tiến độ" icon={<Trophy className="w-4 h-4" />} />
          <TabButton id="settings" label="Cài đặt" icon={<Settings className="w-4 h-4" />} />
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg mx-auto">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg sm:text-2xl">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEditProfile}
                    className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors min-h-[44px] min-w-[44px]"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                </div>
                
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate px-2">{user?.name || 'Guest User'}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 truncate px-2">{user?.email || 'No email'}</p>
                
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 sm:p-4 rounded-xl mb-4">
                  <p className="text-xs sm:text-sm opacity-90">Current Level</p>
                  <p className="text-base sm:text-lg font-bold">{stats.level}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditProfile}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 sm:py-4 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 min-h-[48px] text-sm sm:text-base"
                >
                  <Edit3 className="w-4 h-4" />
                  Chỉnh sửa hồ sơ
                </motion.button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <StatCard
                  title="Bài học hoàn thành"
                  value={`${stats.completedLessons}/${stats.totalLessons}`}
                  icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />}
                  color="green"
                />
                <StatCard
                  title="Streak hiện tại"
                  value={`${stats.currentStreak} ngày`}
                  icon={<Target className="w-5 h-5 sm:w-6 sm:h-6" />}
                  color="orange"
                />
                <StatCard
                  title="Tổng thời gian học"
                  value={`${stats.totalHours}h`}
                  icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6" />}
                  color="purple"
                />
                <StatCard
                  title="Cấp độ tiếp theo"
                  value={stats.nextLevel}
                  icon={<Trophy className="w-5 h-5 sm:w-6 sm:h-6" />}
                  color="blue"
                />
              </div>

              {/* Progress to Next Level */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 mt-4 sm:mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Tiến độ đến cấp độ tiếp theo</h3>
                  <span className="text-blue-600 font-medium text-sm sm:text-base">{stats.progressToNext}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.progressToNext}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                  />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">Hoàn thành thêm 4 bài học để đạt cấp độ {stats.nextLevel}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Báo cáo tiến độ học tập</h2>
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-sm sm:text-base">Tính năng báo cáo chi tiết đang được phát triển</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">Bạn sẽ có thể xem biểu đồ tiến độ, thống kê chi tiết và nhiều hơn nữa!</p>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Cài đặt tài khoản</h2>
            
            <div className="space-y-6">
              {/* Account Settings */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Email</p>
                      <p className="text-gray-600 text-xs sm:text-sm truncate">{user?.email || 'Chưa cập nhật'}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm px-3 py-2 rounded-lg hover:bg-blue-50 min-h-[36px]">
                      Thay đổi
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Mật khẩu</p>
                      <p className="text-gray-600 text-xs sm:text-sm">••••••••</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm px-3 py-2 rounded-lg hover:bg-blue-50 min-h-[36px]">
                      Thay đổi
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-red-600 mb-4">Vùng nguy hiểm</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors min-h-[48px] text-sm sm:text-base"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 