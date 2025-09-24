
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Truck, MapPin, Route, BarChart3 } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const DistributionPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('planning');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Distribution Planning. Optimize distribution networks, routes, and delivery schedules.');
    }
  }, [isEnabled, speak]);

  const distributionData = [
    { 
      route: 'Route-001', 
      origin: 'Main Warehouse', 
      destination: 'Customer Zone A', 
      distance: '125 km',
      deliveries: '8',
      capacity: '85%',
      cost: '$450',
      status: 'Optimized'
    },
    { 
      route: 'Route-002', 
      origin: 'Distribution Center', 
      destination: 'Customer Zone B', 
      distance: '89 km',
      deliveries: '12',
      capacity: '92%',
      cost: '$380',
      status: 'At Capacity'
    },
  ];

  const networkData = [
    { 
      facility: 'Main Warehouse', 
      type: 'Warehouse', 
      location: 'New York', 
      capacity: '10,000 sqm',
      utilization: '75%',
      throughput: '1,250 units/day',
      status: 'Active'
    },
    { 
      facility: 'Distribution Center A', 
      type: 'Distribution Center', 
      location: 'California', 
      capacity: '15,000 sqm',
      utilization: '80%',
      throughput: '2,100 units/day',
      status: 'Active'
    },
  ];

  const distributionColumns = [
    { key: 'route', header: 'Route ID' },
    { key: 'origin', header: 'Origin' },
    { key: 'destination', header: 'Destination' },
    { key: 'distance', header: 'Distance' },
    { key: 'deliveries', header: 'Deliveries' },
    { key: 'capacity', header: 'Capacity Usage' },
    { key: 'cost', header: 'Cost' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        if (value === 'At Capacity') variant = 'secondary';
        if (value === 'Optimized') variant = 'default';
        return <Badge variant={variant}>{value}</Badge>;
      }
    },
  ];

  const networkColumns = [
    { key: 'facility', header: 'Facility' },
    { key: 'type', header: 'Type' },
    { key: 'location', header: 'Location' },
    { key: 'capacity', header: 'Capacity' },
    { key: 'utilization', header: 'Utilization' },
    { key: 'throughput', header: 'Throughput' },
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
          title="Distribution Planning"
          description="Optimize distribution networks, routes, and delivery schedules"
          voiceIntroduction="Welcome to Distribution Planning. Optimize your distribution network and logistics."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">45</h3>
              <p className="text-sm text-gray-600">Active Routes</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">12</h3>
              <p className="text-sm text-gray-600">Distribution Centers</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Route className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">847</h3>
              <p className="text-sm text-gray-600">Daily Deliveries</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">92%</h3>
              <p className="text-sm text-gray-600">On-Time Delivery</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="planning">Route Planning</TabsTrigger>
          <TabsTrigger value="network">Network Design</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Distribution Route Planning</h2>
            <Button size="sm">Optimize Routes</Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={distributionColumns} data={distributionData} />
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Distribution Network</h2>
            <Button size="sm">Add Facility</Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={networkColumns} data={networkData} />
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Route Optimization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Optimization Parameters</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cost Reduction Target</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Time Window</span>
                    <span className="font-medium">8-17 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle Capacity</span>
                    <span className="font-medium">85-95%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Optimization Results</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Distance Saved</span>
                    <span className="font-medium text-green-600">12.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Cost Reduction</span>
                    <span className="font-medium text-green-600">$2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Savings</span>
                    <span className="font-medium text-green-600">18 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribution Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>On-Time Delivery</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Complete Deliveries</span>
                    <span className="font-medium">96%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Satisfaction</span>
                    <span className="font-medium">4.6/5</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Cost Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cost per Delivery</span>
                    <span className="font-medium">$12.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Efficiency</span>
                    <span className="font-medium">8.2 km/L</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle Utilization</span>
                    <span className="font-medium">87%</span>
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

export default DistributionPlanning;
