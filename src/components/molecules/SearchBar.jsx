import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchBar = ({ onSearch, onClear, placeholder = "Search tasks..." }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (value) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        icon="Search"
        iconPosition="left"
        className="pr-12"
      />
      
      {query && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={handleClear}
            className="p-1 h-8 w-8"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchBar;