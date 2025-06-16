import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  showClearAll = true 
}) => {
  const filterOptions = [
    { key: 'all', label: 'All Tasks', icon: 'List' },
    { key: 'pending', label: 'Pending', icon: 'Clock' },
    { key: 'completed', label: 'Completed', icon: 'CheckCircle' },
    { key: 'high', label: 'High Priority', icon: 'AlertCircle' },
    { key: 'today', label: 'Due Today', icon: 'Calendar' }
  ];

  const priorityFilters = [
    { key: 'high', label: 'High', variant: 'error' },
    { key: 'medium', label: 'Medium', variant: 'warning' },
    { key: 'low', label: 'Low', variant: 'success' }
  ];

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.key}
            variant={filters[option.key] ? 'primary' : 'outline'}
            size="sm"
            icon={option.icon}
            onClick={() => onFilterChange(option.key, !filters[option.key])}
            className="text-xs"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Priority Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700 mr-2">Priority:</span>
        {priorityFilters.map((priority) => (
          <motion.button
            key={priority.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(`priority_${priority.key}`, !filters[`priority_${priority.key}`])}
            className={`
              transition-all duration-200
              ${filters[`priority_${priority.key}`] ? 'ring-2 ring-offset-1 ring-primary' : ''}
            `}
          >
            <Badge
              variant={filters[`priority_${priority.key}`] ? priority.variant : 'default'}
              size="sm"
            >
              {priority.label}
            </Badge>
          </motion.button>
        ))}
      </div>

      {/* Clear All */}
      {hasActiveFilters && showClearAll && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear all filters
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FilterBar;