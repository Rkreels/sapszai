
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, ArrowRightLeft, Plus, Edit, CheckCircle, Clock } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
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

const StockTransfers: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('transfers');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Stock Transfers. Manage inventory transfers between locations and warehouses.');
    }
  }, [isEnabled, speak]);

  const transferData = [
    { 
      id: 'ST-001', 
      material: 'Steel Pipes', 
      from: 'Main Warehouse', 
      to: 'Distribution Center', 
      quantity: '200', 
      unit: 'PCS',
      requestDate: '2025-05-20',
      status: 'In Transit',
      requestor: 'John Smith'
    },
    { 
      id: 'ST-002', 
      material: 'Copper Wire', 
      from: 'Distribution Center', 
      to: 'Regional Hub', 
      quantity: '50', 
      unit: 'M',
      requestDate: '2025-05-19',
      status: 'Completed',
      requestor: 'Maria Garcia'
    },
    { 
      id: 'ST-003', 
      material: 'Aluminum Sheets', 
      from: 'Regional Hub', 
      to: 'Main Warehouse', 
      quantity: '100', 
      unit: 'SQM',
      requestDate: '2025-05-18',
      status: 'Pending',
      requestor: 'Robert Johnson'
    },
  ];

  const requestData = [
    { 
      id: 'STR-001', 
      material: 'Fasteners', 
      requestedBy: 'Production Team', 
      fromLocation: 'Main Warehouse', 
      toLocation: 'Production Floor', 
      quantity: '500', 
      priority: 'High',
      status: 'Approved'
    },
    { 
      id: 'STR-002', 
      material: 'Gaskets', 
      requestedBy: 'Maintenance Team', 
      fromLocation: 'Distribution Center', 
      toLocation: 'Maintenance Shop', 
      quantity: '25', 
      priority: 'Medium',
      status: 'Pending Approval'
    },
  ];

  const transferColumns = [
    { key: 'id', header: 'Transfer ID' },
    { key: 'material', header: 'Material' },
    { key: 'from', header: 'From' },
    { key: 'to', header: 'To' },
    { 
      key: 'quantity', 
      header: 'Quantity',
      render: (value: string, row: any) => `${value} ${row.unit}`
    },
    { key: 'requestDate', header: 'Request Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'Pending') variant = 'outline';
        if (value === 'In Transit') variant = 'secondary';
        if (value === 'Completed') variant = 'default';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => <Button variant="outline" size="sm"><Edit className="h-3 w-3" /></Button>
    }
  ];

  const requestColumns = [
    { key: 'id', header: 'Request ID' },
    { key: 'material', header: 'Material' },
    { key: 'requestedBy', header: 'Requested By' },
    { key: 'fromLocation', header: 'From Location' },
    { key: 'toLocation', header: 'To Location' },
    { key: 'quantity', header: 'Quantity' },
    { 
      key: 'priority', 
      header: 'Priority',
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'High') variant = 'destructive';
        if (value === 'Medium') variant = 'secondary';
        if (value === 'Low') variant = 'outline';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'Pending Approval') variant = 'outline';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/supply-chain')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Stock Transfers"
          description="Manage inventory transfers between locations and warehouses"
          voiceIntroduction="Welcome to Stock Transfers. Manage inventory movements between locations."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <ArrowRightLeft className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">156</h3>
              <p className="text-sm text-gray-600">Total Transfers</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">23</h3>
              <p className="text-sm text-gray-600">In Transit</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">128</h3>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <ArrowRightLeft className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">5</h3>
              <p className="text-sm text-gray-600">Pending Approval</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transfers">Active Transfers</TabsTrigger>
          <TabsTrigger value="requests">Transfer Requests</TabsTrigger>
          <TabsTrigger value="history">Transfer History</TabsTrigger>
        </TabsList>

        <TabsContent value="transfers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Stock Transfers</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={transferColumns} data={transferData} />
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Transfer Requests</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={requestColumns} data={requestData} />
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Transfer History</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Steel Pipes Transfer</h4>
                    <p className="text-sm text-gray-600">Main Warehouse → Distribution Center</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">200 PCS</p>
                    <p className="text-sm text-gray-600">Completed: 2025-05-15</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Copper Wire Transfer</h4>
                    <p className="text-sm text-gray-600">Distribution Center → Regional Hub</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">100 M</p>
                    <p className="text-sm text-gray-600">Completed: 2025-05-12</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockTransfers;
