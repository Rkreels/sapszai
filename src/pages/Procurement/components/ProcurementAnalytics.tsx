
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const spendData = [
  { category: 'Electronics', amount: 450000, budget: 500000 },
  { category: 'Office Supplies', amount: 120000, budget: 150000 },
  { category: 'Transportation', amount: 280000, budget: 300000 },
  { category: 'Manufacturing', amount: 380000, budget: 400000 },
  { category: 'Services', amount: 200000, budget: 250000 }
];

const supplierSpend = [
  { name: 'Tech Components Inc.', value: 1245800, color: '#0088FE' },
  { name: 'Electronics Wholesale', value: 1352800, color: '#00C49F' },
  { name: 'Global Logistics', value: 879600, color: '#FFBB28' },
  { name: 'Industrial Parts Co.', value: 965400, color: '#FF8042' },
  { name: 'Others', value: 556400, color: '#8884d8' }
];

const monthlyTrend = [
  { month: 'Jan', spend: 420000, savings: 15000 },
  { month: 'Feb', spend: 380000, savings: 18000 },
  { month: 'Mar', spend: 450000, savings: 22000 },
  { month: 'Apr', spend: 390000, savings: 19000 },
  { month: 'May', spend: 410000, savings: 24000 }
];

const ProcurementAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Spend by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Spend']} />
              <Bar dataKey="amount" fill="#3b82f6" />
              <Bar dataKey="budget" fill="#e5e7eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Top Suppliers by Spend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={supplierSpend}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {supplierSpend.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Spend']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Monthly Spend Trend & Savings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'spend' ? 'Total Spend' : 'Cost Savings']} />
            <Line type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProcurementAnalytics;
