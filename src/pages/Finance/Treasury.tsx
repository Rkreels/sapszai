
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
  Building2, 
  CreditCard,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  ArrowRight,
  Calendar,
  FileText
} from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  accountType: 'Checking' | 'Savings' | 'Credit Line' | 'Investment';
  currency: string;
  balance: number;
  status: 'Active' | 'Inactive' | 'Frozen';
  lastUpdated: string;
}

interface CashPosition {
  id: string;
  date: string;
  totalCash: number;
  inflows: number;
  outflows: number;
  netPosition: number;
  currency: string;
}

interface Investment {
  id: string;
  instrumentType: string;
  description: string;
  principalAmount: number;
  currentValue: number;
  maturityDate: string;
  interestRate: number;
  status: 'Active' | 'Matured' | 'Redeemed';
}

interface InternalTransfer {
  id: string;
  transferId: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  transferDate: string;
  status: 'Pending' | 'Completed' | 'Failed';
  description: string;
  reference: string;
}

interface TransferForm {
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  transferDate: string;
  description: string;
}

const Treasury: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('overview');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [cashPositions, setCashPositions] = useState<CashPosition[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transfers, setTransfers] = useState<InternalTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const { toast } = useToast();

  const transferForm = useForm<TransferForm>({
    defaultValues: {
      fromAccount: '',
      toAccount: '',
      amount: 0,
      currency: 'USD',
      transferDate: new Date().toISOString().split('T')[0],
      description: ''
    }
  });

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Treasury Management. Manage cash positions, bank accounts, investments, and liquidity optimization with real-time treasury operations.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    
    // Simulate API calls with sample data
    const sampleBankAccounts: BankAccount[] = [
      {
        id: 'ba-001',
        accountNumber: '****1234',
        bankName: 'JPMorgan Chase',
        accountType: 'Checking',
        currency: 'USD',
        balance: 2450000,
        status: 'Active',
        lastUpdated: '2025-01-28T10:30:00Z'
      },
      {
        id: 'ba-002',
        accountNumber: '****5678',
        bankName: 'Bank of America',
        accountType: 'Savings',
        currency: 'USD',
        balance: 1200000,
        status: 'Active',
        lastUpdated: '2025-01-28T09:15:00Z'
      }
    ];

    const sampleCashPositions: CashPosition[] = [
      {
        id: 'cp-001',
        date: '2025-01-28',
        totalCash: 3650000,
        inflows: 850000,
        outflows: 620000,
        netPosition: 230000,
        currency: 'USD'
      },
      {
        id: 'cp-002',
        date: '2025-01-27',
        totalCash: 3420000,
        inflows: 750000,
        outflows: 680000,
        netPosition: 70000,
        currency: 'USD'
      }
    ];

    const sampleInvestments: Investment[] = [
      {
        id: 'inv-001',
        instrumentType: 'Certificate of Deposit',
        description: '6-Month CD - 4.5% APY',
        principalAmount: 500000,
        currentValue: 511250,
        maturityDate: '2025-07-28',
        interestRate: 4.5,
        status: 'Active'
      },
      {
        id: 'inv-002',
        instrumentType: 'Money Market Fund',
        description: 'High-Yield Money Market',
        principalAmount: 750000,
        currentValue: 762500,
        maturityDate: '2025-12-31',
        interestRate: 3.8,
        status: 'Active'
      }
    ];

    const sampleTransfers: InternalTransfer[] = [
      {
        id: 'tr-001',
        transferId: 'TRF-2025-001',
        fromAccount: 'ba-001',
        toAccount: 'ba-002',
        amount: 100000,
        currency: 'USD',
        transferDate: '2025-01-28',
        status: 'Completed',
        description: 'Monthly cash allocation',
        reference: 'REF-001'
      },
      {
        id: 'tr-002',
        transferId: 'TRF-2025-002',
        fromAccount: 'ba-002',
        toAccount: 'ba-001',
        amount: 50000,
        currency: 'USD',
        transferDate: '2025-01-29',
        status: 'Pending',
        description: 'Operating expense funding',
        reference: 'REF-002'
      }
    ];

    setBankAccounts(sampleBankAccounts);
    setCashPositions(sampleCashPositions);
    setInvestments(sampleInvestments);
    setTransfers(sampleTransfers);
    setIsLoading(false);
  };

  const refreshData = () => {
    loadData();
    toast({
      title: 'Data Refreshed',
      description: 'Treasury data has been updated successfully.',
    });
  };

  const handleCreateTransfer = (data: TransferForm) => {
    if (data.fromAccount === data.toAccount) {
      toast({
        title: 'Invalid Transfer',
        description: 'Source and destination accounts cannot be the same.',
        variant: 'destructive'
      });
      return;
    }

    const fromAccount = bankAccounts.find(acc => acc.id === data.fromAccount);
    if (!fromAccount || fromAccount.balance < data.amount) {
      toast({
        title: 'Insufficient Funds',
        description: 'Source account does not have sufficient balance for this transfer.',
        variant: 'destructive'
      });
      return;
    }

    const newTransfer: InternalTransfer = {
      id: `tr-${String(transfers.length + 1).padStart(3, '0')}`,
      transferId: `TRF-${new Date().getFullYear()}-${String(transfers.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'Pending',
      reference: `REF-${String(transfers.length + 1).padStart(3, '0')}`
    };

    setTransfers([...transfers, newTransfer]);
    setIsTransferDialogOpen(false);
    transferForm.reset();
    toast({
      title: 'Transfer Created',
      description: 'Internal transfer has been created and is pending processing.',
    });
  };

  const bankAccountColumns: EnhancedColumn[] = [
    { key: 'accountNumber', header: 'Account', searchable: true },
    { key: 'bankName', header: 'Bank', searchable: true },
    { key: 'accountType', header: 'Type', filterable: true, filterOptions: [
      { label: 'Checking', value: 'Checking' },
      { label: 'Savings', value: 'Savings' },
      { label: 'Credit Line', value: 'Credit Line' },
      { label: 'Investment', value: 'Investment' }
    ]},
    { 
      key: 'balance', 
      header: 'Balance',
      sortable: true,
      render: (value: number, row: BankAccount) => `${row.currency} ${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={
          value === 'Active' ? 'bg-green-100 text-green-800' :
          value === 'Inactive' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }>
          {value}
        </Badge>
      )
    }
  ];

  const bankAccountActions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: BankAccount) => {
        toast({
          title: 'View Account',
          description: `Opening details for ${row.accountNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Reconcile',
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: (row: BankAccount) => {
        toast({
          title: 'Bank Reconciliation',
          description: `Starting reconciliation for ${row.accountNumber}`,
        });
      },
      variant: 'ghost'
    }
  ];

  const investmentColumns: EnhancedColumn[] = [
    { key: 'instrumentType', header: 'Type', searchable: true },
    { key: 'description', header: 'Description', searchable: true },
    { 
      key: 'principalAmount', 
      header: 'Principal',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'currentValue', 
      header: 'Current Value',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'interestRate', 
      header: 'Rate',
      render: (value: number) => `${value}%`
    },
    { key: 'maturityDate', header: 'Maturity', sortable: true },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={
          value === 'Active' ? 'bg-green-100 text-green-800' :
          value === 'Matured' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }>
          {value}
        </Badge>
      )
    }
  ];

  const totalCash = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const todayCashPosition = cashPositions[0] || { netPosition: 0, inflows: 0, outflows: 0 };

  const transferColumns: EnhancedColumn[] = [
    { key: 'transferId', header: 'Transfer ID', searchable: true },
    { 
      key: 'fromAccount', 
      header: 'From Account',
      render: (value: string) => {
        const account = bankAccounts.find(acc => acc.id === value);
        return account ? `${account.bankName} (${account.accountType})` : value;
      }
    },
    { 
      key: 'toAccount', 
      header: 'To Account',
      render: (value: string) => {
        const account = bankAccounts.find(acc => acc.id === value);
        return account ? `${account.bankName} (${account.accountType})` : value;
      }
    },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value: number, row: InternalTransfer) => `${row.currency} ${value.toLocaleString()}`
    },
    { key: 'transferDate', header: 'Date', sortable: true },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={
          value === 'Completed' ? 'bg-green-100 text-green-800' :
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }>
          {value}
        </Badge>
      )
    },
    { key: 'description', header: 'Description', searchable: true }
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
          title="Treasury Management"
          description="Manage cash positions, bank accounts, and investments for optimal liquidity"
          voiceIntroduction="Welcome to comprehensive Treasury Management with real-time cash positioning and investment tracking."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Treasury Operations"
        examples={[
          "Managing bank master data with automated bank statement imports and electronic reconciliation processes",
          "Optimizing cash positioning with real-time liquidity monitoring and automated investment sweeps",
          "Processing treasury transactions including foreign exchange hedging and investment portfolio management"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">${totalCash.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Cash</div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">${totalInvestments.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Investments</div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">${todayCashPosition.netPosition.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Net Position</div>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{bankAccounts.length}</div>
                <div className="text-sm text-muted-foreground">Bank Accounts</div>
              </div>
              <CreditCard className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transfers">Internal Transfers</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="forecasting">Cash Forecasting</TabsTrigger>
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
                    <span>Today's Inflows</span>
                    <span className="font-medium text-green-600">${todayCashPosition.inflows.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's Outflows</span>
                    <span className="font-medium text-red-600">${todayCashPosition.outflows.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Net Position</span>
                    <span className={`font-semibold ${todayCashPosition.netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${todayCashPosition.netPosition.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments.slice(0, 3).map((investment) => (
                    <div key={investment.id} className="flex justify-between">
                      <div>
                        <div className="font-medium">{investment.instrumentType}</div>
                        <div className="text-sm text-muted-foreground">{investment.interestRate}% APY</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${investment.currentValue.toLocaleString()}</div>
                        <div className="text-sm text-green-600">
                          +${(investment.currentValue - investment.principalAmount).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Bank Account Management
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={refreshData} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button onClick={() => toast({ title: 'Add Account', description: 'Opening bank account setup form' })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={bankAccountColumns}
                data={bankAccounts}
                actions={bankAccountActions}
                searchPlaceholder="Search bank accounts..."
                exportable={true}
                refreshable={true}
                onRefresh={refreshData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Internal Transfer Management
                <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Transfer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Internal Transfer</DialogTitle>
                    </DialogHeader>
                    <Form {...transferForm}>
                      <form onSubmit={transferForm.handleSubmit(handleCreateTransfer)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={transferForm.control}
                            name="fromAccount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>From Account</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select source account" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {bankAccounts.map(account => (
                                      <SelectItem key={account.id} value={account.id}>
                                        {account.bankName} - {account.accountType} ({account.currency} {account.balance.toLocaleString()})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={transferForm.control}
                            name="toAccount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>To Account</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select destination account" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {bankAccounts.map(account => (
                                      <SelectItem key={account.id} value={account.id}>
                                        {account.bankName} - {account.accountType} ({account.currency} {account.balance.toLocaleString()})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={transferForm.control}
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
                            control={transferForm.control}
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
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={transferForm.control}
                          name="transferDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transfer Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={transferForm.control}
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
                          <Button type="button" variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Create Transfer</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={transferColumns}
                data={transfers}
                searchPlaceholder="Search transfers..."
                exportable={true}
                refreshable={true}
                onRefresh={refreshData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Investment Portfolio
                <Button onClick={() => toast({ title: 'New Investment', description: 'Opening investment entry form' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Investment
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={investmentColumns}
                data={investments}
                searchPlaceholder="Search investments..."
                exportable={true}
                refreshable={true}
                onRefresh={refreshData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Forecasting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="forecastPeriod">Forecast Period</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Generate Forecast</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-lg font-semibold">Next 7 Days</div>
                  <div className="text-2xl font-bold text-green-600">+$125,000</div>
                  <div className="text-sm text-muted-foreground">Projected net inflow</div>
                </Card>
                <Card className="p-4">
                  <div className="text-lg font-semibold">Next 30 Days</div>
                  <div className="text-2xl font-bold text-blue-600">+$480,000</div>
                  <div className="text-sm text-muted-foreground">Projected net inflow</div>
                </Card>
                <Card className="p-4">
                  <div className="text-lg font-semibold">Next 90 Days</div>
                  <div className="text-2xl font-bold text-purple-600">+$1,250,000</div>
                  <div className="text-sm text-muted-foreground">Projected net inflow</div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Treasury;
