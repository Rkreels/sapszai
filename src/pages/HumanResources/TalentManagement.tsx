
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Star, TrendingUp, Target } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const TalentManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Talent Management. Develop employee skills, manage career paths, and identify high performers.');
    }
  }, [isEnabled, speak]);

  const talentProfiles = [
    {
      employeeId: 'EMP-001',
      employeeName: 'John Smith',
      position: 'Software Engineer',
      performanceRating: 4.5,
      potentialRating: 'High',
      careerLevel: 'Senior',
      skillGaps: 2,
      lastReview: '2024-12-15',
      status: 'Active'
    },
    {
      employeeId: 'EMP-002',
      employeeName: 'Sarah Johnson',
      position: 'HR Manager',
      performanceRating: 4.8,
      potentialRating: 'High',
      careerLevel: 'Manager',
      skillGaps: 1,
      lastReview: '2024-12-10',
      status: 'Star Performer'
    },
    {
      employeeId: 'EMP-003',
      employeeName: 'Michael Brown',
      position: 'Sales Representative',
      performanceRating: 3.9,
      potentialRating: 'Medium',
      careerLevel: 'Junior',
      skillGaps: 3,
      lastReview: '2024-12-20',
      status: 'Development'
    }
  ];

  const columns = [
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'employeeName', header: 'Employee Name' },
    { key: 'position', header: 'Position' },
    { 
      key: 'performanceRating', 
      header: 'Performance',
      render: (value: number) => (
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span>{value.toFixed(1)}</span>
        </div>
      )
    },
    { 
      key: 'potentialRating', 
      header: 'Potential',
      render: (value: string) => {
        const colors = {
          'High': 'bg-green-100 text-green-800',
          'Medium': 'bg-yellow-100 text-yellow-800',
          'Low': 'bg-red-100 text-red-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    },
    { key: 'careerLevel', header: 'Career Level' },
    { key: 'skillGaps', header: 'Skill Gaps' },
    { key: 'lastReview', header: 'Last Review' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Star Performer': 'bg-purple-100 text-purple-800',
          'Active': 'bg-blue-100 text-blue-800',
          'Development': 'bg-orange-100 text-orange-800'
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
          title="Talent Management"
          description="Develop employee skills, manage career paths, and identify high performers"
          voiceIntroduction="Welcome to Talent Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">High Performers</div>
          <div className="text-2xl font-bold">187</div>
          <div className="text-sm text-green-600">Top 15% of workforce</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">High Potential</div>
          <div className="text-2xl font-bold">94</div>
          <div className="text-sm text-purple-600">Future leaders</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">In Development</div>
          <div className="text-2xl font-bold">156</div>
          <div className="text-sm text-orange-600">Active programs</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Performance</div>
          <div className="text-2xl font-bold">4.2</div>
          <div className="text-sm text-blue-600">Out of 5.0</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Talent Profiles</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Development Plan
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={talentProfiles} />
      </Card>
    </div>
  );
};

export default TalentManagement;
