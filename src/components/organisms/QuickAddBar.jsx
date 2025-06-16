import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services";

const QuickAddBar = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');

  const handleSubmit = async (e) => {
    e.preventDefault();
if (!taskTitle.trim()) return;

    setLoading(true);
    try {
      await taskService.create({
        title: taskTitle.trim(),
        priority,
        categoryId: category
      });
      
      setTaskTitle('');
      setPriority('medium');
      setCategory('general');
      setShowAdvanced(false);
      
      toast.success('Task added successfully! 🎉');
      
      // Emit event to refresh task list
      if (typeof window !== 'undefined' && window.CustomEvent) {
        window.dispatchEvent(new CustomEvent('taskAdded'));
      } else if (typeof window !== 'undefined') {
        // Fallback for older browsers
        const event = document.createEvent('Event');
        event.initEvent('taskAdded', true, true);
        window.dispatchEvent(event);
      }
    } catch (error) {
      toast.error('Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const priorities = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' }
  ];

  const categories = [
    { value: 'general', label: 'General', icon: 'Folder' },
    { value: 'work', label: 'Work', icon: 'Briefcase' },
    { value: 'personal', label: 'Personal', icon: 'User' },
    { value: 'home', label: 'Home', icon: 'Home' }
  ];

  return (
    <motion.div
    initial={{
        y: 100
    }}
    animate={{
        y: 0
    }}
    className="bg-white border-t border-gray-200 p-4">
    <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main Input */}
        <div className="flex items-center space-x-3">
            <div className="flex-1">
                <Input
                    type="text"
                    placeholder="Add a new task... (Press Enter to save)"
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    icon="Plus"
                    className="border-0 bg-surface/50 focus:bg-white" />
            </div>
            <Button
                variant="ghost"
                size="md"
                icon="Settings"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={showAdvanced ? "text-primary bg-primary/10" : "text-gray-500"} />
            <Button
                type="submit"
                variant="primary"
                size="md"
                icon="Send"
                loading={loading}
                disabled={!taskTitle.trim() || loading} />
        </div>
        {/* Advanced Options */}
        <motion.div
            initial={false}
            animate={{
                height: showAdvanced ? "auto" : 0,
                opacity: showAdvanced ? 1 : 0
            }}
            transition={{
                duration: 0.2
            }}
            className="overflow-hidden">
            <div
                className="flex items-center justify-between pt-3 border-t border-gray-200">
                {/* Priority Selection */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Priority:</span>
                    <div className="flex space-x-1">
                        {priorities.map(p => <motion.button
                            key={p.value}
                            type="button"
                            whileHover={{
                                scale: 1.05
                            }}
                            whileTap={{
                                scale: 0.95
                            }}
                            onClick={() => setPriority(p.value)}
                            className={`
                      transition-all duration-200
                      ${priority === p.value ? "ring-2 ring-offset-1 ring-primary" : ""}
                    `}>
                            <Badge variant={priority === p.value ? p.color : "default"} size="sm">
                                {p.label}
                            </Badge>
                        </motion.button>)}
                    </div>
                </div>
                {/* Category Selection */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Category:</span>
                    <div className="flex space-x-1">
                        {categories.map(c => <motion.button
                            key={c.value}
                            type="button"
                            whileHover={{
                                scale: 1.05
                            }}
                            whileTap={{
                                scale: 0.95
                            }}
                            onClick={() => setCategory(c.value)}
                            className={`
                      p-2 rounded-lg border transition-all duration-200
                      ${category === c.value ? "border-primary bg-primary text-white" : "border-gray-300 text-gray-600 hover:border-gray-400"}
                    `}>
                            <ApperIcon name={c.icon} className="w-4 h-4" />
                        </motion.button>)}
                    </div>
                </div>
            </div>
        </motion.div>
    </form>
</motion.div>
  );
};

export default QuickAddBar;