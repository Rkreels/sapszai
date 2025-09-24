
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Search, Plus, Filter, Edit, Trash2, Eye, Download, Upload, FileText, Send, Copy } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import DataTable from '../../components/data/DataTable';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface Quotation {
  id: string;
  customer: string;
  customerId: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired' | 'Converted';
  validFrom: string;
  validUntil: string;
  totalAmount: number;
  currency: string;
  salesRep: string;
  items: QuotationItem[];
  terms: string;
  notes: string;
  probability: number;
  createdDate: string;
  lastModified: string;
}

interface QuotationItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

const QuotationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('quotations');
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const sampleQuotations: Quotation[] = [
      {
        id: 'QUO-2025-001',
        customer: 'Acme Corporation',
        customerId: 'CUST-001',
        status: 'Sent',
        validFrom: '2025-05-20',
        validUntil: '2025-06-20',
        totalAmount: 45000,
        currency: 'USD',
        salesRep: 'Sarah Johnson',
        probability: 75,
        createdDate: '2025-05-20',
        lastModified: '2025-05-20',
        items: [
          {
            id: '1',
            productId: 'PROD-001',
            productName: 'Enterprise Software License',
            description: 'Annual license for 100 users',
            quantity: 1,
            unitPrice: 50000,
            discount: 10,
            totalPrice: 45000
          }
        ],
        terms: 'Payment terms: Net 30 days',
        notes: 'Follow up in 1 week'
      },
      {
        id: 'QUO-2025-002',
        customer: 'TechSolutions Inc',
        customerId: 'CUST-002',
        status: 'Accepted',
        validFrom: '2025-05-15',
        validUntil: '2025-06-15',
        totalAmount: 28500,
        currency: 'USD',
        salesRep: 'Mike Wilson',
        probability: 90,
        createdDate: '2025-05-15',
        lastModified: '2025-05-18',
        items: [
          {
            id: '1',
            productId: 'PROD-002',
            productName: 'Professional Services',
            description: 'Implementation and training',
            quantity: 50,
            unitPrice: 600,
            discount: 5,
            totalPrice: 28500
          }
        ],
        terms: 'Payment terms: 50% upfront, 50% on completion',
        notes: 'Ready to convert to sales order'
      },
      {
        id: 'QUO-2025-003',
        customer: 'Global Manufacturing',
        customerId: 'CUST-003',
        status: 'Draft',
        validFrom: '2025-05-22',
        validUntil: '2025-06-22',
        totalAmount: 125000,
        currency: 'USD',
        salesRep: 'Lisa Chen',
        probability: 60,
        createdDate: '2025-05-22',
        lastModified: '2025-05-22',
        items: [
          {
            id: '1',
            productId: 'PROD-003',
            productName: 'Industrial Equipment Package',
            description: 'Complete manufacturing solution',
            quantity: 1,
            unitPrice: 125000,
            discount: 0,
            totalPrice: 125000
          }
        ],
        terms: 'Payment terms: Net 45 days',
        notes: 'Awaiting technical specifications'
      }
    ];

    setTimeout(() => {
      setQuotations(sampleQuotations);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || quotation.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateQuotation = () => {
    setSelectedQuotation(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteQuotation = (quotationId: string) => {
    setQuotations(prev => prev.filter(q => q.id !== quotationId));
    toast({
      title: 'Quotation Deleted',
      description: 'Quotation has been successfully removed.',
    });
  };

  const handleConvertToOrder = (quotationId: string) => {
    setQuotations(prev => prev.map(q => 
      q.id === quotationId ? { ...q, status: 'Converted' as const } : q
    ));
    toast({
      title: 'Quotation Converted',
      description: 'Quotation has been converted to sales order.',
    });
  };

  const handleSendQuotation = (quotationId: string) => {
    setQuotations(prev => prev.map(q => 
      q.id === quotationId ? { ...q, status: 'Sent' as const } : q
    ));
    toast({
      title: 'Quotation Sent',
      description: 'Quotation has been sent to customer.',
    });
  };

  const quotationColumns = [
    { key: 'id', header: 'Quotation ID' },
    { key: 'customer', header: 'Customer' },
    { key: 'validUntil', header: 'Valid Until' },
    { 
      key: 'totalAmount', 
      header: 'Amount',
      render: (value: number, row: Quotation) => `${row.currency} ${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Accepted' || value === 'Converted' ? 'default' : 
          value === 'Sent' ? 'secondary' : 
          value === 'Rejected' || value === 'Expired' ? 'destructive' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: 'probability', 
      header: 'Probability',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: Quotation) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditQuotation(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleSendQuotation(row.id)}>
            <Send className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleConvertToOrder(row.id)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteQuotation(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const quotationMetrics = [
    { name: 'Total Quotations', value: quotations.length, change: '+15%' },
    { name: 'Sent', value: quotations.filter(q => q.status === 'Sent').length, change: '+20%' },
    { name: 'Accepted', value: quotations.filter(q => q.status === 'Accepted').length, change: '+25%' },
    { name: 'Total Value', value: `$${quotations.reduce((sum, q) => sum + q.totalAmount, 0).toLocaleString()}`, change: '+18%' }
  ];

  const statusData = quotations.reduce((acc, quotation) => {
    acc[quotation.status] = (acc[quotation.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusData).map(([status, count]) => ({
    status,
    count,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  const conversionData = [
    { month: 'Jan', sent: 45, accepted: 28, converted: 25 },
    { month: 'Feb', sent: 52, accepted: 35, converted: 32 },
    { month: 'Mar', sent: 48, accepted: 31, converted: 28 },
    { month: 'Apr', sent: 61, accepted: 42, converted: 38 },
    { month: 'May', sent: 55, accepted: 38, converted: 35 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Quotation Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateQuotation}>
            <Plus className="h-4 w-4 mr-2" />
            Create Quotation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quotationMetrics.map((metric, index) => (
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="quotations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quotations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search quotations..." 
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable columns={quotationColumns} data={filteredQuotations} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quotation Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status} (${count})`}
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
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sent" fill="#8884d8" name="Sent" />
                    <Bar dataKey="accepted" fill="#82ca9d" name="Accepted" />
                    <Bar dataKey="converted" fill="#ffc658" name="Converted" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Conversion Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={conversionData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sent" stroke="#8884d8" name="Sent" />
                  <Line type="monotone" dataKey="accepted" stroke="#82ca9d" name="Accepted" />
                  <Line type="monotone" dataKey="converted" stroke="#ffc658" name="Converted" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quotation Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Standard Template</h3>
                  <p className="text-sm text-muted-foreground">Basic quotation format</p>
                  <Button className="w-full mt-2" variant="outline">Use Template</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Service Template</h3>
                  <p className="text-sm text-muted-foreground">For service offerings</p>
                  <Button className="w-full mt-2" variant="outline">Use Template</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Product Template</h3>
                  <p className="text-sm text-muted-foreground">For product sales</p>
                  <Button className="w-full mt-2" variant="outline">Use Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Draft</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotations.filter(q => q.status === 'Draft').map(quotation => (
                    <div key={quotation.id} className="p-2 border rounded">
                      <div className="font-medium text-sm">{quotation.id}</div>
                      <div className="text-xs text-muted-foreground">{quotation.customer}</div>
                      <div className="text-xs">${quotation.totalAmount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotations.filter(q => q.status === 'Sent').map(quotation => (
                    <div key={quotation.id} className="p-2 border rounded">
                      <div className="font-medium text-sm">{quotation.id}</div>
                      <div className="text-xs text-muted-foreground">{quotation.customer}</div>
                      <div className="text-xs">${quotation.totalAmount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accepted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotations.filter(q => q.status === 'Accepted').map(quotation => (
                    <div key={quotation.id} className="p-2 border rounded">
                      <div className="font-medium text-sm">{quotation.id}</div>
                      <div className="text-xs text-muted-foreground">{quotation.customer}</div>
                      <div className="text-xs">${quotation.totalAmount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Converted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotations.filter(q => q.status === 'Converted').map(quotation => (
                    <div key={quotation.id} className="p-2 border rounded">
                      <div className="font-medium text-sm">{quotation.id}</div>
                      <div className="text-xs text-muted-foreground">{quotation.customer}</div>
                      <div className="text-xs">${quotation.totalAmount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quotation Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Conversion Analysis</span>
                  <span className="text-xs text-muted-foreground">Success rates & trends</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Sales Rep Performance</span>
                  <span className="text-xs text-muted-foreground">Individual quotation metrics</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Customer Analysis</span>
                  <span className="text-xs text-muted-foreground">Quotation patterns by customer</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Product Performance</span>
                  <span className="text-xs text-muted-foreground">Most quoted products</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Quotation' : 'Create New Quotation'}</DialogTitle>
          </DialogHeader>
          <QuotationForm 
            quotation={selectedQuotation}
            onSave={(quotationData) => {
              if (isEditing && selectedQuotation) {
                setQuotations(prev => prev.map(q => 
                  q.id === selectedQuotation.id ? { ...q, ...quotationData } : q
                ));
                toast({ title: 'Quotation Updated', description: 'Quotation has been successfully updated.' });
              } else {
                const newQuotation: Quotation = {
                  id: `QUO-2025-${String(quotations.length + 1).padStart(3, '0')}`,
                  createdDate: new Date().toISOString().split('T')[0],
                  lastModified: new Date().toISOString().split('T')[0],
                  items: [],
                  probability: 50,
                  ...quotationData as Quotation
                };
                setQuotations(prev => [...prev, newQuotation]);
                toast({ title: 'Quotation Created', description: 'New quotation has been successfully created.' });
              }
              setIsDialogOpen(false);
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const QuotationForm: React.FC<{
  quotation: Quotation | null;
  onSave: (data: Partial<Quotation>) => void;
  onCancel: () => void;
}> = ({ quotation, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: quotation?.customer || '',
    customerId: quotation?.customerId || '',
    status: quotation?.status || 'Draft',
    validFrom: quotation?.validFrom || '',
    validUntil: quotation?.validUntil || '',
    totalAmount: quotation?.totalAmount || 0,
    currency: quotation?.currency || 'USD',
    salesRep: quotation?.salesRep || '',
    probability: quotation?.probability || 50,
    terms: quotation?.terms || '',
    notes: quotation?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customer">Customer</Label>
          <Input
            id="customer"
            value={formData.customer}
            onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="salesRep">Sales Representative</Label>
          <Input
            id="salesRep"
            value={formData.salesRep}
            onChange={(e) => setFormData(prev => ({ ...prev, salesRep: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="validFrom">Valid From</Label>
          <Input
            id="validFrom"
            type="date"
            value={formData.validFrom}
            onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="validUntil">Valid Until</Label>
          <Input
            id="validUntil"
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="totalAmount">Total Amount</Label>
          <Input
            id="totalAmount"
            type="number"
            value={formData.totalAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: Number(e.target.value) }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="probability">Win Probability (%)</Label>
          <Input
            id="probability"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => setFormData(prev => ({ ...prev, probability: Number(e.target.value) }))}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="terms">Terms & Conditions</Label>
        <Textarea
          id="terms"
          value={formData.terms}
          onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Quotation
        </Button>
      </div>
    </form>
  );
};

export default QuotationManagement;
