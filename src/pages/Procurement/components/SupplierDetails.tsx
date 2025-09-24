import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { MapPin, Phone, Mail, Globe, FileText, Star, TrendingUp, BarChart, Package, ClipboardCheck } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  status: string;
  rating: number;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  country: string;
  category: string;
  totalSpend: string;
  lastOrder: string;
  paymentTerms: string;
  deliveryTerm: string;
  currency: string;
}

interface SupplierDetailsProps {
  supplier: Supplier;
}

// Sample data for supplier orders, contracts, and invoices
const recentOrders = [
  { id: "4500012765", date: "05/15/2025", delivery: "06/01/2025", value: "125,000.00 USD", status: "Open", items: 12 },
  { id: "4500012681", date: "04/22/2025", delivery: "05/05/2025", value: "78,350.00 USD", status: "Delivered", items: 8 },
  { id: "4500012597", date: "03/18/2025", delivery: "04/01/2025", value: "54,800.00 USD", status: "Delivered", items: 15 },
  { id: "4500012492", date: "02/25/2025", delivery: "03/10/2025", value: "92,600.00 USD", status: "Delivered", items: 10 },
  { id: "4500012388", date: "01/12/2025", delivery: "01/28/2025", value: "67,450.00 USD", status: "Delivered", items: 7 }
];

const contracts = [
  { id: "CNT-2025-042", description: "Annual Supply Agreement", start: "01/01/2025", end: "12/31/2025", value: "1,250,000.00 USD", status: "Active" },
  { id: "CNT-2024-185", description: "Service Level Agreement", start: "07/01/2024", end: "06/30/2025", value: "350,000.00 USD", status: "Active" },
  { id: "CNT-2023-098", description: "Special Pricing Agreement", start: "01/01/2023", end: "12/31/2024", value: "800,000.00 USD", status: "Expired" }
];

const invoices = [
  { id: "5100045678", date: "05/10/2025", dueDate: "06/10/2025", amount: "45,200.00 USD", status: "Outstanding" },
  { id: "5100045532", date: "04/15/2025", dueDate: "05/15/2025", amount: "78,350.00 USD", status: "Paid" },
  { id: "5100045498", date: "03/22/2025", dueDate: "04/22/2025", amount: "54,800.00 USD", status: "Paid" },
  { id: "5100045412", date: "02/28/2025", dueDate: "03/28/2025", amount: "92,600.00 USD", status: "Paid" }
];

const materials = [
  { id: "MAT-10045", name: "High-capacity Server Memory", category: "Electronics", price: "854.00 USD", leadTime: "21 days" },
  { id: "MAT-10032", name: "Data Center Cooling Unit", category: "Equipment", price: "4,250.00 USD", leadTime: "40 days" },
  { id: "MAT-10028", name: "Fiber Optic Cable (per m)", category: "Networking", price: "12.50 USD", leadTime: "14 days" },
  { id: "MAT-10021", name: "Enterprise SSD Storage", category: "Storage", price: "745.00 USD", leadTime: "7 days" }
];

const performanceData = [
  { period: "2025 Q1", onTimeDelivery: "95%", qualityRating: "4.8/5.0", responseTime: "1.2 days", costVariance: "+2.1%" },
  { period: "2024 Q4", onTimeDelivery: "94%", qualityRating: "4.7/5.0", responseTime: "1.5 days", costVariance: "+1.8%" },
  { period: "2024 Q3", onTimeDelivery: "97%", qualityRating: "4.9/5.0", responseTime: "1.0 days", costVariance: "-0.5%" },
  { period: "2024 Q2", onTimeDelivery: "92%", qualityRating: "4.6/5.0", responseTime: "1.8 days", costVariance: "+3.2%" }
];

