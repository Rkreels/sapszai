
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { 
  ArrowLeft, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  RefreshCw,
  Download
} from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

interface CashFlow {
  id: string;
  date: string;
  description: string;
  type: 'Inflow' | 'Outflow';
  amount: number;
  category: string;
  account: string;
  status: 'Planned' | 'Actual' | 'Forecasted';
}

interface BankPosition {
  id: string;
  bankName: string;
  accountType: string;
  currency: string;
  balance: number;
  availableBalance: number;
  pendingTransactions: number;
  lastUpdated: string;
}

interface PaymentTransaction {
  id: string;
  paymentId: string;
  vendor: string;
  amount: number;
  currency: string;
  paymentMethod: 'Wire Transfer' | 'ACH' | 'Check' | 'Credit Card';
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  scheduledDate: string;
  processedDate?: string;
}

interface CashFlowForm {
  date: string;
  description: string;
  type: 'Inflow' | 'Outflow';
  amount: number;
  category: string;
  account: string;
  status: 'Planned' | 'Actual' | 'Forecasted';
}

interface PaymentForm {
  vendor: string;
  amount: number;
  currency: string;
  paymentMethod: 'Wire Transfer' | 'ACH' | 'Check' | 'Credit Card';
  scheduledDate: string;
  description: string;
}

const CashManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('overview');
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [bankPositions, setBankPositions] = useState<BankPosition[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [isCashFlowDialogOpen, setIsCashFlowDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const { toast } = useToast();

  const cashFlowForm = useForm<CashFlowForm>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: '',
      type: 'Inflow',
      amount: 0,
      category: '',
      account: '',
      status: 'Planned'
    }
  });

  const paymentForm = useForm<PaymentForm>({
    defaultValues: {
      vendor: '',
      amount: 0,
      currency: 'USD',
      paymentMethod: 'Wire Transfer',
      scheduledDate: new Date().toISOString().split('T')[0],
      description: ''
    }
  });

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Cash Management. Monitor cash flow, manage bank accounts, and optimize liquidity for effective treasury operations.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadCashData();
  }, []);

  const loadCashData = () => {
    const sampleCashFlows: CashFlow[] = [
      {
        id: 'cf-001',
        date: '2025-01-28',
        description: 'Customer Payment - Invoice #12345',
        type: 'Inflow',
        amount: 125000,
        category: 'Sales Revenue',
        account: 'Operating Account',
        status: 'Actual'
      },
      {
        id: 'cf-002',
        date: '2025-01-28',
        description: 'Vendor Payment - Dell Technologies',
        type: 'Outflow',
        amount: 45000,
        category: 'Operating Expenses',
        account: 'Operating Account',
        status: 'Actual'
      },
      {
        id: 'cf-003',
        date: '2025-01-29',  
        description: 'Payroll Processing',
        type: 'Outflow',
        amount: 95000,
        category: 'Payroll',
        account: 'Operating Account',
        status: 'Planned'
      },
      {
        id: 'cf-004',
        date: '2025-01-30',
        description: 'Loan Interest Payment',
        type: 'Outflow',
        amount: 12500,
        category: 'Interest Expense',
        account: 'Operating Account',
        status: 'Planned'
      }
    ];

    const sampleBankPositions: BankPosition[] = [
      {
        id: 'bp-001',
        bankName: 'JPMorgan Chase',
        accountType: 'Operating Account',
        currency: 'USD',
        balance: 2450000,
        availableBalance: 2350000,
        pendingTransactions: 5,
        lastUpdated: '2025-01-28T14:30:00Z'
      },
      {
        id: 'bp-002',
        bankName: 'Bank of America',
        accountType: 'Savings Account',
        currency: 'USD',
        balance: 1200000,
        availableBalance: 1200000,
        pendingTransactions: 0,
        lastUpdated: '2025-01-28T14:30:00Z'
      },
      {
        id: 'bp-003',
        bankName: 'Wells Fargo',
        accountType: 'Credit Line',
        currency: 'USD',
        balance: -150000,
        availableBalance: 850000,
        pendingTransactions: 2,
        lastUpdated: '2025-01-28T14:30:00Z'
      }
    ];

    const samplePayments: PaymentTransaction[] = [
      {
        id: 'pt-001',
        paymentId: 'PAY-2025-001',
        vendor: 'Dell Technologies',
        amount: 45000,
        currency: 'USD',
        paymentMethod: 'Wire Transfer',
        status: 'Completed',
        scheduledDate: '2025-01-28',
        processedDate: '2025-01-28'
      },
      {
        id: 'pt-002',
        paymentId: 'PAY-2025-002',
        vendor: 'Microsoft Corporation',
        amount: 25000,
        currency: 'USD',
        paymentMethod: 'ACH',
        status: 'Processing',
        scheduledDate: '2025-01-29'
      },
      {
        id: 'pt-003',
        paymentId: 'PAY-2025-003',
        vendor: 'Office Supplies Inc',
        amount: 1500,
        currency: 'USD',
        paymentMethod: 'Credit Card',
        status: 'Pending',
        scheduledDate: '2025-01-30'
      }
    ];

    setCashFlows(sampleCashFlows);
    setBankPositions(sampleBankPositions);
    setPayments(samplePayments);
  };

  const handleAddCashFlow = (data: CashFlowForm) => {
    const newCashFlow: CashFlow = {
      id: `cf-${String(cashFlows.length + 1).padStart(3, '0')}`,
      ...data
    };
    setCashFlows([...cashFlows, newCashFlow]);
    setIsCashFlowDialogOpen(false);
    cashFlowForm.reset();
    toast({
      title: 'Cash Flow Added',
      description: 'New cash flow entry has been successfully added.'
    });
  };

  const handleProcessPayment = (data: PaymentForm) => {
    const newPayment: PaymentTransaction = {
      id: `pt-${String(payments.length + 1).padStart(3, '0')}`,
      paymentId: `PAY-${new Date().getFullYear()}-${String(payments.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'Pending'
    };
    setPayments([...payments, newPayment]);
    setIsPaymentDialogOpen(false);
    paymentForm.reset();
    toast({
      title: 'Payment Processed',
      description: 'Payment has been successfully processed and scheduled.'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Planned': 'bg-blue-100 text-blue-800',
      'Actual': 'bg-green-100 text-green-800',
      'Forecasted': 'bg-purple-100 text-purple-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Failed': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const cashFlowColumns: EnhancedColumn[] = [
    { key: 'date', header: 'Date', sortable: true },
    { key: 'description', header: 'Description', searchable: true },
    { 
      key: 'type', 
      header: 'Type',
      filterable: true,
      filterOptions: [
        { label: 'Inflow', value: 'Inflow' },
        { label: 'Outflow', value: 'Outflow' }
      ],
      render: (value: string) => (
        <div className={`flex items-center ${value === 'Inflow' ? 'text-green-600' : 'text-red-600'}`}>
          {value === 'Inflow' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
          {value}
        </div>
      )
    },
    { 
      key: 'amount', 
      header: 'Amount',
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'category', header: 'Category', searchable: true },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    }
  ];

  const bankPositionColumns: EnhancedColumn[] = [
    { key: 'bankName', header: 'Bank', searchable: true },
    { key: 'accountType', header: 'Account Type', searchable: true },
    { key: 'currency', header: 'Currency' },
    { 
      key: 'balance', 
      header: 'Balance',
      sortable: true,
      render: (value: number, row: BankPosition) => (
        <span className={value < 0 ? 'text-red-600' : 'text-green-600'}>
          {row.currency} {Math.abs(value).toLocaleString()}
        </span>
      )
    },
    { 
      key: 'availableBalance', 
      header: 'Available',
      render: (value: number, row: BankPosition) => `${row.currency} ${value.toLocaleString()}`
    },
    { key: 'pendingTransactions', header: 'Pending', sortable: true }
  ];

  const paymentColumns: EnhancedColumn[] = [
    { key: 'paymentId', header: 'Payment ID', searchable: true },
    { key: 'vendor', header: 'Vendor', searchable: true },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value: number, row: PaymentTransaction) => `${row.currency} ${value.toLocaleString()}`
    },
    { key: 'paymentMethod', header: 'Method', searchable: true },
    { key: 'scheduledDate', header: 'Scheduled', sortable: true },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    }
  ];

  const totalCash = bankPositions.reduce((sum, pos) => sum + Math.max(0, pos.balance), 0);
  const totalInflows = cashFlows.filter(cf => cf.type === 'Inflow').reduce((sum, cf) => sum + cf.amount, 0);
  const totalOutflows = cashFlows.filter(cf => cf.type === 'Outflow').reduce((sum, cf) => sum + cf.amount, 0);
  const netCashFlow = totalInflows - totalOutflows;

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
          title="Cash Management"
          description="Monitor cash flow, manage bank accounts, and optimize liquidity"
          voiceIntroduction="Welcome to comprehensive Cash Management for optimal treasury operations."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Cash and Liquidity Management"
        examples={[
          "Managing bank master data and electronic bank statements with automated reconciliation and real-time position monitoring",
          "Creating cash flow forecasts and liquidity planning with rolling forecasts and scenario analysis for optimal cash positioning",
          "Processing payments and collections with optimized payment methods and bank communication for efficient cash operations"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">${(totalCash / 1000000).toFixed(2)}M</div>
            <div className="text-sm text-muted-foreground">Available Cash</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">${(totalInflows / 1000).toFixed(0)}K</div>
            <div className="text-sm text-muted-foreground">Total Inflows</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CreditCard className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">${(totalOutflows / 1000).toFixed(0)}K</div>
            <div className="text-sm text-muted-foreground">Total Outflows</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Banknote className={`h-8 w-8 mx-auto mb-2 ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            <div className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${(Math.abs(netCashFlow) / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-muted-foreground">Net Cash Flow</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="positions">Bank Positions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="flex items-center text-green-600">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Total Inflows
                    </span>
                    <span className="font-medium text-green-600">${totalInflows.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center text-red-600">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      Total Outflows
                    </span>
                    <span className="font-medium text-red-600">${totalOutflows.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Net Cash Flow</span>
                    <span className={`font-semibold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(netCashFlow).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bank Account Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bankPositions.map((position) => (
                    <div key={position.id} className="flex justify-between">
                      <div>
                        <div className="font-medium">{position.bankName}</div>
                        <div className="text-sm text-muted-foreground">{position.accountType}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${position.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {position.currency} {Math.abs(position.balance).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Available: {position.currency} {position.availableBalance.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Cash Flow Management
                <Dialog open={isCashFlowDialogOpen} onOpenChange={setIsCashFlowDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Cash Flow Entry</DialogTitle>
                    </DialogHeader>
                    <Form {...cashFlowForm}>
                      <form onSubmit={cashFlowForm.handleSubmit(handleAddCashFlow)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={cashFlowForm.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={cashFlowForm.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Inflow">Inflow</SelectItem>
                                    <SelectItem value="Outflow">Outflow</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={cashFlowForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={cashFlowForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={cashFlowForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Sales Revenue">Sales Revenue</SelectItem>
                                    <SelectItem value="Operating Expenses">Operating Expenses</SelectItem>
                                    <SelectItem value="Payroll">Payroll</SelectItem>
                                    <SelectItem value="Interest Expense">Interest Expense</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={cashFlowForm.control}
                            name="account"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select account" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {bankPositions.map(pos => (
                                      <SelectItem key={pos.id} value={pos.accountType}>
                                        {pos.bankName} - {pos.accountType}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={cashFlowForm.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Planned">Planned</SelectItem>
                                    <SelectItem value="Actual">Actual</SelectItem>
                                    <SelectItem value="Forecasted">Forecasted</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsCashFlowDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Add Entry</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={cashFlowColumns}
                data={cashFlows}
                searchPlaceholder="Search cash flows..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Bank Position Management
                <Button onClick={() => toast({ title: 'Refresh Positions', description: 'Updating bank positions' })}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={bankPositionColumns}
                data={bankPositions}
                searchPlaceholder="Search bank positions..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Payment Processing
                <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Process Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Process Payment</DialogTitle>
                    </DialogHeader>
                    <Form {...paymentForm}>
                      <form onSubmit={paymentForm.handleSubmit(handleProcessPayment)} className="space-y-4">
                        <FormField
                          control={paymentForm.control}
                          name="vendor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vendor</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={paymentForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={paymentForm.control}
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
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={paymentForm.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Payment Method</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                                    <SelectItem value="ACH">ACH</SelectItem>
                                    <SelectItem value="Check">Check</SelectItem>
                                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={paymentForm.control}
                            name="scheduledDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Scheduled Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={paymentForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Process Payment</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={paymentColumns}
                data={payments}
                searchPlaceholder="Search payments..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CashManagement;
