
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

interface BarChartComponentProps {
  data: Array<{ [key: string]: string | number }>;
  dataKey: string;
  xAxisKey: string;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  title?: string;
  subtitle?: string;
  animate?: boolean;
  horizontal?: boolean;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ 
  data, 
  dataKey, 
  xAxisKey,
  height = 300,
  color = "#0284c7",
  showGrid = true,
  showLegend = false,
  title,
  subtitle,
  animate = true,
  horizontal = false
}) => {
  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div style={{ height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            {horizontal ? (
              <>
                <XAxis type="number" />
                <YAxis dataKey={xAxisKey} type="category" />
              </>
            ) : (
              <>
                <XAxis dataKey={xAxisKey} />
                <YAxis />
              </>
            )}
            <Tooltip />
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            {showLegend && <Legend />}
            <Bar 
              dataKey={dataKey} 
              fill={color}
              animationDuration={animate ? 1500 : 0}
              animationBegin={0}
              animationEasing="ease-in-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
