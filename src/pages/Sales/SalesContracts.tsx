
import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Search, Plus, Filter, FileText } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const SalesContracts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agreements');
  
  const contracts = [
    { id: 'SC001', type: 'Volume Agreement', customer: 'Acme Corp', startDate: '2025-01-01', endDate: '2025-12-31', value: '$250,000', status: 'Active' },
    { id: 'SC002', type: 'Service Agreement', customer: 'TechSolutions Inc', startDate: '2025-02-15', endDate: '2026-02-14', value: '$120,000', status: 'Active' },
    { id: 'SC003', type: 'Value Contract', customer: 'Global Retail', startDate: '2025-03-01', endDate: '2026-03-01', value: '$500,000', status: 'Active' },
    { id: 'SC004', type: 'Quantity Contract', customer: 'Manufacturing Partners', startDate: '2025-01-01', endDate: '2025-06-30', value: '$75,000', status: 'Pending Approval' },
    { id: 'SC005', type: 'Scheduling Agreement', customer: 'Logistic Solutions', startDate: '2025-04-01', endDate: '2025-12-31', value: '$180,000', status: 'Draft' },
  ];
  
  const schedules = [
    { id: 'SA001', contract: 'SC005', scheduledDate: '2025-05-15', quantity: '250 units', product: 'Industrial Sensors', deliveryStatus: 'Planned' },
    { id: 'SA002', contract: 'SC005', scheduledDate: '2025-07-20', quantity: '300 units', product: 'Industrial Sensors', deliveryStatus: 'Planned' },
    { id: 'SA003', contract: 'SC005', scheduledDate: '2025-09-10', quantity: '200 units', product: 'Industrial Sensors', deliveryStatus: 'Planned' },
    { id: 'SA004', contract: 'SC003', scheduledDate: '2025-04-05', quantity: '500 units', product: 'Consumer Electronics', deliveryStatus: 'Confirmed' },
    { id: 'SA005', contract: 'SC002', scheduledDate: '2025-03-15', quantity: 'N/A', product: 'Maintenance Services', deliveryStatus: 'Scheduled' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Sales Contracts</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Contract
          </Button>
        </div>
      </div>

      <Tabs defaultValue="agreements" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agreements">Contract Agreements</TabsTrigger>
          <TabsTrigger value="schedules">Delivery Schedules</TabsTrigger>
          <TabsTrigger value="templates">Contract Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="agreements" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between mb-4">
                <div className="relative w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search contracts..." className="pl-8" />
                </div>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue placeholder="Contract Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="volume">Volume Agreement</SelectItem>
                      <SelectItem value="service">Service Agreement</SelectItem>
                      <SelectItem value="value">Value Contract</SelectItem>
                      <SelectItem value="quantity">Quantity Contract</SelectItem>
                      <SelectItem value="scheduling">Scheduling Agreement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map(contract => (
                      <TableRow key={contract.id}>
                        <TableCell>{contract.id}</TableCell>
                        <TableCell>{contract.type}</TableCell>
                        <TableCell>{contract.customer}</TableCell>
                        <TableCell>{contract.startDate}</TableCell>
                        <TableCell>{contract.endDate}</TableCell>
                        <TableCell>{contract.value}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            contract.status === 'Active' ? 'bg-green-100 text-green-800' :
                            contract.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {contract.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between mb-4">
                <div className="relative w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search delivery schedules..." className="pl-8" />
                </div>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Schedule ID</TableHead>
                      <TableHead>Contract Reference</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Delivery Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map(schedule => (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.id}</TableCell>
                        <TableCell>{schedule.contract}</TableCell>
                        <TableCell>{schedule.scheduledDate}</TableCell>
                        <TableCell>{schedule.quantity}</TableCell>
                        <TableCell>{schedule.product}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            schedule.deliveryStatus === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                            schedule.deliveryStatus === 'Scheduled' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {schedule.deliveryStatus}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6 p-6 flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium mb-2">Contract Templates</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">Create and manage standardized contract templates for different business scenarios</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <Button variant="outline" className="h-24 flex flex-col">
                  <span className="text-sm font-medium">Volume-Based Agreement</span>
                  <span className="text-xs text-muted-foreground mt-1">Discounts based on purchase volumes</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <span className="text-sm font-medium">Service Level Agreement</span>
                  <span className="text-xs text-muted-foreground mt-1">Terms for service provision</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <span className="text-sm font-medium">Value-Based Contract</span>
                  <span className="text-xs text-muted-foreground mt-1">Fixed monetary value commitment</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <span className="text-sm font-medium">Scheduling Agreement</span>
                  <span className="text-xs text-muted-foreground mt-1">Long-term delivery schedule</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesContracts;
