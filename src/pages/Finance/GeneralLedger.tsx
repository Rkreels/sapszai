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
import { ArrowLeft, Plus, BookOpen, Calculator, TrendingUp, Download, Eye, Edit, Trash2, FileText } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { listEntities, upsertEntity, removeEntity, generateId } from '../../lib/localCrud';

interface JournalEntry {
  id: string;
  documentNumber: string;
  postingDate: string;
  account: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
  reference: string;
  companyCode: string;
  costCenter?: string;
  profitCenter?: string;
  businessArea?: string;
  documentType: string;
  status: 'Draft' | 'Posted' | 'Reversed';
}

interface Account {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: 'Assets' | 'Liabilities' | 'Equity' | 'Revenue' | 'Expenses';
  balance: number;
  isActive: boolean;
  category: string;
}

const journalEntrySchema = z.object({
  postingDate: z.string().min(1, 'Posting date is required'),
  account: z.string().min(1, 'Account is required'),
  debit: z.number().min(0, 'Debit must be non-negative'),
  credit: z.number().min(0, 'Credit must be non-negative'),
  description: z.string().min(1, 'Description is required'),
  reference: z.string().optional(),
  companyCode: z.string().min(1, 'Company code is required'),
  costCenter: z.string().optional(),
  profitCenter: z.string().optional(),
  businessArea: z.string().optional(),
  documentType: z.string().min(1, 'Document type is required'),
}).refine(data => data.debit > 0 || data.credit > 0, {
  message: 'Either debit or credit must be greater than 0',
  path: ['debit'],
});

const accountSchema = z.object({
  accountNumber: z.string().min(1, 'Account number is required'),
  accountName: z.string().min(1, 'Account name is required'),
  accountType: z.enum(['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses']),
  category: z.string().min(1, 'Category is required'),
});

const ENTRIES_STORAGE_KEY = 'journal_entries';
const ACCOUNTS_STORAGE_KEY = 'chart_of_accounts';

