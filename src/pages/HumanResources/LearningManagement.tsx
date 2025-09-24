
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, BookOpen, Award, Clock } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const LearningManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Learning Management. Manage training programs, certifications, and employee skill development.');
    }
  }, [isEnabled, speak]);

  const learningPrograms = [
    {
      programId: 'LRN-001',
      title: 'Leadership Development',
      category: 'Management',
      duration: '40 hours',
      enrolled: 45,
      completed: 32,
      completionRate: 71,
      status: 'Active',
      startDate: '2025-01-01'
    },
    {
      programId: 'LRN-002',
      title: 'Technical Skills Bootcamp',
      category: 'Technical',
      duration: '80 hours',
      enrolled: 120,
      completed: 95,
      completionRate: 79,
      status: 'Active',
      startDate: '2024-12-01'
    },
    {
      programId: 'LRN-003',
      title: 'Customer Service Excellence',
      category: 'Soft Skills',
      duration: '20 hours',
      enrolled: 78,
      completed: 78,
      completionRate: 100,
      status: 'Completed',
      startDate: '2024-11-15'
    }
  ];

  const columns = [
    { key: 'programId', header: 'Program ID' },
    { key: 'title', header: 'Program Title' },
    { key: 'category', header: 'Category' },
    { key: 'duration', header: 'Duration' },
    { key: 'enrolled', header: 'Enrolled' },
    { key: 'completed', header: 'Completed' },
    { 
      key: 'completionRate', 
      header: 'Completion Rate',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Completed': 'bg-blue-100 text-blue-800',
          'Draft': 'bg-yellow-100 text-yellow-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    },
    { key: 'startDate', header: 'Start Date' }
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
          title="Learning Management"
          description="Manage training programs, certifications, and employee skill development"
          voiceIntroduction="Welcome to Learning Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Programs</div>
          <div className="text-2xl font-bold">24</div>
          <div className="text-sm text-blue-600">Available courses</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Enrollments</div>
          <div className="text-2xl font-bold">2,456</div>
          <div className="text-sm text-green-600">This year</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Completion</div>
          <div className="text-2xl font-bold">83%</div>
          <div className="text-sm text-purple-600">Success rate</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Certifications</div>
          <div className="text-2xl font-bold">187</div>
          <div className="text-sm text-yellow-600">Awarded</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Learning Programs</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Program
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={learningPrograms} />
      </Card>
    </div>
  );
};

export default LearningManagement;
