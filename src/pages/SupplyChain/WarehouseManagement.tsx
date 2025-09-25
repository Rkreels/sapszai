
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Warehouse, MapPin, Users, Activity, Plus, Edit } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';
import { useToast } from '../../components/ui/use-toast';

const WarehouseManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Warehouse Management. Manage warehouse operations, locations, and staff assignments.');
    }
  }, [isEnabled, speak]);

  const warehouseData = [
    { id: 'WH-001', name: 'Main Warehouse', location: 'New York', capacity: '10,000', occupied: '7,500', utilization: '75%', status: 'Active' },
    { id: 'WH-002', name: 'Distribution Center', location: 'California', capacity: '15,000', occupied: '12,000', utilization: '80%', status: 'Active' },
    { id: 'WH-003', name: 'Regional Hub', location: 'Texas', capacity: '8,000', occupied: '5,200', utilization: '65%', status: 'Active' },
  ];

  const locationData = [
    { id: 'LOC-A001', warehouse: 'Main Warehouse', zone: 'Zone A', aisle: 'A01', shelf: '001', bin: 'A', material: 'Steel Pipes', quantity: '500' },
    { id: 'LOC-B002', warehouse: 'Main Warehouse', zone: 'Zone B', aisle: 'B01', shelf: '002', bin: 'B', material: 'Copper Wire', quantity: '150' },
    { id: 'LOC-C003', warehouse: 'Distribution Center', zone: 'Zone C', aisle: 'C01', shelf: '003', bin: 'C', material: 'Aluminum Sheets', quantity: '800' },
  ];

  const staffData = [
    { id: 'ST-001', name: 'John Smith', role: 'Warehouse Manager', warehouse: 'Main Warehouse', shift: 'Day', status: 'Active' },
    { id: 'ST-002', name: 'Maria Garcia', role: 'Picker', warehouse: 'Main Warehouse', shift: 'Day', status: 'Active' },
    { id: 'ST-003', name: 'Robert Johnson', role: 'Forklift Operator', warehouse: 'Distribution Center', shift: 'Night', status: 'Active' },
  ];

  const warehouseColumns = [
    { key: 'name', header: 'Warehouse Name' },
    { key: 'location', header: 'Location' },
    { key: 'capacity', header: 'Capacity (sqm)' },
    { key: 'occupied', header: 'Occupied (sqm)' },
    { key: 'utilization', header: 'Utilization' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => <Badge variant="default">{value}</Badge>
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => (
        <Button variant="outline" size="sm" onClick={() => {
          toast({
            title: "Edit Warehouse",
            description: "Edit warehouse details form would open here.",
          });
        }}>
          <Edit className="h-3 w-3" />
        </Button>
      )
    }
  ];

  const locationColumns = [
    { key: 'warehouse', header: 'Warehouse' },
    { key: 'zone', header: 'Zone' },
    { key: 'aisle', header: 'Aisle' },
    { key: 'shelf', header: 'Shelf' },
    { key: 'material', header: 'Material' },
    { key: 'quantity', header: 'Quantity' },
  ];

  const staffColumns = [
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    { key: 'warehouse', header: 'Warehouse' },
    { key: 'shift', header: 'Shift' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => <Badge variant="default">{value}</Badge>
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
          title="Warehouse Management"
          description="Manage warehouse operations, locations, and staff"
          voiceIntroduction="Welcome to Warehouse Management. Optimize your warehouse operations."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Warehouse className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">3</h3>
              <p className="text-sm text-gray-600">Active Warehouses</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">1,247</h3>
              <p className="text-sm text-gray-600">Storage Locations</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">45</h3>
              <p className="text-sm text-gray-600">Warehouse Staff</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">73%</h3>
              <p className="text-sm text-gray-600">Avg Utilization</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Warehouse Utilization</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Main Warehouse</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm">75%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Distribution Center</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <span className="text-sm">80%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Regional Hub</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-sm">65%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Activities</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Goods Receipts</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between">
                  <span>Goods Issues</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex justify-between">
                  <span>Transfers</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between">
                  <span>Cycle Counts</span>
                  <span className="font-semibold">12</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="warehouses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Warehouse Facilities</h2>
            <Button size="sm" onClick={() => {
              toast({
                title: "Add Warehouse",
                description: "Add new warehouse form would open here.",
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Warehouse
            </Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={warehouseColumns} data={warehouseData} />
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Storage Locations</h2>
            <Button size="sm" onClick={() => {
              toast({
                title: "Add Location",
                description: "Add new storage location form would open here.",
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={locationColumns} data={locationData} />
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Warehouse Staff</h2>
            <Button size="sm" onClick={() => {
              toast({
                title: "Add Staff Member",
                description: "Add new warehouse staff member form would open here.",
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={staffColumns} data={staffData} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WarehouseManagement;
