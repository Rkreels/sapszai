
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import DataTable from '../../components/data/DataTable';
import { ArrowLeft, Plus, Edit, Eye, Wrench, Calendar, AlertTriangle } from 'lucide-react';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

const Maintenance: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [maintenanceOrders, setMaintenanceOrders] = useState([
    {
      orderNumber: 'MO-001',
      equipment: 'Production Line A1',
      equipmentId: 'EQ-001',
      type: 'Preventive',
      priority: 'High',
      status: 'In Progress',
      scheduledDate: '2025-01-28',
      estimatedDuration: '4 hours',
      technician: 'Mike Johnson',
      description: 'Monthly lubrication and inspection'
    },
    {
      orderNumber: 'MO-002',
      equipment: 'Packaging Machine B2',
      equipmentId: 'EQ-002',
      type: 'Corrective',
      priority: 'Critical',
      status: 'Open',
      scheduledDate: '2025-01-27',
      estimatedDuration: '8 hours',
      technician: 'Sarah Davis',
      description: 'Replace faulty conveyor belt'
    },
    {
      orderNumber: 'MO-003',
      equipment: 'Quality Control Station',
      equipmentId: 'EQ-003',
      type: 'Predictive',
      priority: 'Medium',
      status: 'Completed',
      scheduledDate: '2025-01-25',
      estimatedDuration: '2 hours',
      technician: 'Robert Brown',
      description: 'Calibration of measuring instruments'
    }
  ]);

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now in the Manufacturing Maintenance page. Here you can manage maintenance orders, schedules, and equipment service records for optimal production efficiency.');
    }
  }, [isEnabled, speak]);

  const columns = [
    { key: 'orderNumber', header: 'Order Number' },
    { key: 'equipment', header: 'Equipment' },
    { key: 'equipmentId', header: 'Equipment ID' },
    { 
      key: 'type', 
      header: 'Type',
      render: (value: string) => {
        const colors = {
          'Preventive': 'bg-blue-100 text-blue-800',
          'Corrective': 'bg-orange-100 text-orange-800',
          'Predictive': 'bg-purple-100 text-purple-800',
          'Emergency': 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        );
      }
    },
    { 
      key: 'priority', 
      header: 'Priority',
      render: (value: string) => {
        const colors = {
          'Low': 'bg-gray-100 text-gray-800',
          'Medium': 'bg-yellow-100 text-yellow-800',
          'High': 'bg-orange-100 text-orange-800',
          'Critical': 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        );
      }
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Open': 'bg-blue-100 text-blue-800',
          'In Progress': 'bg-yellow-100 text-yellow-800',
          'Completed': 'bg-green-100 text-green-800',
          'On Hold': 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        );
      }
    },
    { key: 'scheduledDate', header: 'Scheduled Date' },
    { key: 'estimatedDuration', header: 'Duration' },
    { key: 'technician', header: 'Technician' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: any) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" title="View Details">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Start Work">
            <Wrench className="h-4 w-4" />
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
          title="Maintenance Management"
          description="Manage equipment maintenance, schedules, and service records"
          voiceIntroduction="Welcome to Maintenance Management. Here you can manage all maintenance activities."
        />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Maintenance Orders</h2>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Maintenance Order
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Maintenance
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Open Orders</div>
          <div className="text-2xl font-bold">24</div>
          <div className="text-sm text-blue-600">5 critical</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Equipment Uptime</div>
          <div className="text-2xl font-bold">96.5%</div>
          <div className="text-sm text-green-600">This month</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">MTBF</div>
          <div className="text-2xl font-bold">128h</div>
          <div className="text-sm text-purple-600">Mean time between failures</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Maintenance Cost</div>
          <div className="text-2xl font-bold">$45K</div>
          <div className="text-sm text-orange-600">This month</div>
        </Card>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={maintenanceOrders} />
      </Card>
    </div>
  );
};

export default Maintenance;