const SupplierDetails: React.FC<SupplierDetailsProps> = ({ supplier }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{supplier.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant={supplier.status === 'Active' ? 'default' : 'outline'}>
              {supplier.status}
            </Badge>
            <div className="flex items-center">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < supplier.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">Supplier ID: {supplier.id}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </Button>
          <Button variant="default" size="sm">
            Edit Supplier
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <ul className="space-y-3">
                  <li className="flex">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{supplier.email}</div>
                    </div>
                  </li>
                  <li className="flex">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium">{supplier.phone}</div>
                    </div>
                  </li>
                  <li className="flex">
                    <Globe className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Website</div>
                      <div className="font-medium">{supplier.website}</div>
                    </div>
                  </li>
                  <li className="flex">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-medium">{supplier.address}</div>
                      <div className="text-sm">{supplier.country}</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Business Information</h2>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Contact Person</span>
                    <span className="font-medium">{supplier.contactPerson}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium">{supplier.category}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Payment Terms</span>
                    <span className="font-medium">{supplier.paymentTerms}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Delivery Terms</span>
                    <span className="font-medium">{supplier.deliveryTerm}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Currency</span>
                    <span className="font-medium">{supplier.currency}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Total Spend</div>
                      <div className="font-medium">{supplier.totalSpend}</div>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <BarChart className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">On-Time Delivery</div>
                      <div className="font-medium">92%</div>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <BarChart className="h-5 w-5 text-purple-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Quality Rating</div>
                      <div className="font-medium">4.8/5.0</div>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-5 w-5 text-orange-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Last Order</div>
                      <div className="font-medium">{supplier.lastOrder}</div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Purchase Orders</h2>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.slice(0, 3).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.value}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'Open' ? 'outline' : 'default'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Supplied Materials</h2>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Lead Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.slice(0, 3).map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.name}</TableCell>
                        <TableCell>{material.category}</TableCell>
                        <TableCell>{material.price}</TableCell>
                        <TableCell>{material.leadTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Active Contracts</h2>
                  <Button variant="outline" size="sm">Manage Contracts</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.filter(c => c.status === 'Active').map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">{contract.id}</TableCell>
                        <TableCell>{contract.description}</TableCell>
                        <TableCell>{contract.start}</TableCell>
                        <TableCell>{contract.end}</TableCell>
                        <TableCell>{contract.value}</TableCell>
                        <TableCell>
                          <Badge>
                            {contract.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Purchase Orders</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    Create PO
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.delivery}</TableCell>
                      <TableCell>{order.value}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'Open' ? 'outline' : 'default'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contracts">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Contracts</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    New Contract
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.id}</TableCell>
                      <TableCell>{contract.description}</TableCell>
                      <TableCell>{contract.start}</TableCell>
                      <TableCell>{contract.end}</TableCell>
                      <TableCell>{contract.value}</TableCell>
                      <TableCell>
                        <Badge variant={contract.status === 'Active' ? 'default' : 'secondary'}>
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Invoices</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'Paid' ? 'default' : 'outline'}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">On-Time Delivery</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Target: 95%</span>
                      <span>Industry avg: 85%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Quality Rating</span>
                      <span className="text-sm font-medium">4.8/5.0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Target: 4.5/5.0</span>
                      <span>Industry avg: 4.2/5.0</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-sm font-medium">1.2 days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Target: 1.0 days</span>
                      <span>Industry avg: 2.5 days</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cost Competitiveness</span>
                      <span className="text-sm font-medium">+2.1%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Target: ±0%</span>
                      <span>Industry avg: +4.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Performance History</h2>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Full Report
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>On-Time</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Response</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.map((period) => (
                      <TableRow key={period.period}>
                        <TableCell className="font-medium">{period.period}</TableCell>
                        <TableCell>{period.onTimeDelivery}</TableCell>
                        <TableCell>{period.qualityRating}</TableCell>
                        <TableCell>{period.responseTime}</TableCell>
                        <TableCell className={period.costVariance.startsWith('-') ? 'text-green-600' : 'text-amber-600'}>
                          {period.costVariance}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Supplier Evaluation</h2>
                <Button size="sm">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Start Evaluation
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Last Evaluation</h3>
                  <div className="text-xl font-bold mb-2">94/100</div>
                  <Badge className="mb-2" variant="outline">A Rating</Badge>
                  <div className="text-xs text-gray-500">Conducted on: March 15, 2025</div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Evaluation Categories</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quality</span>
                      <span className="font-medium">96/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery</span>
                      <span className="font-medium">92/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service</span>
                      <span className="font-medium">95/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cost</span>
                      <span className="font-medium">88/100</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Improvement Areas</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      Price competitiveness
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      Order change flexibility
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Technical support
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Documentation quality
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierDetails;
