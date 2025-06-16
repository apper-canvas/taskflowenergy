import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import { taskService } from '@/services';

const Analytics = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
    todayCompleted: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [tasksData, statsData] = await Promise.all([
        taskService.getAll(),
        taskService.getStats()
      ]);
      
      setStats(statsData);
      
      // Generate weekly completion data
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      const weeklyStats = weekDays.map(day => {
        const dayString = day.toDateString();
        const completedOnDay = tasksData.filter(task => 
          task.completed && 
          task.completedAt && 
          new Date(task.completedAt).toDateString() === dayString
        ).length;
        
        return {
          day: format(day, 'EEE'),
          date: day,
          completed: completedOnDay,
          isToday: day.toDateString() === new Date().toDateString()
        };
      });
      
      setWeeklyData(weeklyStats);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const priorityStats = [
    { label: 'High Priority', value: 8, color: 'bg-error', percentage: 32 },
    { label: 'Medium Priority', value: 12, color: 'bg-warning', percentage: 48 },
    { label: 'Low Priority', value: 5, color: 'bg-success', percentage: 20 }
  ];

  const categoryStats = [
    { label: 'Work', value: 12, color: 'bg-primary', icon: 'Briefcase' },
    { label: 'Personal', value: 8, color: 'bg-success', icon: 'User' },
    { label: 'Home', value: 5, color: 'bg-warning', icon: 'Home' },
    { label: 'Health', value: 0, color: 'bg-error', icon: 'Heart' }
  ];

  const insightCards = [
    {
      title: 'Most Productive Day',
      value: 'Tuesday',
      description: 'You complete the most tasks on Tuesdays',
      icon: 'Calendar',
      color: 'text-primary'
    },
    {
      title: 'Average Daily Tasks',
      value: '3.2',
      description: 'Tasks completed per day this week',
      icon: 'BarChart',
      color: 'text-success'
    },
    {
      title: 'Current Streak',
      value: '5 days',
      description: 'Days with at least one completed task',
      icon: 'Flame',
      color: 'text-accent'
    },
    {
      title: 'Time to Complete',
      value: '2.1 days',
      description: 'Average time from creation to completion',
      icon: 'Clock',
      color: 'text-warning'
    }
  ];

  if (loading) {
    return (
      <div className="h-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <SkeletonLoader count={4} type="stat" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Analytics
          </h1>
          <p className="text-gray-600">
            Track your productivity and task completion patterns
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {insightCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
                  <ApperIcon name={card.icon} className={`w-5 h-5 ${card.color}`} />
                </div>
                <Badge variant="default" size="xs">New</Badge>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </h3>
              <p className="text-2xl font-display font-bold text-gray-900 mb-2">
                {card.value}
              </p>
              <p className="text-xs text-gray-500">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-semibold text-gray-900">
                Weekly Activity
              </h3>
              <ApperIcon name="BarChart3" className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${
                      day.isToday ? 'text-primary' : 'text-gray-700'
                    }`}>
                      {day.day}
                    </span>
                    {day.isToday && (
                      <Badge variant="primary" size="xs">Today</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 w-8 text-right">
                      {day.completed}
                    </span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((day.completed / 10) * 100, 100)}%` }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`h-full rounded-full ${
                          day.isToday ? 'bg-primary' : 'bg-success'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Priority Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-semibold text-gray-900">
                Priority Distribution
              </h3>
              <ApperIcon name="PieChart" className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {priorityStats.map((priority, index) => (
                <motion.div
                  key={priority.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                    <span className="text-sm font-medium text-gray-700">
                      {priority.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 w-8 text-right">
                      {priority.value}
                    </span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${priority.percentage}%` }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`h-full rounded-full ${priority.color}`}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8">
                      {priority.percentage}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Tasks by Category
            </h3>
            <ApperIcon name="Folder" className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryStats.map((category, index) => (
              <motion.div
                key={category.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${category.color}/10 flex items-center justify-center`}>
                    <ApperIcon name={category.icon} className={`w-4 h-4 ${category.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {category.label}
                  </span>
                </div>
                <p className="text-2xl font-display font-bold text-gray-900">
                  {category.value}
                </p>
                <p className="text-xs text-gray-500">
                  {category.value === 0 ? 'No tasks yet' : 'Active tasks'}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Completion Rate Circle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center"
        >
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">
            Overall Completion Rate
          </h3>
          
          <div className="relative inline-flex">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx={64}
                cy={64}
                r={56}
                stroke="currentColor"
                strokeWidth={8}
                fill="transparent"
                className="text-gray-200"
              />
              <motion.circle
                cx={64}
                cy={64}
                r={56}
                stroke="currentColor"
                strokeWidth={8}
                fill="transparent"
                strokeDasharray={352}
                strokeDashoffset={352 - (352 * stats.completionRate) / 100}
                className="text-primary"
                initial={{ strokeDashoffset: 352 }}
                animate={{ strokeDashoffset: 352 - (352 * stats.completionRate) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-gray-900">
                  {stats.completionRate}%
                </p>
                <p className="text-sm text-gray-500">Complete</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center space-x-8">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-success">
                {stats.completed}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-warning">
                {stats.pending}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;