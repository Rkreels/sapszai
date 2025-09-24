
import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import DataTable from '../../../components/data/DataTable';
import { Calendar, Plus, Download, Filter } from 'lucide-react';

const ProductionPlanning: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-week');

  const planningData = [
    {
      material: 'Widget A',
      plannedQty: 1000,
      actualQty: 850,
      variance: -150,
      startDate: '2025-05-20',
      endDate: '2025-05-24',
      status: 'In Progress',
      workCenter: 'WC-001'
    },
    {
      material: 'Widget B',
      plannedQty: 750,
      actualQty: 780,
      variance: 30,
      startDate: '2025-05-21',
      endDate: '2025-05-25',
      status: 'Completed',
      workCenter: 'WC-002'
    },
    {
      material: 'Assembly C',
      plannedQty: 500,
      actualQty: 0,
      variance: -500,
      startDate: '2025-05-27',
      endDate: '2025-05-31',
      status: 'Planned',
      workCenter: 'WC-003'
    }
  ];

  const capacityData = [
    {
      workCenter: 'WC-001',
      totalCapacity: 160,
      planned: 120,
      available: 40,
      utilization: 75,
      efficiency: 92
    },
    {
      workCenter: 'WC-002',
      totalCapacity: 140,
      planned: 135,
      available: 5,
      utilization: 96,
      efficiency: 88
    },
    {
      workCenter: 'WC-003',
      totalCapacity: 180,
      planned: 95,
      available: 85,
      utilization: 53,
      efficiency: 94
    }
  ];

  const planningColumns = [
    { key: 'material', header: 'Material' },
    { key: 'plannedQty', header: 'Planned Qty' },
    { key: 'actualQty', header: 'Actual Qty' },
    { 
      key: 'variance', 
      header: 'Variance',
      render: (value: number) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          {value >= 0 ? '+' : ''}{value}
        </span>
      )
    },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Planned': 'bg-blue-100 text-blue-800',
          'In Progress': 'bg-yellow-100 text-yellow-800',
          'Completed': 'bg-green-100 text-green-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        );
      }
    },
    { key: 'workCenter', header: 'Work Center' }
  ];

  const capacityColumns = [
    { key: 'workCenter', header: 'Work Center' },
    { key: 'totalCapacity', header: 'Total Capacity (hrs)' },
    { key: 'planned', header: 'Planned (hrs)' },
    { key: 'available', header: 'Available (hrs)' },
    { 
      key: 'utilization', 
      header: 'Utilization %',
      render: (value: number) => (
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className={`h-2 rounded-full ${value > 90 ? 'bg-red-500' : value > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span>{value}%</span>
        </div>
      )
    },
    { key: 'efficiency', header: 'Efficiency %' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Production Planning</h2>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="current-week">Current Week</option>
            <option value="next-week">Next Week</option>
            <option value="current-month">Current Month</option>
            <option value="next-month">Next Month</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Planned</div>
          <div className="text-2xl font-bold">2,250</div>
          <div className="text-sm text-green-600">units</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Actual</div>
          <div className="text-2xl font-bold">1,630</div>
          <div className="text-sm text-blue-600">units</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Plan Accuracy</div>
          <div className="text-2xl font-bold">87.5%</div>
          <div className="text-sm text-yellow-600">↓ 2.1%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Efficiency</div>
          <div className="text-2xl font-bold">91.3%</div>
          <div className="text-sm text-green-600">↑ 1.8%</div>
        </Card>
      </div>

      <Tabs defaultValue="planning" className="w-full">
        <TabsList>
          <TabsTrigger value="planning">Production Plans</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Planning</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="forecasting">Demand Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="planning">
          <Card className="p-6">
            <DataTable columns={planningColumns} data={planningData} />
          </Card>
        </TabsContent>

        <TabsContent value="capacity">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Work Center Capacity</h3>
            <DataTable columns={capacityColumns} data={capacityData} />
          </Card>
        </TabsContent>

        <TabsContent value="scheduling">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Production Schedule</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2 text-sm font-medium text-gray-500">
                <div>Time</div>
                <div>Monday</div>
                <div>Tuesday</div>
                <div>Wednesday</div>
                <div>Thursday</div>
                <div>Friday</div>
                <div>Saturday</div>
              </div>
              {['08:00', '10:00', '12:00', '14:00', '16:00'].map((time) => (
                <div key={time} className="grid grid-cols-7 gap-2 text-sm">
                  <div className="font-medium">{time}</div>
                  <div className="p-2 bg-blue-100 rounded text-center">Widget A</div>
                  <div className="p-2 bg-green-100 rounded text-center">Widget B</div>
                  <div className="p-2 bg-yellow-100 rounded text-center">Assembly C</div>
                  <div className="p-2 bg-purple-100 rounded text-center">Widget A</div>
                  <div className="p-2 bg-gray-100 rounded text-center">Maintenance</div>
                  <div className="p-2 bg-red-100 rounded text-center">Cleanup</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Demand Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded">
                <div className="text-sm text-gray-500">Next Week Forecast</div>
                <div className="text-2xl font-bold">2,100 units</div>
                <div className="text-sm text-green-600">↑ 5.2% confidence</div>
              </div>
              <div className="p-4 border rounded">
                <div className="text-sm text-gray-500">Next Month Forecast</div>
                <div className="text-2xl font-bold">8,750 units</div>
                <div className="text-sm text-blue-600">82% confidence</div>
              </div>
              <div className="p-4 border rounded">
                <div className="text-sm text-gray-500">Seasonal Trend</div>
                <div className="text-2xl font-bold">+12%</div>
                <div className="text-sm text-purple-600">Summer peak</div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionPlanning;
