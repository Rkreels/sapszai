
import React from 'react';
import { Button } from '../../../components/ui/button';
import { Download } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import { Skeleton } from '../../../components/ui/skeleton';

// Sample data for charts
const salesPerformanceData = [
  { month: 'Jan', sales: 65, target: 45 },
  { month: 'Feb', sales: 59, target: 45 },
  { month: 'Mar', sales: 80, target: 60 },
  { month: 'Apr', sales: 81, target: 60 },
  { month: 'May', sales: 56, target: 50 },
  { month: 'Jun', sales: 55, target: 50 },
  { month: 'Jul', sales: 40, target: 40 },
];

const forecastData = [
  { quarter: 'Q1', forecast: 320000, actual: 340000 },
  { quarter: 'Q2', forecast: 380000, actual: 395000 },
  { quarter: 'Q3', forecast: 410000, actual: 405000 },
  { quarter: 'Q4', forecast: 450000, actual: 0 },
];

interface SalesMetricsProps {
  isLoading: boolean;
}

const SalesMetrics: React.FC<SalesMetricsProps> = ({ isLoading }) => {
  return (
    <>
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        {isLoading ? (
          <div className="h-64">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesPerformanceData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#0284c7" />
                <Bar dataKey="target" fill="#d1d5db" />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-gray-500 mt-2 flex justify-between">
              <span>Last updated: Today, 10:30 AM</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-[#0284c7]"></div>
                  <span>Actual</span>
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-[#d1d5db]"></div>
                  <span>Target</span>
                </span>
                <Button variant="outline" size="sm" className="h-6 text-xs flex gap-1">
                  <Download className="h-3 w-3" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="col-span-full">
        {isLoading ? (
          <div className="h-64">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                <Line type="monotone" dataKey="forecast" stroke="#8884d8" name="Forecast" />
                <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Q1 Performance</div>
                <div className="text-lg font-medium">+6.25%</div>
                <div className="text-xs text-green-500">Above forecast</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Q2 Performance</div>
                <div className="text-lg font-medium">+3.95%</div>
                <div className="text-xs text-green-500">Above forecast</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Q3 Performance</div>
                <div className="text-lg font-medium">-1.22%</div>
                <div className="text-xs text-red-500">Below forecast</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Q4 Forecast</div>
                <div className="text-lg font-medium">€450,000</div>
                <div className="text-xs text-blue-500">In progress</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SalesMetrics;
