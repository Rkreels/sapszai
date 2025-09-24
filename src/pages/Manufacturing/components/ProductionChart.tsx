
import React from 'react';
import { Card } from '../../../components/ui/card';
import { BarChart2 } from 'lucide-react';

const ProductionChart: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Production Overview</h2>
        <div className="text-sm text-gray-500">May 2025</div>
      </div>
      
      <div className="h-80 bg-gray-50 rounded-md flex items-center justify-center">
        <div className="text-center">
          <BarChart2 className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">Production overview chart will display here</p>
          <p className="text-sm text-gray-400 mt-1">showing actual vs planned production quantities</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="border rounded-md p-4">
          <h3 className="text-sm text-gray-500 mb-2">Planned Production</h3>
          <div className="text-2xl font-semibold">2,450 units</div>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="text-sm text-gray-500 mb-2">Actual Production</h3>
          <div className="text-2xl font-semibold">2,187 units</div>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="text-sm text-gray-500 mb-2">Efficiency Rate</h3>
          <div className="text-2xl font-semibold">92.5%</div>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="text-sm text-gray-500 mb-2">Quality Rate</h3>
          <div className="text-2xl font-semibold">98.3%</div>
        </div>
      </div>
    </Card>
  );
};

export default ProductionChart;
