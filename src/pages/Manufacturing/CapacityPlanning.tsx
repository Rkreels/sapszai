import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { ArrowLeft, Calendar, Filter, Download, Clock } from 'lucide-react';
import { Card } from '../../components/ui/card';
import DataTable from '../../components/data/DataTable';

interface WorkCenter {
  id: string;
  name: string;
  capacity: string;
  unit: string;
  utilized: string;
  utilization: string;
  load: string;
  status: string;
}

const CapacityPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now viewing Capacity Planning. This page helps you plan and manage production capacity efficiently.');
    }
  }, [isEnabled, speak]);

  // Sample data for work centers
  const workCenters = [
    { 
      id: 'WC-001', 
      name: 'Assembly Line 1', 
      capacity: '160', 
      unit: 'Hours',
      utilized: '142',
      utilization: '89%',
      load: '92%',
      status: 'Active'
    },
    { 
      id: 'WC-002', 
      name: 'Assembly Line 2', 
      capacity: '160', 
      unit: 'Hours',
      utilized: '126',
      utilization: '79%',
      load: '82%',
      status: 'Active'
    },
    { 
      id: 'WC-003', 
      name: 'Machining Center', 
      capacity: '160', 
      unit: 'Hours',
      utilized: '158',
      utilization: '99%',
      load: '105%',
      status: 'Overloaded'
    },
    { 
      id: 'WC-004', 
      name: 'Testing Station', 
      capacity: '160', 
      unit: 'Hours',
      utilized: '85',
      utilization: '53%',
      load: '60%',
      status: 'Active'
    }
  ];

  // Column definitions for the table
  const columns = [
    { key: 'id', header: 'Work Center' },
    { key: 'name', header: 'Name' },
    { key: 'capacity', header: 'Capacity (Hours)' },
    { key: 'utilized', header: 'Utilized (Hours)' },
    { 
      key: 'utilization', 
      header: 'Utilization',
      render: (value: string) => (
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: value }}
            ></div>
          </div>
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: 'load', 
      header: 'Planned Load',
      render: (value: string) => {
        const loadValue = parseInt(value);
        const color = loadValue > 100 ? 'bg-red-600' : 'bg-green-600';
        
        return (
          <div className="flex items-center">
            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className={color + " h-2 rounded-full"} 
                style={{ width: value }}
              ></div>
            </div>
            <span>{value}</span>
          </div>
        );
      }
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const color = value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        return (
          <span className={`px-2 py-1 ${color} rounded-full text-xs`}>
            {value}
          </span>
        );
      }
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_: string, row: WorkCenter) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Details</Button>
          <Button variant="outline" size="sm">Adjust</Button>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/manufacturing')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Capacity Planning"
          description="Plan and manage production capacity efficiently"
          voiceIntroduction="Welcome to Capacity Planning. Here you can plan and optimize your production capacity."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Overall Utilization</h3>
          <div className="text-3xl font-semibold mb-2">78.3%</div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">↑ 2.1%</span>
            <span className="text-xs text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Available Capacity</h3>
          <div className="text-3xl font-semibold mb-2">412 hrs</div>
          <div className="flex items-center">
            <span className="text-red-500 text-sm font-medium">↓ 18 hrs</span>
            <span className="text-xs text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Bottlenecks</h3>
          <div className="text-3xl font-semibold mb-2">1</div>
          <div className="flex items-center">
            <span className="text-yellow-500 text-sm font-medium">↔ No change</span>
            <span className="text-xs text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Total Work Centers</h3>
          <div className="text-3xl font-semibold mb-2">12</div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">↑ 1</span>
            <span className="text-xs text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Work Center Capacity</h2>
          <p className="text-sm text-gray-500">May 2025 - Week 21</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Change Period
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Capacity Leveling
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={workCenters} className="w-full" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Capacity Utilization Trend</h3>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Capacity utilization trend chart will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Showing capacity utilization over time</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Production Demand vs. Capacity</h3>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Production demand vs. capacity chart will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Comparing production demand against available capacity</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CapacityPlanning;
