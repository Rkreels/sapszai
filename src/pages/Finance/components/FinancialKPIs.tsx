
import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Wallet, BarChart2 } from 'lucide-react';

const FinancialKPIs: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Revenue (MTD)</h3>
            <div className="text-3xl font-semibold mb-2">$4.28M</div>
          </div>
          <span className="p-2 bg-green-100 rounded-full">
            <DollarSign className="h-5 w-5 text-green-600" />
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-green-500 text-sm font-medium flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1" /> 12.8%
          </span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Net Profit</h3>
            <div className="text-3xl font-semibold mb-2">$965K</div>
          </div>
          <span className="p-2 bg-blue-100 rounded-full">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-green-500 text-sm font-medium flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1" /> 8.3%
          </span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Operating Expenses</h3>
            <div className="text-3xl font-semibold mb-2">$1.72M</div>
          </div>
          <span className="p-2 bg-red-100 rounded-full">
            <Wallet className="h-5 w-5 text-red-600" />
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-red-500 text-sm font-medium flex items-center">
            <ArrowDownRight className="h-3 w-3 mr-1" /> 5.2%
          </span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Cash Flow</h3>
            <div className="text-3xl font-semibold mb-2">$658K</div>
          </div>
          <span className="p-2 bg-purple-100 rounded-full">
            <BarChart2 className="h-5 w-5 text-purple-600" />
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-green-500 text-sm font-medium flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1" /> 3.7%
          </span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialKPIs;
