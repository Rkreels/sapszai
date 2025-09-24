
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Crown, TrendingUp, Users } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const SuccessionPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Succession Planning. Plan for leadership succession and career development.');
    }
  }, [isEnabled, speak]);

  const successionPlans = [
    {
      positionId: 'POS-001',
      position: 'VP Engineering',
      currentHolder: 'Jane Doe',
      riskLevel: 'Medium',
      successors: 3,
      readyNow: 1,
      ready1Year: 2,
      ready2Plus: 0,
      status: 'Active'
    },
    {
      positionId: 'POS-002',
      position: 'HR Director',
      currentHolder: 'Mike Wilson',
      riskLevel: 'Low',
      successors: 2,
      readyNow: 0,
      ready1Year: 1,
      ready2Plus: 1,
      status: 'Active'
    },
    {
      positionId: 'POS-003',
      position: 'Sales Manager',
      currentHolder: 'Lisa Davis',
      riskLevel: 'High',
      successors: 1,
      readyNow: 0,
      ready1Year: 0,
      ready2Plus: 1,
      status: 'Critical'
    }
  ];

  const columns = [
    { key: 'positionId', header: 'Position ID' },
    { key: 'position', header: 'Position' },
    { key: 'currentHolder', header: 'Current Holder' },
    { 
      key: 'riskLevel', 
      header: 'Risk Level',
      render: (value: string) => {
        const colors = {
          'Low': 'bg-green-100 text-green-800',
          'Medium': 'bg-yellow-100 text-yellow-800',
          'High': 'bg-red-100 text-red-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    },
    { key: 'successors', header: 'Total Successors' },
    { key: 'readyNow', header: 'Ready Now' },
    { key: 'ready1Year', header: 'Ready 1 Year' },
    { key: 'ready2Plus', header: 'Ready 2+ Years' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-blue-100 text-blue-800',
          'Critical': 'bg-red-100 text-red-800',
          'Complete': 'bg-green-100 text-green-800'
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
          onClick={() => navigate('/human-resources')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Succession Planning"
          description="Plan for leadership succession and career development"
          voiceIntroduction="Welcome to Succession Planning."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Key Positions</div>
          <div className="text-2xl font-bold">34</div>
          <div className="text-sm text-blue-600">Under planning</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Ready Successors</div>
          <div className="text-2xl font-bold">67</div>
          <div className="text-sm text-green-600">Available now</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">High Risk Positions</div>
          <div className="text-2xl font-bold">8</div>
          <div className="text-sm text-red-600">Need attention</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Coverage Rate</div>
          <div className="text-2xl font-bold">78%</div>
          <div className="text-sm text-purple-600">Positions covered</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Succession Plans</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={successionPlans} />
      </Card>
    </div>
  );
};

export default SuccessionPlanning;
