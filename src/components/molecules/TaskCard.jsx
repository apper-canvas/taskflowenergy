import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { taskService } from '@/services';

const TaskCard = ({ task, onUpdate, onDelete, showCategory = false }) => {
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const updatedTask = await taskService.update(task.Id, {
        completed: !task.completed
      });
      onUpdate(updatedTask);
      toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed! 🎉');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setLoading(true);
    try {
      await taskService.delete(task.Id);
      onDelete(task.Id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    setLoading(true);
    try {
      const updatedTask = await taskService.archive(task.Id);
      onUpdate(updatedTask);
      toast.success('Task archived');
    } catch (error) {
      toast.error('Failed to archive task');
    } finally {
      setLoading(false);
    }
  };

  const formatDueDate = (date) => {
    if (!date) return null;
    const dueDate = new Date(date);
    if (isToday(dueDate)) return 'Today';
    return format(dueDate, 'MMM d');
  };

  const getDueDateStatus = (date) => {
    if (!date) return null;
    const dueDate = new Date(date);
    if (isPast(dueDate) && !task.completed) return 'overdue';
    if (isToday(dueDate)) return 'today';
    return 'upcoming';
  };

  const dueDateStatus = getDueDateStatus(task.dueDate);
  const formattedDueDate = formatDueDate(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
      className={`
        bg-white rounded-xl p-4 border shadow-sm transition-all duration-200 group
        ${task.completed ? 'bg-gray-50 border-gray-200' : 'border-gray-200 hover:border-gray-300'}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={loading}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Priority */}
          <div className="flex items-start justify-between">
            <h3 className={`text-sm font-medium break-words ${
              task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            
            {/* Priority Indicator */}
            <div className="flex items-center space-x-2 ml-2">
              {task.priority === 'high' && (
                <Badge variant="high" size="xs" pulse={!task.completed}>
                  High
                </Badge>
              )}
              {task.priority === 'medium' && (
                <Badge variant="medium" size="xs">
                  Med
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className={`mt-1 text-sm break-words ${
              task.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-3">
              {/* Category */}
              {showCategory && task.categoryId && (
                <Badge variant="default" size="xs" icon="Folder">
                  {task.categoryId}
                </Badge>
              )}

              {/* Due Date */}
              {formattedDueDate && (
                <Badge 
                  variant={dueDateStatus === 'overdue' ? 'error' : dueDateStatus === 'today' ? 'warning' : 'default'}
                  size="xs" 
                  icon="Calendar"
                >
                  {formattedDueDate}
                </Badge>
              )}
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ 
                opacity: showActions ? 1 : 0, 
                x: showActions ? 0 : 10 
              }}
              className="flex items-center space-x-1"
            >
              <Button
                variant="ghost"
                size="sm"
                icon="Edit3"
                onClick={() => {/* Handle edit */}}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Button
                variant="ghost"
                size="sm"
                icon="Archive"
                onClick={handleArchive}
                disabled={loading}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Button
                variant="ghost"
                size="sm"
                icon="Trash2"
                onClick={handleDelete}
                disabled={loading}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;