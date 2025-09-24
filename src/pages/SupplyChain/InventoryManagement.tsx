
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Package, AlertTriangle, TrendingUp, Search, Plus, Edit, Trash2 } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const InventoryManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Inventory Management. Here you can manage stock levels, track inventory movements, and optimize warehouse operations.');
    }
  }, [isEnabled, speak]);

  const inventoryData = [
    { id: 'INV-001', material: 'Steel Pipes', description: 'Carbon Steel Pipes 20mm', currentStock: 2500, reorderPoint: 500, maxStock: 5000, unit: 'PCS', value: '125,000', status: 'Normal' },
    { id: 'INV-002', material: 'Copper Wire', description: 'Electrical Copper Wire 2.5mm', currentStock: 150, reorderPoint: 200, maxStock: 1000, unit: 'M', value: '45,000', status: 'Below Reorder' },
    { id: 'INV-003', material: 'Aluminum Sheets', description: 'Aluminum Sheets 1.5mm Thick', currentStock: 800, reorderPoint: 100, maxStock: 1200, unit: 'SQM', value: '96,000', status: 'Normal' },
    { id: 'INV-004', material: 'Fasteners', description: 'Stainless Steel Bolts M8', currentStock: 50, reorderPoint: 100, maxStock: 500, unit: 'PCS', value: '8,500', status: 'Critical' },
  ];

  const movementData = [
    { id: 'MOV-001', type: 'Goods Receipt', material: 'Steel Pipes', quantity: '+500', date: '2025-05-20', reference: 'PO-4500012765' },
    { id: 'MOV-002', type: 'Goods Issue', material: 'Copper Wire', quantity: '-75', date: '2025-05-19', reference: 'SO-3000045632' },
    { id: 'MOV-003', type: 'Transfer', material: 'Aluminum Sheets', quantity: '-200', date: '2025-05-18', reference: 'TR-2000012345' },
    { id: 'MOV-004', type: 'Physical Count', material: 'Fasteners', quantity: '-5', date: '2025-05-17', reference: 'PC-1000067890' },
  ];

  const inventoryColumns = [
    { key: 'material', header: 'Material' },
    { key: 'description', header: 'Description' },
    { key: 'currentStock', header: 'Current Stock' },
    { key: 'reorderPoint', header: 'Reorder Point' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'Critical') variant = 'destructive';
        if (value === 'Below Reorder') variant = 'secondary';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
    { key: 'value', header: 'Value ($)' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm"><Edit className="h-3 w-3" /></Button>
          <Button variant="outline" size="sm"><Trash2 className="h-3 w-3" /></Button>
        </div>
      )
    }
  ];

  const movementColumns = [
    { key: 'type', header: 'Movement Type' },
    { key: 'material', header: 'Material' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'date', header: 'Date' },
    { key: 'reference', header: 'Reference' },
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
          title="Inventory Management"
          description="Manage stock levels, track movements, and optimize inventory"
          voiceIntroduction="Welcome to Inventory Management. Track and optimize your inventory levels."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">2,847</h3>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">23</h3>
              <p className="text-sm text-gray-600">Below Reorder</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">$2.8M</h3>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">156</h3>
              <p className="text-sm text-gray-600">Movements Today</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stock">Stock Levels</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Inventory Overview</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>
          </div>
          
          <Card className="p-6">
            <DataTable columns={inventoryColumns} data={inventoryData} />
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Stock Level Analysis</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-green-700">Normal Stock</h4>
                  <p className="text-2xl font-bold">2,785</p>
                  <p className="text-sm text-gray-600">Items in normal range</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-orange-700">Below Reorder</h4>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-gray-600">Items need reordering</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-red-700">Critical Level</h4>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-gray-600">Items at critical level</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Inventory Movements</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Record Movement
            </Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={movementColumns} data={movementData} />
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Inventory Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Top Moving Items</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 border-b">
                    <span>Steel Pipes</span>
                    <span className="font-medium">245 movements</span>
                  </div>
                  <div className="flex justify-between p-2 border-b">
                    <span>Copper Wire</span>
                    <span className="font-medium">198 movements</span>
                  </div>
                  <div className="flex justify-between p-2 border-b">
                    <span>Aluminum Sheets</span>
                    <span className="font-medium">156 movements</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Slow Moving Items</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 border-b">
                    <span>Special Gaskets</span>
                    <span className="font-medium">2 movements</span>
                  </div>
                  <div className="flex justify-between p-2 border-b">
                    <span>Rare Earth Elements</span>
                    <span className="font-medium">1 movement</span>
                  </div>
                  <div className="flex justify-between p-2 border-b">
                    <span>Custom Components</span>
                    <span className="font-medium">0 movements</span>
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

export default InventoryManagement;
