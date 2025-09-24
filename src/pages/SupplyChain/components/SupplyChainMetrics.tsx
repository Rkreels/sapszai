
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Package, Truck, Users, Clock } from 'lucide-react';

const SupplyChainMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Open Purchase Orders</h3>
            <div className="text-3xl font-semibold mb-2">248</div>
          </div>
          <span className="p-2 bg-blue-100 rounded-full">
            <Package className="h-5 w-5 text-blue-600" />
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-green-500 text-sm font-medium flex items-center">
            <ArrowDownRight className="h-3 w-3 mr-1" /> 7.2%
          </span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">On-Time Delivery</h3>
            <div className="text-3xl font-semibold mb-2">93.7%</div>
          </div>
          <span className="p-2 bg-green-100 rounded-full">
            <Truck className="h-5 w-5 text-green-600" />
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-green-500 text-sm font-medium flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1" /> 2.3%
          </span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Supplier Performance</h3>
            <div className="text-3xl font-semibold mb-2">87.2%</div>
          </div>
          <span className="p-2 bg-yellow-100 rounded-full">
            <Users className="h-5 w-5 text-yellow-600" />
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-red-500 text-sm font-medium flex items-center">
            <ArrowDownRight className="h-3 w-3 mr-1" /> 1.8%
          </span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Order Lead Time</h3>
            <div className="text-3xl font-semibold mb-2">5.3 days</div>
          </div>
          <span className="p-2 bg-purple-100 rounded-full">
            <Clock className="h-5 w-5 text-purple-600" />
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-green-500 text-sm font-medium flex items-center">
            <ArrowDownRight className="h-3 w-3 mr-1" /> 0.4 days
          </span>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainMetrics;
