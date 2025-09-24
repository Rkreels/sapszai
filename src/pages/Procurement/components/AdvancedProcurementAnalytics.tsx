
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Clock } from 'lucide-react';

const spendAnalysisData = [
  { category: 'Raw Materials', amount: 2800000, budget: 3000000, variance: -200000, suppliers: 15 },
  { category: 'Services', amount: 1200000, budget: 1100000, variance: 100000, suppliers: 8 },
  { category: 'IT Equipment', amount: 850000, budget: 900000, variance: -50000, suppliers: 12 },
  { category: 'Office Supplies', amount: 320000, budget: 350000, variance: -30000, suppliers: 6 },
  { category: 'Transportation', amount: 680000, budget: 650000, variance: 30000, suppliers: 4 }
];

const supplierPerformanceData = [
  { name: 'Global Tech Solutions', onTimeDelivery: 95, qualityScore: 92, costEfficiency: 88, riskScore: 15 },
  { name: 'Industrial Supplies Co.', onTimeDelivery: 89, qualityScore: 96, costEfficiency: 91, riskScore: 12 },
  { name: 'Logistics Partners Inc.', onTimeDelivery: 92, qualityScore: 85, costEfficiency: 94, riskScore: 18 },
  { name: 'Premium Materials Ltd.', onTimeDelivery: 97, qualityScore: 98, costEfficiency: 85, riskScore: 8 },
  { name: 'Quick Services Group', onTimeDelivery: 86, qualityScore: 89, costEfficiency: 92, riskScore: 22 }
];

const monthlyTrendData = [
  { month: 'Jan', totalSpend: 2100000, savings: 185000, prOrders: 245, avgCycle: 8.5 },
  { month: 'Feb', totalSpend: 1950000, savings: 210000, prOrders: 228, avgCycle: 7.8 },
  { month: 'Mar', totalSpend: 2350000, savings: 195000, prOrders: 267, avgCycle: 8.2 },
  { month: 'Apr', totalSpend: 2180000, savings: 225000, prOrders: 251, avgCycle: 7.5 },
  { month: 'May', totalSpend: 2400000, savings: 240000, prOrders: 289, avgCycle: 7.2 }
];

const categoryDistribution = [
  { name: 'Raw Materials', value: 45, color: '#0088FE' },
  { name: 'Services', value: 20, color: '#00C49F' },
  { name: 'IT Equipment', value: 15, color: '#FFBB28' },
  { name: 'Transportation', value: 12, color: '#FF8042' },
  { name: 'Office Supplies', value: 8, color: '#8884d8' }
];

const AdvancedProcurementAnalytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('YTD');
  const [selectedMetric, setSelectedMetric] = useState('spend');

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Procurement Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <select 
            className="px-3 py-2 border rounded-md"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
          >
            <option value="MTD">Month to Date</option>
            <option value="QTD">Quarter to Date</option>
            <option value="YTD">Year to Date</option>
            <option value="Custom">Custom Range</option>
          </select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Spend</div>
              <div className="text-2xl font-bold">$12.8M</div>
              <div className="text-sm text-green-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                5.2% vs last year
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Cost Savings</div>
              <div className="text-2xl font-bold">$1.05M</div>
              <div className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                12.8% improvement
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Active Suppliers</div>
              <div className="text-2xl font-bold">186</div>
              <div className="text-sm text-blue-600">92% performance rate</div>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Avg Procurement Cycle</div>
              <div className="text-2xl font-bold">7.8 days</div>
              <div className="text-sm text-orange-600 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                15% faster
              </div>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend Analysis by Category */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spend Analysis by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `$${(value as number).toLocaleString()}`, 
                  name === 'amount' ? 'Actual Spend' : 'Budget'
                ]} 
              />
              <Bar dataKey="amount" fill="#3b82f6" name="amount" />
              <Bar dataKey="budget" fill="#e5e7eb" name="budget" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Supplier Performance Radar */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Supplier Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplierPerformanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
              <Bar dataKey="onTimeDelivery" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Trend Analysis */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Procurement Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'totalSpend' ? `$${(value as number).toLocaleString()}` : 
                  name === 'savings' ? `$${(value as number).toLocaleString()}` :
                  name === 'avgCycle' ? `${value} days` : value,
                  name === 'totalSpend' ? 'Total Spend' :
                  name === 'savings' ? 'Cost Savings' :
                  name === 'prOrders' ? 'PO Count' : 'Avg Cycle Time'
                ]} 
              />
              <Area type="monotone" dataKey="totalSpend" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="savings" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spend Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Supplier Performance Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Supplier Performance Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Supplier</th>
                <th className="text-center p-3">On-Time Delivery</th>
                <th className="text-center p-3">Quality Score</th>
                <th className="text-center p-3">Cost Efficiency</th>
                <th className="text-center p-3">Risk Score</th>
                <th className="text-center p-3">Overall Rating</th>
              </tr>
            </thead>
            <tbody>
              {supplierPerformanceData.map((supplier, index) => {
                const overallRating = Math.round((supplier.onTimeDelivery + supplier.qualityScore + supplier.costEfficiency - supplier.riskScore) / 3);
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{supplier.name}</td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${supplier.onTimeDelivery >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {supplier.onTimeDelivery}%
                      </span>
                    </td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${supplier.qualityScore >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {supplier.qualityScore}%
                      </span>
                    </td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${supplier.costEfficiency >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {supplier.costEfficiency}%
                      </span>
                    </td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${supplier.riskScore <= 15 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {supplier.riskScore}%
                      </span>
                    </td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${overallRating >= 85 ? 'bg-green-100 text-green-800' : overallRating >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {overallRating}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedProcurementAnalytics;
