import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { ArrowLeft, Calendar, Filter, Download, Play, RefreshCw } from 'lucide-react';
import { Card } from '../../components/ui/card';
import DataTable from '../../components/data/DataTable';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

const MaterialRequirements: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now viewing Material Requirements Planning. This page helps you plan material needs for production.');
    }
  }, [isEnabled, speak]);

  // Sample data for material requirements
  const materials = [
    { 
      material: '1000234', 
      description: 'Widget A', 
      required: '2500', 
      unit: 'EA',
      available: '1800',
      shortage: '700',
      orderDate: '05/25/2025',
      status: 'Sufficient'
    },
    { 
      material: '1000235', 
      description: 'Widget B', 
      required: '1200', 
      unit: 'EA',
      available: '180',
      shortage: '1020',
      orderDate: '05/22/2025',
      status: 'Shortage'
    },
    { 
      material: '1000236', 
      description: 'Component C', 
      required: '4800', 
      unit: 'EA',
      available: '5200',
      shortage: '0',
      orderDate: '-',
      status: 'Sufficient'
    },
    { 
      material: '1000237', 
      description: 'Raw Material D', 
      required: '1200', 
      unit: 'KG',
      available: '850',
      shortage: '350',
      orderDate: '05/24/2025',
      status: 'Shortage'
    }
  ];

  // Column definitions for the table
  const columns = [
    { key: 'material', header: 'Material' },
    { key: 'description', header: 'Description' },
    { key: 'required', header: 'Required' },
    { key: 'unit', header: 'Unit' },
    { key: 'available', header: 'Available' },
    { key: 'shortage', header: 'Shortage' },
    { key: 'orderDate', header: 'Order Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const color = value === 'Sufficient' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
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
      render: (_, row: any) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">View</Button>
          <Button variant="outline" size="sm">Order</Button>
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
          title="Material Requirements Planning"
          description="Plan and manage materials needed for production"
          voiceIntroduction="Welcome to Material Requirements Planning. Here you can plan and manage materials needed for production."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Materials with Shortage</h3>
          <div className="text-3xl font-semibold mb-2">14</div>
          <div className="flex items-center">
            <span className="text-red-500 text-sm font-medium">↑ 2</span>
            <span className="text-xs text-gray-500 ml-2">vs last week</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Materials Ordered</h3>
          <div className="text-3xl font-semibold mb-2">21</div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">↑ 3</span>
            <span className="text-xs text-gray-500 ml-2">vs last week</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Total Requirements</h3>
          <div className="text-3xl font-semibold mb-2">$472K</div>
          <div className="flex items-center">
            <span className="text-red-500 text-sm font-medium">↑ 8.3%</span>
            <span className="text-xs text-gray-500 ml-2">vs last week</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Last MRP Run</h3>
          <div className="text-3xl font-semibold mb-2">8h ago</div>
          <div className="flex items-center">
            <span className="text-blue-500 text-sm font-medium">May 20, 9:45 AM</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Material Requirements</h2>
          <p className="text-sm text-gray-500">Planning Period: May 20 - June 20, 2025</p>
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
            <Play className="h-4 w-4 mr-2" />
            Run MRP
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center">
          <span className="text-sm text-gray-500">
            <RefreshCw className="h-4 w-4 inline mr-1" />
            Last updated: May 20, 2025 - 9:45 AM
          </span>
        </div>
        <DataTable columns={columns} data={materials} className="w-full" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Material Availability by Category</h3>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Material availability chart will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Showing material availability by category</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Material Requirements Timeline</h3>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Requirements timeline chart will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Showing material requirements over time</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MaterialRequirements;
