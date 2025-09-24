
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Truck, Handshake } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const VendorMaster: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Vendor Master. Manage supplier information including contact details, payment terms, and vendor classifications.');
    }
  }, [isEnabled, speak]);

  const vendors = [
    {
      vendorNumber: 'VEND-001',
      vendorName: 'Industrial Supplies Co.',
      country: 'United States',
      city: 'Chicago',
      vendorGroup: 'Raw Materials',
      paymentTerms: 'Net 45',
      currency: 'USD',
      status: 'Active'
    },
    {
      vendorNumber: 'VEND-002',
      vendorName: 'European Components Ltd',
      country: 'Germany',
      city: 'Munich',
      vendorGroup: 'Components',
      paymentTerms: 'Net 30',
      currency: 'EUR',
      status: 'Active'
    },
    {
      vendorNumber: 'VEND-003',
      vendorName: 'Asia Pacific Trading',
      country: 'Singapore',
      city: 'Singapore',
      vendorGroup: 'Services',
      paymentTerms: 'Net 15',
      currency: 'SGD',
      status: 'Blocked'
    }
  ];

  const columns = [
    { key: 'vendorNumber', header: 'Vendor Number' },
    { key: 'vendorName', header: 'Vendor Name' },
    { key: 'country', header: 'Country' },
    { key: 'city', header: 'City' },
    { key: 'vendorGroup', header: 'Vendor Group' },
    { key: 'paymentTerms', header: 'Payment Terms' },
    { key: 'currency', header: 'Currency' },
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
          title="Vendor Master"
          description="Create and maintain vendor master records"
          voiceIntroduction="Welcome to Vendor Master."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Vendors</div>
          <div className="text-2xl font-bold">3,567</div>
          <div className="text-sm text-blue-600">All vendor records</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Vendors</div>
          <div className="text-2xl font-bold">3,234</div>
          <div className="text-sm text-green-600">Currently active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Vendor Groups</div>
          <div className="text-2xl font-bold">28</div>
          <div className="text-sm text-purple-600">Categories defined</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Countries</div>
          <div className="text-2xl font-bold">35</div>
          <div className="text-sm text-orange-600">Global suppliers</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vendor Records</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Vendor
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={vendors} />
      </Card>
    </div>
  );
};

export default VendorMaster;
