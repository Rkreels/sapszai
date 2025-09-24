
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Briefcase, Target, TrendingUp, DollarSign } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const portfolioProjects = [
  { 
    id: 'PRJ-001', 
    name: 'ERP Implementation', 
    priority: 'High', 
    status: 'In Progress',
    progress: 75,
    budget: 350000,
    roi: '24%',
    strategicValue: 'High'
  },
  { 
    id: 'PRJ-002', 
    name: 'Digital Transformation', 
    priority: 'High', 
    status: 'Planning',
    progress: 15,
    budget: 500000,
    roi: '32%',
    strategicValue: 'High'
  },
  { 
    id: 'PRJ-003', 
    name: 'Website Redesign', 
    priority: 'Medium', 
    status: 'In Progress',
    progress: 85,
    budget: 120000,
    roi: '18%',
    strategicValue: 'Medium'
  },
];

const portfolioKPIs = [
  { metric: 'Total Portfolio Value', value: '€2.8M', trend: '+12%' },
  { metric: 'Average ROI', value: '28%', trend: '+5%' },
  { metric: 'On-Time Delivery', value: '87%', trend: '+3%' },
  { metric: 'Budget Adherence', value: '94%', trend: '-2%' },
];

const PortfolioManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Portfolio Management. Here you can manage your project portfolio, track strategic alignment, monitor performance, and optimize resource allocation across projects.');
    }
  }, [isEnabled, speak]);

  const projectColumns = [
    { key: 'name', header: 'Project Name' },
    { 
      key: 'priority', 
      header: 'Priority',
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
          value === 'In Progress' ? 'default' : 
          value === 'Planning' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
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
      key: 'budget', 
      header: 'Budget',
      render: (value: number) => `€${value.toLocaleString()}`
    },
    { key: 'roi', header: 'ROI' },
    { 
      key: 'strategicValue', 
      header: 'Strategic Value',
      render: (value: string) => (
        <Badge variant={
          value === 'High' ? 'default' : 
          value === 'Medium' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
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
          title="Portfolio Management"
          description="Manage project portfolio and strategic alignment"
          voiceIntroduction="Welcome to Portfolio Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {portfolioKPIs.map((kpi, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{kpi.metric}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
              <div className={`text-sm font-medium ${kpi.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="strategy">Strategic Alignment</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Portfolio Dashboard</h3>
            <DataTable 
              columns={projectColumns}
              data={portfolioProjects}
              className="border rounded-md"
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold">Portfolio Health</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Overall Health</span>
                    <span>Good</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Risk Level</span>
                    <span>Low</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold">Strategic Goals</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p>• Digital transformation: 75% complete</p>
                <p>• Operational efficiency: On track</p>
                <p>• Customer experience: Improving</p>
                <p>• Cost optimization: 15% achieved</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold">Financial Summary</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Investment</span>
                  <span className="font-semibold">€2.8M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Expected ROI</span>
                  <span className="font-semibold">28%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Payback Period</span>
                  <span className="font-semibold">2.3 years</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Strategic Alignment Matrix</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Strategic Objectives</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Digital Transformation</span>
                    <Badge variant="default">5 Projects</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Operational Excellence</span>
                    <Badge variant="secondary">3 Projects</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Experience</span>
                    <Badge variant="outline">2 Projects</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Market Expansion</span>
                    <Badge variant="outline">1 Project</Badge>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Alignment Score</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Strategic Fit</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Resource Alignment</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Timeline Alignment</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Portfolio Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 text-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">Portfolio ROI</h4>
                <p className="text-2xl font-bold text-green-600">28%</p>
                <p className="text-sm text-gray-600">+5% from last quarter</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">Success Rate</h4>
                <p className="text-2xl font-bold text-blue-600">87%</p>
                <p className="text-sm text-gray-600">Above industry average</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">Cost Efficiency</h4>
                <p className="text-2xl font-bold text-orange-600">94%</p>
                <p className="text-sm text-gray-600">Within budget targets</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Portfolio Optimization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Optimization Recommendations</h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-medium text-blue-800">Resource Reallocation</p>
                    <p className="text-sm text-blue-700">Move 2 developers from Project B to Project A</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-medium text-green-800">Timeline Optimization</p>
                    <p className="text-sm text-green-700">Parallel execution could save 3 months</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded">
                    <p className="font-medium text-orange-800">Risk Mitigation</p>
                    <p className="text-sm text-orange-700">Consider adding contingency budget</p>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Capacity Planning</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Current Utilization</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Planned Capacity Q3</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Forecast Q4</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
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

export default PortfolioManagement;
