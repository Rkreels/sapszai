
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Search, Plus, Filter, Edit, Trash2, Download, Upload, Package, RotateCcw, RefreshCw } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import DataTable from '../../components/data/DataTable';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface SalesReturn {
  id: string;
  returnDate: string;
  customer: string;
  customerId: string;
  originalOrder: string;
  returnType: 'Product Return' | 'Credit Return' | 'Exchange' | 'Warranty Return';
  reason: string;
  status: 'Pending' | 'Approved' | 'Processing' | 'Completed' | 'Rejected';
  totalAmount: number;
  refundAmount: number;
  items: ReturnItem[];
  approvedBy?: string;
  processedDate?: string;
  notes: string;
}

interface ReturnItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  condition: 'New' | 'Used' | 'Damaged' | 'Defective';
  returnReason: string;
}

interface CreditMemo {
  id: string;
  returnId: string;
  customer: string;
  amount: number;
  issueDate: string;
  status: 'Draft' | 'Issued' | 'Applied' | 'Expired';
  expiryDate: string;
}

const SalesReturns: React.FC = () => {
  const [activeTab, setActiveTab] = useState('returns');
  const [returns, setReturns] = useState<SalesReturn[]>([]);
  const [creditMemos, setCreditMemos] = useState<CreditMemo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState<SalesReturn | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const sampleReturns: SalesReturn[] = [
      {
        id: 'RET-2025-001',
        returnDate: '2025-05-20',
        customer: 'Acme Corporation',
        customerId: 'CUST-001',
        originalOrder: 'SO-2025-001',
        returnType: 'Product Return',
        reason: 'Defective product',
        status: 'Approved',
        totalAmount: 15000,
        refundAmount: 15000,
        approvedBy: 'Sarah Johnson',
        processedDate: '2025-05-21',
        notes: 'Product received with manufacturing defect',
        items: [
          {
            id: '1',
            productId: 'PROD-001',
            productName: 'Industrial Machine Component',
            quantity: 1,
            unitPrice: 15000,
            totalPrice: 15000,
            condition: 'Defective',
            returnReason: 'Manufacturing defect'
          }
        ]
      },
      {
        id: 'RET-2025-002',
        returnDate: '2025-05-18',
        customer: 'TechSolutions Inc',
        customerId: 'CUST-002',
        originalOrder: 'SO-2025-003',
        returnType: 'Exchange',
        reason: 'Wrong model ordered',
        status: 'Processing',
        totalAmount: 8500,
        refundAmount: 0,
        notes: 'Customer wants to exchange for different model',
        items: [
          {
            id: '1',
            productId: 'PROD-002',
            productName: 'Software License',
            quantity: 5,
            unitPrice: 1700,
            totalPrice: 8500,
            condition: 'New',
            returnReason: 'Wrong specification'
          }
        ]
      },
      {
        id: 'RET-2025-003',
        returnDate: '2025-05-15',
        customer: 'Global Manufacturing',
        customerId: 'CUST-003',
        originalOrder: 'SO-2025-007',
        returnType: 'Credit Return',
        reason: 'Customer dissatisfaction',
        status: 'Completed',
        totalAmount: 12000,
        refundAmount: 10800,
        approvedBy: 'Mike Wilson',
        processedDate: '2025-05-16',
        notes: 'Partial refund due to restocking fee',
        items: [
          {
            id: '1',
            productId: 'PROD-003',
            productName: 'Professional Services',
            quantity: 20,
            unitPrice: 600,
            totalPrice: 12000,
            condition: 'Used',
            returnReason: 'Service not as expected'
          }
        ]
      }
    ];

    const sampleCreditMemos: CreditMemo[] = [
      {
        id: 'CM-2025-001',
        returnId: 'RET-2025-001',
        customer: 'Acme Corporation',
        amount: 15000,
        issueDate: '2025-05-21',
        status: 'Applied',
        expiryDate: '2026-05-21'
      },
      {
        id: 'CM-2025-002',
        returnId: 'RET-2025-003',
        customer: 'Global Manufacturing',
        amount: 10800,
        issueDate: '2025-05-16',
        status: 'Issued',
        expiryDate: '2026-05-16'
      }
    ];

    setTimeout(() => {
      setReturns(sampleReturns);
      setCreditMemos(sampleCreditMemos);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredReturns = returns.filter(returnItem => {
    const matchesSearch = returnItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || returnItem.status.toLowerCase() === filterStatus;
    const matchesType = filterType === 'all' || returnItem.returnType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateReturn = () => {
    setSelectedReturn(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditReturn = (returnItem: SalesReturn) => {
    setSelectedReturn(returnItem);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteReturn = (returnId: string) => {
    setReturns(prev => prev.filter(r => r.id !== returnId));
    toast({
      title: 'Return Deleted',
      description: 'Return request has been successfully removed.',
    });
  };

  const handleApproveReturn = (returnId: string) => {
    setReturns(prev => prev.map(r => 
      r.id === returnId ? { ...r, status: 'Approved' as const, approvedBy: 'Current User' } : r
    ));
    toast({
      title: 'Return Approved',
      description: 'Return request has been approved.',
    });
  };

  const handleProcessReturn = (returnId: string) => {
    setReturns(prev => prev.map(r => 
      r.id === returnId ? { ...r, status: 'Processing' as const } : r
    ));
    toast({
      title: 'Return Processing',
      description: 'Return is now being processed.',
    });
  };

  const returnColumns = [
    { key: 'id', header: 'Return ID' },
    { key: 'customer', header: 'Customer' },
    { key: 'originalOrder', header: 'Original Order' },
    { key: 'returnType', header: 'Type' },
    { key: 'returnDate', header: 'Return Date' },
    { 
      key: 'totalAmount', 
      header: 'Amount',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Completed' ? 'default' : 
          value === 'Approved' || value === 'Processing' ? 'secondary' : 
          value === 'Rejected' ? 'destructive' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: SalesReturn) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditReturn(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          {row.status === 'Pending' && (
            <Button variant="ghost" size="sm" onClick={() => handleApproveReturn(row.id)}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleDeleteReturn(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const creditMemoColumns = [
    { key: 'id', header: 'Credit Memo ID' },
    { key: 'customer', header: 'Customer' },
    { key: 'returnId', header: 'Return ID' },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'issueDate', header: 'Issue Date' },
    { key: 'expiryDate', header: 'Expiry Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Applied' ? 'default' : 
          value === 'Issued' ? 'secondary' : 
          value === 'Expired' ? 'destructive' : 'outline'
        }>
          {value}
        </Badge>
      )
    }
  ];

  const returnMetrics = [
    { 
      title: 'Total Returns', 
      value: returns.length.toString(), 
      change: '+15%',
      icon: RotateCcw
    },
    { 
      title: 'Pending Approval', 
      value: returns.filter(r => r.status === 'Pending').length.toString(), 
      change: '+5%',
      icon: Package
    },
    { 
      title: 'Return Value', 
      value: `$${returns.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}`, 
      change: '+12%',
      icon: RefreshCw
    },
    { 
      title: 'Refund Amount', 
      value: `$${returns.reduce((sum, r) => sum + r.refundAmount, 0).toLocaleString()}`, 
      change: '+8%',
      icon: RefreshCw
    }
  ];

  const returnReasonData = returns.reduce((acc, returnItem) => {
    acc[returnItem.reason] = (acc[returnItem.reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const reasonChartData = Object.entries(returnReasonData).map(([reason, count]) => ({
    reason,
    count,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  const monthlyReturnData = [
    { month: 'Jan', returns: 12, value: 45000 },
    { month: 'Feb', returns: 15, value: 52000 },
    { month: 'Mar', returns: 8, value: 28000 },
    { month: 'Apr', returns: 18, value: 65000 },
    { month: 'May', returns: 10, value: 35500 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Sales Returns</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleCreateReturn}>
            <Plus className="h-4 w-4 mr-2" />
            Create Return
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {returnMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-green-600">{metric.change}</div>
                </div>
                <metric.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="creditMemos">Credit Memos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="approval">Approval Workflow</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Return Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search returns..." 
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Product Return">Product Return</SelectItem>
                      <SelectItem value="Credit Return">Credit Return</SelectItem>
                      <SelectItem value="Exchange">Exchange</SelectItem>
                      <SelectItem value="Warranty Return">Warranty Return</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable columns={returnColumns} data={filteredReturns} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creditMemos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit Memos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable columns={creditMemoColumns} data={creditMemos} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Return Reasons</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reasonChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ reason, count }) => `${reason} (${count})`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reasonChartData.map((entry, index) => (
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
                <CardTitle>Monthly Return Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyReturnData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="returns" stroke="#8884d8" name="Returns Count" />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Return Value" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Return Value by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyReturnData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'value' ? `$${Number(value).toLocaleString()}` : value,
                    name === 'value' ? 'Return Value' : 'Returns Count'
                  ]} />
                  <Bar dataKey="value" fill="#8884d8" name="Return Value" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returns.filter(r => r.status === 'Pending').map(returnItem => (
                  <div key={returnItem.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{returnItem.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {returnItem.customer} • {returnItem.returnType} • ${returnItem.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-sm">{returnItem.reason}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleApproveReturn(returnItem.id)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
                {returns.filter(r => r.status === 'Pending').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending approvals
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Return Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Return Analysis</span>
                  <span className="text-xs text-muted-foreground">Detailed return trends</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Customer Return History</span>
                  <span className="text-xs text-muted-foreground">Returns by customer</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Product Return Analysis</span>
                  <span className="text-xs text-muted-foreground">Returns by product</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Financial Impact</span>
                  <span className="text-xs text-muted-foreground">Return cost analysis</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Return' : 'Create New Return'}</DialogTitle>
          </DialogHeader>
          <ReturnForm 
            returnItem={selectedReturn}
            onSave={(returnData) => {
              if (isEditing && selectedReturn) {
                setReturns(prev => prev.map(r => 
                  r.id === selectedReturn.id ? { ...r, ...returnData } : r
                ));
                toast({ title: 'Return Updated', description: 'Return has been successfully updated.' });
              } else {
                const newReturn: SalesReturn = {
                  id: `RET-2025-${String(returns.length + 1).padStart(3, '0')}`,
                  returnDate: new Date().toISOString().split('T')[0],
                  items: [],
                  refundAmount: 0,
                  ...returnData as SalesReturn
                };
                setReturns(prev => [...prev, newReturn]);
                toast({ title: 'Return Created', description: 'New return has been successfully created.' });
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

const ReturnForm: React.FC<{
  returnItem: SalesReturn | null;
  onSave: (data: Partial<SalesReturn>) => void;
  onCancel: () => void;
}> = ({ returnItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: returnItem?.customer || '',
    customerId: returnItem?.customerId || '',
    originalOrder: returnItem?.originalOrder || '',
    returnType: returnItem?.returnType || 'Product Return',
    reason: returnItem?.reason || '',
    status: returnItem?.status || 'Pending',
    totalAmount: returnItem?.totalAmount || 0,
    notes: returnItem?.notes || ''
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
          <Label htmlFor="originalOrder">Original Order</Label>
          <Input
            id="originalOrder"
            value={formData.originalOrder}
            onChange={(e) => setFormData(prev => ({ ...prev, originalOrder: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="returnType">Return Type</Label>
          <Select value={formData.returnType} onValueChange={(value) => setFormData(prev => ({ ...prev, returnType: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Product Return">Product Return</SelectItem>
              <SelectItem value="Credit Return">Credit Return</SelectItem>
              <SelectItem value="Exchange">Exchange</SelectItem>
              <SelectItem value="Warranty Return">Warranty Return</SelectItem>
            </SelectContent>
          </Select>
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
      </div>
      
      <div>
        <Label htmlFor="reason">Return Reason</Label>
        <Input
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
          required
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
          Save Return
        </Button>
      </div>
    </form>
  );
};

export default SalesReturns;
