
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Users2, Briefcase } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const BusinessPartner: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Business Partner Management. Unified business partner management for customers, vendors, and other entities.');
    }
  }, [isEnabled, speak]);

  const businessPartners = [
    {
      bpNumber: 'BP-100001',
      bpName: 'Global Tech Solutions Inc.',
      bpType: 'Organization',
      bpRole: 'Customer',
      country: 'United States',
      city: 'San Francisco',
      partnerGroup: 'Enterprise',
      status: 'Active'
    },
    {
      bpNumber: 'BP-200001',
      bpName: 'Industrial Supplies Ltd.',
      bpType: 'Organization',
      bpRole: 'Vendor',
      country: 'Germany',
      city: 'Hamburg',
      partnerGroup: 'Supplier',
      status: 'Active'
    },
    {
      bpNumber: 'BP-300001',
      bpName: 'John Smith Consulting',
      bpType: 'Person',
      bpRole: 'Service Provider',
      country: 'United Kingdom',
      city: 'London',
      partnerGroup: 'Individual',
      status: 'Blocked'
    }
  ];

  const columns = [
    { key: 'bpNumber', header: 'Business Partner Number' },
    { key: 'bpName', header: 'Business Partner Name' },
    { key: 'bpType', header: 'Type' },
    { key: 'bpRole', header: 'Role' },
    { key: 'country', header: 'Country' },
    { key: 'city', header: 'City' },
    { key: 'partnerGroup', header: 'Partner Group' },
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
          title="Business Partner"
          description="Unified business partner management"
          voiceIntroduction="Welcome to Business Partner Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Partners</div>
          <div className="text-2xl font-bold">11,801</div>
          <div className="text-sm text-blue-600">All business partners</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Partners</div>
          <div className="text-2xl font-bold">11,125</div>
          <div className="text-sm text-green-600">Currently active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Organizations</div>
          <div className="text-2xl font-bold">8,456</div>
          <div className="text-sm text-purple-600">Corporate entities</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Individuals</div>
          <div className="text-2xl font-bold">3,345</div>
          <div className="text-sm text-orange-600">Individual partners</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Business Partner Records</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Business Partner
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={businessPartners} />
      </Card>
    </div>
  );
};

export default BusinessPartner;
