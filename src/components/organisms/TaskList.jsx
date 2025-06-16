import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import TaskCard from "@/components/molecules/TaskCard";
import SearchBar from "@/components/molecules/SearchBar";
import FilterBar from "@/components/molecules/FilterBar";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import ErrorState from "@/components/molecules/ErrorState";
import EmptyState from "@/components/molecules/EmptyState";
import { taskService } from "@/services";

const TaskList = ({ categoryFilter = 'all' }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    all: true,
    pending: false,
    completed: false,
    high: false,
    today: false,
    priority_high: false,
    priority_medium: false,
    priority_low: false
  });

  useEffect(() => {
    loadTasks();
    
    // Listen for task added events
    const handleTaskAdded = () => loadTasks();
    window.addEventListener('taskAdded', handleTaskAdded);
    
    return () => window.removeEventListener('taskAdded', handleTaskAdded);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, searchQuery, filters, categoryFilter]);

const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const tasksData = await taskService.getAll();
      setTasks((tasksData || []).filter(task => !task.archived));
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Apply category filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'today') {
        const today = new Date().toDateString();
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false;
          return new Date(task.dueDate).toDateString() === today;
        });
      } else if (categoryFilter === 'high-priority') {
        filtered = filtered.filter(task => task.priority === 'high');
      } else if (categoryFilter === 'completed') {
        filtered = filtered.filter(task => task.completed);
} else {
        filtered = filtered.filter(task => 
          task.category_id === categoryFilter
        );
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Apply status filters
    if (filters.pending) {
      filtered = filtered.filter(task => !task.completed);
    }
    if (filters.completed) {
      filtered = filtered.filter(task => task.completed);
    }

    // Apply priority filters
    if (filters.priority_high) {
      filtered = filtered.filter(task => task.priority === 'high');
    }
    if (filters.priority_medium) {
      filtered = filtered.filter(task => task.priority === 'medium');
    }
    if (filters.priority_low) {
      filtered = filtered.filter(task => task.priority === 'low');
    }

    // Apply today filter
    if (filters.today) {
      const today = new Date().toDateString();
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate).toDateString() === today;
      });
    }

    // Apply high priority filter
    if (filters.high) {
      filtered = filtered.filter(task => task.priority === 'high');
    }

    setFilteredTasks(filtered);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value,
      // Reset 'all' when other filters are applied
      all: filterKey === 'all' ? value : (value ? false : prev.all)
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      all: true,
      pending: false,
      completed: false,
      high: false,
      today: false,
      priority_high: false,
      priority_medium: false,
      priority_low: false
    });
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadTasks}
      />
    );
  }

  return (
    <div className="space-y-6">
    {/* Search and Filters */}
    <div className="space-y-4">
        <SearchBar
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search tasks..." />
        <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters} />
    </div>
    {/* Task List */}
    <div className="space-y-3">
        {filteredTasks.length === 0 && !loading ? <EmptyState
            title="No tasks found"
            description={searchQuery || Object.values(filters).some(f => f && filters.all !== f) ? "Try adjusting your search or filters" : "Create your first task to get started!"}
icon={searchQuery || Object.values(filters).some(f => f && filters.all !== f) ? "Search" : "CheckSquare"}
            actionLabel={searchQuery || Object.values(filters).some(f => f && filters.all !== f) ? "Clear filters" : "Add your first task"}
            onAction={searchQuery || Object.values(filters).some(f => f && filters.all !== f) ? handleClearFilters : () => window.dispatchEvent(new window.CustomEvent("openQuickAdd"))} /> : <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, index) => <motion.div
                key={task.Id}
                layout
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                exit={{
                    opacity: 0,
                    y: -20,
                    scale: 0.95
                }}
                transition={{
                    delay: index * 0.05,

                    layout: {
                        duration: 0.3
                    }
                }}>
                <TaskCard
                    task={task}
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                    showCategory={categoryFilter === "all"} />
            </motion.div>)}
        </AnimatePresence>}
    </div>
    {/* Results Summary */}
    {filteredTasks.length > 0 && <motion.div
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
className="text-center py-4">
        <p className="text-sm text-gray-500">Showing {filteredTasks.length} of {tasks.length} tasks
                      </p>
    </motion.div>}
</div>
  );
};

export default TaskList;