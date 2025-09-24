
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, UserPlus, Search, FileText } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const Recruitment: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Recruitment. Manage job postings, candidates, and hiring processes.');
    }
  }, [isEnabled, speak]);

  const jobOpenings = [
    {
      jobId: 'JOB-001',
      title: 'Senior Software Engineer',
      department: 'IT',
      location: 'New York',
      applications: 45,
      interviewed: 8,
      offered: 2,
      hired: 0,
      status: 'Active',
      deadline: '2025-02-15'
    },
    {
      jobId: 'JOB-002',
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Chicago',
      applications: 67,
      interviewed: 12,
      offered: 1,
      hired: 1,
      status: 'Filled',
      deadline: '2025-01-31'
    },
    {
      jobId: 'JOB-003',
      title: 'Data Analyst',
      department: 'Analytics',
      location: 'Remote',
      applications: 123,
      interviewed: 15,
      offered: 3,
      hired: 0,
      status: 'Active',
      deadline: '2025-02-28'
    }
  ];

  const columns = [
    { key: 'jobId', header: 'Job ID' },
    { key: 'title', header: 'Job Title' },
    { key: 'department', header: 'Department' },
    { key: 'location', header: 'Location' },
    { key: 'applications', header: 'Applications' },
    { key: 'interviewed', header: 'Interviewed' },
    { key: 'offered', header: 'Offered' },
    { key: 'hired', header: 'Hired' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Filled': 'bg-blue-100 text-blue-800',
          'Closed': 'bg-gray-100 text-gray-800',
          'On Hold': 'bg-yellow-100 text-yellow-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    },
    { key: 'deadline', header: 'Deadline' }
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
          title="Recruitment"
          description="Manage job postings, candidates, and hiring processes"
          voiceIntroduction="Welcome to Recruitment."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Open Positions</div>
          <div className="text-2xl font-bold">18</div>
          <div className="text-sm text-blue-600">Currently hiring</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Applications</div>
          <div className="text-2xl font-bold">1,247</div>
          <div className="text-sm text-green-600">This month</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Interview Rate</div>
          <div className="text-2xl font-bold">24%</div>
          <div className="text-sm text-purple-600">Conversion rate</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Time to Hire</div>
          <div className="text-2xl font-bold">28</div>
          <div className="text-sm text-orange-600">Days average</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Job Openings</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Job Posting
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={jobOpenings} />
      </Card>
    </div>
  );
};

export default Recruitment;
