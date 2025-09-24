
import React from 'react';
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const productionData = [
  { month: 'Jan', output: 1200 },
  { month: 'Feb', output: 1400 },
  { month: 'Mar', output: 1100 },
  { month: 'Apr', output: 1600 },
  { month: 'May', output: 1300 },
  { month: 'Jun', output: 1500 },
];

const ProductionOverview: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={productionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip 
          formatter={(value) => [`${value} units`, 'Production']}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar dataKey="output" fill="#0284c7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductionOverview;
