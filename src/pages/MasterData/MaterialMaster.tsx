
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Package, Search, Edit } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';
import { useToast } from '../../hooks/use-toast';

const MaterialMaster: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Material Master. Manage product and material data including descriptions, units of measure, and classifications.');
    }
  }, [isEnabled, speak]);

  const materials = [
    {
      materialNumber: 'MAT-001',
      description: 'Steel Rod 10mm',
      materialType: 'Raw Material',
      baseUnit: 'KG',
      materialGroup: 'Metals',
      plant: 'Plant 1000',
      status: 'Active',
      lastChanged: '2025-01-15'
    },
    {
      materialNumber: 'MAT-002',
      description: 'Finished Product A',
      materialType: 'Finished Good',
      baseUnit: 'PC',
      materialGroup: 'Electronics',
      plant: 'Plant 2000',
      status: 'Active',
      lastChanged: '2025-01-18'
    },
    {
      materialNumber: 'MAT-003',
      description: 'Semi-Finished Part B',
      materialType: 'Semi-Finished',
      baseUnit: 'PC',
      materialGroup: 'Components',
      plant: 'Plant 1000',
      status: 'Inactive',
      lastChanged: '2025-01-10'
    }
  ];

  const columns = [
    { key: 'materialNumber', header: 'Material Number' },
    { key: 'description', header: 'Description' },
    { key: 'materialType', header: 'Material Type' },
    { key: 'baseUnit', header: 'Base Unit' },
    { key: 'materialGroup', header: 'Material Group' },
    { key: 'plant', header: 'Plant' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Inactive': 'bg-red-100 text-red-800',
          'Blocked': 'bg-yellow-100 text-yellow-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    },
    { key: 'lastChanged', header: 'Last Changed' }
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
          title="Material Master"
          description="Create and maintain material master records"
          voiceIntroduction="Welcome to Material Master."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Materials</div>
          <div className="text-2xl font-bold">12,456</div>
          <div className="text-sm text-blue-600">All material types</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Materials</div>
          <div className="text-2xl font-bold">11,203</div>
          <div className="text-sm text-green-600">Currently in use</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Material Groups</div>
          <div className="text-2xl font-bold">45</div>
          <div className="text-sm text-purple-600">Categories defined</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Plants Assigned</div>
          <div className="text-2xl font-bold">8</div>
          <div className="text-sm text-orange-600">Locations covered</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Material Records</h2>
        <Button onClick={() => {
          toast({
            title: 'Create Material',
            description: 'Opening material creation form',
          });
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Material
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={materials} />
      </Card>
    </div>
  );
};

export default MaterialMaster;
