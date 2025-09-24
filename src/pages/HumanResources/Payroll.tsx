
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, DollarSign, Calculator, FileText } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';
import { useToast } from '../../hooks/use-toast';

const Payroll: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Payroll Management. Process employee salaries, taxes, and benefits calculations.');
    }
  }, [isEnabled, speak]);

  const payrollRecords = [
    {
      employeeId: 'EMP-001',
      employeeName: 'John Smith',
      period: '2025-01',
      grossSalary: 5000,
      deductions: 1200,
      netSalary: 3800,
      status: 'Processed',
      payDate: '2025-01-31'
    },
    {
      employeeId: 'EMP-002',
      employeeName: 'Sarah Johnson',
      period: '2025-01',
      grossSalary: 7500,
      deductions: 1800,
      netSalary: 5700,
      status: 'Processed',
      payDate: '2025-01-31'
    },
    {
      employeeId: 'EMP-003',
      employeeName: 'Michael Brown',
      period: '2025-01',
      grossSalary: 4200,
      deductions: 1000,
      netSalary: 3200,
      status: 'Pending',
      payDate: '2025-01-31'
    }
  ];

  const columns = [
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'employeeName', header: 'Employee Name' },
    { key: 'period', header: 'Pay Period' },
    { 
      key: 'grossSalary', 
      header: 'Gross Salary',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'deductions', 
      header: 'Deductions',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'netSalary', 
      header: 'Net Salary',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Processed': 'bg-green-100 text-green-800',
          'Pending': 'bg-yellow-100 text-yellow-800',
          'Failed': 'bg-red-100 text-red-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    },
    { key: 'payDate', header: 'Pay Date' }
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
          title="Payroll Management"
          description="Process employee salaries, taxes, and benefits calculations"
          voiceIntroduction="Welcome to Payroll Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Payroll</div>
          <div className="text-2xl font-bold">$8.2M</div>
          <div className="text-sm text-blue-600">Monthly</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Processed</div>
          <div className="text-2xl font-bold">1,203</div>
          <div className="text-sm text-green-600">This period</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-bold">44</div>
          <div className="text-sm text-yellow-600">Awaiting approval</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Salary</div>
          <div className="text-2xl font-bold">$6,817</div>
          <div className="text-sm text-purple-600">Per employee</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Payroll Records</h2>
        <Button onClick={() => {
          toast({
            title: 'Process Payroll',
            description: 'Starting payroll processing for current period',
          });
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Process Payroll
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={payrollRecords} />
      </Card>
    </div>
  );
};

export default Payroll;
