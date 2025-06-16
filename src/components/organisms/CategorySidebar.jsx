import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { categoryService, taskService } from '@/services';

const CategorySidebar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ]);
      
      // Update task counts
      const categoriesWithCounts = categoriesData.map(category => {
        const taskCount = tasksData.filter(task => 
          task.categoryId === category.name.toLowerCase() && !task.archived
        ).length;
        return { ...category, taskCount };
      });
      
      setCategories(categoriesWithCounts);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    // Emit custom event for parent components to listen to
    window.dispatchEvent(new CustomEvent('categoryChanged', { detail: categoryId }));
  };

  const quickFilters = [
    { id: 'all', label: 'All Tasks', icon: 'List', count: categories.reduce((sum, cat) => sum + cat.taskCount, 0) },
    { id: 'today', label: 'Due Today', icon: 'Calendar', count: 0 },
    { id: 'high-priority', label: 'High Priority', icon: 'AlertCircle', count: 0 },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle', count: 0 }
  ];

  if (loading) {
    return (
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-sm font-display font-semibold text-gray-900 mb-3">Categories</h2>
        </div>
        <SkeletonLoader count={5} type="category" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState 
          message={error}
          onRetry={loadCategories}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-display font-semibold text-gray-900">Overview</h2>
        </div>

        {/* Quick Filters */}
        <div className="space-y-1">
          {quickFilters.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ x: 4 }}
              onClick={() => handleCategoryClick(filter.id)}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200
                ${activeCategory === filter.id 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <ApperIcon 
                  name={filter.icon} 
                  className={`w-4 h-4 ${activeCategory === filter.id ? 'text-white' : 'text-gray-500'}`}
                />
                <span>{filter.label}</span>
              </div>
              <Badge 
                variant={activeCategory === filter.id ? 'accent' : 'default'} 
                size="xs"
              >
                {filter.count}
              </Badge>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-display font-semibold text-gray-900">Categories</h3>
          <Button
            variant="ghost"
            size="sm"
            icon="Plus"
            onClick={() => setShowAddForm(true)}
            className="text-xs p-1"
          />
        </div>

        {/* Categories List */}
        <div className="space-y-1">
          <AnimatePresence>
            {categories.map((category, index) => (
              <motion.button
                key={category.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                onClick={() => handleCategoryClick(category.name.toLowerCase())}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeCategory === category.name.toLowerCase()
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <ApperIcon 
                    name={category.icon} 
                    className={`w-4 h-4 ${activeCategory === category.name.toLowerCase() ? 'text-white' : 'text-gray-500'}`}
                  />
                  <span className="truncate">{category.name}</span>
                </div>
                <Badge 
                  variant={activeCategory === category.name.toLowerCase() ? 'accent' : 'default'} 
                  size="xs"
                >
                  {category.taskCount}
                </Badge>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8">
            <ApperIcon name="FolderPlus" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">No categories yet</p>
            <Button
              variant="primary"
              size="sm"
              icon="Plus"
              onClick={() => setShowAddForm(true)}
            >
              Add Category
            </Button>
          </div>
        )}
      </div>

      {/* Progress Ring */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500">Daily Progress</p>
            <p className="text-lg font-display font-bold text-gray-900">75%</p>
          </div>
          <div className="relative">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx={24}
                cy={24}
                r={20}
                stroke="currentColor"
                strokeWidth={3}
                fill="transparent"
                className="text-gray-200"
              />
              <motion.circle
                cx={24}
                cy={24}
                r={20}
                stroke="currentColor"
                strokeWidth={3}
                fill="transparent"
                strokeDasharray={126}
                strokeDashoffset={31.5}
                className="text-primary"
                initial={{ strokeDashoffset: 126 }}
                animate={{ strokeDashoffset: 31.5 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;