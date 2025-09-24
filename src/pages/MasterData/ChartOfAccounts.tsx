
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, FileText, BarChart3 } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const ChartOfAccounts: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Chart of Accounts. Define and maintain chart of accounts structure for financial reporting.');
    }
  }, [isEnabled, speak]);

  const accounts = [
    {
      accountNumber: '1000000',
      accountName: 'Cash and Cash Equivalents',
      accountGroup: 'Assets',
      accountType: 'Balance Sheet',
      level: '1',
      parentAccount: '',
      status: 'Active',
      postingAllowed: 'Yes'
    },
    {
      accountNumber: '1100000',
      accountName: 'Accounts Receivable',
      accountGroup: 'Assets',
      accountType: 'Balance Sheet',
      level: '1',
      parentAccount: '',
      status: 'Active',
      postingAllowed: 'Yes'
    },
    {
      accountNumber: '4000000',
      accountName: 'Revenue',
      accountGroup: 'Revenue',
      accountType: 'P&L',
      level: '1',
      parentAccount: '',
      status: 'Active',
      postingAllowed: 'No'
    },
    {
      accountNumber: '4010000',
      accountName: 'Product Sales',
      accountGroup: 'Revenue',
      accountType: 'P&L',
      level: '2',
      parentAccount: '4000000',
      status: 'Active',
      postingAllowed: 'Yes'
    }
  ];

  const columns = [
    { key: 'accountNumber', header: 'Account Number' },
    { key: 'accountName', header: 'Account Name' },
    { key: 'accountGroup', header: 'Account Group' },
    { key: 'accountType', header: 'Account Type' },
    { key: 'level', header: 'Level' },
    { key: 'parentAccount', header: 'Parent Account' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Inactive': 'bg-gray-100 text-gray-800',
          'Blocked': 'bg-red-100 text-red-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    },
    { 
      key: 'postingAllowed', 
      header: 'Posting Allowed',
      render: (value: string) => {
        const colors = {
          'Yes': 'bg-green-100 text-green-800',
          'No': 'bg-red-100 text-red-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/master-data')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Chart of Accounts"
          description="Define and maintain chart of accounts structure"
          voiceIntroduction="Welcome to Chart of Accounts."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Accounts</div>
          <div className="text-2xl font-bold">2,456</div>
          <div className="text-sm text-blue-600">All account records</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Accounts</div>
          <div className="text-2xl font-bold">2,203</div>
          <div className="text-sm text-green-600">Currently active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Balance Sheet Accounts</div>
          <div className="text-2xl font-bold">1,145</div>
          <div className="text-sm text-purple-600">Assets & Liabilities</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">P&L Accounts</div>
          <div className="text-2xl font-bold">1,058</div>
          <div className="text-sm text-orange-600">Revenue & Expenses</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Account Records</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Account
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={accounts} />
      </Card>
    </div>
  );
};

export default ChartOfAccounts;
