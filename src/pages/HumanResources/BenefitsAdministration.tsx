
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Heart, Shield, Umbrella, Car } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const BenefitsAdministration: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Benefits Administration. Manage employee benefits, insurance programs, and enrollment.');
    }
  }, [isEnabled, speak]);

  const benefitsPlans = [
    {
      planId: 'BEN-001',
      planName: 'Health Insurance Premium',
      category: 'Health',
      provider: 'Blue Cross',
      enrolled: 1156,
      eligible: 1247,
      enrollmentRate: 93,
      monthlyCost: 450,
      employerContribution: 380,
      status: 'Active'
    },
    {
      planId: 'BEN-002',
      planName: 'Dental Insurance',
      category: 'Dental',
      provider: 'Delta Dental',
      enrolled: 987,
      eligible: 1247,
      enrollmentRate: 79,
      monthlyCost: 65,
      employerContribution: 50,
      status: 'Active'
    },
    {
      planId: 'BEN-003',
      planName: '401k Retirement',
      category: 'Retirement',
      provider: 'Fidelity',
      enrolled: 1089,
      eligible: 1247,
      enrollmentRate: 87,
      monthlyCost: 0,
      employerContribution: 200,
      status: 'Active'
    }
  ];

  const columns = [
    { key: 'planId', header: 'Plan ID' },
    { key: 'planName', header: 'Plan Name' },
    { key: 'category', header: 'Category' },
    { key: 'provider', header: 'Provider' },
    { key: 'enrolled', header: 'Enrolled' },
    { key: 'eligible', header: 'Eligible' },
    { 
      key: 'enrollmentRate', 
      header: 'Enrollment Rate',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'monthlyCost', 
      header: 'Monthly Cost',
      render: (value: number) => `$${value}`
    },
    { 
      key: 'employerContribution', 
      header: 'Employer Share',
      render: (value: number) => `$${value}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Inactive': 'bg-gray-100 text-gray-800',
          'Suspended': 'bg-red-100 text-red-800'
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
          title="Benefits Administration"
          description="Manage employee benefits, insurance programs, and enrollment"
          voiceIntroduction="Welcome to Benefits Administration."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Plans</div>
          <div className="text-2xl font-bold">15</div>
          <div className="text-sm text-blue-600">Available benefits</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Enrollment Rate</div>
          <div className="text-2xl font-bold">86%</div>
          <div className="text-sm text-green-600">Overall participation</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Monthly Cost</div>
          <div className="text-2xl font-bold">$890K</div>
          <div className="text-sm text-purple-600">Total employer share</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Open Enrollment</div>
          <div className="text-2xl font-bold">Nov 1-30</div>
          <div className="text-sm text-orange-600">Next period</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Benefits Plans</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Benefit Plan
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={benefitsPlans} />
      </Card>
    </div>
  );
};

export default BenefitsAdministration;
