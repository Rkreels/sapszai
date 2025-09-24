
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, Edit, Eye, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

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

const AccountsPayable: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Accounts Payable. Manage vendor invoices, payment processing, and maintain accurate payables records for optimal cash flow management.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleInvoices: Invoice[] = [
      {
        id: 'inv-001',
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
        id: 'inv-002',
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
    setInvoices(sampleInvoices);
  }, []);

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
        toast({
          title: 'View Invoice',
          description: `Opening invoice ${row.invoiceNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Process Payment',
      icon: <CreditCard className="h-4 w-4" />,
      onClick: (row: Invoice) => {
        toast({
          title: 'Process Payment',
          description: `Processing payment for ${row.invoiceNumber}`,
        });
      },
      variant: 'ghost'
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
                <Button onClick={() => toast({ title: 'Create Invoice', description: 'Opening invoice entry form' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Invoice
                </Button>
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
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Payment
                        </Button>
                        <Button size="sm">
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
                  <div className="flex justify-between">
                    <span>Current (0-30 days)</span>
                    <span className="font-medium">$12,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>31-60 days</span>
                    <span className="font-medium">$3,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>61-90 days</span>
                    <span className="font-medium">$150</span>
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
    </div>
  );
};

export default AccountsPayable;
