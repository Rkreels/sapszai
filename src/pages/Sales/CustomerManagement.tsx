
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Search, Plus, Filter, Edit, Trash2, Eye, Download, Upload, Phone, Mail, MapPin, Building } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import DataTable from '../../components/data/DataTable';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  status: 'Active' | 'Inactive' | 'Prospect';
  totalRevenue: number;
  lastOrder: string;
  creditLimit: number;
  address: string;
  contactPerson: string;
  website: string;
  taxId: string;
  paymentTerms: string;
  salesRep: string;
  created: string;
}

const CustomerManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const { toast } = useToast();

  // Sample data
  useEffect(() => {
    const sampleCustomers: Customer[] = [
      {
        id: 'CUST-001',
        name: 'John Smith',
        email: 'john.smith@acmecorp.com',
        phone: '+1-555-0123',
        company: 'Acme Corporation',
        industry: 'Manufacturing',
        status: 'Active',
        totalRevenue: 1250000,
        lastOrder: '2025-05-15',
        creditLimit: 500000,
        address: '123 Business Ave, New York, NY 10001',
        contactPerson: 'John Smith',
        website: 'www.acmecorp.com',
        taxId: 'TAX123456789',
        paymentTerms: 'Net 30',
        salesRep: 'Sarah Johnson',
        created: '2024-01-15'
      },
      {
        id: 'CUST-002',
        name: 'Emily Davis',
        email: 'emily.davis@techsolutions.com',
        phone: '+1-555-0124',
        company: 'TechSolutions Inc',
        industry: 'Technology',
        status: 'Active',
        totalRevenue: 890000,
        lastOrder: '2025-05-10',
        creditLimit: 300000,
        address: '456 Tech Street, San Francisco, CA 94105',
        contactPerson: 'Emily Davis',
        website: 'www.techsolutions.com',
        taxId: 'TAX987654321',
        paymentTerms: 'Net 45',
        salesRep: 'Mike Wilson',
        created: '2024-02-20'
      },
      {
        id: 'CUST-003',
        name: 'Michael Brown',
        email: 'm.brown@globalretail.com',
        phone: '+1-555-0125',
        company: 'Global Retail',
        industry: 'Retail',
        status: 'Prospect',
        totalRevenue: 0,
        lastOrder: '',
        creditLimit: 200000,
        address: '789 Commerce Blvd, Chicago, IL 60601',
        contactPerson: 'Michael Brown',
        website: 'www.globalretail.com',
        taxId: 'TAX456789123',
        paymentTerms: 'Net 30',
        salesRep: 'Lisa Chen',
        created: '2025-05-01'
      }
    ];

    setTimeout(() => {
      setCustomers(sampleCustomers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || customer.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setIsEditing(false);
    setIsDialogOpen(true);
    if (isEnabled) {
      speak('Opening customer creation form. Please fill in the required customer information.');
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditing(true);
    setIsDialogOpen(true);
    if (isEnabled) {
      speak(`Editing customer ${customer.name} from ${customer.company}. You can modify any customer details.`);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      toast({
        title: 'Customer Deleted',
        description: 'Customer has been successfully removed.',
      });
      if (isEnabled) {
        speak('Customer has been successfully deleted from the system.');
      }
    }
  };

  const handleSaveCustomer = (customerData: Partial<Customer>) => {
    if (isEditing && selectedCustomer) {
      setCustomers(prev => prev.map(c => 
        c.id === selectedCustomer.id ? { ...c, ...customerData } : c
      ));
      toast({
        title: 'Customer Updated',
        description: 'Customer information has been successfully updated.',
      });
    } else {
      const newCustomer: Customer = {
        id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        created: new Date().toISOString().split('T')[0],
        totalRevenue: 0,
        lastOrder: '',
        ...customerData as Customer
      };
      setCustomers(prev => [...prev, newCustomer]);
      toast({
        title: 'Customer Created',
        description: 'New customer has been successfully added.',
      });
    }
    setIsDialogOpen(false);
  };

  const customerColumns = [
    { key: 'id', header: 'Customer ID' },
    { key: 'name', header: 'Name' },
    { key: 'company', header: 'Company' },
    { key: 'industry', header: 'Industry' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'default' : value === 'Prospect' ? 'secondary' : 'outline'}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'totalRevenue', 
      header: 'Total Revenue',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: Customer) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditCustomer(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteCustomer(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const customerMetrics = [
    { name: 'Total Customers', value: customers.length, change: '+12%' },
    { name: 'Active Customers', value: customers.filter(c => c.status === 'Active').length, change: '+8%' },
    { name: 'Prospects', value: customers.filter(c => c.status === 'Prospect').length, change: '+25%' },
    { name: 'Total Revenue', value: `$${customers.reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()}`, change: '+18%' }
  ];

  const industryData = customers.reduce((acc, customer) => {
    acc[customer.industry] = (acc[customer.industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(industryData).map(([industry, count]) => ({
    industry,
    count,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Customer Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv,.xlsx';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                toast({ title: 'Import Started', description: `Importing customers from ${file.name}` });
              }
            };
            input.click();
          }}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            const csvData = [
              ['Customer ID', 'Name', 'Company', 'Email', 'Phone', 'Industry', 'Status', 'Total Revenue'],
              ...customers.map(c => [c.id, c.name, c.company, c.email, c.phone, c.industry, c.status, c.totalRevenue])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'customers.csv';
            a.click();
            URL.revokeObjectURL(url);
            toast({ title: 'Export Complete', description: 'Customer data exported successfully' });
          }}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateCustomer}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {customerMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.name}</div>
              <div className="text-sm text-green-600">{metric.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search customers..." 
                      className="pl-8 w-80"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable columns={customerColumns} data={filteredCustomers} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Distribution by Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ industry, count }) => `${industry} (${count})`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customers.filter(c => c.totalRevenue > 0)}>
                    <XAxis dataKey="company" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="totalRevenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">High Value</h3>
                  <p className="text-sm text-muted-foreground">Revenue &gt; $1M</p>
                  <div className="text-2xl font-bold mt-2">
                    {customers.filter(c => c.totalRevenue > 1000000).length}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Medium Value</h3>
                  <p className="text-sm text-muted-foreground">Revenue $100K - $1M</p>
                  <div className="text-2xl font-bold mt-2">
                    {customers.filter(c => c.totalRevenue >= 100000 && c.totalRevenue <= 1000000).length}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Low Value</h3>
                  <p className="text-sm text-muted-foreground">Revenue &lt; $100K</p>
                  <div className="text-2xl font-bold mt-2">
                    {customers.filter(c => c.totalRevenue < 100000).length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col" onClick={() => {
                  toast({ title: 'Generating Report', description: 'Customer Activity Report for last 30 days' });
                  setTimeout(() => {
                    const reportData = customers.map(c => `${c.name}: ${Math.floor(Math.random() * 10)} activities`).join('\n');
                    const blob = new Blob([reportData], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'customer-activity-report.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }, 1000);
                }}>
                  <span>Customer Activity Report</span>
                  <span className="text-xs text-muted-foreground">Last 30 days</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col" onClick={() => {
                  toast({ title: 'Generating Report', description: 'Revenue Analysis by customer segment' });
                  setTimeout(() => {
                    const revenueReport = `High Value: $${customers.filter(c => c.totalRevenue > 1000000).reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()}\nMedium Value: $${customers.filter(c => c.totalRevenue >= 100000 && c.totalRevenue <= 1000000).reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()}\nLow Value: $${customers.filter(c => c.totalRevenue < 100000).reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()}`;
                    const blob = new Blob([revenueReport], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'revenue-analysis.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }, 1000);
                }}>
                  <span>Revenue Analysis</span>
                  <span className="text-xs text-muted-foreground">By customer segment</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col" onClick={() => {
                  toast({ title: 'Generating Report', description: 'Credit Analysis report' });
                  setTimeout(() => {
                    const creditReport = customers.map(c => `${c.company}: Credit Limit $${c.creditLimit.toLocaleString()}, Utilization: ${Math.floor(Math.random() * 80)}%`).join('\n');
                    const blob = new Blob([creditReport], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'credit-analysis.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }, 1000);
                }}>
                  <span>Credit Analysis</span>
                  <span className="text-xs text-muted-foreground">Credit limits &amp; usage</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col" onClick={() => {
                  toast({ title: 'Generating Report', description: 'Sales Performance by representative' });
                  setTimeout(() => {
                    const salesReps = [...new Set(customers.map(c => c.salesRep))];
                    const performanceReport = salesReps.map(rep => {
                      const repCustomers = customers.filter(c => c.salesRep === rep);
                      const totalRevenue = repCustomers.reduce((sum, c) => sum + c.totalRevenue, 0);
                      return `${rep}: ${repCustomers.length} customers, $${totalRevenue.toLocaleString()} revenue`;
                    }).join('\n');
                    const blob = new Blob([performanceReport], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'sales-performance.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }, 1000);
                }}>
                  <span>Sales Performance</span>
                  <span className="text-xs text-muted-foreground">By sales representative</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Customer' : 'Create New Customer'}</DialogTitle>
          </DialogHeader>
          <CustomerForm 
            customer={selectedCustomer}
            onSave={handleSaveCustomer}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CustomerForm: React.FC<{
  customer: Customer | null;
  onSave: (data: Partial<Customer>) => void;
  onCancel: () => void;
}> = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    company: customer?.company || '',
    industry: customer?.industry || '',
    status: customer?.status || 'Prospect',
    creditLimit: customer?.creditLimit || 0,
    address: customer?.address || '',
    website: customer?.website || '',
    taxId: customer?.taxId || '',
    paymentTerms: customer?.paymentTerms || 'Net 30',
    salesRep: customer?.salesRep || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Contact Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Prospect">Prospect</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="creditLimit">Credit Limit</Label>
          <Input
            id="creditLimit"
            type="number"
            value={formData.creditLimit}
            onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: Number(e.target.value) }))}
          />
        </div>
        <div>
          <Label htmlFor="salesRep">Sales Representative</Label>
          <Input
            id="salesRep"
            value={formData.salesRep}
            onChange={(e) => setFormData(prev => ({ ...prev, salesRep: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Customer
        </Button>
      </div>
    </form>
  );
};

export default CustomerManagement;
