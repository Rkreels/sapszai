
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
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
  RefreshCw
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

const Treasury: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('overview');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [cashPositions, setCashPositions] = useState<CashPosition[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

    setBankAccounts(sampleBankAccounts);
    setCashPositions(sampleCashPositions);
    setInvestments(sampleInvestments);
    setIsLoading(false);
  };

  const refreshData = () => {
    loadData();
    toast({
      title: 'Data Refreshed',
      description: 'Treasury data has been updated successfully.',
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
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
