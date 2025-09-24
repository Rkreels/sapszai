
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Truck, Package, Calendar, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const SupplyPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('planning');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Supply Planning. Manage supply requirements, purchase planning, and supplier capacity.');
    }
  }, [isEnabled, speak]);

  const planningData = [
    { 
      material: 'Steel Pipes', 
      currentStock: '2,500', 
      requirement: '3,200', 
      shortage: '700',
      leadTime: '14 days',
      supplier: 'Steel Corp Inc.',
      orderDate: '2025-05-25',
      status: 'Planned'
    },
    { 
      material: 'Copper Wire', 
      currentStock: '150', 
      requirement: '300', 
      shortage: '150',
      leadTime: '10 days',
      supplier: 'Copper Solutions',
      orderDate: '2025-05-28',
      status: 'Urgent'
    },
  ];

  const supplierData = [
    { 
      supplier: 'Steel Corp Inc.', 
      material: 'Steel Pipes', 
      capacity: '5,000', 
      committed: '3,200', 
      available: '1,800',
      utilization: '64%',
      leadTime: '14 days'
    },
    { 
      supplier: 'Copper Solutions', 
      material: 'Copper Wire', 
      capacity: '1,000', 
      committed: '800', 
      available: '200',
      utilization: '80%',
      leadTime: '10 days'
    },
  ];

  const planningColumns = [
    { key: 'material', header: 'Material' },
    { key: 'currentStock', header: 'Current Stock' },
    { key: 'requirement', header: 'Requirement' },
    { key: 'shortage', header: 'Shortage' },
    { key: 'supplier', header: 'Supplier' },
    { key: 'orderDate', header: 'Planned Order Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'Urgent') variant = 'destructive';
        if (value === 'Planned') variant = 'default';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
  ];

  const supplierColumns = [
    { key: 'supplier', header: 'Supplier' },
    { key: 'material', header: 'Material' },
    { key: 'capacity', header: 'Monthly Capacity' },
    { key: 'committed', header: 'Committed' },
    { key: 'available', header: 'Available' },
    { key: 'utilization', header: 'Utilization' },
    { key: 'leadTime', header: 'Lead Time' },
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
          title="Supply Planning"
          description="Manage supply requirements, purchase planning, and supplier capacity"
          voiceIntroduction="Welcome to Supply Planning. Optimize your supply chain planning and execution."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">847</h3>
              <p className="text-sm text-gray-600">Materials Planned</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">23</h3>
              <p className="text-sm text-gray-600">Shortages</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">156</h3>
              <p className="text-sm text-gray-600">Planned Orders</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">12</h3>
              <p className="text-sm text-gray-600">Weeks Horizon</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="planning">Supply Planning</TabsTrigger>
          <TabsTrigger value="capacity">Supplier Capacity</TabsTrigger>
          <TabsTrigger value="orders">Planned Orders</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Material Requirements Planning</h2>
            <Button size="sm">Run MRP</Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={planningColumns} data={planningData} />
          </Card>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Supplier Capacity Overview</h2>
            <Button size="sm">Update Capacity</Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={supplierColumns} data={supplierData} />
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Planned Purchase Orders</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Steel Pipes - 700 PCS</h4>
                    <p className="text-sm text-gray-600">Steel Corp Inc. • Due: 2025-06-08</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$35,000</p>
                    <Badge variant="destructive">Urgent</Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Copper Wire - 150 M</h4>
                    <p className="text-sm text-gray-600">Copper Solutions • Due: 2025-06-07</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$4,500</p>
                    <Badge variant="default">Planned</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Supply Planning Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Planning Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Plan Adherence</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Performance</span>
                    <span className="font-medium">91%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Forecast Accuracy</span>
                    <span className="font-medium">87%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Supply Risks</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Single Source Items</span>
                    <span className="font-medium text-red-600">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Long Lead Time Items</span>
                    <span className="font-medium text-orange-600">78</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Cost Variance</span>
                    <span className="font-medium text-yellow-600">23</span>
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

export default SupplyPlanning;
