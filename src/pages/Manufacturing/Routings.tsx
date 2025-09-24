
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import DataTable from '../../components/data/DataTable';
import { ArrowLeft, Plus, Edit, Copy, Eye } from 'lucide-react';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

const Routings: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [routings, setRoutings] = useState([
    {
      routingId: 'RT-001',
      material: 'Widget A',
      version: '1.0',
      status: 'Active',
      totalTime: 120,
      operations: 4,
      workCenter: 'WC-001',
      validFrom: '2025-01-01'
    },
    {
      routingId: 'RT-002', 
      material: 'Widget B',
      version: '1.1',
      status: 'Active',
      totalTime: 95,
      operations: 3,
      workCenter: 'WC-002',
      validFrom: '2025-03-01'
    },
    {
      routingId: 'RT-003',
      material: 'Assembly C',
      version: '1.0',
      status: 'Draft',
      totalTime: 180,
      operations: 6,
      workCenter: 'WC-003',
      validFrom: '2025-06-01'
    }
  ]);

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now in Routings Management. Here you can manage production routings, operations, and work sequences.');
    }
  }, [isEnabled, speak]);

  const columns = [
    { key: 'routingId', header: 'Routing ID' },
    { key: 'material', header: 'Material' },
    { key: 'version', header: 'Version' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Draft': 'bg-yellow-100 text-yellow-800',
          'Inactive': 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        );
      }
    },
    { 
      key: 'totalTime', 
      header: 'Total Time (min)',
      render: (value: number) => `${value} min`
    },
    { key: 'operations', header: 'Operations' },
    { key: 'workCenter', header: 'Primary Work Center' },
    { key: 'validFrom', header: 'Valid From' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: any) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Copy">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="View Operations">
            <Eye className="h-4 w-4" />
          </Button>
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
          title="Routings"
          description="Manage production routings, operations, and work sequences"
          voiceIntroduction="Welcome to Routings Management."
        />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Routings Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Routing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Routings</div>
          <div className="text-2xl font-bold">89</div>
          <div className="text-sm text-blue-600">All versions</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Routings</div>
          <div className="text-2xl font-bold">78</div>
          <div className="text-sm text-green-600">Currently used</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Operations</div>
          <div className="text-2xl font-bold">4.3</div>
          <div className="text-sm text-purple-600">Per routing</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Cycle Time</div>
          <div className="text-2xl font-bold">132 min</div>
          <div className="text-sm text-orange-600">Per unit</div>
        </Card>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={routings} />
      </Card>
    </div>
  );
};

export default Routings;
