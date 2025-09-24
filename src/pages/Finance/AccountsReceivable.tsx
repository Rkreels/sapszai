
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, Edit, Eye, Receipt, AlertCircle, DollarSign, Trash2 } from 'lucide-react';
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

interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  currency: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Disputed';
  dueDate: string;
  invoiceDate: string;
  salesOrder: string;
  description: string;
}

const customerInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  customer: z.string().min(1, 'Customer is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  salesOrder: z.string().min(1, 'Sales order is required'),
  description: z.string().min(1, 'Description is required'),
});

const STORAGE_KEY = 'accounts_receivable_invoices';

const AccountsReceivable: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('invoices');
  const [customerInvoices, setCustomerInvoices] = useState<CustomerInvoice[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<CustomerInvoice | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof customerInvoiceSchema>>({
    resolver: zodResolver(customerInvoiceSchema),
    defaultValues: {
      currency: 'USD',
      invoiceDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Accounts Receivable. Manage customer invoices, payment collection, and maintain receivables records for optimal cash flow.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedInvoices = listEntities<CustomerInvoice>(STORAGE_KEY);
    
    if (storedInvoices.length === 0) {
      // Seed with sample data
      const sampleInvoices: CustomerInvoice[] = [
        {
          id: generateId('cinv'),
          invoiceNumber: 'CINV-2025-001',
          customer: 'Acme Corporation',
          amount: 25000.00,
          currency: 'USD',
          status: 'Sent',
          dueDate: '2025-02-20',
          invoiceDate: '2025-01-21',
          salesOrder: 'SO-2025-001',
          description: 'Professional Services - Q1 2025'
        },
        {
          id: generateId('cinv'),
          invoiceNumber: 'CINV-2025-002',
          customer: 'Global Manufacturing',
          amount: 18500.00,
          currency: 'USD',
          status: 'Paid',
          dueDate: '2025-02-15',
          invoiceDate: '2025-01-18',
          salesOrder: 'SO-2025-002',
          description: 'Software License and Support'
        }
      ];
      
      sampleInvoices.forEach(invoice => upsertEntity<CustomerInvoice>(STORAGE_KEY, invoice));
      setCustomerInvoices(sampleInvoices);
    } else {
      setCustomerInvoices(storedInvoices);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Sent': 'bg-blue-100 text-blue-800',
      'Paid': 'bg-green-100 text-green-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Disputed': 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const onSubmit = (data: z.infer<typeof customerInvoiceSchema>) => {
    try {
      const newInvoice: CustomerInvoice = {
        id: generateId('cinv'),
        ...data,
        status: 'Draft',
      };

      upsertEntity<CustomerInvoice>(STORAGE_KEY, newInvoice);
      setCustomerInvoices(prev => [...prev, newInvoice]);
      
      toast({
        title: 'Customer Invoice Created',
        description: `Invoice ${data.invoiceNumber} has been created successfully.`,
      });
      
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create customer invoice.',
        variant: 'destructive',
      });
    }
  };

  const onEdit = (data: z.infer<typeof customerInvoiceSchema>) => {
    if (!editingInvoice) return;
    
    try {
      const updatedInvoice = { ...editingInvoice, ...data };
      upsertEntity<CustomerInvoice>(STORAGE_KEY, updatedInvoice);
      setCustomerInvoices(prev => prev.map(invoice => 
        invoice.id === editingInvoice.id ? updatedInvoice : invoice
      ));
      
      toast({
        title: 'Customer Invoice Updated',
        description: `Invoice ${data.invoiceNumber} has been updated.`,
      });
      
      setEditingInvoice(null);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update customer invoice.',
        variant: 'destructive',
      });
    }
  };

  const deleteInvoice = (invoice: CustomerInvoice) => {
    if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      try {
        removeEntity(STORAGE_KEY, invoice.id);
        setCustomerInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
        
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

  const updateInvoiceStatus = (invoice: CustomerInvoice, newStatus: CustomerInvoice['status']) => {
    try {
      const updatedInvoice = { ...invoice, status: newStatus };
      upsertEntity<CustomerInvoice>(STORAGE_KEY, updatedInvoice);
      setCustomerInvoices(prev => prev.map(inv => inv.id === invoice.id ? updatedInvoice : inv));
      
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

  const sendReminder = (invoice: CustomerInvoice) => {
    if (invoice.status === 'Paid') {
      toast({
        title: 'Cannot Send Reminder',
        description: 'Reminders cannot be sent for paid invoices.',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Reminder Sent',
      description: `Payment reminder sent for invoice ${invoice.invoiceNumber}.`,
    });
  };

  const recordPayment = (invoice: CustomerInvoice) => {
    if (invoice.status === 'Paid') {
      toast({
        title: 'Already Paid',
        description: 'This invoice has already been paid.',
        variant: 'destructive',
      });
      return;
    }
    
    updateInvoiceStatus(invoice, 'Paid');
  };

  const columns: EnhancedColumn[] = [
    { key: 'invoiceNumber', header: 'Invoice #', sortable: true, searchable: true },
    { key: 'customer', header: 'Customer', searchable: true },
    { key: 'description', header: 'Description', searchable: true },
    { 
      key: 'amount', 
      header: 'Amount',
      sortable: true,
      render: (value: number, row: CustomerInvoice) => `${row.currency} ${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Draft', value: 'Draft' },
        { label: 'Sent', value: 'Sent' },
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
    { key: 'salesOrder', header: 'Sales Order', searchable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: CustomerInvoice) => {
        toast({
          title: 'View Invoice',
          description: `Opening invoice ${row.invoiceNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: CustomerInvoice) => {
        setEditingInvoice(row);
        form.reset({
          invoiceNumber: row.invoiceNumber,
          customer: row.customer,
          amount: row.amount,
          currency: row.currency,
          dueDate: row.dueDate,
          invoiceDate: row.invoiceDate,
          salesOrder: row.salesOrder,
          description: row.description,
        });
        setIsCreateDialogOpen(true);
      },
      variant: 'ghost',
      condition: (row: CustomerInvoice) => row.status !== 'Paid'
    },
    {
      label: 'Send Reminder',
      icon: <Receipt className="h-4 w-4" />,
      onClick: (row: CustomerInvoice) => {
        sendReminder(row);
      },
      variant: 'ghost',
      condition: (row: CustomerInvoice) => row.status !== 'Paid'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: CustomerInvoice) => {
        deleteInvoice(row);
      },
      variant: 'ghost',
      condition: (row: CustomerInvoice) => row.status !== 'Paid'
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
          title="Accounts Receivable"
          description="Manage customer invoices, payment collection, and receivables records"
          voiceIntroduction="Welcome to Accounts Receivable for comprehensive customer billing management."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Accounts Receivable Management"
        examples={[
          "Creating customer invoices from sales orders with automated billing schedules and payment terms",
          "Managing collections process with automated reminders and dunning procedures for overdue accounts",
          "Processing customer payments and managing cash application with dispute resolution workflows"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{customerInvoices.length}</div>
            <div className="text-sm text-muted-foreground">Total Invoices</div>
            <div className="text-sm text-blue-600">This month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${customerInvoices
                .filter(inv => inv.status !== 'Paid')
                .reduce((sum, inv) => sum + inv.amount, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Outstanding</div>
            <div className="text-sm text-orange-600">To be collected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${customerInvoices
                .filter(inv => inv.status === 'Paid')
                .reduce((sum, inv) => sum + inv.amount, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Collected</div>
            <div className="text-sm text-green-600">This month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {customerInvoices.filter(inv => inv.status === 'Overdue').length}
            </div>
            <div className="text-sm text-muted-foreground">Overdue</div>
            <div className="text-sm text-red-600">Collection needed</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Customer Invoices</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Customer Invoice Management
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingInvoice(null);
                      form.reset();
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingInvoice ? 'Edit Customer Invoice' : 'Create New Customer Invoice'}
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
                                <Input placeholder="CINV-2025-001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="customer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer</FormLabel>
                              <FormControl>
                                <Input placeholder="Customer name" {...field} />
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
                          name="salesOrder"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sales Order</FormLabel>
                              <FormControl>
                                <Input placeholder="SO-2025-001" {...field} />
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
                data={customerInvoices}
                actions={actions}
                searchPlaceholder="Search customer invoices..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Collections Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerInvoices.filter(inv => ['Sent', 'Overdue'].includes(inv.status)).map((invoice) => (
                  <div key={invoice.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{invoice.invoiceNumber}</h4>
                        <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                        <p className="text-sm">Amount: ${invoice.amount.toLocaleString()} | Due: {invoice.dueDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => sendReminder(invoice)}>
                          <Receipt className="h-4 w-4 mr-2" />
                          Send Reminder
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => recordPayment(invoice)}>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Record Payment
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
                  <div className="flex justify-between">
                    <span>Current (0-30 days)</span>
                    <span className="font-medium">$25,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>31-60 days</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>61-90 days</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Over 90 days</span>
                    <span className="font-medium text-red-600">$0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collection Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Draft', 'Sent', 'Paid', 'Overdue'].map((status) => {
                    const count = customerInvoices.filter(inv => inv.status === status).length;
                    const amount = customerInvoices
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
    </div>
  );
};

export default AccountsReceivable;
