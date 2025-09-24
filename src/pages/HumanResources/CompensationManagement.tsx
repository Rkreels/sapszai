
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, DollarSign, TrendingUp, BarChart } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const CompensationManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Compensation Management. Design and manage compensation structures and salary bands.');
    }
  }, [isEnabled, speak]);

  const compensationData = [
    {
      bandId: 'BAND-001',
      level: 'Junior',
      department: 'IT',
      minSalary: 45000,
      midSalary: 55000,
      maxSalary: 65000,
      employees: 23,
      avgSalary: 52000,
      compaRatio: 0.95,
      status: 'Active'
    },
    {
      bandId: 'BAND-002',
      level: 'Senior',
      department: 'IT',
      minSalary: 65000,
      midSalary: 80000,
      maxSalary: 95000,
      employees: 45,
      avgSalary: 78000,
      compaRatio: 0.98,
      status: 'Active'
    },
    {
      bandId: 'BAND-003',
      level: 'Manager',
      department: 'Sales',
      minSalary: 80000,
      midSalary: 100000,
      maxSalary: 120000,
      employees: 12,
      avgSalary: 95000,
      compaRatio: 0.95,
      status: 'Review'
    }
  ];

  const columns = [
    { key: 'bandId', header: 'Band ID' },
    { key: 'level', header: 'Level' },
    { key: 'department', header: 'Department' },
    { 
      key: 'minSalary', 
      header: 'Min Salary',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'midSalary', 
      header: 'Mid Salary',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'maxSalary', 
      header: 'Max Salary',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'employees', header: 'Employees' },
    { 
      key: 'avgSalary', 
      header: 'Avg Salary',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'compaRatio', 
      header: 'Compa Ratio',
      render: (value: number) => value.toFixed(2)
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Review': 'bg-yellow-100 text-yellow-800',
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
          onClick={() => navigate('/human-resources')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Compensation Management"
          description="Design and manage compensation structures and salary bands"
          voiceIntroduction="Welcome to Compensation Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Salary Bands</div>
          <div className="text-2xl font-bold">28</div>
          <div className="text-sm text-blue-600">Active structures</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Compa Ratio</div>
          <div className="text-2xl font-bold">0.96</div>
          <div className="text-sm text-green-600">Market aligned</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Budget Utilization</div>
          <div className="text-2xl font-bold">87%</div>
          <div className="text-sm text-purple-600">Of allocation</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Merit Increase</div>
          <div className="text-2xl font-bold">3.2%</div>
          <div className="text-sm text-orange-600">Average this year</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Compensation Bands</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Band
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={compensationData} />
      </Card>
    </div>
  );
};

export default CompensationManagement;
