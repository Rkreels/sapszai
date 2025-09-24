
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Building2, Wrench } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const AssetMaster: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Asset Master. Manage fixed assets including equipment, machinery, and property records.');
    }
  }, [isEnabled, speak]);

  const assets = [
    {
      assetNumber: 'ASSET-001',
      description: 'Manufacturing Equipment A',
      assetClass: 'Machinery',
      acquisitionValue: 250000,
      acquisitionDate: '2023-01-15',
      location: 'Plant 1000',
      status: 'Active',
      depreciationMethod: 'Straight Line'
    },
    {
      assetNumber: 'ASSET-002',
      description: 'Office Building Main',
      assetClass: 'Building',
      acquisitionValue: 2500000,
      acquisitionDate: '2020-06-01',
      location: 'Head Office',
      status: 'Active',
      depreciationMethod: 'Straight Line'
    },
    {
      assetNumber: 'ASSET-003',
      description: 'Delivery Vehicle Fleet',
      assetClass: 'Vehicle',
      acquisitionValue: 85000,
      acquisitionDate: '2024-03-10',
      location: 'Warehouse',
      status: 'Retired',
      depreciationMethod: 'Declining Balance'
    }
  ];

  const columns = [
    { key: 'assetNumber', header: 'Asset Number' },
    { key: 'description', header: 'Description' },
    { key: 'assetClass', header: 'Asset Class' },
    { 
      key: 'acquisitionValue', 
      header: 'Acquisition Value',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'acquisitionDate', header: 'Acquisition Date' },
    { key: 'location', header: 'Location' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Retired': 'bg-gray-100 text-gray-800',
          'Under Construction': 'bg-blue-100 text-blue-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    },
    { key: 'depreciationMethod', header: 'Depreciation Method' }
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
          title="Asset Master"
          description="Create and maintain asset master records"
          voiceIntroduction="Welcome to Asset Master."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Assets</div>
          <div className="text-2xl font-bold">1,245</div>
          <div className="text-sm text-blue-600">All asset records</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Asset Value</div>
          <div className="text-2xl font-bold">$125M</div>
          <div className="text-sm text-green-600">Total book value</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Assets</div>
          <div className="text-2xl font-bold">1,156</div>
          <div className="text-sm text-purple-600">Currently in use</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Asset Classes</div>
          <div className="text-2xl font-bold">15</div>
          <div className="text-sm text-orange-600">Categories defined</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Asset Records</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Asset
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={assets} />
      </Card>
    </div>
  );
};

export default AssetMaster;
