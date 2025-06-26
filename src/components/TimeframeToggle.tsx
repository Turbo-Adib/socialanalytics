import React from 'react';

interface TimeframeToggleProps {
  value: 'daily' | 'monthly';
  onChange: (value: 'daily' | 'monthly') => void;
}

const TimeframeToggle: React.FC<TimeframeToggleProps> = ({ value, onChange }) => {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
      <button
        onClick={() => onChange('daily')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
          value === 'daily'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Daily
      </button>
      <button
        onClick={() => onChange('monthly')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
          value === 'monthly'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Monthly
      </button>
    </div>
  );
};

export default TimeframeToggle;