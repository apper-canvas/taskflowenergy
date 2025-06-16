import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label,
  type = 'text',
  error,
  helpText,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value || props.defaultValue;

  const inputClasses = `
    w-full px-4 py-3 text-gray-900 bg-white border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    ${error ? 'border-error' : 'border-gray-300 hover:border-gray-400'}
    ${icon && iconPosition === 'left' ? 'pl-11' : ''}
    ${icon && iconPosition === 'right' ? 'pr-11' : ''}
    ${className}
  `;

  return (
    <div className="relative">
      {/* Floating Label */}
      {label && (
        <motion.label
          animate={{
            scale: focused || hasValue ? 0.85 : 1,
            y: focused || hasValue ? -10 : 8,
            color: error ? '#EF4444' : focused ? '#5B47E0' : '#6B7280'
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-4 z-10 px-1 bg-white pointer-events-none font-medium transform-gpu origin-left"
        >
          {label}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <ApperIcon 
              name={icon} 
              className={`w-5 h-5 ${error ? 'text-error' : 'text-gray-400'}`}
            />
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;