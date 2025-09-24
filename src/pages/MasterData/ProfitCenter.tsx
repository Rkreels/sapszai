
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, TrendingUp, PieChart } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const ProfitCenter: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Profit Center Management. Define profit center structure and responsibility for profitability analysis.');
    }
  }, [isEnabled, speak]);

  const profitCenters = [
    {
      profitCenter: 'PC-1000',
      description: 'North America Division',
      controllingArea: 'A000',
      companyCode: '1000',
      segment: 'Manufacturing',
      currency: 'USD',
      person: 'Alice Wilson',
      validFrom: '2025-01-01',
      status: 'Active'
    },
    {
      profitCenter: 'PC-2000',
      description: 'Europe Division',
      controllingArea: 'A000',
      companyCode: '2000',
      segment: 'Sales',
      currency: 'EUR',
      person: 'Hans Mueller',
      validFrom: '2025-01-01',
      status: 'Active'
    },
    {
      profitCenter: 'PC-3000',
      description: 'Asia Pacific Division',
      controllingArea: 'A000',
      companyCode: '3000',
      segment: 'Services',
      currency: 'JPY',
      person: 'Yuki Tanaka',
      validFrom: '2025-01-01',
      status: 'Planning'
    }
  ];

  const columns = [
    { key: 'profitCenter', header: 'Profit Center' },
    { key: 'description', header: 'Description' },
    { key: 'controllingArea', header: 'Controlling Area' },
    { key: 'companyCode', header: 'Company Code' },
    { key: 'segment', header: 'Segment' },
    { key: 'currency', header: 'Currency' },
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
          title="Profit Center"
          description="Define profit center structure and responsibility"
          voiceIntroduction="Welcome to Profit Center Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Profit Centers</div>
          <div className="text-2xl font-bold">45</div>
          <div className="text-sm text-blue-600">All profit centers</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Centers</div>
          <div className="text-2xl font-bold">38</div>
          <div className="text-sm text-green-600">Currently active</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-2xl font-bold">$45.2M</div>
          <div className="text-sm text-green-600">This quarter</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Operating Margin</div>
          <div className="text-2xl font-bold">18.5%</div>
          <div className="text-sm text-purple-600">Average across centers</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Profit Center Records</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Profit Center
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={profitCenters} />
      </Card>
    </div>
  );
};

export default ProfitCenter;
