
import React from 'react';
import BarChartComponent from '../../../components/charts/BarChartComponent';

const projectStatusData = [
  { status: 'Completed', count: 12 },
  { status: 'In Progress', count: 8 },
  { status: 'Planning', count: 5 },
  { status: 'On Hold', count: 2 },
];

const budgetUtilizationData = [
  { project: 'ERP Implementation', planned: 350000, actual: 320000 },
  { project: 'Website Redesign', planned: 120000, actual: 115000 },
  { project: 'Mobile App', planned: 200000, actual: 180000 },
  { project: 'Data Center', planned: 400000, actual: 450000 },
];

const ProjectAnalytics: React.FC = () => {
  return (
    <>
      <div className="col-span-full md:col-span-1">
        <div className="bg-white p-4 rounded-lg shadow h-full">
          <h3 className="text-lg font-medium mb-4">Project Status Overview</h3>
          <BarChartComponent
            data={projectStatusData}
            dataKey="count"
            xAxisKey="status"
            height={200}
            color="#4f46e5"
          />
        </div>
      </div>
      
      <div className="col-span-full md:col-span-1">
        <div className="bg-white p-4 rounded-lg shadow h-full">
          <h3 className="text-lg font-medium mb-4">Key Performance Indicators</h3>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium">On-Time Completion Rate</p>
              <p className="text-xl font-semibold">85%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium">Budget Adherence</p>
              <p className="text-xl font-semibold">92%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium">Resource Utilization</p>
              <p className="text-xl font-semibold">78%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-span-full">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Budget Utilization by Project</h3>
          <BarChartComponent
            data={budgetUtilizationData}
            dataKey="actual"
            xAxisKey="project"
            height={250}
            title="Planned vs. Actual Budget"
            subtitle="In EUR"
            color="#0284c7"
          />
        </div>
      </div>
    </>
  );
};

export default ProjectAnalytics;
