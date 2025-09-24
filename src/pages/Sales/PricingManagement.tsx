
import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Search, Plus, Download, UploadCloud, Filter, Edit, Eye } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../hooks/use-toast';

const PricingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('priceLists');
  const { toast } = useToast();

  const priceLists = [
    { id: 'PL001', name: 'Standard Retail Pricing', items: 234, validFrom: '2025-01-01', validTo: '2025-12-31', status: 'Active' },
    { id: 'PL002', name: 'Preferred Customer', items: 234, validFrom: '2025-01-01', validTo: '2025-12-31', status: 'Active' },
    { id: 'PL003', name: 'Wholesale Pricing', items: 189, validFrom: '2025-01-01', validTo: '2025-12-31', status: 'Active' },
    { id: 'PL004', name: 'Promotional Q2 2025', items: 67, validFrom: '2025-04-01', validTo: '2025-06-30', status: 'Pending' },
    { id: 'PL005', name: 'Year-End Special', items: 124, validFrom: '2025-11-15', validTo: '2025-12-31', status: 'Draft' },
  ];

  const conditions = [
    { id: 'C001', type: 'Discount', value: '10%', product: 'Electronics', customer: 'All', validFrom: '2025-01-01', validTo: '2025-12-31' },
    { id: 'C002', type: 'Surcharge', value: '5%', product: 'All', customer: 'Region: North', validFrom: '2025-01-01', validTo: '2025-12-31' },
    { id: 'C003', type: 'Discount', value: '15%', product: 'Furniture', customer: 'Corporate', validFrom: '2025-01-01', validTo: '2025-12-31' },
    { id: 'C004', type: 'Freight', value: '$25.00', product: 'All', customer: 'All', validFrom: '2025-01-01', validTo: '2025-12-31' },
    { id: 'C005', type: 'Promotional', value: '20%', product: 'Summer Collection', customer: 'All', validFrom: '2025-06-01', validTo: '2025-08-31' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Pricing Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => {
            toast({
              title: 'Filter Applied',
              description: 'Filter options panel opened',
            });
          }}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv,.xlsx';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                toast({ title: 'Import Started', description: `Importing pricing data from ${file.name}` });
              }
            };
            input.click();
          }}>
            <UploadCloud className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            toast({
              title: 'Export Started',
              description: 'Exporting pricing data to CSV',
            });
          }}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => {
            toast({
              title: 'Create New Price List',
              description: 'Opening price list creation form',
            });
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

      <Tabs defaultValue="priceLists" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="priceLists">Price Lists</TabsTrigger>
          <TabsTrigger value="conditions">Pricing Conditions</TabsTrigger>
          <TabsTrigger value="procedures">Pricing Procedures</TabsTrigger>
        </TabsList>

        <TabsContent value="priceLists" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between mb-4">
                <div className="relative w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search price lists..." className="pl-8" />
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-sm">Status:</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[120px] h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Price List Name</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Valid From</TableHead>
                      <TableHead>Valid To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priceLists.map(list => (
                      <TableRow key={list.id}>
                        <TableCell>{list.id}</TableCell>
                        <TableCell>{list.name}</TableCell>
                        <TableCell>{list.items}</TableCell>
                        <TableCell>{list.validFrom}</TableCell>
                        <TableCell>{list.validTo}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            list.status === 'Active' ? 'bg-green-100 text-green-800' :
                            list.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {list.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => {
                            toast({
                              title: 'View Price List',
                              description: `Opening price list ${list.name}`,
                            });
                          }}>
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="conditions" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between mb-4">
                <div className="relative w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search pricing conditions..." className="pl-8" />
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-sm">Type:</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[120px] h-9">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="surcharge">Surcharge</SelectItem>
                      <SelectItem value="freight">Freight</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Valid From</TableHead>
                      <TableHead>Valid To</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conditions.map(condition => (
                      <TableRow key={condition.id}>
                        <TableCell>{condition.id}</TableCell>
                        <TableCell>{condition.type}</TableCell>
                        <TableCell>{condition.value}</TableCell>
                        <TableCell>{condition.product}</TableCell>
                        <TableCell>{condition.customer}</TableCell>
                        <TableCell>{condition.validFrom}</TableCell>
                        <TableCell>{condition.validTo}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => {
                            toast({
                              title: 'Edit Pricing Condition',
                              description: `Editing condition ${condition.id}`,
                            });
                          }}>
                            <Edit className="h-4 w-4" />
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

        <TabsContent value="procedures" className="space-y-4">
          <Card>
            <CardContent className="pt-6 text-center p-20">
              <h3 className="text-lg font-medium mb-2">Pricing Procedures Configuration</h3>
              <p className="text-muted-foreground mb-6">Configure sequence and rules for applying pricing conditions</p>
              <Button onClick={() => {
                toast({
                  title: 'Configure Pricing Procedures',
                  description: 'Opening pricing procedures configuration panel',
                });
              }}>
                Configure Pricing Procedures
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingManagement;