const GeneralLedger: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('entries');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [selectedDocumentNumber, setSelectedDocumentNumber] = useState<string>('');
  const { toast } = useToast();

  const entryForm = useForm<z.infer<typeof journalEntrySchema>>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      debit: 0,
      credit: 0,
      companyCode: '1000',
      documentType: 'SA',
      postingDate: new Date().toISOString().split('T')[0],
    },
  });

  const accountForm = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
  });

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to General Ledger. The central repository for all financial transactions, providing real-time accounting with the Universal Journal.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const entries = listEntities<JournalEntry>(ENTRIES_STORAGE_KEY);
    const chartAccounts = listEntities<Account>(ACCOUNTS_STORAGE_KEY);
    
    if (entries.length === 0) {
      // Seed with sample data
      const sampleEntries: JournalEntry[] = [
        {
          id: generateId('je'),
          documentNumber: 'DOC-2025-001',
          postingDate: '2025-01-20',
          account: '100000',
          accountName: 'Cash and Cash Equivalents',
          debit: 15000.00,
          credit: 0,
          description: 'Customer payment received',
          reference: 'CINV-2025-001',
          companyCode: '1000',
          costCenter: 'CC-1000',
          documentType: 'DZ',
          status: 'Posted'
        },
        {
          id: generateId('je'),
          documentNumber: 'DOC-2025-001',
          postingDate: '2025-01-20',
          account: '130000',
          accountName: 'Accounts Receivable',
          debit: 0,
          credit: 15000.00,
          description: 'Customer payment received',
          reference: 'CINV-2025-001',
          companyCode: '1000',
          costCenter: 'CC-1000',
          documentType: 'DZ',
          status: 'Posted'
        },
        {
          id: generateId('je'),
          documentNumber: 'DOC-2025-002',
          postingDate: '2025-01-21',
          account: '500000',
          accountName: 'Cost of Goods Sold',
          debit: 8500.00,
          credit: 0,
          description: 'COGS for January sales',
          reference: 'INV-2025-123',
          companyCode: '1000',
          costCenter: 'CC-2000',
          documentType: 'SA',
          status: 'Posted'
        },
        {
          id: generateId('je'),
          documentNumber: 'DOC-2025-002',
          postingDate: '2025-01-21',
          account: '140000',
          accountName: 'Inventory',
          debit: 0,
          credit: 8500.00,
          description: 'COGS for January sales',
          reference: 'INV-2025-123',
          companyCode: '1000',
          costCenter: 'CC-2000',
          documentType: 'SA',
          status: 'Posted'
        }
      ];
      
      sampleEntries.forEach(entry => upsertEntity<JournalEntry>(ENTRIES_STORAGE_KEY, entry));
      setJournalEntries(sampleEntries);
    } else {
      setJournalEntries(entries);
    }

    if (chartAccounts.length === 0) {
      // Seed with sample accounts
      const sampleAccounts: Account[] = [
        {
          id: generateId('acc'),
          accountNumber: '100000',
          accountName: 'Cash and Cash Equivalents',
          accountType: 'Assets',
          balance: 125000,
          isActive: true,
          category: 'Current Assets'
        },
        {
          id: generateId('acc'),
          accountNumber: '130000',
          accountName: 'Accounts Receivable',
          accountType: 'Assets',
          balance: 85000,
          isActive: true,
          category: 'Current Assets'
        },
        {
          id: generateId('acc'),
          accountNumber: '140000',
          accountName: 'Inventory',
          accountType: 'Assets',
          balance: 65000,
          isActive: true,
          category: 'Current Assets'
        },
        {
          id: generateId('acc'),
          accountNumber: '200000',
          accountName: 'Accounts Payable',
          accountType: 'Liabilities',
          balance: 45000,
          isActive: true,
          category: 'Current Liabilities'
        },
        {
          id: generateId('acc'),
          accountNumber: '300000',
          accountName: 'Retained Earnings',
          accountType: 'Equity',
          balance: 150000,
          isActive: true,
          category: 'Equity'
        },
        {
          id: generateId('acc'),
          accountNumber: '400000',
          accountName: 'Sales Revenue',
          accountType: 'Revenue',
          balance: 165000,
          isActive: true,
          category: 'Operating Revenue'
        },
        {
          id: generateId('acc'),
          accountNumber: '500000',
          accountName: 'Cost of Goods Sold',
          accountType: 'Expenses',
          balance: 85000,
          isActive: true,
          category: 'Cost of Sales'
        },
        {
          id: generateId('acc'),
          accountNumber: '600000',
          accountName: 'Operating Expenses',
          accountType: 'Expenses',
          balance: 45000,
          isActive: true,
          category: 'Operating Expenses'
        }
      ];
      
      sampleAccounts.forEach(account => upsertEntity<Account>(ACCOUNTS_STORAGE_KEY, account));
      setAccounts(sampleAccounts);
    } else {
      setAccounts(chartAccounts);
    }
  };

  const onSubmitEntry = (data: z.infer<typeof journalEntrySchema>) => {
    try {
      const documentNumber = selectedDocumentNumber || `DOC-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      const account = accounts.find(acc => acc.accountNumber === data.account);
      
      const newEntry: JournalEntry = {
        id: generateId('je'),
        documentNumber,
        accountName: account?.accountName || 'Unknown Account',
        postingDate: data.postingDate,
        account: data.account,
        debit: data.debit,
        credit: data.credit,
        description: data.description,
        reference: data.reference || '',
        companyCode: data.companyCode,
        costCenter: data.costCenter,
        profitCenter: data.profitCenter,
        businessArea: data.businessArea,
        documentType: data.documentType,
        status: 'Draft',
      };

      upsertEntity<JournalEntry>(ENTRIES_STORAGE_KEY, newEntry);
      setJournalEntries(prev => [...prev, newEntry]);
      
      toast({
        title: 'Journal Entry Created',
        description: `Entry ${documentNumber} has been created successfully.`,
      });
      
      setIsEntryDialogOpen(false);
      setSelectedDocumentNumber('');
      entryForm.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create journal entry.',
        variant: 'destructive',
      });
    }
  };

  const onSubmitAccount = (data: z.infer<typeof accountSchema>) => {
    try {
      const newAccount: Account = {
        id: generateId('acc'),
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        accountType: data.accountType,
        category: data.category,
        balance: 0,
        isActive: true,
      };

      upsertEntity<Account>(ACCOUNTS_STORAGE_KEY, newAccount);
      setAccounts(prev => [...prev, newAccount]);
      
      toast({
        title: 'Account Created',
        description: `Account ${data.accountNumber} has been created successfully.`,
      });
      
      setIsAccountDialogOpen(false);
      accountForm.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create account.',
        variant: 'destructive',
      });
    }
  };

  const postEntry = (entry: JournalEntry) => {
    try {
      const updatedEntry = { ...entry, status: 'Posted' as const };
      upsertEntity<JournalEntry>(ENTRIES_STORAGE_KEY, updatedEntry);
      setJournalEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
      
      toast({
        title: 'Entry Posted',
        description: `Journal entry ${entry.documentNumber} has been posted.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post entry.',
        variant: 'destructive',
      });
    }
  };

  const reverseEntry = (entry: JournalEntry) => {
    if (entry.status !== 'Posted') return;
    
    try {
      const reversedEntry = { ...entry, status: 'Reversed' as const };
      upsertEntity<JournalEntry>(ENTRIES_STORAGE_KEY, reversedEntry);
      setJournalEntries(prev => prev.map(e => e.id === entry.id ? reversedEntry : e));
      
      toast({
        title: 'Entry Reversed',
        description: `Journal entry ${entry.documentNumber} has been reversed.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reverse entry.',
        variant: 'destructive',
      });
    }
  };

  const deleteEntry = (entry: JournalEntry) => {
    if (entry.status === 'Posted') {
      toast({
        title: 'Cannot Delete',
        description: 'Posted entries cannot be deleted. Please reverse instead.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      removeEntity(ENTRIES_STORAGE_KEY, entry.id);
      setJournalEntries(prev => prev.filter(e => e.id !== entry.id));
      
      toast({
        title: 'Entry Deleted',
        description: `Journal entry ${entry.documentNumber} has been deleted.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete entry.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Posted': 'bg-green-100 text-green-800',
      'Reversed': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn<JournalEntry>[] = [
    { key: 'documentNumber', header: 'Document #', sortable: true, searchable: true },
    { key: 'postingDate', header: 'Posting Date', sortable: true },
    { key: 'account', header: 'Account', searchable: true },
    { key: 'accountName', header: 'Account Name', searchable: true },
    { 
      key: 'debit', 
      header: 'Debit',
      sortable: true,
      render: (value: unknown) => typeof value === 'number' && value > 0 ? `$${value.toLocaleString()}` : '-'
    },
    { 
      key: 'credit', 
      header: 'Credit',
      sortable: true,
      render: (value: unknown) => typeof value === 'number' && value > 0 ? `$${value.toLocaleString()}` : '-'
    },
    { key: 'description', header: 'Description', searchable: true },
    { key: 'reference', header: 'Reference', searchable: true },
    { key: 'costCenter', header: 'Cost Center', searchable: true },
    {
      key: 'status',
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Draft', value: 'Draft' },
        { label: 'Posted', value: 'Posted' },
        { label: 'Reversed', value: 'Reversed' }
      ],
      render: (value: unknown) => (
        <Badge className={getStatusColor(value as string)}>
          {value as string}
        </Badge>
      )
    }
  ];

  const entryActions: TableAction<JournalEntry>[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: JournalEntry) => {
        toast({
          title: 'View Entry',
          description: `Opening ${row.documentNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Post',
      icon: <FileText className="h-4 w-4" />,
      onClick: (row: JournalEntry) => {
        postEntry(row);
      },
      variant: 'ghost',
      condition: (row: JournalEntry) => row.status === 'Draft'
    },
    {
      label: 'Reverse',
      icon: <TrendingUp className="h-4 w-4 transform rotate-180" />,
      onClick: (row: JournalEntry) => {
        if (confirm(`Are you sure you want to reverse entry ${row.documentNumber}?`)) {
          reverseEntry(row);
        }
      },
      variant: 'ghost',
      condition: (row: JournalEntry) => row.status === 'Posted'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: JournalEntry) => {
        if (confirm(`Are you sure you want to delete entry ${row.documentNumber}?`)) {
          deleteEntry(row);
        }
      },
      variant: 'ghost',
      condition: (row: JournalEntry) => row.status === 'Draft'
    }
  ];

  const accountColumns: EnhancedColumn[] = [
    { key: 'accountNumber', header: 'Account Number', sortable: true, searchable: true },
    { key: 'accountName', header: 'Account Name', searchable: true },
    { 
      key: 'accountType', 
      header: 'Type',
      filterable: true,
      filterOptions: [
        { label: 'Assets', value: 'Assets' },
        { label: 'Liabilities', value: 'Liabilities' },
        { label: 'Equity', value: 'Equity' },
        { label: 'Revenue', value: 'Revenue' },
        { label: 'Expenses', value: 'Expenses' }
      ]
    },
    { key: 'category', header: 'Category', searchable: true },
    { 
      key: 'balance', 
      header: 'Balance',
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value: boolean) => (
        <Badge className={value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  // Calculate trial balance
  const trialBalance = accounts.map(account => ({
    ...account,
    debitBalance: account.accountType === 'Assets' || account.accountType === 'Expenses' ? account.balance : 0,
    creditBalance: account.accountType === 'Liabilities' || account.accountType === 'Equity' || account.accountType === 'Revenue' ? account.balance : 0,
  }));

  const totalDebits = trialBalance.reduce((sum, acc) => sum + acc.debitBalance, 0);
  const totalCredits = trialBalance.reduce((sum, acc) => sum + acc.creditBalance, 0);

  // Calculate financial position
  const totalAssets = accounts.filter(acc => acc.accountType === 'Assets').reduce((sum, acc) => sum + acc.balance, 0);
  const totalLiabilities = accounts.filter(acc => acc.accountType === 'Liabilities').reduce((sum, acc) => sum + acc.balance, 0);
  const totalEquity = accounts.filter(acc => acc.accountType === 'Equity').reduce((sum, acc) => sum + acc.balance, 0);
  const totalRevenue = accounts.filter(acc => acc.accountType === 'Revenue').reduce((sum, acc) => sum + acc.balance, 0);
  const totalExpenses = accounts.filter(acc => acc.accountType === 'Expenses').reduce((sum, acc) => sum + acc.balance, 0);
  const netIncome = totalRevenue - totalExpenses;

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
          title="General Ledger"
          description="Central repository for all financial transactions with real-time posting"
          voiceIntroduction="Welcome to General Ledger, the heart of SAP S/4HANA financial accounting."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="General Ledger and Universal Journal"
        examples={[
          "Understanding the Universal Journal as the single source of truth for all financial and management accounting data",
          "Real-time posting of transactions with immediate impact on financial statements and reports",
          "Managing account hierarchies, cost center assignments, and profit center allocations"
        ]}
        detailLevel="advanced"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('entries')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{journalEntries.length}</div>
            <div className="text-sm text-muted-foreground">Journal Entries</div>
            <div className="text-sm text-blue-600">Total</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('balance')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${totalDebits.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Debits</div>
            <div className="text-sm text-green-600">Balanced</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('balance')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${totalCredits.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Credits</div>
            <div className="text-sm text-green-600">Balanced</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('accounts')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{accounts.filter(acc => acc.isActive).length}</div>
            <div className="text-sm text-muted-foreground">Active Accounts</div>
            <div className="text-sm text-purple-600">Chart of accounts</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entries">Journal Entries</TabsTrigger>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Journal Entries
                </span>
                <div className="flex space-x-2">
                  <Dialog open={isEntryDialogOpen} onOpenChange={setIsEntryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Post Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Journal Entry</DialogTitle>
                      </DialogHeader>
                      <Form {...entryForm}>
                        <form onSubmit={entryForm.handleSubmit(onSubmitEntry)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={entryForm.control}
                              name="postingDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Posting Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={entryForm.control}
                              name="documentType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Document Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select document type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="SA">SA - General Posting</SelectItem>
                                      <SelectItem value="DZ">DZ - Customer Payment</SelectItem>
                                      <SelectItem value="KZ">KZ - Vendor Payment</SelectItem>
                                      <SelectItem value="AB">AB - Asset Posting</SelectItem>
                                      <SelectItem value="RE">RE - Invoice</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={entryForm.control}
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
                                      {accounts.filter(acc => acc.isActive).map((account) => (
                                        <SelectItem key={account.id} value={account.accountNumber}>
                                          {account.accountNumber} - {account.accountName}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={entryForm.control}
                              name="companyCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company Code</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select company code" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="1000">1000 - Main Company</SelectItem>
                                      <SelectItem value="2000">2000 - Subsidiary A</SelectItem>
                                      <SelectItem value="3000">3000 - Subsidiary B</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={entryForm.control}
                              name="debit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Debit Amount</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="0" 
                                      step="0.01" 
                                      {...field} 
                                      onChange={(e) => {
                                        field.onChange(parseFloat(e.target.value) || 0);
                                        if (parseFloat(e.target.value) > 0) {
                                          entryForm.setValue('credit', 0);
                                        }
                                      }} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={entryForm.control}
                              name="credit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Credit Amount</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="0" 
                                      step="0.01" 
                                      {...field} 
                                      onChange={(e) => {
                                        field.onChange(parseFloat(e.target.value) || 0);
                                        if (parseFloat(e.target.value) > 0) {
                                          entryForm.setValue('debit', 0);
                                        }
                                      }} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={entryForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter transaction description" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={entryForm.control}
                              name="reference"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Reference</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Reference number (optional)" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={entryForm.control}
                              name="costCenter"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cost Center</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select cost center (optional)" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="CC-1000">CC-1000 - Production</SelectItem>
                                      <SelectItem value="CC-2000">CC-2000 - Sales</SelectItem>
                                      <SelectItem value="CC-3000">CC-3000 - Administration</SelectItem>
                                      <SelectItem value="CC-4000">CC-4000 - IT</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsEntryDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Create Entry</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={journalEntries}
                actions={entryActions}
                searchPlaceholder="Search journal entries..."
                exportable={true}
                refreshable={true}
                onRefresh={loadData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Chart of Accounts</span>
                <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Account</DialogTitle>
                    </DialogHeader>
                    <Form {...accountForm}>
                      <form onSubmit={accountForm.handleSubmit(onSubmitAccount)} className="space-y-4">
                        <FormField
                          control={accountForm.control}
                          name="accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter account number (e.g., 110000)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={accountForm.control}
                          name="accountName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter account name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={accountForm.control}
                          name="accountType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select account type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Assets">Assets</SelectItem>
                                  <SelectItem value="Liabilities">Liabilities</SelectItem>
                                  <SelectItem value="Equity">Equity</SelectItem>
                                  <SelectItem value="Revenue">Revenue</SelectItem>
                                  <SelectItem value="Expenses">Expenses</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={accountForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter account category" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsAccountDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Create Account</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={accountColumns}
                data={accounts}
                searchPlaceholder="Search accounts..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Trial Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4 font-semibold border-b pb-2">
                  <div>Account</div>
                  <div>Account Name</div>
                  <div>Type</div>
                  <div className="text-right">Debit</div>
                  <div className="text-right">Credit</div>
                </div>
                {trialBalance.map((account, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 py-2 hover:bg-gray-50">
                    <div className="font-mono">{account.accountNumber}</div>
                    <div>{account.accountName}</div>
                    <div>{account.accountType}</div>
                    <div className="text-right font-medium">
                      {account.debitBalance > 0 ? `$${account.debitBalance.toLocaleString()}` : '-'}
                    </div>
                    <div className="text-right font-medium">
                      {account.creditBalance > 0 ? `$${account.creditBalance.toLocaleString()}` : '-'}
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-5 gap-4 pt-4 border-t font-bold text-lg">
                  <div className="col-span-3">Total</div>
                  <div className="text-right">${totalDebits.toLocaleString()}</div>
                  <div className="text-right">${totalCredits.toLocaleString()}</div>
                </div>
                {totalDebits !== totalCredits && (
                  <div className="text-red-600 text-center">
                    ⚠️ Trial balance does not balance! Difference: ${Math.abs(totalDebits - totalCredits).toLocaleString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Financial Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Assets</span>
                    <span className="font-medium">${totalAssets.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Liabilities</span>
                    <span className="font-medium">${totalLiabilities.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Equity</span>
                    <span>${(totalAssets - totalLiabilities).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Period Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-medium text-green-600">${totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Expenses</span>
                    <span className="font-medium text-red-600">${totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Net Income</span>
                    <span className={netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${netIncome.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Account Type Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'].map((type) => {
                    const typeAccounts = accounts.filter(acc => acc.accountType === type);
                    const typeTotal = typeAccounts.reduce((sum, acc) => sum + acc.balance, 0);
                    return (
                      <div key={type} className="flex justify-between">
                        <span>{type} ({typeAccounts.length})</span>
                        <span className="font-medium">${typeTotal.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Transactions</span>
                    <span className="font-medium">{journalEntries.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Posted Entries</span>
                    <span className="font-medium text-green-600">
                      {journalEntries.filter(entry => entry.status === 'Posted').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Draft Entries</span>
                    <span className="font-medium text-yellow-600">
                      {journalEntries.filter(entry => entry.status === 'Draft').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reversed Entries</span>
                    <span className="font-medium text-red-600">
                      {journalEntries.filter(entry => entry.status === 'Reversed').length}
                    </span>
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

export default GeneralLedger;