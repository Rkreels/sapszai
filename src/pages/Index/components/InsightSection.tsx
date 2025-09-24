
import React from 'react';

interface InsightSectionProps {
  title: string;
  count?: number;
}

const InsightSection: React.FC<InsightSectionProps> = ({ title, count = 2 }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="sap-section-title flex items-center">
          {`${title} (${count})`}
          <button 
            onClick={() => {}}
            className="ml-2 text-blue-600"
          >
            <span className="text-xs">▼</span>
          </button>
        </h2>
        
        <div>
          <button className="text-sm text-blue-500">Add Tiles</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded bg-white p-6 h-64 flex flex-col items-center justify-center">
          <p className="text-gray-500">No items available</p>
        </div>
        
        <div className="border rounded bg-white p-6 h-64 flex flex-col items-center justify-center">
          <p className="text-gray-500">No items available</p>
        </div>
      </div>
    </div>
  );
};

export default InsightSection;
