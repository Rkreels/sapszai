
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, ClipboardList, Plus, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const PhysicalInventory: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('counts');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Physical Inventory. Manage cycle counts, physical inventories, and stock reconciliation.');
    }
  }, [isEnabled, speak]);

  const countData = [
    { 
      id: 'CC-001', 
      material: 'Steel Pipes', 
      location: 'A-01-001',
      systemQty: '2500',
      countedQty: '2485',
      variance: '-15',
      status: 'Counted',
      counter: 'John Smith',
      date: '2025-05-20'
    },
    { 
      id: 'CC-002', 
      material: 'Copper Wire', 
      location: 'B-02-001',
      systemQty: '150',
      countedQty: '155',
      variance: '+5',
      status: 'Counted',
      counter: 'Maria Garcia',
      date: '2025-05-20'
    },
    { 
      id: 'CC-003', 
      material: 'Aluminum Sheets', 
      location: 'C-01-002',
      systemQty: '800',
      countedQty: '',
      variance: '',
      status: 'Pending',
      counter: 'Robert Johnson',
      date: '2025-05-21'
    },
  ];

  const cycleData = [
    { 
      id: 'CYC-2025-05', 
      description: 'Monthly Cycle Count - Zone A', 
      startDate: '2025-05-01',
      endDate: '2025-05-31',
      totalItems: '245',
      counted: '198',
      progress: '81%',
      status: 'In Progress'
    },
    { 
      id: 'CYC-2025-04', 
      description: 'Monthly Cycle Count - Zone B', 
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      totalItems: '180',
      counted: '180',
      progress: '100%',
      status: 'Completed'
    },
  ];

  const varianceData = [
    { material: 'Steel Pipes', systemQty: '2500', countedQty: '2485', variance: '-15', value: '-$750', reason: 'Damaged items found' },
    { material: 'Copper Wire', systemQty: '150', countedQty: '155', variance: '+5', value: '+$150', reason: 'Found in wrong location' },
    { material: 'Fasteners', systemQty: '1000', countedQty: '985', variance: '-15', value: '-$45', reason: 'Counting error' },
  ];

  const countColumns = [
    { key: 'id', header: 'Count ID' },
    { key: 'material', header: 'Material' },
    { key: 'location', header: 'Location' },
    { key: 'systemQty', header: 'System Qty' },
    { key: 'countedQty', header: 'Counted Qty' },
    { key: 'variance', header: 'Variance' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'Pending') variant = 'outline';
        if (value === 'Counted') variant = 'default';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    { key: 'counter', header: 'Counter' },
  ];

  const cycleColumns = [
    { key: 'id', header: 'Cycle ID' },
    { key: 'description', header: 'Description' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { key: 'progress', header: 'Progress' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'In Progress') variant = 'secondary';
        if (value === 'Completed') variant = 'default';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
  ];

  const varianceColumns = [
    { key: 'material', header: 'Material' },
    { key: 'systemQty', header: 'System Qty' },
    { key: 'countedQty', header: 'Counted Qty' },
    { key: 'variance', header: 'Variance' },
    { key: 'value', header: 'Value Impact' },
    { key: 'reason', header: 'Reason' },
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
          title="Physical Inventory"
          description="Manage cycle counts, physical inventories, and stock reconciliation"
          voiceIntroduction="Welcome to Physical Inventory. Manage inventory counting and reconciliation."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <ClipboardList className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">245</h3>
              <p className="text-sm text-gray-600">Items to Count</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">198</h3>
              <p className="text-sm text-gray-600">Items Counted</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">12</h3>
              <p className="text-sm text-gray-600">Variances Found</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <ClipboardList className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">81%</h3>
              <p className="text-sm text-gray-600">Count Progress</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="counts">Item Counts</TabsTrigger>
          <TabsTrigger value="cycles">Cycle Counts</TabsTrigger>
          <TabsTrigger value="variances">Variances</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="counts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Item Counts</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Count
              </Button>
            </div>
          </div>
          
          <Card className="p-6">
            <DataTable columns={countColumns} data={countData} />
          </Card>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Cycle Count Programs</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Cycle
            </Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={cycleColumns} data={cycleData} />
          </Card>
        </TabsContent>

        <TabsContent value="variances" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Count Variances</h2>
            <Button size="sm">Process Adjustments</Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={varianceColumns} data={varianceData} />
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Inventory Count Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Count Accuracy</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Items with No Variance</span>
                    <span className="font-medium">186 (94%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items with Variance</span>
                    <span className="font-medium">12 (6%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Variance %</span>
                    <span className="font-medium">2.1%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Count Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Counts Per Day</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Count Time</span>
                    <span className="font-medium">3.2 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Productivity Rate</span>
                    <span className="font-medium">18.8 items/hour</span>
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

export default PhysicalInventory;
