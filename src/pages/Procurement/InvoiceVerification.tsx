
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, CheckCircle, XCircle, AlertTriangle, DollarSign, FileText } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';

interface Invoice {
  id: string;
  invoiceNumber: string;
  supplier: string;
  poNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
  status: 'Pending' | 'Matched' | 'Blocked' | 'Approved' | 'Paid' | 'Rejected';
  matchingStatus: 'Not Matched' | 'Partially Matched' | 'Fully Matched' | 'Variances Found';
  paymentTerms: string;
  processor: string;
  discrepancies: string[];
}

const InvoiceVerification: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Invoice Verification. Verify and process supplier invoices against purchase orders and goods receipts.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleInvoices: Invoice[] = [
      {
        id: 'inv-001',
        invoiceNumber: 'INV-2025-001',
        supplier: 'Dell Technologies',
        poNumber: 'PO-2025-123',
        invoiceDate: '2025-01-26',
        dueDate: '2025-02-25',
        totalAmount: 12500.00,
        currency: 'USD',
        status: 'Matched',
        matchingStatus: 'Fully Matched',
        paymentTerms: 'Net 30',
        processor: 'John Smith',
        discrepancies: []
      },
      {
        id: 'inv-002',
        invoiceNumber: 'INV-2025-002',
        supplier: 'Office Depot',
        poNumber: 'PO-2025-124',
        invoiceDate: '2025-01-25',
        dueDate: '2025-02-09',
        totalAmount: 1250.00,
        currency: 'USD',
        status: 'Blocked',
        matchingStatus: 'Variances Found',
        paymentTerms: 'Net 15',
        processor: 'Sarah Wilson',
        discrepancies: ['Quantity variance: Ordered 100, Invoiced 85', 'Price variance: PO $1.25, Invoice $1.47']
      }
    ];
    setInvoices(sampleInvoices);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Matched': 'bg-blue-100 text-blue-800',
      'Blocked': 'bg-red-100 text-red-800',
      'Approved': 'bg-green-100 text-green-800',
      'Paid': 'bg-gray-100 text-gray-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMatchingColor = (matching: string) => {
    const colors = {
      'Not Matched': 'bg-gray-100 text-gray-800',
      'Partially Matched': 'bg-yellow-100 text-yellow-800',
      'Fully Matched': 'bg-green-100 text-green-800',
      'Variances Found': 'bg-red-100 text-red-800'
    };
    return colors[matching as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'invoiceNumber', header: 'Invoice #', sortable: true, searchable: true },
    { key: 'supplier', header: 'Supplier', searchable: true },
    { key: 'poNumber', header: 'PO Number', searchable: true },
    { 
      key: 'totalAmount', 
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
        { label: 'Matched', value: 'Matched' },
        { label: 'Blocked', value: 'Blocked' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Paid', value: 'Paid' },
        { label: 'Rejected', value: 'Rejected' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'matchingStatus', 
      header: 'Matching',
      filterable: true,
      filterOptions: [
        { label: 'Not Matched', value: 'Not Matched' },
        { label: 'Partially Matched', value: 'Partially Matched' },
        { label: 'Fully Matched', value: 'Fully Matched' },
        { label: 'Variances Found', value: 'Variances Found' }
      ],
      render: (value: string) => (
        <Badge className={getMatchingColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'dueDate', header: 'Due Date', sortable: true },
    { key: 'processor', header: 'Processor', searchable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'Verify',
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (row: Invoice) => {
        toast({
          title: 'Verify Invoice',
          description: `Starting verification for ${row.invoiceNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Review Discrepancies',
      icon: <AlertTriangle className="h-4 w-4" />,
      onClick: (row: Invoice) => {
        toast({
          title: 'Review Discrepancies',
          description: `Reviewing discrepancies for ${row.invoiceNumber}`,
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
          onClick={() => navigate('/procurement')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Invoice Verification"
          description="Verify and process supplier invoices for payment"
          voiceIntroduction="Welcome to Invoice Verification for processing supplier invoices."
        />
      </div>

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
              {invoices.filter(i => i.status === 'Pending' || i.status === 'Blocked').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
            <div className="text-sm text-orange-600">Needs attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {invoices.filter(i => i.matchingStatus === 'Fully Matched').length}
            </div>
            <div className="text-sm text-muted-foreground">Fully Matched</div>
            <div className="text-sm text-green-600">Ready for payment</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${invoices.reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-sm text-purple-600">Awaiting payment</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="matching">Matching</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Invoice Verification Queue
                <Button onClick={() => toast({ title: 'Upload Invoice', description: 'Opening invoice upload form' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Invoice
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={invoices}
                actions={actions}
                searchPlaceholder="Search invoices, suppliers, or PO numbers..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Three-Way Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.filter(i => i.matchingStatus !== 'Fully Matched').map((invoice) => (
                  <div key={invoice.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          {invoice.invoiceNumber}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Supplier: {invoice.supplier} | PO: {invoice.poNumber}
                        </p>
                        <p className="text-sm">Amount: {invoice.currency} {invoice.totalAmount.toLocaleString()}</p>
                        <Badge className={getMatchingColor(invoice.matchingStatus)}>
                          {invoice.matchingStatus}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Match
                        </Button>
                        <Button size="sm" variant="outline">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                    {invoice.discrepancies.length > 0 && (
                      <div className="mt-3 p-2 bg-red-50 rounded">
                        <p className="text-sm font-medium text-red-800">Discrepancies:</p>
                        <ul className="text-sm text-red-700 mt-1">
                          {invoice.discrepancies.map((disc, index) => (
                            <li key={index}>• {disc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blocked Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.filter(i => i.status === 'Blocked').map((invoice) => (
                  <div key={invoice.id} className="p-4 border rounded-lg bg-red-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold flex items-center text-red-800">
                          <XCircle className="h-4 w-4 mr-2" />
                          {invoice.invoiceNumber} - BLOCKED
                        </h4>
                        <p className="text-sm text-red-700">
                          {invoice.supplier} | Due: {invoice.dueDate}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-red-800">Issues:</p>
                          <ul className="text-sm text-red-700">
                            {invoice.discrepancies.map((disc, index) => (
                              <li key={index}>• {disc}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Resolve
                        </Button>
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Pending', 'Matched', 'Blocked', 'Approved', 'Paid', 'Rejected'].map((status) => {
                    const count = invoices.filter(i => i.status === status).length;
                    const percentage = invoices.length > 0 ? Math.round((count / invoices.length) * 100) : 0;
                    return (
                      <div key={status} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{status}</span>
                          <span>{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <span>Straight-Through Processing</span>
                      <span className="font-bold text-green-600">65%</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <span>Average Processing Time</span>
                      <span className="font-bold">2.3 days</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <span>Exception Rate</span>
                      <span className="font-bold text-orange-600">15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceVerification;
