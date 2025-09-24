
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Users, Building } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const CustomerMaster: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Customer Master. Manage customer information including contact details, payment terms, and credit limits.');
    }
  }, [isEnabled, speak]);

  const customers = [
    {
      customerNumber: 'CUST-001',
      customerName: 'ABC Corporation',
      country: 'United States',
      city: 'New York',
      customerGroup: 'Enterprise',
      paymentTerms: 'Net 30',
      creditLimit: 500000,
      status: 'Active'
    },
    {
      customerNumber: 'CUST-002',
      customerName: 'Global Tech Solutions',
      country: 'Germany',
      city: 'Berlin',
      customerGroup: 'SMB',
      paymentTerms: 'Net 15',
      creditLimit: 100000,
      status: 'Active'
    },
    {
      customerNumber: 'CUST-003',
      customerName: 'Regional Distributors',
      country: 'United Kingdom',
      city: 'London',
      customerGroup: 'Distributor',
      paymentTerms: 'Cash',
      creditLimit: 250000,
      status: 'Blocked'
    }
  ];

  const columns = [
    { key: 'customerNumber', header: 'Customer Number' },
    { key: 'customerName', header: 'Customer Name' },
    { key: 'country', header: 'Country' },
    { key: 'city', header: 'City' },
    { key: 'customerGroup', header: 'Customer Group' },
    { key: 'paymentTerms', header: 'Payment Terms' },
    { 
      key: 'creditLimit', 
      header: 'Credit Limit',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Blocked': 'bg-red-100 text-red-800',
          'Inactive': 'bg-gray-100 text-gray-800'
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
          title="Customer Master"
          description="Create and maintain customer master records"
          voiceIntroduction="Welcome to Customer Master."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Customers</div>
          <div className="text-2xl font-bold">8,234</div>
          <div className="text-sm text-blue-600">All customer records</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Customers</div>
          <div className="text-2xl font-bold">7,891</div>
          <div className="text-sm text-green-600">Currently active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Credit Exposure</div>
          <div className="text-2xl font-bold">$45.6M</div>
          <div className="text-sm text-orange-600">Total credit limits</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Countries</div>
          <div className="text-2xl font-bold">42</div>
          <div className="text-sm text-purple-600">Global presence</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Customer Records</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Customer
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={customers} />
      </Card>
    </div>
  );
};

export default CustomerMaster;
