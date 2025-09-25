
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, Edit, Eye, CreditCard, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { listEntities, upsertEntity, removeEntity, generateId } from '../../lib/localCrud';

interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Approved' | 'Paid' | 'Overdue' | 'Disputed';
  dueDate: string;
  invoiceDate: string;
  purchaseOrder: string;
  description: string;
}

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  purchaseOrder: z.string().min(1, 'Purchase order is required'),
  description: z.string().min(1, 'Description is required'),
});

const STORAGE_KEY = 'accounts_payable_invoices';

const AccountsPayable: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      currency: 'USD',
      invoiceDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Accounts Payable. Manage vendor invoices, payment processing, and maintain accurate payables records for optimal cash flow management.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedInvoices = listEntities<Invoice>(STORAGE_KEY);
    
    if (storedInvoices.length === 0) {
      // Seed with sample data
      const sampleInvoices: Invoice[] = [
        {
          id: generateId('inv'),
          invoiceNumber: 'INV-2025-001',
          vendor: 'Dell Technologies',
          amount: 15000.00,
          currency: 'USD',
          status: 'Approved',
          dueDate: '2025-02-15',
          invoiceDate: '2025-01-20',
          purchaseOrder: 'PO-2025-001',
          description: 'Laptop computers - IT Equipment'
        },
        {
          id: generateId('inv'),
          invoiceNumber: 'INV-2025-002',
          vendor: 'Office Depot',
          amount: 850.00,
          currency: 'USD',
          status: 'Pending',
          dueDate: '2025-02-10',
          invoiceDate: '2025-01-25',
          purchaseOrder: 'PO-2025-002',
          description: 'Office supplies and stationery'
        }
      ];
      
      sampleInvoices.forEach(invoice => upsertEntity<Invoice>(STORAGE_KEY, invoice));
      setInvoices(sampleInvoices);
    } else {
      setInvoices(storedInvoices);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-blue-100 text-blue-800',
      'Paid': 'bg-green-100 text-green-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Disputed': 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const onSubmit = (data: z.infer<typeof invoiceSchema>) => {
    try {
      const newInvoice: Invoice = {
        id: generateId('inv'),
        ...data,
        status: 'Pending',
      };

      upsertEntity<Invoice>(STORAGE_KEY, newInvoice);
      setInvoices(prev => [...prev, newInvoice]);
      
      toast({
        title: 'Invoice Created',
        description: `Invoice ${data.invoiceNumber} has been created successfully.`,
      });
      
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create invoice.',
        variant: 'destructive',
      });
    }
  };

  const onEdit = (data: z.infer<typeof invoiceSchema>) => {
    if (!editingInvoice) return;
    
    try {
      const updatedInvoice = { ...editingInvoice, ...data };
      upsertEntity<Invoice>(STORAGE_KEY, updatedInvoice);
      setInvoices(prev => prev.map(invoice => 
        invoice.id === editingInvoice.id ? updatedInvoice : invoice
      ));
      
      toast({
        title: 'Invoice Updated',
        description: `Invoice ${data.invoiceNumber} has been updated.`,
      });
      
      setEditingInvoice(null);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update invoice.',
        variant: 'destructive',
      });
    }
  };

  const deleteInvoice = (invoice: Invoice) => {
    if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      try {
        removeEntity(STORAGE_KEY, invoice.id);
        setInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
        
        toast({
          title: 'Invoice Deleted',
          description: `Invoice ${invoice.invoiceNumber} has been deleted.`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete invoice.',
          variant: 'destructive',
        });
      }
    }
  };

  const updateInvoiceStatus = (invoice: Invoice, newStatus: Invoice['status']) => {
    try {
      const updatedInvoice = { ...invoice, status: newStatus };
      upsertEntity<Invoice>(STORAGE_KEY, updatedInvoice);
      setInvoices(prev => prev.map(inv => inv.id === invoice.id ? updatedInvoice : inv));
      
      toast({
        title: 'Status Updated',
        description: `Invoice ${invoice.invoiceNumber} status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update invoice status.',
        variant: 'destructive',
      });
    }
  };

  const processPayment = (invoice: Invoice) => {
    if (invoice.status !== 'Approved') {
      toast({
        title: 'Cannot Process Payment',
        description: 'Only approved invoices can be processed for payment.',
        variant: 'destructive',
      });
      return;
    }
    
    updateInvoiceStatus(invoice, 'Paid');
  };

  const columns: EnhancedColumn[] = [
    { key: 'invoiceNumber', header: 'Invoice #', sortable: true, searchable: true },
    { key: 'vendor', header: 'Vendor', searchable: true },
    { key: 'description', header: 'Description', searchable: true },
    { 
      key: 'amount', 
      header: 'Amount',
      sortable: true,
      render: (value: number, row: Invoice) => `${row.currency} ${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Paid', value: 'Paid' },
        { label: 'Overdue', value: 'Overdue' },
        { label: 'Disputed', value: 'Disputed' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'dueDate', header: 'Due Date', sortable: true },
    { key: 'purchaseOrder', header: 'PO Number', searchable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: Invoice) => {
        setViewingInvoice(row);
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: Invoice) => {
        setEditingInvoice(row);
        form.reset({
          invoiceNumber: row.invoiceNumber,
          vendor: row.vendor,
          amount: row.amount,
          currency: row.currency,
          dueDate: row.dueDate,
          invoiceDate: row.invoiceDate,
          purchaseOrder: row.purchaseOrder,
          description: row.description,
        });
        setIsCreateDialogOpen(true);
      },
      variant: 'ghost',
      condition: (row: Invoice) => row.status !== 'Paid'
    },
    {
      label: 'Process Payment',
      icon: <CreditCard className="h-4 w-4" />,
      onClick: (row: Invoice) => {
        processPayment(row);
      },
      variant: 'ghost',
      condition: (row: Invoice) => row.status === 'Approved'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: Invoice) => {
        deleteInvoice(row);
      },
      variant: 'ghost',
      condition: (row: Invoice) => row.status !== 'Paid'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/finance')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Accounts Payable"
          description="Manage vendor invoices, payment processing, and payables records"
          voiceIntroduction="Welcome to Accounts Payable for comprehensive invoice and payment management."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Accounts Payable Management"
        examples={[
          "Processing vendor invoices with three-way matching against purchase orders and goods receipts",
          "Managing payment schedules and cash flow optimization with early payment discounts",
          "Handling invoice disputes and vendor inquiries with automated workflow routing"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{invoices.length}</div>
            <div className="text-sm text-muted-foreground">Total Invoices</div>
            <div className="text-sm text-blue-600">This month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {invoices.filter(inv => inv.status === 'Pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Approval</div>
            <div className="text-sm text-orange-600">Needs review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Outstanding Amount</div>
            <div className="text-sm text-red-600">To be paid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {invoices.filter(inv => inv.status === 'Overdue').length}
            </div>
            <div className="text-sm text-muted-foreground">Overdue</div>
            <div className="text-sm text-red-600">Immediate attention</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Invoice Management
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingInvoice(null);
                      form.reset();
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(editingInvoice ? onEdit : onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="invoiceNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Invoice Number</FormLabel>
                              <FormControl>
                                <Input placeholder="INV-2025-001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="vendor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vendor</FormLabel>
                              <FormControl>
                                <Input placeholder="Vendor name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="0.00" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                  <SelectItem value="JPY">JPY</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="invoiceDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Invoice Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="purchaseOrder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Purchase Order</FormLabel>
                              <FormControl>
                                <Input placeholder="PO-2025-001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="Invoice description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingInvoice ? 'Update' : 'Create'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={invoices}
                actions={actions}
                searchPlaceholder="Search invoices..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.filter(inv => ['Approved', 'Overdue'].includes(inv.status)).map((invoice) => (
                  <div key={invoice.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{invoice.invoiceNumber}</h4>
                        <p className="text-sm text-muted-foreground">{invoice.vendor}</p>
                        <p className="text-sm">Amount: ${invoice.amount.toLocaleString()} | Due: {invoice.dueDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => updateInvoiceStatus(invoice, 'Approved')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Payment
                        </Button>
                        <Button size="sm" onClick={() => processPayment(invoice)}>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aging Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const today = new Date();
                    const agingData = {
                      current: 0,
                      days31to60: 0,
                      days61to90: 0,
                      over90: 0
                    };

                    invoices.forEach(invoice => {
                      if (invoice.status === 'Paid') return; // Skip paid invoices
                      
                      const dueDate = new Date(invoice.dueDate);
                      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                      
                      if (daysOverdue <= 0) {
                        agingData.current += invoice.amount;
                      } else if (daysOverdue <= 30) {
                        agingData.current += invoice.amount;
                      } else if (daysOverdue <= 60) {
                        agingData.days31to60 += invoice.amount;
                      } else if (daysOverdue <= 90) {
                        agingData.days61to90 += invoice.amount;
                      } else {
                        agingData.over90 += invoice.amount;
                      }
                    });

                    return (
                      <>
                        <div className="flex justify-between">
                          <span>Current (0-30 days)</span>
                          <span className="font-medium">${agingData.current.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>31-60 days</span>
                          <span className="font-medium">${agingData.days31to60.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>61-90 days</span>
                          <span className="font-medium">${agingData.days61to90.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Over 90 days</span>
                          <span className="font-medium text-red-600">${agingData.over90.toLocaleString()}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Pending', 'Approved', 'Paid', 'Overdue'].map((status) => {
                    const count = invoices.filter(inv => inv.status === status).length;
                    const amount = invoices
                      .filter(inv => inv.status === status)
                      .reduce((sum, inv) => sum + inv.amount, 0);
                    return (
                      <div key={status} className="flex justify-between">
                        <span>{status}</span>
                        <span className="font-medium">
                          {count} invoices (${amount.toLocaleString()})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* View Invoice Dialog */}
      <Dialog open={!!viewingInvoice} onOpenChange={() => setViewingInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details - {viewingInvoice?.invoiceNumber}</DialogTitle>
          </DialogHeader>
          {viewingInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Invoice Number</Label>
                  <p className="text-lg font-semibold">{viewingInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={getStatusColor(viewingInvoice.status)}>
                    {viewingInvoice.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Vendor</Label>
                  <p className="text-lg">{viewingInvoice.vendor}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Purchase Order</Label>
                  <p className="text-lg">{viewingInvoice.purchaseOrder}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Invoice Date</Label>
                  <p className="text-lg">{new Date(viewingInvoice.invoiceDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Due Date</Label>
                  <p className="text-lg">{new Date(viewingInvoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <p className="text-lg">{viewingInvoice.description}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-500">Amount</Label>
                  <p className="text-2xl font-bold text-blue-600">
                    {viewingInvoice.currency} {viewingInvoice.amount.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Created: {new Date().toLocaleDateString()}
                </div>
                <div className="space-x-2">
                  {viewingInvoice.status !== 'Paid' && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setViewingInvoice(null);
                        setEditingInvoice(viewingInvoice);
                        form.reset({
                          invoiceNumber: viewingInvoice.invoiceNumber,
                          vendor: viewingInvoice.vendor,
                          amount: viewingInvoice.amount,
                          currency: viewingInvoice.currency,
                          dueDate: viewingInvoice.dueDate,
                          invoiceDate: viewingInvoice.invoiceDate,
                          purchaseOrder: viewingInvoice.purchaseOrder,
                          description: viewingInvoice.description,
                        });
                        setIsCreateDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  {viewingInvoice.status === 'Approved' && (
                    <Button 
                      onClick={() => {
                        processPayment(viewingInvoice);
                        setViewingInvoice(null);
                      }}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Process Payment
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setViewingInvoice(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountsPayable;
