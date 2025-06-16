import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskCard from '@/components/molecules/TaskCard';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';

const Archive = () => {
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadArchivedTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [archivedTasks, searchQuery]);

  const loadArchivedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const tasks = await taskService.getArchived();
      setArchivedTasks(tasks);
    } catch (err) {
      setError(err.message || 'Failed to load archived tasks');
      toast.error('Failed to load archived tasks');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...archivedTasks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(filtered);
  };

  const handleTaskUnarchive = async (taskId) => {
    try {
      await taskService.unarchive(taskId);
      setArchivedTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task restored from archive');
    } catch (error) {
      toast.error('Failed to restore task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Permanently delete this task? This action cannot be undone.')) return;
    
    try {
      await taskService.delete(taskId);
      setArchivedTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task permanently deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const clearAllArchive = async () => {
    if (!window.confirm('Permanently delete all archived tasks? This action cannot be undone.')) return;
    
    try {
      // Delete all archived tasks
      await Promise.all(archivedTasks.map(task => taskService.delete(task.Id)));
      setArchivedTasks([]);
      toast.success('All archived tasks deleted');
    } catch (error) {
      toast.error('Failed to clear archive');
    }
  };

  const ArchiveTaskCard = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-700 mb-1 break-words">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500 mb-2 break-words">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">
              Archived {new Date(task.completedAt || task.createdAt).toLocaleDateString()}
            </span>
            {task.completed && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-success/10 text-success">
                <ApperIcon name="Check" className="w-3 h-3 mr-1" />
                Completed
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            icon="RotateCcw"
            onClick={() => handleTaskUnarchive(task.Id)}
            className="text-primary hover:text-primary"
            title="Restore from archive"
          />
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={() => handleTaskDelete(task.Id)}
            className="text-error hover:text-error"
            title="Delete permanently"
          />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="h-full max-w-full overflow-hidden">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <SkeletonLoader count={5} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full max-w-full overflow-hidden">
        <div className="max-w-4xl mx-auto p-6">
          <ErrorState 
            message={error}
            onRetry={loadArchivedTasks}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Archive
            </h1>
            <p className="text-gray-600">
              View and manage your archived tasks
            </p>
          </div>
          
          {archivedTasks.length > 0 && (
            <div className="mt-4 sm:mt-0">
              <Button
                variant="outline"
                icon="Trash2"
                onClick={clearAllArchive}
                className="text-error border-error hover:bg-error hover:text-white"
              >
                Clear All
              </Button>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="Archive" className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-gray-900">
                  {archivedTasks.length}
                </p>
                <p className="text-sm text-gray-600">
                  {archivedTasks.length === 1 ? 'Archived task' : 'Archived tasks'}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Completed: {archivedTasks.filter(t => t.completed).length}
              </p>
              <p className="text-sm text-gray-500">
                Incomplete: {archivedTasks.filter(t => !t.completed).length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        {archivedTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar
              onSearch={handleSearch}
              onClear={handleClearSearch}
              placeholder="Search archived tasks..."
            />
          </motion.div>
        )}

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {filteredTasks.length === 0 && archivedTasks.length === 0 ? (
            <EmptyState
              title="No archived tasks"
              description="Completed or archived tasks will appear here"
              icon="Archive"
            />
          ) : filteredTasks.length === 0 && searchQuery ? (
            <EmptyState
              title="No matching tasks"
              description="Try adjusting your search query"
              icon="Search"
              actionLabel="Clear search"
              onAction={handleClearSearch}
            />
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.Id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    delay: index * 0.05,
                    layout: { duration: 0.3 }
                  }}
                >
                  <ArchiveTaskCard task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Results Summary */}
        {filteredTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4"
          >
            <p className="text-sm text-gray-500">
              Showing {filteredTasks.length} of {archivedTasks.length} archived tasks
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Archive;