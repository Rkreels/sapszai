
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    label: string;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend }) => {
  return (
    <div className="p-4">
      <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
      <div className="text-3xl font-semibold mb-2">{value}</div>
      {trend && (
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm ${
            trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-xs text-gray-500">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
