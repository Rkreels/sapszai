
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Truck, MapPin, Calendar, Plus, Edit, Eye } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const Transportation: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('shipments');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Transportation Management. Plan routes, track shipments, and optimize logistics operations.');
    }
  }, [isEnabled, speak]);

  const shipments = [
    {
      shipmentId: 'SHP-001',
      carrier: 'Global Logistics Inc.',
      origin: 'New York, NY',
      destination: 'Los Angeles, CA',
      departureDate: '2025-05-20',
      arrivalDate: '2025-05-25',
      status: 'In Transit',
      weight: '2500 kg',
      value: '$125,000'
    },
    {
      shipmentId: 'SHP-002',
      carrier: 'Fast Freight Corp',
      origin: 'Chicago, IL',
      destination: 'Miami, FL',
      departureDate: '2025-05-19',
      arrivalDate: '2025-05-23',
      status: 'Delivered',
      weight: '1800 kg',
      value: '$89,500'
    },
    {
      shipmentId: 'SHP-003',
      carrier: 'Express Transport',
      origin: 'Seattle, WA',
      destination: 'Denver, CO',
      departureDate: '2025-05-21',
      arrivalDate: '2025-05-24',
      status: 'Planning',
      weight: '3200 kg',
      value: '$156,000'
    }
  ];

  const routes = [
    {
      routeId: 'RT-001',
      routeName: 'East Coast Express',
      distance: '2,800 miles',
      duration: '5 days',
      stops: 3,
      frequency: 'Daily',
      vehicles: 12,
      status: 'Active'
    },
    {
      routeId: 'RT-002',
      routeName: 'Midwest Circuit',
      distance: '1,500 miles',
      duration: '3 days',
      stops: 5,
      frequency: 'Bi-weekly',
      vehicles: 8,
      status: 'Active'
    },
    {
      routeId: 'RT-003',
      routeName: 'Western Loop',
      distance: '2,200 miles',
      duration: '4 days',
      stops: 4,
      frequency: 'Weekly',
      vehicles: 6,
      status: 'Inactive'
    }
  ];

  const shipmentColumns = [
    { key: 'shipmentId', header: 'Shipment ID' },
    { key: 'carrier', header: 'Carrier' },
    { key: 'origin', header: 'Origin' },
    { key: 'destination', header: 'Destination' },
    { key: 'departureDate', header: 'Departure' },
    { key: 'arrivalDate', header: 'Arrival' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Planning': 'bg-yellow-100 text-yellow-800',
          'In Transit': 'bg-blue-100 text-blue-800',
          'Delivered': 'bg-green-100 text-green-800',
          'Delayed': 'bg-red-100 text-red-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    },
    { key: 'weight', header: 'Weight' },
    { key: 'value', header: 'Value' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
        </div>
      )
    }
  ];

  const routeColumns = [
    { key: 'routeId', header: 'Route ID' },
    { key: 'routeName', header: 'Route Name' },
    { key: 'distance', header: 'Distance' },
    { key: 'duration', header: 'Duration' },
    { key: 'stops', header: 'Stops' },
    { key: 'frequency', header: 'Frequency' },
    { key: 'vehicles', header: 'Vehicles' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Inactive': 'bg-red-100 text-red-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    }
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
          title="Transportation Management"
          description="Manage transportation planning, execution, and tracking"
          voiceIntroduction="Welcome to Transportation Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">234</h3>
              <p className="text-sm text-gray-600">Active Shipments</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">18</h3>
              <p className="text-sm text-gray-600">Active Routes</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">96.5%</h3>
              <p className="text-sm text-gray-600">On-Time Delivery</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">$2.4M</h3>
              <p className="text-sm text-gray-600">Monthly Cost</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="carriers">Carriers</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="shipments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Shipment Management</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Shipment
            </Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={shipmentColumns} data={shipments} />
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Route Management</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Route
            </Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={routeColumns} data={routes} />
          </Card>
        </TabsContent>

        <TabsContent value="carriers" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Carrier Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Global Logistics Inc.</h4>
                  <div className="flex justify-between text-sm">
                    <span>On-time Performance:</span>
                    <span className="font-medium text-green-600">98.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost Rating:</span>
                    <span className="font-medium text-blue-600">4.2/5</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Fast Freight Corp</h4>
                  <div className="flex justify-between text-sm">
                    <span>On-time Performance:</span>
                    <span className="font-medium text-green-600">96.8%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost Rating:</span>
                    <span className="font-medium text-blue-600">4.5/5</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Express Transport</h4>
                  <div className="flex justify-between text-sm">
                    <span>On-time Performance:</span>
                    <span className="font-medium text-yellow-600">94.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost Rating:</span>
                    <span className="font-medium text-blue-600">3.8/5</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Premium Delivery</h4>
                  <div className="flex justify-between text-sm">
                    <span>On-time Performance:</span>
                    <span className="font-medium text-green-600">99.1%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost Rating:</span>
                    <span className="font-medium text-blue-600">3.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Transportation Planning</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Load Planning</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Available Capacity:</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilization Target:</span>
                    <span className="font-medium">90%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Mile:</span>
                    <span className="font-medium">$2.45</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Route Optimization</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Routes Optimized:</span>
                    <span className="font-medium">12/18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Distance Reduction:</span>
                    <span className="font-medium text-green-600">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Savings:</span>
                    <span className="font-medium text-green-600">$45,000/month</span>
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

export default Transportation;
