
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Target, DollarSign } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const CostCenter: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Cost Center Management. Create and maintain cost center hierarchy for cost accounting.');
    }
  }, [isEnabled, speak]);

  const costCenters = [
    {
      costCenter: 'CC-1000',
      description: 'Production Department',
      costCenterGroup: 'Manufacturing',
      companyCode: '1000',
      controllingArea: 'A000',
      person: 'John Smith',
      validFrom: '2025-01-01',
      status: 'Active'
    },
    {
      costCenter: 'CC-2000',
      description: 'Sales Department',
      costCenterGroup: 'Sales & Marketing',
      companyCode: '1000',
      controllingArea: 'A000',
      person: 'Sarah Johnson',
      validFrom: '2025-01-01',
      status: 'Active'
    },
    {
      costCenter: 'CC-3000',
      description: 'IT Department',
      costCenterGroup: 'Administration',
      companyCode: '1000',
      controllingArea: 'A000',
      person: 'Michael Brown',
      validFrom: '2025-01-01',
      status: 'Planning'
    }
  ];

  const columns = [
    { key: 'costCenter', header: 'Cost Center' },
    { key: 'description', header: 'Description' },
    { key: 'costCenterGroup', header: 'Cost Center Group' },
    { key: 'companyCode', header: 'Company Code' },
    { key: 'controllingArea', header: 'Controlling Area' },
    { key: 'person', header: 'Responsible Person' },
    { key: 'validFrom', header: 'Valid From' },
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
          title="Cost Center"
          description="Create and maintain cost center hierarchy"
          voiceIntroduction="Welcome to Cost Center Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Cost Centers</div>
          <div className="text-2xl font-bold">156</div>
          <div className="text-sm text-blue-600">All cost centers</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Centers</div>
          <div className="text-2xl font-bold">134</div>
          <div className="text-sm text-green-600">Currently active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Cost Groups</div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-purple-600">Hierarchical groups</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Monthly Budget</div>
          <div className="text-2xl font-bold">$2.4M</div>
          <div className="text-sm text-orange-600">Total allocated</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cost Center Records</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Cost Center
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={costCenters} />
      </Card>
    </div>
  );
};

export default CostCenter;
