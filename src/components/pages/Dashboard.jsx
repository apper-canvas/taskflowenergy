import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TaskList from '@/components/organisms/TaskList';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { taskService } from '@/services';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
    todayCompleted: 0
  });
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadStats();
    
    // Listen for category changes from sidebar
    const handleCategoryChange = (event) => {
      setActiveCategory(event.detail);
    };
    
    window.addEventListener('categoryChanged', handleCategoryChange);
    
    return () => window.removeEventListener('categoryChanged', handleCategoryChange);
  }, []);

const loadStats = async () => {
    try {
      const statsData = await taskService.getStats();
      setStats(statsData || {
        total: 0,
        completed: 0,
        pending: 0,
        completionRate: 0,
        todayCompleted: 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const getCategoryTitle = (categoryId) => {
    switch (categoryId) {
      case 'all':
        return 'All Tasks';
      case 'today':
        return 'Due Today';
      case 'high-priority':
        return 'High Priority';
      case 'completed':
        return 'Completed Tasks';
      default:
        return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    }
  };

  const getCategoryDescription = (categoryId) => {
    switch (categoryId) {
      case 'all':
        return 'Manage all your tasks in one place';
      case 'today':
        return 'Focus on tasks due today';
      case 'high-priority':
        return 'Important tasks that need attention';
      case 'completed':
        return 'Tasks you\'ve already finished';
      default:
        return `Tasks in your ${categoryId} category`;
    }
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: 'List',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Today Done',
      value: stats.todayCompleted,
      icon: 'Calendar',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="h-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              {getCategoryTitle(activeCategory)}
            </h1>
            <p className="text-gray-600">
              {getCategoryDescription(activeCategory)}
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <Badge variant="primary" size="md" icon="TrendingUp">
              {stats.completionRate}% Complete
            </Badge>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-4 py-2 bg-surface rounded-lg"
            >
              <ApperIcon name="Zap" className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-gray-700">
                {stats.todayCompleted} completed today
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-display font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <TaskList categoryFilter={activeCategory} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;