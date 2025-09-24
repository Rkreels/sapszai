
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Factory, MapPin } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const PlantMaster: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Plant Master. Create and maintain plant master data for manufacturing and distribution locations.');
    }
  }, [isEnabled, speak]);

  const plants = [
    {
      plantCode: 'PLT-1000',
      plantName: 'Manufacturing Plant North',
      companyCode: '1000',
      country: 'United States',
      city: 'Detroit',
      address: '123 Industrial Blvd',
      plantCategory: 'Manufacturing',
      language: 'EN',
      currency: 'USD',
      status: 'Active'
    },
    {
      plantCode: 'PLT-2000',
      plantName: 'Distribution Center West',
      companyCode: '1000',
      country: 'United States',
      city: 'Los Angeles',
      address: '456 Warehouse Way',
      plantCategory: 'Distribution',
      language: 'EN',
      currency: 'USD',
      status: 'Active'
    },
    {
      plantCode: 'PLT-3000',
      plantName: 'European Manufacturing',
      companyCode: '2000',
      country: 'Germany',
      city: 'Munich',
      address: 'Industriestr. 789',
      plantCategory: 'Manufacturing',
      language: 'DE',
      currency: 'EUR',
      status: 'Planning'
    }
  ];

  const columns = [
    { key: 'plantCode', header: 'Plant Code' },
    { key: 'plantName', header: 'Plant Name' },
    { key: 'companyCode', header: 'Company Code' },
    { key: 'country', header: 'Country' },
    { key: 'city', header: 'City' },
    { key: 'address', header: 'Address' },
    { key: 'plantCategory', header: 'Plant Category' },
    { key: 'language', header: 'Language' },
    { key: 'currency', header: 'Currency' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Planning': 'bg-blue-100 text-blue-800',
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
          title="Plant Master"
          description="Create and maintain plant master data"
          voiceIntroduction="Welcome to Plant Master."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Plants</div>
          <div className="text-2xl font-bold">28</div>
          <div className="text-sm text-blue-600">All plant records</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Plants</div>
          <div className="text-2xl font-bold">24</div>
          <div className="text-sm text-green-600">Currently operational</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Manufacturing</div>
          <div className="text-2xl font-bold">16</div>
          <div className="text-sm text-purple-600">Production facilities</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Distribution</div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-orange-600">Warehouses & DCs</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Plant Records</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Plant
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={plants} />
      </Card>
    </div>
  );
};

export default PlantMaster;
