
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Users, Package, TrendingUp, Shield } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const VendorManagedInventory: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('vmi');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Vendor Managed Inventory. Monitor VMI programs, supplier performance, and inventory optimization.');
    }
  }, [isEnabled, speak]);

  const vmiData = [
    { 
      supplier: 'Steel Corp Inc.', 
      material: 'Steel Pipes', 
      minLevel: '500', 
      maxLevel: '2,500',
      currentLevel: '2,200',
      lastReplenishment: '2025-05-18',
      nextReplenishment: '2025-05-25',
      status: 'Active'
    },
    { 
      supplier: 'Copper Solutions', 
      material: 'Copper Wire', 
      minLevel: '100', 
      maxLevel: '500',
      currentLevel: '120',
      lastReplenishment: '2025-05-19',
      nextReplenishment: '2025-05-26',
      status: 'Active'
    },
  ];

  const performanceData = [
    { 
      supplier: 'Steel Corp Inc.', 
      serviceLevel: '98.5%', 
      stockouts: '2', 
      excessInventory: '$1,250',
      costSavings: '$15,600',
      inventoryTurns: '8.2',
      rating: 'Excellent'
    },
    { 
      supplier: 'Copper Solutions', 
      serviceLevel: '95.2%', 
      stockouts: '4', 
      excessInventory: '$890',
      costSavings: '$8,400',
      inventoryTurns: '6.8',
      rating: 'Good'
    },
  ];

  const vmiColumns = [
    { key: 'supplier', header: 'Supplier' },
    { key: 'material', header: 'Material' },
    { key: 'minLevel', header: 'Min Level' },
    { key: 'maxLevel', header: 'Max Level' },
    { key: 'currentLevel', header: 'Current Level' },
    { key: 'nextReplenishment', header: 'Next Replenishment' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => <Badge variant="default">{value}</Badge>
    },
  ];

  const performanceColumns = [
    { key: 'supplier', header: 'Supplier' },
    { key: 'serviceLevel', header: 'Service Level' },
    { key: 'stockouts', header: 'Stockouts (YTD)' },
    { key: 'excessInventory', header: 'Excess Inventory' },
    { key: 'costSavings', header: 'Cost Savings' },
    { key: 'inventoryTurns', header: 'Inventory Turns' },
    { 
      key: 'rating', 
      header: 'Rating',
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'Excellent') variant = 'default';
        if (value === 'Good') variant = 'secondary';
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
          title="Vendor Managed Inventory"
          description="Monitor VMI programs, supplier performance, and inventory optimization"
          voiceIntroduction="Welcome to Vendor Managed Inventory. Optimize your supplier-managed inventory programs."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">8</h3>
              <p className="text-sm text-gray-600">VMI Suppliers</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">247</h3>
              <p className="text-sm text-gray-600">VMI Materials</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">96.8%</h3>
              <p className="text-sm text-gray-600">Service Level</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">$247K</h3>
              <p className="text-sm text-gray-600">Cost Savings</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vmi">VMI Programs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="vmi" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active VMI Programs</h2>
            <Button size="sm">Add VMI Program</Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={vmiColumns} data={vmiData} />
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">VMI Performance Metrics</h2>
            <Button size="sm">Export Report</Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={performanceColumns} data={performanceData} />
          </Card>
        </TabsContent>

        <TabsContent value="agreements" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">VMI Agreements</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Steel Corp Inc. - VMI Agreement</h4>
                    <p className="text-sm text-gray-600">Effective: 2024-01-01 - 2025-12-31</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">Active</Badge>
                    <p className="text-sm text-gray-600 mt-1">Steel Pipes, Rebar</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Copper Solutions - VMI Agreement</h4>
                    <p className="text-sm text-gray-600">Effective: 2024-06-01 - 2026-05-31</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">Active</Badge>
                    <p className="text-sm text-gray-600 mt-1">Copper Wire, Fittings</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">VMI Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Inventory Optimization</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Inventory Reduction</span>
                    <span className="font-medium text-green-600">23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carrying Cost Savings</span>
                    <span className="font-medium text-green-600">$125,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stockout Reduction</span>
                    <span className="font-medium text-green-600">67%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Process Efficiency</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Order Processing Time</span>
                    <span className="font-medium text-green-600">-78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Administrative Cost</span>
                    <span className="font-medium text-green-600">-45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Forecast Accuracy</span>
                    <span className="font-medium">94%</span>
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

export default VendorManagedInventory;
