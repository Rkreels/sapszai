
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Play, Pause, CheckCircle, AlertCircle, Clock, Users } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const activeExecutions = [
  { id: 'EXE-001', project: 'ERP Implementation', phase: 'Data Migration', progress: 75, status: 'In Progress', team: 'Team Alpha' },
  { id: 'EXE-002', project: 'Website Redesign', phase: 'Development', progress: 90, status: 'In Progress', team: 'Team Beta' },
  { id: 'EXE-003', project: 'Mobile App', phase: 'Testing', progress: 45, status: 'On Hold', team: 'Team Gamma' },
];

const workPackages = [
  { id: 'WP-001', name: 'System Configuration', assignee: 'John Smith', dueDate: '2025-06-15', status: 'Active', completion: 80 },
  { id: 'WP-002', name: 'User Training', assignee: 'Sarah Davis', dueDate: '2025-06-20', status: 'Active', completion: 35 },
  { id: 'WP-003', name: 'Data Validation', assignee: 'Mike Johnson', dueDate: '2025-06-10', status: 'Completed', completion: 100 },
];

const ProjectExecution: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('execution');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Project Execution. Here you can monitor project progress, manage work packages, track deliverables, and ensure successful project delivery.');
    }
  }, [isEnabled, speak]);

  const executionColumns = [
    { key: 'project', header: 'Project' },
    { key: 'phase', header: 'Current Phase' },
    { 
      key: 'progress', 
      header: 'Progress',
      render: (value: number) => (
        <div className="w-full">
          <Progress value={value} className="h-2" />
          <div className="text-xs text-right mt-1">{value}%</div>
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'In Progress' ? 'default' : 
          value === 'Completed' ? 'secondary' : 'destructive'
        }>
          {value}
        </Badge>
      )
    },
    { key: 'team', header: 'Team' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => <Button variant="outline" size="sm">Monitor</Button>
    }
  ];

  const workPackageColumns = [
    { key: 'name', header: 'Work Package' },
    { key: 'assignee', header: 'Assignee' },
    { key: 'dueDate', header: 'Due Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Active' ? 'default' : 
          value === 'Completed' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: 'completion', 
      header: 'Completion',
      render: (value: number) => `${value}%`
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/project-management')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Project Execution"
          description="Monitor and manage active project execution phases"
          voiceIntroduction="Welcome to Project Execution management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Completed Tasks</p>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Issues</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-bold">45</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="workpackages">Work Packages</TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="execution" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Active Project Executions</h3>
            <DataTable 
              columns={executionColumns}
              data={activeExecutions}
              className="border rounded-md"
            />
          </Card>
        </TabsContent>

        <TabsContent value="workpackages" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Work Packages</h3>
              <Button>Create Work Package</Button>
            </div>
            <DataTable 
              columns={workPackageColumns}
              data={workPackages}
              className="border rounded-md"
            />
          </Card>
        </TabsContent>

        <TabsContent value="deliverables" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Deliverables</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">System Architecture Document</h4>
                  <p className="text-sm text-gray-600">Due: June 15, 2025</p>
                </div>
                <Badge>In Progress</Badge>
              </div>
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">User Acceptance Testing Report</h4>
                  <p className="text-sm text-gray-600">Due: June 20, 2025</p>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Execution Monitoring</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Schedule Performance</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Cost Performance</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Quality Metrics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Deliverable Quality</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Customer Satisfaction</span>
                      <span>91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectExecution;
