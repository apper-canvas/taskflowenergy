import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'task' }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const TaskSkeleton = () => (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-start space-x-3">
        {/* Checkbox skeleton */}
        <div className="w-5 h-5 bg-gray-200 rounded border-2 animate-pulse mt-0.5"></div>
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          
          <div className="flex items-center space-x-2 mt-3">
            <div className="h-5 bg-gray-200 rounded-full w-12 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const CategorySkeleton = () => (
    <div className="p-3 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  const StatSkeleton = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  const getSkeletonComponent = () => {
    switch (type) {
      case 'category':
        return CategorySkeleton;
      case 'stat':
        return StatSkeleton;
      default:
        return TaskSkeleton;
    }
  };

  const SkeletonComponent = getSkeletonComponent();

  return (
    <div className="space-y-4">
      {skeletons.map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <SkeletonComponent />
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;