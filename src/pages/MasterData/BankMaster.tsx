
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Building, CreditCard } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const BankMaster: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Bank Master. Manage bank information for payment processing and cash management.');
    }
  }, [isEnabled, speak]);

  const banks = [
    {
      bankKey: 'BANK-001',
      bankName: 'First National Bank',
      country: 'United States',
      city: 'New York',
      swiftCode: 'FNBKUS33XXX',
      routingNumber: '021000021',
      bankGroup: 'Commercial',
      status: 'Active'
    },
    {
      bankKey: 'BANK-002',
      bankName: 'Deutsche Bank AG',
      country: 'Germany',
      city: 'Frankfurt',
      swiftCode: 'DEUTDEFFXXX',
      routingNumber: '',
      bankGroup: 'International',
      status: 'Active'
    },
    {
      bankKey: 'BANK-003',
      bankName: 'HSBC Bank PLC',
      country: 'United Kingdom',
      city: 'London',
      swiftCode: 'HBUKGB4BXXX',
      routingNumber: '',
      bankGroup: 'International',
      status: 'Inactive'
    }
  ];

  const columns = [
    { key: 'bankKey', header: 'Bank Key' },
    { key: 'bankName', header: 'Bank Name' },
    { key: 'country', header: 'Country' },
    { key: 'city', header: 'City' },
    { key: 'swiftCode', header: 'SWIFT Code' },
    { key: 'routingNumber', header: 'Routing Number' },
    { key: 'bankGroup', header: 'Bank Group' },
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
          title="Bank Master"
          description="Manage bank information for payment processing"
          voiceIntroduction="Welcome to Bank Master."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Banks</div>
          <div className="text-2xl font-bold">245</div>
          <div className="text-sm text-blue-600">All bank records</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Banks</div>
          <div className="text-2xl font-bold">223</div>
          <div className="text-sm text-green-600">Currently active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Countries</div>
          <div className="text-2xl font-bold">45</div>
          <div className="text-sm text-purple-600">Global coverage</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Bank Groups</div>
          <div className="text-2xl font-bold">8</div>
          <div className="text-sm text-orange-600">Categories defined</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Bank Records</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Bank
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={banks} />
      </Card>
    </div>
  );
};

export default BankMaster;
