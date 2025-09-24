
import React from 'react';

const ProductionMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm text-gray-500 mb-2">Production Efficiency</h3>
        <div className="text-3xl font-semibold mb-2">94.7%</div>
        <div className="flex items-center">
          <span className="text-green-500 text-sm font-medium">↑ 1.2%</span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm text-gray-500 mb-2">Quality Rate</h3>
        <div className="text-3xl font-semibold mb-2">98.3%</div>
        <div className="flex items-center">
          <span className="text-green-500 text-sm font-medium">↑ 0.3%</span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm text-gray-500 mb-2">On-Time Production</h3>
        <div className="text-3xl font-semibold mb-2">91.5%</div>
        <div className="flex items-center">
          <span className="text-red-500 text-sm font-medium">↓ 0.8%</span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm text-gray-500 mb-2">Production Volume</h3>
        <div className="text-3xl font-semibold mb-2">12.4K</div>
        <div className="flex items-center">
          <span className="text-green-500 text-sm font-medium">↑ 3.7%</span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default ProductionMetrics;
