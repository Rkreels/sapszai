
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, DollarSign, TrendingUp, AlertTriangle, PieChart } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const projectBudgets = [
  { project: 'ERP Implementation', budgeted: 350000, actual: 285000, variance: -65000, status: 'Under Budget', completion: 75 },
  { project: 'Website Redesign', budgeted: 120000, actual: 115000, variance: -5000, status: 'Under Budget', completion: 85 },
  { project: 'Mobile App', budgeted: 200000, actual: 225000, variance: 25000, status: 'Over Budget', completion: 60 },
  { project: 'Data Center', budgeted: 400000, actual: 380000, variance: -20000, status: 'Under Budget', completion: 70 },
];

const costCategories = [
  { category: 'Personnel', budgeted: 500000, actual: 485000, percentage: 65 },
  { category: 'Equipment', budgeted: 200000, actual: 195000, percentage: 26 },
  { category: 'Software', budgeted: 100000, actual: 105000, percentage: 14 },
  { category: 'Travel', budgeted: 50000, actual: 42000, percentage: 7 },
];

const CostManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('budget');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Cost Management. Here you can track project budgets, monitor expenses, analyze cost variances, and ensure financial control across all projects.');
    }
  }, [isEnabled, speak]);

  const budgetColumns = [
    { key: 'project', header: 'Project' },
    { 
      key: 'budgeted', 
      header: 'Budgeted',
      render: (value: number) => `€${value.toLocaleString()}`
    },
    { 
      key: 'actual', 
      header: 'Actual',
      render: (value: number) => `€${value.toLocaleString()}`
    },
    { 
      key: 'variance', 
      header: 'Variance',
      render: (value: number) => (
        <span className={value < 0 ? 'text-green-600' : 'text-red-600'}>
          €{Math.abs(value).toLocaleString()}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Under Budget' ? 'default' : 'destructive'}>
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

  const categoryColumns = [
    { key: 'category', header: 'Category' },
    { 
      key: 'budgeted', 
      header: 'Budgeted',
      render: (value: number) => `€${value.toLocaleString()}`
    },
    { 
      key: 'actual', 
      header: 'Actual',
      render: (value: number) => `€${value.toLocaleString()}`
    },
    { 
      key: 'percentage', 
      header: 'Distribution',
      render: (value: number) => (
        <div className="w-full">
          <Progress value={value} className="h-2" />
          <div className="text-xs text-right mt-1">{value}%</div>
        </div>
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
          title="Cost Management"
          description="Track budgets, monitor expenses, and control project costs"
          voiceIntroduction="Welcome to Cost Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold">€1.07M</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Actual Spend</p>
              <p className="text-2xl font-bold">€1.00M</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Variance</p>
              <p className="text-2xl font-bold text-green-600">-€65K</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <PieChart className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Budget Utilization</p>
              <p className="text-2xl font-bold">94%</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="budget">Budget Tracking</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="analysis">Cost Analysis</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="budget" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Budget Overview</h3>
            <DataTable 
              columns={budgetColumns}
              data={projectBudgets}
              className="border rounded-md"
            />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cost Categories</h3>
            <DataTable 
              columns={categoryColumns}
              data={costCategories}
              className="border rounded-md"
            />
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Expense Management</h3>
              <Button>Add Expense</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Recent Expenses</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Software License</p>
                      <p className="text-sm text-gray-600">ERP Implementation</p>
                    </div>
                    <span className="font-semibold">€15,000</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Hardware Equipment</p>
                      <p className="text-sm text-gray-600">Data Center</p>
                    </div>
                    <span className="font-semibold">€25,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Consultant Fees</p>
                      <p className="text-sm text-gray-600">Website Redesign</p>
                    </div>
                    <span className="font-semibold">€8,500</span>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Pending Approvals</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Travel Expenses</p>
                      <p className="text-sm text-gray-600">Team Conference</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Training Materials</p>
                      <p className="text-sm text-gray-600">Mobile App</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Cost Performance Index</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>ERP Implementation</span>
                      <span>1.15</span>
                    </div>
                    <Progress value={115} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Website Redesign</span>
                      <span>1.04</span>
                    </div>
                    <Progress value={104} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Mobile App</span>
                      <span>0.89</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Budget Variance Trends</h4>
                <div className="space-y-2 text-sm">
                  <p>• Q1: +€12K over budget</p>
                  <p>• Q2: -€8K under budget</p>
                  <p>• Forecast Q3: On track</p>
                  <p>• Risk factors: Equipment costs rising</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cost Forecasting</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Project Completion Forecast</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>ERP Implementation</span>
                    <span className="font-semibold text-green-600">€340K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Website Redesign</span>
                    <span className="font-semibold text-green-600">€118K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Mobile App</span>
                    <span className="font-semibold text-red-600">€245K</span>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Risk Assessment</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Low Risk</span>
                    <Badge variant="default">2 Projects</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium Risk</span>
                    <Badge variant="secondary">1 Project</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>High Risk</span>
                    <Badge variant="destructive">1 Project</Badge>
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

export default CostManagement;
