import React from 'react';

interface TimeframeToggleProps {
  value: 'daily' | 'monthly';
  onChange: (value: 'daily' | 'monthly') => void;
}

const TimeframeToggle: React.FC<TimeframeToggleProps> = ({ value, onChange }) => {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1">
      <button
        onClick={() => onChange('daily')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
          value === 'daily'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-gray-400 dark:text-gray-400 hover:text-gray-200 dark:hover:text-gray-300'
        }`}
      >
        Daily
      </button>
      <button
        onClick={() => onChange('monthly')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
          value === 'monthly'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-gray-400 dark:text-gray-400 hover:text-gray-200 dark:hover:text-gray-300'
        }`}
      >
        Monthly
      </button>
    </div>
  );
};

export default TimeframeToggle;