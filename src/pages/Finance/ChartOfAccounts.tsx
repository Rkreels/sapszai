
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Plus, Edit, Eye, Settings, Download, Upload } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

interface Account {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: 'Assets' | 'Liabilities' | 'Equity' | 'Revenue' | 'Expenses';
  accountGroup: string;
  parentAccount?: string;
  level: number;
  status: 'Active' | 'Inactive' | 'Blocked';
  balanceType: 'Debit' | 'Credit';
  currentBalance: number;
  currency: string;
  controllingArea?: string;
  profitCenter?: string;
  createdDate: string;
  lastModified: string;
}

const ChartOfAccounts: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('accounts');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Chart of Accounts Management. Configure and maintain your organization\'s account structure with comprehensive hierarchies and controls.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleAccounts: Account[] = [
      {
        id: 'acc-001',
        accountNumber: '1000',
        accountName: 'Cash and Cash Equivalents',
        accountType: 'Assets',
        accountGroup: 'Current Assets',
        level: 1,
        status: 'Active',
        balanceType: 'Debit',
        currentBalance: 2450000,
        currency: 'USD',
        controllingArea: 'CA01',
        createdDate: '2024-01-01',
        lastModified: '2025-01-28'
      },
      {
        id: 'acc-002',
        accountNumber: '1100',
        accountName: 'Accounts Receivable',
        accountType: 'Assets',
        accountGroup: 'Current Assets',
        level: 1,
        status: 'Active',
        balanceType: 'Debit',
        currentBalance: 1850000,
        currency: 'USD',
        controllingArea: 'CA01',
        createdDate: '2024-01-01',
        lastModified: '2025-01-28'
      },
      {
        id: 'acc-003',
        accountNumber: '2000',
        accountName: 'Accounts Payable',
        accountType: 'Liabilities',
        accountGroup: 'Current Liabilities',
        level: 1,
        status: 'Active',
        balanceType: 'Credit',
        currentBalance: 1250000,
        currency: 'USD',
        controllingArea: 'CA01',
        createdDate: '2024-01-01',
        lastModified: '2025-01-28'
      },
      {
        id: 'acc-004',
        accountNumber: '4000',
        accountName: 'Sales Revenue',
        accountType: 'Revenue',
        accountGroup: 'Operating Revenue',
        level: 1,
        status: 'Active',
        balanceType: 'Credit',
        currentBalance: 5650000,
        currency: 'USD',
        controllingArea: 'CA01',
        createdDate: '2024-01-01',
        lastModified: '2025-01-28'
      },
      {
        id: 'acc-005',
        accountNumber: '5000',
        accountName: 'Cost of Goods Sold',
        accountType: 'Expenses',
        accountGroup: 'Direct Costs',
        level: 1,
        status: 'Active',
        balanceType: 'Debit',
        currentBalance: 2850000,
        currency: 'USD',
        controllingArea: 'CA01',
        createdDate: '2024-01-01',
        lastModified: '2025-01-28'
      }
    ];
    setAccounts(sampleAccounts);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Blocked': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getAccountTypeColor = (type: string) => {
    const colors = {
      'Assets': 'bg-blue-100 text-blue-800',
      'Liabilities': 'bg-red-100 text-red-800',
      'Equity': 'bg-purple-100 text-purple-800',
      'Revenue': 'bg-green-100 text-green-800',
      'Expenses': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
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
      ],
      render: (value: string) => (
        <Badge className={getAccountTypeColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'accountGroup', header: 'Account Group', searchable: true },
    { 
      key: 'currentBalance', 
      header: 'Current Balance',
      sortable: true,
      render: (value: number, row: Account) => {
        const isNegative = (row.balanceType === 'Debit' && value < 0) || (row.balanceType === 'Credit' && value > 0);
        return (
          <span className={isNegative ? 'text-red-600' : 'text-green-600'}>
            ${Math.abs(value).toLocaleString()}
          </span>
        );
      }
    },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Blocked', value: 'Blocked' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: Account) => {
        setSelectedAccount(row);
        setActiveTab('create');
        toast({
          title: 'View Account',
          description: `Opening account ${row.accountNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: Account) => {
        toast({
          title: 'Edit Account',
          description: `Editing account ${row.accountNumber}`,
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
          title="Chart of Accounts"
          description="Manage your organization's account structure and hierarchy"
          voiceIntroduction="Welcome to Chart of Accounts Management for comprehensive account structure configuration."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Chart of Accounts Management"
        examples={[
          "Configuring account hierarchies with proper numbering schemes and classification for financial reporting compliance",
          "Setting up account controls including posting restrictions, authorization groups, and validation rules",
          "Managing account master data with integration to controlling areas, profit centers, and cost accounting structures"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{accounts.length}</div>
            <div className="text-sm text-muted-foreground">Total Accounts</div>
            <div className="text-sm text-blue-600">Active chart</div>
          </CardContent>
        </Card>
        {['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'].map((type) => (
          <Card key={type}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {accounts.filter(acc => acc.accountType === type).length}
              </div>
              <div className="text-sm text-muted-foreground">{type}</div>
              <div className="text-sm text-purple-600">Accounts</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="create">Create Account</TabsTrigger>
          <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Chart of Accounts
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={() => setActiveTab('create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Account
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={accounts}
                actions={actions}
                searchPlaceholder="Search accounts..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedAccount ? `Edit Account: ${selectedAccount.accountNumber}` : 'Create New Account'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input 
                    id="accountNumber" 
                    placeholder="Enter account number"
                    defaultValue={selectedAccount?.accountNumber || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input 
                    id="accountName" 
                    placeholder="Enter account name"
                    defaultValue={selectedAccount?.accountName || ''}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select defaultValue={selectedAccount?.accountType || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assets">Assets</SelectItem>
                      <SelectItem value="Liabilities">Liabilities</SelectItem>
                      <SelectItem value="Equity">Equity</SelectItem>
                      <SelectItem value="Revenue">Revenue</SelectItem>
                      <SelectItem value="Expenses">Expenses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accountGroup">Account Group</Label>
                  <Input 
                    id="accountGroup" 
                    placeholder="Enter account group"
                    defaultValue={selectedAccount?.accountGroup || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="balanceType">Balance Type</Label>
                  <Select defaultValue={selectedAccount?.balanceType || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select balance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Debit">Debit</SelectItem>
                      <SelectItem value="Credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue={selectedAccount?.currency || 'USD'}>
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
                <div>
                  <Label htmlFor="controllingArea">Controlling Area</Label>
                  <Input 
                    id="controllingArea" 
                    placeholder="Enter controlling area"
                    defaultValue={selectedAccount?.controllingArea || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={selectedAccount?.status || 'Active'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedAccount(null)}>
                  Cancel
                </Button>
                <Button>
                  {selectedAccount ? 'Update Account' : 'Create Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Hierarchy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'].map((type) => (
                  <div key={type} className="border rounded p-4">
                    <h3 className="font-semibold text-lg mb-2">{type}</h3>
                    <div className="space-y-2">
                      {accounts
                        .filter(acc => acc.accountType === type)
                        .map((account) => (
                          <div key={account.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{account.accountNumber}</span>
                              <span className="ml-2">{account.accountName}</span>
                            </div>
                            <Badge className={getStatusColor(account.status)}>
                              {account.status}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Mass Maintenance</h3>
                  <Button className="w-full" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Accounts
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Chart
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Validation
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Account Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Accounts</span>
                      <span className="font-medium">
                        {accounts.filter(acc => acc.status === 'Active').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inactive Accounts</span>
                      <span className="font-medium">
                        {accounts.filter(acc => acc.status === 'Inactive').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Blocked Accounts</span>
                      <span className="font-medium">
                        {accounts.filter(acc => acc.status === 'Blocked').length}
                      </span>
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

export default ChartOfAccounts;
