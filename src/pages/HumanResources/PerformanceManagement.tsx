
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Target, TrendingUp, Award } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const PerformanceManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Performance Management. Conduct reviews, set goals, and track employee performance.');
    }
  }, [isEnabled, speak]);

  const performanceReviews = [
    {
      employeeId: 'EMP-001',
      employeeName: 'John Smith',
      reviewPeriod: 'Q4 2024',
      overallRating: 4.5,
      goalAchievement: 90,
      competencyScore: 4.2,
      reviewer: 'Jane Doe',
      status: 'Completed',
      dueDate: '2024-12-31'
    },
    {
      employeeId: 'EMP-002',
      employeeName: 'Sarah Johnson',
      reviewPeriod: 'Q4 2024',
      overallRating: 4.8,
      goalAchievement: 95,
      competencyScore: 4.6,
      reviewer: 'Mike Wilson',
      status: 'Completed',
      dueDate: '2024-12-31'
    },
    {
      employeeId: 'EMP-003',
      employeeName: 'Michael Brown',
      reviewPeriod: 'Q4 2024',
      overallRating: 0,
      goalAchievement: 0,
      competencyScore: 0,
      reviewer: 'Lisa Davis',
      status: 'Pending',
      dueDate: '2025-01-15'
    }
  ];

  const columns = [
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'employeeName', header: 'Employee Name' },
    { key: 'reviewPeriod', header: 'Review Period' },
    { 
      key: 'overallRating', 
      header: 'Overall Rating',
      render: (value: number) => value > 0 ? value.toFixed(1) : '-'
    },
    { 
      key: 'goalAchievement', 
      header: 'Goal Achievement',
      render: (value: number) => value > 0 ? `${value}%` : '-'
    },
    { 
      key: 'competencyScore', 
      header: 'Competency Score',
      render: (value: number) => value > 0 ? value.toFixed(1) : '-'
    },
    { key: 'reviewer', header: 'Reviewer' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Completed': 'bg-green-100 text-green-800',
          'Pending': 'bg-yellow-100 text-yellow-800',
          'Overdue': 'bg-red-100 text-red-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    },
    { key: 'dueDate', header: 'Due Date' }
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
          title="Performance Management"
          description="Conduct reviews, set goals, and track employee performance"
          voiceIntroduction="Welcome to Performance Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Reviews Completed</div>
          <div className="text-2xl font-bold">892</div>
          <div className="text-sm text-green-600">This quarter</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Pending Reviews</div>
          <div className="text-2xl font-bold">155</div>
          <div className="text-sm text-yellow-600">Due soon</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Rating</div>
          <div className="text-2xl font-bold">4.3</div>
          <div className="text-sm text-blue-600">Out of 5.0</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Goal Achievement</div>
          <div className="text-2xl font-bold">87%</div>
          <div className="text-sm text-purple-600">Company avg</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Performance Reviews</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Start Review Cycle
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={performanceReviews} />
      </Card>
    </div>
  );
};

export default PerformanceManagement;
