
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

  // Investment form state
  const [isInvestmentDialogOpen, setIsInvestmentDialogOpen] = useState(false);
  const [isEditInvestmentDialogOpen, setIsEditInvestmentDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

  interface InvestmentForm {
    instrumentType: string;
    description: string;
    principalAmount: number;
    interestRate: number;
    maturityDate: string;
    currency: string;
  }

  // Cash Flow Forecast interfaces
  interface CashFlowForecast {
    id: string;
    period: string;
    startDate: string;
    endDate: string;
    projectedInflows: number;
    projectedOutflows: number;
    netPosition: number;
    currency: string;
    confidence: number;
    status: 'Draft' | 'Active' | 'Archived';
    createdBy: string;
    createdAt: string;
  }

  interface CashFlowForecastForm {
    period: string;
    startDate: string;
    endDate: string;
    projectedInflows: number;
    projectedOutflows: number;
    currency: string;
    confidence: number;
  }

  const investmentForm = useForm<InvestmentForm>({
    defaultValues: {
      instrumentType: '',
      description: '',
      principalAmount: 0,
      interestRate: 0,
      maturityDate: '',
      currency: 'USD'
    }
  });

  // Cash Flow Forecast state
  const [isForecastDialogOpen, setIsForecastDialogOpen] = useState(false);
  const [isEditForecastDialogOpen, setIsEditForecastDialogOpen] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState<CashFlowForecast | null>(null);
  const [cashFlowForecasts, setCashFlowForecasts] = useState<CashFlowForecast[]>([
    {
      id: 'cff-001',
      period: 'Weekly',
      startDate: '2025-01-28',
      endDate: '2025-02-03',
      projectedInflows: 850000,
      projectedOutflows: 725000,
      netPosition: 125000,
      currency: 'USD',
      confidence: 85,
      status: 'Active',
      createdBy: 'System',
      createdAt: '2025-01-28T00:00:00Z'
    },
    {
      id: 'cff-002',
      period: 'Monthly',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      projectedInflows: 3200000,
      projectedOutflows: 2720000,
      netPosition: 480000,
      currency: 'USD',
      confidence: 75,
      status: 'Active',
      createdBy: 'System',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'cff-003',
      period: 'Quarterly',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      projectedInflows: 9800000,
      projectedOutflows: 8550000,
      netPosition: 1250000,
      currency: 'USD',
      confidence: 70,
      status: 'Draft',
      createdBy: 'System',
      createdAt: '2025-01-15T00:00:00Z'
    }
  ]);

  const forecastForm = useForm<CashFlowForecastForm>({
    defaultValues: {
      period: 'weekly',
      startDate: '',
      endDate: '',
      projectedInflows: 0,
      projectedOutflows: 0,
      currency: 'USD',
      confidence: 75
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

  // Investment CRUD operations
  const handleCreateInvestment = (data: InvestmentForm) => {
    const newInvestment: Investment = {
      id: `inv-${String(investments.length + 1).padStart(3, '0')}`,
      instrumentType: data.instrumentType,
      description: data.description,
      principalAmount: data.principalAmount,
      currentValue: data.principalAmount, // Initially same as principal
      maturityDate: data.maturityDate,
      interestRate: data.interestRate,
      status: 'Active'
    };
    setInvestments([...investments, newInvestment]);
    setIsInvestmentDialogOpen(false);
    investmentForm.reset();
    toast({
      title: 'Investment Created',
      description: `${data.instrumentType} has been added to the portfolio successfully.`,
    });
  };

  const handleEditInvestment = (investment: Investment) => {
    setSelectedInvestment(investment);
    investmentForm.reset({
      instrumentType: investment.instrumentType,
      description: investment.description,
      principalAmount: investment.principalAmount,
      interestRate: investment.interestRate,
      maturityDate: investment.maturityDate,
      currency: 'USD'
    });
    setIsEditInvestmentDialogOpen(true);
  };

  const handleUpdateInvestment = (data: InvestmentForm) => {
    setInvestments(investments.map(inv => 
      inv.id === selectedInvestment?.id 
        ? { 
            ...inv, 
            instrumentType: data.instrumentType,
            description: data.description,
            principalAmount: data.principalAmount,
            maturityDate: data.maturityDate,
            interestRate: data.interestRate
          } 
        : inv
    ));
    setIsEditInvestmentDialogOpen(false);
    setSelectedInvestment(null);
    toast({
      title: 'Investment Updated',
      description: `${data.instrumentType} has been updated successfully.`,
    });
  };

  const handleDeleteInvestment = (id: string) => {
    const investment = investments.find(inv => inv.id === id);
    setInvestments(investments.filter(inv => inv.id !== id));
    if (investment) {
      toast({
        title: 'Investment Deleted',
        description: `${investment.instrumentType} has been removed from the portfolio.`,
      });
    }
  };

  const handleMatureInvestment = (id: string) => {
    setInvestments(investments.map(inv => 
      inv.id === id 
        ? { ...inv, status: 'Matured' as const } 
        : inv
    ));
    const investment = investments.find(inv => inv.id === id);
    if (investment) {
      toast({
        title: 'Investment Matured',
        description: `${investment.instrumentType} has been marked as matured.`,
      });
    }
  };

  // Cash Flow Forecast CRUD operations
  const handleCreateForecast = (data: CashFlowForecastForm) => {
    const newForecast: CashFlowForecast = {
      id: `cff-${String(cashFlowForecasts.length + 1).padStart(3, '0')}`,
      period: data.period,
      startDate: data.startDate,
      endDate: data.endDate,
      projectedInflows: data.projectedInflows,
      projectedOutflows: data.projectedOutflows,
      netPosition: data.projectedInflows - data.projectedOutflows,
      currency: data.currency,
      confidence: data.confidence,
      status: 'Draft',
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    };
    setCashFlowForecasts([...cashFlowForecasts, newForecast]);
    setIsForecastDialogOpen(false);
    forecastForm.reset();
    toast({
      title: 'Forecast Created',
      description: `${data.period} cash flow forecast has been created successfully.`,
    });
  };

  const handleEditForecast = (forecast: CashFlowForecast) => {
    setSelectedForecast(forecast);
    forecastForm.reset({
      period: forecast.period,
      startDate: forecast.startDate,
      endDate: forecast.endDate,
      projectedInflows: forecast.projectedInflows,
      projectedOutflows: forecast.projectedOutflows,
      currency: forecast.currency,
      confidence: forecast.confidence
    });
    setIsEditForecastDialogOpen(true);
  };

  const handleUpdateForecast = (data: CashFlowForecastForm) => {
    setCashFlowForecasts(cashFlowForecasts.map(f => 
      f.id === selectedForecast?.id 
        ? { 
            ...f, 
            period: data.period,
            startDate: data.startDate,
            endDate: data.endDate,
            projectedInflows: data.projectedInflows,
            projectedOutflows: data.projectedOutflows,
            netPosition: data.projectedInflows - data.projectedOutflows,
            currency: data.currency,
            confidence: data.confidence
          } 
        : f
    ));
    setIsEditForecastDialogOpen(false);
    setSelectedForecast(null);
    toast({
      title: 'Forecast Updated',
      description: `${data.period} cash flow forecast has been updated successfully.`,
    });
  };

  const handleDeleteForecast = (id: string) => {
    const forecast = cashFlowForecasts.find(f => f.id === id);
    setCashFlowForecasts(cashFlowForecasts.filter(f => f.id !== id));
    if (forecast) {
      toast({
        title: 'Forecast Deleted',
        description: `${forecast.period} cash flow forecast has been deleted.`,
      });
    }
  };

  const handleActivateForecast = (id: string) => {
    setCashFlowForecasts(cashFlowForecasts.map(f => 
      f.id === id 
        ? { ...f, status: 'Active' as const } 
        : { ...f, status: f.status === 'Active' ? 'Draft' as const : f.status }
    ));
    const forecast = cashFlowForecasts.find(f => f.id === id);
    if (forecast) {
      toast({
        title: 'Forecast Activated',
        description: `${forecast.period} cash flow forecast has been activated.`,
      });
    }
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

  const investmentActions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: Investment) => {
        toast({
          title: 'View Investment',
          description: `Opening details for ${row.instrumentType}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: Investment) => handleEditInvestment(row),
      variant: 'ghost'
    },
    {
      label: 'Mature',
      icon: <Calendar className="h-4 w-4" />,
      onClick: (row: Investment) => {
        if (row.status === 'Active') {
          handleMatureInvestment(row.id);
        } else {
          toast({
            title: 'Already Matured',
            description: 'This investment is already matured.',
            variant: 'destructive'
          });
        }
      },
      variant: 'ghost',
      disabled: (row: Investment) => row.status !== 'Active'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: Investment) => {
        if (confirm(`Are you sure you want to delete ${row.instrumentType}?`)) {
          handleDeleteInvestment(row.id);
        }
      },
      variant: 'ghost'
    }
  ];

  // Cash Flow Forecast columns and actions
  const cashFlowForecastColumns: EnhancedColumn[] = [
    { key: 'period', header: 'Period', filterable: true, filterOptions: [
      { label: 'Weekly', value: 'Weekly' },
      { label: 'Monthly', value: 'Monthly' },
      { label: 'Quarterly', value: 'Quarterly' }
    ]},
    { key: 'startDate', header: 'Start Date', sortable: true },
    { key: 'endDate', header: 'End Date', sortable: true },
    { 
      key: 'projectedInflows', 
      header: 'Projected Inflows',
      render: (value: number, row: CashFlowForecast) => `${row.currency} ${value.toLocaleString()}`
    },
    { 
      key: 'projectedOutflows', 
      header: 'Projected Outflows',
      render: (value: number, row: CashFlowForecast) => `${row.currency} ${value.toLocaleString()}`
    },
    { 
      key: 'netPosition', 
      header: 'Net Position',
      render: (value: number, row: CashFlowForecast) => (
        <span className={`font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {row.currency} {value.toLocaleString()}
        </span>
      )
    },
    { 
      key: 'confidence', 
      header: 'Confidence',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={
          value === 'Active' ? 'bg-green-100 text-green-800' :
          value === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }>
          {value}
        </Badge>
      )
    }
  ];

  const cashFlowForecastActions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: CashFlowForecast) => {
        toast({
          title: 'View Forecast',
          description: `Opening details for ${row.period} forecast`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: CashFlowForecast) => handleEditForecast(row),
      variant: 'ghost'
    },
    {
      label: 'Activate',
      icon: <TrendingUp className="h-4 w-4" />,
      onClick: (row: CashFlowForecast) => {
        if (row.status !== 'Active') {
          handleActivateForecast(row.id);
        } else {
          toast({
            title: 'Already Active',
            description: 'This forecast is already active.',
            variant: 'destructive'
          });
        }
      },
      variant: 'ghost',
      disabled: (row: CashFlowForecast) => row.status === 'Active'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: CashFlowForecast) => {
        if (confirm(`Are you sure you want to delete ${row.period} forecast?`)) {
          handleDeleteForecast(row.id);
        }
      },
      variant: 'ghost'
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transfers">Internal Transfers</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="forecasting">Cash Forecasting</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity Analysis</TabsTrigger>
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
                  <Button onClick={() => toast({ title: 'Account Management', description: 'Bank account management features would be handled by Bank Accounts module' })}>
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
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-2xl lg:max-w-4xl">
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
                Investment Portfolio Management
                <div className="flex gap-2">
                  <Button variant="outline" onClick={refreshData} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Dialog open={isInvestmentDialogOpen} onOpenChange={setIsInvestmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Investment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-md lg:max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Add New Investment</DialogTitle>
                      </DialogHeader>
                      <Form {...investmentForm}>
                        <form onSubmit={investmentForm.handleSubmit(handleCreateInvestment)} className="space-y-4">
                          <FormField
                            control={investmentForm.control}
                            name="instrumentType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Instrument Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select instrument type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Certificate of Deposit">Certificate of Deposit</SelectItem>
                                    <SelectItem value="Money Market Fund">Money Market Fund</SelectItem>
                                    <SelectItem value="Treasury Bill">Treasury Bill</SelectItem>
                                    <SelectItem value="Corporate Bond">Corporate Bond</SelectItem>
                                    <SelectItem value="Government Bond">Government Bond</SelectItem>
                                    <SelectItem value="Commercial Paper">Commercial Paper</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={investmentForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 6-Month CD - 4.5% APY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={investmentForm.control}
                            name="principalAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Principal Amount ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={investmentForm.control}
                            name="interestRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Interest Rate (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={investmentForm.control}
                            name="maturityDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Maturity Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsInvestmentDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Add Investment</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={investmentColumns}
                data={investments}
                actions={investmentActions}
                searchPlaceholder="Search investments..."
                exportable={true}
                refreshable={true}
                onRefresh={refreshData}
              />
            </CardContent>
          </Card>
          
          {/* Edit Investment Dialog */}
          <Dialog open={isEditInvestmentDialogOpen} onOpenChange={setIsEditInvestmentDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-md lg:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Edit Investment</DialogTitle>
              </DialogHeader>
              <Form {...investmentForm}>
                <form onSubmit={investmentForm.handleSubmit(handleUpdateInvestment)} className="space-y-4">
                  <FormField
                    control={investmentForm.control}
                    name="instrumentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instrument Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select instrument type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Certificate of Deposit">Certificate of Deposit</SelectItem>
                            <SelectItem value="Money Market Fund">Money Market Fund</SelectItem>
                            <SelectItem value="Treasury Bill">Treasury Bill</SelectItem>
                            <SelectItem value="Corporate Bond">Corporate Bond</SelectItem>
                            <SelectItem value="Government Bond">Government Bond</SelectItem>
                            <SelectItem value="Commercial Paper">Commercial Paper</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={investmentForm.control}
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
                  <FormField
                    control={investmentForm.control}
                    name="principalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Principal Amount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={investmentForm.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={investmentForm.control}
                    name="maturityDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maturity Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditInvestmentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Investment</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Cash Flow Forecasting
                <div className="flex gap-2">
                  <Button variant="outline" onClick={refreshData} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Dialog open={isForecastDialogOpen} onOpenChange={setIsForecastDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Forecast
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-lg lg:max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Create Cash Flow Forecast</DialogTitle>
                      </DialogHeader>
                      <Form {...forecastForm}>
                        <form onSubmit={forecastForm.handleSubmit(handleCreateForecast)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={forecastForm.control}
                              name="period"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Forecast Period</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select period" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="weekly">Weekly</SelectItem>
                                      <SelectItem value="monthly">Monthly</SelectItem>
                                      <SelectItem value="quarterly">Quarterly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={forecastForm.control}
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
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={forecastForm.control}
                              name="startDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={forecastForm.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={forecastForm.control}
                              name="projectedInflows"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Projected Inflows ($)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={forecastForm.control}
                              name="projectedOutflows"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Projected Outflows ($)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={forecastForm.control}
                            name="confidence"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confidence Level (%)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select confidence" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="50">50% - Low Confidence</SelectItem>
                                    <SelectItem value="65">65% - Medium-Low Confidence</SelectItem>
                                    <SelectItem value="75">75% - Medium Confidence</SelectItem>
                                    <SelectItem value="85">85% - Medium-High Confidence</SelectItem>
                                    <SelectItem value="95">95% - High Confidence</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsForecastDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Create Forecast</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Cards */}
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

              {/* Forecasts Table */}
              <EnhancedDataTable 
                columns={cashFlowForecastColumns}
                data={cashFlowForecasts}
                actions={cashFlowForecastActions}
                searchPlaceholder="Search forecasts..."
                exportable={true}
                refreshable={true}
                onRefresh={refreshData}
              />
            </CardContent>
          </Card>
          
          {/* Edit Forecast Dialog */}
          <Dialog open={isEditForecastDialogOpen} onOpenChange={setIsEditForecastDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-lg lg:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Edit Cash Flow Forecast</DialogTitle>
              </DialogHeader>
              <Form {...forecastForm}>
                <form onSubmit={forecastForm.handleSubmit(handleUpdateForecast)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={forecastForm.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forecast Period</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={forecastForm.control}
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
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={forecastForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={forecastForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={forecastForm.control}
                      name="projectedInflows"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Projected Inflows ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={forecastForm.control}
                      name="projectedOutflows"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Projected Outflows ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={forecastForm.control}
                    name="confidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confidence Level (%)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select confidence" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="50">50% - Low Confidence</SelectItem>
                            <SelectItem value="65">65% - Medium-Low Confidence</SelectItem>
                            <SelectItem value="75">75% - Medium Confidence</SelectItem>
                            <SelectItem value="85">85% - Medium-High Confidence</SelectItem>
                            <SelectItem value="95">95% - High Confidence</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditForecastDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Forecast</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  FX Risk Exposure
                  <Button size="sm" onClick={() => toast({ title: 'FX Risk Analysis', description: 'Opening detailed FX risk analysis' })}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analyze
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">$2.4M</div>
                      <div className="text-sm text-muted-foreground">EUR Exposure</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">$1.8M</div>
                      <div className="text-sm text-muted-foreground">GBP Exposure</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Hedged Position</span>
                      <span className="font-semibold">65%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Unhedged Risk</span>
                      <span className="font-semibold text-red-600">$1.5M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>VaR (95%)</span>
                      <span className="font-semibold">$125,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Interest Rate Risk
                  <Button size="sm" onClick={() => toast({ title: 'Interest Rate Analysis', description: 'Opening interest rate sensitivity analysis' })}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analyze
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">+2.5%</div>
                      <div className="text-sm text-muted-foreground">Rate Sensitivity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">$450K</div>
                      <div className="text-sm text-muted-foreground">Impact +1%</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Duration Gap</span>
                      <span className="font-semibold">1.2 years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Repricing Gap</span>
                      <span className="font-semibold">$3.2M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>EVE Sensitivity</span>
                      <span className="font-semibold text-orange-600">-8.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Hedging Instruments
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => toast({ title: 'New Hedge', description: 'Opening hedge creation wizard' })}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Hedge
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                  <div>Instrument</div>
                  <div>Type</div>
                  <div>Notional</div>
                  <div>Status</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">FX Forward #001</div>
                    <div className="text-muted-foreground">EUR/USD</div>
                  </div>
                  <div>FX Forward</div>
                  <div className="font-semibold">€1,000,000</div>
                  <div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Interest Swap #002</div>
                    <div className="text-muted-foreground">Fixed vs Floating</div>
                  </div>
                  <div>IRS</div>
                  <div className="font-semibold">$5,000,000</div>
                  <div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">FX Option #003</div>
                    <div className="text-muted-foreground">GBP/USD Call</div>
                  </div>
                  <div>FX Option</div>
                  <div className="font-semibold">£500,000</div>
                  <div>
                    <Badge variant="secondary">Expired</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="liquidity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Liquidity Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">$8.4M</div>
                    <div className="text-sm text-muted-foreground">Current Position</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Inflows (Today)</span>
                      <span className="font-semibold text-green-600">+$1.2M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Outflows (Today)</span>
                      <span className="font-semibold text-red-600">-$850K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Net Position</span>
                      <span className="font-semibold text-green-600">+$350K</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liquidity Ratios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1.45</div>
                    <div className="text-sm text-muted-foreground">Current Ratio</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quick Ratio</span>
                      <span className="font-semibold">1.25</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cash Ratio</span>
                      <span className="font-semibold">0.85</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Operating Cash Flow</span>
                      <span className="font-semibold text-green-600">+$2.1M</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liquidity Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">45 days</div>
                    <div className="text-sm text-muted-foreground">Cash Runway</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>7-Day Forecast</span>
                      <span className="font-semibold text-green-600">+$2.8M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>30-Day Forecast</span>
                      <span className="font-semibold text-orange-600">-$1.2M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>90-Day Forecast</span>
                      <span className="font-semibold text-red-600">-$4.5M</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Liquidity Stress Testing
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => toast({ title: 'Run Stress Test', description: 'Running liquidity stress analysis' })}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Test
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold text-green-600">15 days</div>
                    <div className="text-sm text-muted-foreground">Base Case</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold text-orange-600">8 days</div>
                    <div className="text-sm text-muted-foreground">Moderate Stress</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold text-red-600">3 days</div>
                    <div className="text-sm text-muted-foreground">Severe Stress</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-lg font-bold text-purple-600">1 day</div>
                    <div className="text-sm text-muted-foreground">Extreme Stress</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Stress Test Scenarios</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="font-medium mb-2">Market Disruption</div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>• 50% increase in margin calls</div>
                        <div>• Credit line reductions</div>
                        <div>• Market access limited</div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-medium mb-2">Credit Crisis</div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>• Counterparty defaults</div>
                        <div>• Banking system stress</div>
                        <div>• Liquidity freeze</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Treasury;
