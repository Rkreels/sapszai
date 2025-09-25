import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Download, Upload, CreditCard, Building, TrendingUp, DollarSign, RefreshCw } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import DataTable, { Column } from '../../components/data/DataTable';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '../../hooks/use-toast';

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: RenderableRow) => React.ReactNode;
}

interface RenderableRow {
  currency?: string;
  type?: string;
  id: string;
}

interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  accountType: string;
  currency: string;
  balance: string;
  iban: string;
  swift: string;
  status: string;
  lastTransaction: string;
}

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: string;
  currency: string;
  description: string;
  accountId: string;
  balance: string;
  reference: string;
}

interface BankStatement {
  id: string;
  accountId: string;
  period: string;
  status: string;
  downloadDate: string;
  transactions: number;
  format: string;
}

interface FormValues {
  accountNumber: string;
  bankName: string;
  accountType: string;
  currency: string;
  iban: string;
  swift: string;
  balance: string;
}

const BankAccounts: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('accounts');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    defaultValues: {
      accountNumber: '',
      bankName: '',
      accountType: '',
      currency: '',
      iban: '',
      swift: '',
      balance: ''
    }
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: 'BA-001', accountNumber: '1234567890', bankName: 'Deutsche Bank AG', accountType: 'Current', currency: 'EUR', balance: '2,450,000.00', iban: 'DE89370400440532013000', swift: 'DEUTDEFF', status: 'Active', lastTransaction: '2024-05-20' },
    { id: 'BA-002', accountNumber: '9876543210', bankName: 'HSBC Holdings', accountType: 'Savings', currency: 'USD', balance: '1,780,500.00', iban: 'GB29NWBK60161331926819', swift: 'HBUKGB4B', status: 'Active', lastTransaction: '2024-05-19' },
    { id: 'BA-003', accountNumber: '5555666677', bankName: 'JPMorgan Chase', accountType: 'Current', currency: 'USD', balance: '980,250.00', iban: 'US64SVBKUS6S3300958879', swift: 'CHASUS33', status: 'Active', lastTransaction: '2024-05-20' },
    { id: 'BA-004', accountNumber: '1111222233', bankName: 'Crédit Agricole', accountType: 'Investment', currency: 'EUR', balance: '3,200,000.00', iban: 'FR1420041010050500013M02606', swift: 'AGRIFRPP', status: 'Restricted', lastTransaction: '2024-05-18' }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TXN-001', date: '2024-05-20', type: 'Credit', amount: '125,000.00', currency: 'EUR', description: 'Customer Payment - Invoice INV-2024-001', accountId: 'BA-001', balance: '2,450,000.00', reference: 'REF-001' },
    { id: 'TXN-002', date: '2024-05-20', type: 'Debit', amount: '45,500.00', currency: 'EUR', description: 'Supplier Payment - Vendor VEN-001', accountId: 'BA-001', balance: '2,325,000.00', reference: 'REF-002' },
    { id: 'TXN-003', date: '2024-05-19', type: 'Credit', amount: '78,900.00', currency: 'USD', description: 'Wire Transfer - International Sale', accountId: 'BA-002', balance: '1,780,500.00', reference: 'REF-003' },
    { id: 'TXN-004', date: '2024-05-19', type: 'Debit', amount: '15,200.00', currency: 'USD', description: 'Bank Charges - Monthly Fees', accountId: 'BA-002', balance: '1,701,600.00', reference: 'REF-004' }
  ]);

  const [bankStatements, setBankStatements] = useState<BankStatement[]>([
    { id: 'STMT-001', accountId: 'BA-001', period: 'May 2024', status: 'Available', downloadDate: '2024-05-20', transactions: 156, format: 'PDF' },
    { id: 'STMT-002', accountId: 'BA-002', period: 'May 2024', status: 'Processing', downloadDate: '', transactions: 89, format: 'Excel' },
    { id: 'STMT-003', accountId: 'BA-001', period: 'April 2024', status: 'Available', downloadDate: '2024-04-30', transactions: 142, format: 'PDF' },
    { id: 'STMT-004', accountId: 'BA-003', period: 'May 2024', status: 'Available', downloadDate: '2024-05-19', transactions: 67, format: 'CSV' }
  ]);

  const handleCreateAccount = (data: FormValues) => {
    const newAccount = {
      id: `BA-${String(bankAccounts.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'Active',
      lastTransaction: new Date().toISOString().split('T')[0]
    };
    setBankAccounts([...bankAccounts, newAccount]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    form.reset(account);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAccount = (data: FormValues) => {
    setBankAccounts(bankAccounts.map(acc => acc.id === selectedAccount?.id ? { ...acc, ...data } : acc));
    setIsEditDialogOpen(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = (id: string) => {
    setBankAccounts(bankAccounts.filter(acc => acc.id !== id));
  };

  const accountColumns: Column[] = [
    { key: 'id', header: 'Account ID' },
    { key: 'accountNumber', header: 'Account Number' },
    { key: 'bankName', header: 'Bank Name' },
    { key: 'accountType', header: 'Type' },
    { key: 'currency', header: 'Currency' },
    { 
      key: 'balance', 
      header: 'Balance',
      render: (value: string, row: RenderableRow) => (
        <span className="font-semibold text-green-600">{row.currency} {value}</span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>{value}</Badge>
      )
    },
    { key: 'lastTransaction', header: 'Last Transaction' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: string | number, row: RenderableRow) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleEditAccount(row)}><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteAccount(row.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      )
    }
  ];

  const transactionColumns: Column[] = [
    { key: 'id', header: 'Transaction ID' },
    { key: 'date', header: 'Date' },
    { 
      key: 'type', 
      header: 'Type',
      render: (value: string) => (
        <Badge variant={value === 'Credit' ? 'default' : 'destructive'}>{value}</Badge>
      )
    },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value: string, row: RenderableRow) => (
        <span className={`font-semibold ${row.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
          {row.currency} {value}
        </span>
      )
    },
    { key: 'description', header: 'Description' },
    { key: 'reference', header: 'Reference' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: string | number, row: RenderableRow) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
        </div>
      )
    }
  ];

  const statementColumns: Column[] = [
    { key: 'id', header: 'Statement ID' },
    { key: 'accountId', header: 'Account' },
    { key: 'period', header: 'Period' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Available' ? 'default' : 'secondary'}>{value}</Badge>
      )
    },
    { key: 'transactions', header: 'Transactions' },
    { key: 'format', header: 'Format' },
    { key: 'downloadDate', header: 'Downloaded' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: string | number, row: RenderableRow) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
        </div>
      )
    }
  ];

  const totalBalance = bankAccounts.reduce((sum, acc: BankAccount) => {
    const balance = parseFloat(acc.balance.replace(/,/g, ''));
    return sum + (acc.currency === 'EUR' ? balance : balance * 0.85); // Simple EUR conversion
  }, 0);

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
          title="Bank Accounts"
          description="Manage bank accounts, transactions, and statements"
          voiceIntroduction="Welcome to Bank Account Management. Monitor and manage your corporate bank accounts, transactions, and statements."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{bankAccounts.length}</p>
                <p className="text-xs text-muted-foreground">Active Accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">€{totalBalance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{transactions.length}</p>
                <p className="text-xs text-muted-foreground">Recent Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">+5.2%</p>
                <p className="text-xs text-muted-foreground">Monthly Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="statements">Bank Statements</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Bank Accounts</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Bank Account</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreateAccount)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="accountNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Account Number</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="bankName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bank Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="accountType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Account Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Current">Current</SelectItem>
                                      <SelectItem value="Savings">Savings</SelectItem>
                                      <SelectItem value="Investment">Investment</SelectItem>
                                      <SelectItem value="Fixed Deposit">Fixed Deposit</SelectItem>
                                    </SelectContent>
                                  </Select>
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
                                      <SelectItem value="EUR">EUR</SelectItem>
                                      <SelectItem value="USD">USD</SelectItem>
                                      <SelectItem value="GBP">GBP</SelectItem>
                                      <SelectItem value="JPY">JPY</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="iban"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>IBAN</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="swift"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>SWIFT Code</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="balance"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Opening Balance</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="number" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Add Account</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={accountColumns} data={bankAccounts} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Transactions</CardTitle>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Accounts</SelectItem>
                      {bankAccounts.map(acc => (
                        <SelectItem key={acc.id} value={acc.id}>{acc.accountNumber}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={transactionColumns} data={transactions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Bank Statements</CardTitle>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Statement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={statementColumns} data={bankStatements} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Bank Reconciliation Status
                  <Button size="sm" onClick={() => toast({ title: 'Start Reconciliation', description: 'Opening reconciliation wizard' })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Start Reconciliation
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bankAccounts.map(account => (
                    <div key={account.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{account.bankName}</div>
                        <div className="text-sm text-muted-foreground">{account.accountType}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Reconciled</Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reconciliation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Reconciled</span>
                    <span className="font-semibold text-green-600">€8.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Reconciliation</span>
                    <span className="font-semibold text-orange-600">€0.8M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unmatched Items</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-semibold text-green-600">96.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Reconciliation History
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                  <div>Account</div>
                  <div>Period</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">BA-001</div>
                    <div className="text-muted-foreground">Deutsche Bank</div>
                  </div>
                  <div>May 2024</div>
                  <div>
                    <Badge variant="default">Reconciled</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">BA-002</div>
                    <div className="text-muted-foreground">HSBC Holdings</div>
                  </div>
                  <div>May 2024</div>
                  <div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">BA-003</div>
                    <div className="text-muted-foreground">JPMorgan Chase</div>
                  </div>
                  <div>May 2024</div>
                  <div>
                    <Badge variant="default">Reconciled</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bank Account</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateAccount)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Current">Current</SelectItem>
                          <SelectItem value="Savings">Savings</SelectItem>
                          <SelectItem value="Investment">Investment</SelectItem>
                          <SelectItem value="Fixed Deposit">Fixed Deposit</SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="iban"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IBAN</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="swift"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SWIFT Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opening Balance</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Account</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankAccounts;
