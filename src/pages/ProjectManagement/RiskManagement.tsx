
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, AlertTriangle, Shield, TrendingDown, Target } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const projectRisks = [
  { 
    id: 'RISK-001', 
    title: 'Data Migration Complexity', 
    project: 'ERP Implementation', 
    probability: 'High', 
    impact: 'High', 
    status: 'Active',
    owner: 'John Smith',
    dueDate: '2025-06-15'
  },
  { 
    id: 'RISK-002', 
    title: 'Resource Availability', 
    project: 'Website Redesign', 
    probability: 'Medium', 
    impact: 'Medium', 
    status: 'Mitigated',
    owner: 'Emma Wilson',
    dueDate: '2025-05-30'
  },
  { 
    id: 'RISK-003', 
    title: 'Technology Integration', 
    project: 'Mobile App', 
    probability: 'Low', 
    impact: 'High', 
    status: 'Monitoring',
    owner: 'Mike Johnson',
    dueDate: '2025-07-01'
  },
];

const mitigationActions = [
  { id: 'MIT-001', risk: 'Data Migration Complexity', action: 'Hire external consultants', status: 'In Progress', dueDate: '2025-06-01' },
  { id: 'MIT-002', risk: 'Resource Availability', action: 'Cross-train team members', status: 'Completed', dueDate: '2025-05-15' },
  { id: 'MIT-003', risk: 'Technology Integration', action: 'Conduct proof of concept', status: 'Planned', dueDate: '2025-06-30' },
];

const RiskManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('risks');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Risk Management. Here you can identify, assess, monitor, and mitigate project risks to ensure successful project delivery.');
    }
  }, [isEnabled, speak]);

  const riskColumns = [
    { key: 'title', header: 'Risk Title' },
    { key: 'project', header: 'Project' },
    { 
      key: 'probability', 
      header: 'Probability',
      render: (value: string) => (
        <Badge variant={
          value === 'High' ? 'destructive' : 
          value === 'Medium' ? 'default' : 'secondary'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: 'impact', 
      header: 'Impact',
      render: (value: string) => (
        <Badge variant={
          value === 'High' ? 'destructive' : 
          value === 'Medium' ? 'default' : 'secondary'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Active' ? 'destructive' : 
          value === 'Mitigated' ? 'default' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { key: 'owner', header: 'Owner' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => <Button variant="outline" size="sm">Manage</Button>
    }
  ];

  const mitigationColumns = [
    { key: 'risk', header: 'Risk' },
    { key: 'action', header: 'Mitigation Action' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Completed' ? 'default' : 
          value === 'In Progress' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { key: 'dueDate', header: 'Due Date' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => <Button variant="outline" size="sm">Update</Button>
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
          title="Risk Management"
          description="Identify, assess, and mitigate project risks"
          voiceIntroduction="Welcome to Risk Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">High Risks</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Mitigated</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Risk Trend</p>
              <p className="text-2xl font-bold text-green-600">↓15%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Actions Due</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="risks">Risk Register</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="risks" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Risk Register</h3>
              <Button>Add New Risk</Button>
            </div>
            <DataTable 
              columns={riskColumns}
              data={projectRisks}
              className="border rounded-md"
            />
          </Card>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Risk Assessment Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Risk Categories</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Technical</span>
                    <Badge variant="destructive">5 Risks</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Schedule</span>
                    <Badge variant="default">3 Risks</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Resource</span>
                    <Badge variant="secondary">2 Risks</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Financial</span>
                    <Badge variant="outline">1 Risk</Badge>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Risk Priority</h4>
                <div className="space-y-3">
                  <div className="bg-red-50 p-3 rounded">
                    <p className="font-medium text-red-800">Critical Priority</p>
                    <p className="text-sm text-red-700">3 risks requiring immediate attention</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <p className="font-medium text-yellow-800">High Priority</p>
                    <p className="text-sm text-yellow-700">5 risks under active management</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-medium text-green-800">Medium Priority</p>
                    <p className="text-sm text-green-700">3 risks being monitored</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mitigation" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Mitigation Actions</h3>
              <Button>Create Action Plan</Button>
            </div>
            <DataTable 
              columns={mitigationColumns}
              data={mitigationActions}
              className="border rounded-md"
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Mitigation Strategies</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">Avoidance</h4>
                  <p className="text-sm text-gray-600">Eliminate the risk by changing the project approach</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">Mitigation</h4>
                  <p className="text-sm text-gray-600">Reduce the probability or impact of the risk</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium">Transfer</h4>
                  <p className="text-sm text-gray-600">Shift the risk to a third party</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium">Acceptance</h4>
                  <p className="text-sm text-gray-600">Acknowledge the risk and prepare contingency plans</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contingency Plans</h3>
              <div className="space-y-3">
                <div className="border rounded p-3">
                  <h4 className="font-medium">Data Migration Failure</h4>
                  <p className="text-sm text-gray-600">Fallback to manual migration with additional resources</p>
                </div>
                <div className="border rounded p-3">
                  <h4 className="font-medium">Key Resource Unavailability</h4>
                  <p className="text-sm text-gray-600">Activate backup team and extend timeline</p>
                </div>
                <div className="border rounded p-3">
                  <h4 className="font-medium">Budget Overrun</h4>
                  <p className="text-sm text-gray-600">Reduce scope or seek additional funding approval</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Risk Monitoring Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">Risk Heat Map</h4>
                <p className="text-sm text-gray-600">Visual risk assessment matrix</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <TrendingDown className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">Risk Trends</h4>
                <p className="text-sm text-gray-600">Historical risk evolution</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">Risk Indicators</h4>
                <p className="text-sm text-gray-600">Early warning signals</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskManagement;
