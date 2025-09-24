import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  ArrowLeft, 
  Plus, 
  Calculator, 
  TrendingUp, 
  Target, 
  BarChart3,
  Eye,
  Edit,
  Copy,
  Download
} from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

interface Budget {
  id: string;
  name: string;
  year: number;
  department: string;
  category: string;
  budgetAmount: number;
  actualSpent: number;
  committed: number;
  available: number;
  variance: number;
  variancePercent: number;
  status: 'Draft' | 'Approved' | 'Active' | 'Closed';
}

interface BudgetVersion {
  id: string;
  budgetId: string;
  version: string;
  description: string;
  createdDate: string;
  createdBy: string;
  status: 'Current' | 'Previous' | 'Archived';
}

const BudgetPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('budgets');
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetVersions, setBudgetVersions] = useState<BudgetVersion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Budget Planning. Create, manage, and monitor budgets with variance analysis and forecasting capabilities for comprehensive financial planning.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = () => {
    const sampleBudgets: Budget[] = [
      {
        id: 'bg-001',
        name: 'IT Operations Budget',
        year: 2025,
        department: 'Information Technology',
        category: 'Operating Expenses',
        budgetAmount: 500000,
        actualSpent: 125000,
        committed: 150000,
        available: 225000,
        variance: -25000,
        variancePercent: -5.0,
        status: 'Active'
      },
      {
        id: 'bg-002',
        name: 'Marketing Campaign Budget',
        year: 2025,
        department: 'Marketing',
        category: 'Marketing Expenses',
        budgetAmount: 300000,
        actualSpent: 85000,
        committed: 75000,
        available: 140000,
        variance: 15000,
        variancePercent: 5.0,
        status: 'Active'
      },
      {
        id: 'bg-003',
        name: 'HR Training Budget',
        year: 2025,
        department: 'Human Resources',
        category: 'Training & Development',
        budgetAmount: 150000,
        actualSpent: 45000,
        committed: 25000,
        available: 80000,
        variance: 5000,
        variancePercent: 3.3,
        status: 'Active'
      }
    ];

    const sampleVersions: BudgetVersion[] = [
      {
        id: 'bv-001',
        budgetId: 'bg-001',
        version: '2025.1',
        description: 'Initial 2025 Budget',
        createdDate: '2024-12-15',
        createdBy: 'John Smith',
        status: 'Current'
      },
      {
        id: 'bv-002',
        budgetId: 'bg-001',
        version: '2024.3',
        description: 'Final 2024 Budget Revision',
        createdDate: '2024-09-15',
        createdBy: 'John Smith',
        status: 'Previous'
      }
    ];

    setBudgets(sampleBudgets);
    setBudgetVersions(sampleVersions);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Approved': 'bg-blue-100 text-blue-800',
      'Active': 'bg-green-100 text-green-800',
      'Closed': 'bg-red-100 text-red-800',
      'Current': 'bg-green-100 text-green-800',
      'Previous': 'bg-blue-100 text-blue-800',
      'Archived': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const budgetColumns: EnhancedColumn[] = [
    { key: 'name', header: 'Budget Name', searchable: true },
    { key: 'department', header: 'Department', searchable: true, filterable: true, filterOptions: [
      { label: 'Information Technology', value: 'Information Technology' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Human Resources', value: 'Human Resources' },
      { label: 'Finance', value: 'Finance' }
    ]},
    { key: 'category', header: 'Category', searchable: true },
    { 
      key: 'budgetAmount', 
      header: 'Budget Amount',
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'actualSpent', 
      header: 'Spent',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'available', 
      header: 'Available',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'variance', 
      header: 'Variance',
      render: (value: number, row: Budget) => (
        <span className={getVarianceColor(value)}>
          ${Math.abs(value).toLocaleString()} ({row.variancePercent > 0 ? '+' : ''}{row.variancePercent}%)
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    }
  ];

  const budgetActions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: Budget) => {
        toast({
          title: 'View Budget',
          description: `Opening details for ${row.name}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: Budget) => {
        toast({
          title: 'Edit Budget',
          description: `Editing ${row.name}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Copy',
      icon: <Copy className="h-4 w-4" />,
      onClick: (row: Budget) => {
        toast({
          title: 'Copy Budget',
          description: `Creating copy of ${row.name}`,
        });
      },
      variant: 'ghost'
    }
  ];

  const versionColumns: EnhancedColumn[] = [
    { key: 'version', header: 'Version', sortable: true },
    { key: 'description', header: 'Description', searchable: true },
    { key: 'createdDate', header: 'Created Date', sortable: true },
    { key: 'createdBy', header: 'Created By', searchable: true },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    }
  ];

  const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.actualSpent, 0);
  const totalAvailable = budgets.reduce((sum, b) => sum + b.available, 0);
  const utilizationPercent = ((totalSpent / totalBudget) * 100).toFixed(1);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/finance')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Budget Planning"
          description="Create, manage, and monitor budgets with variance analysis"
          voiceIntroduction="Welcome to comprehensive Budget Planning for financial control and analysis."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Budget Planning and Control"
        examples={[
          "Creating annual budgets with departmental allocations and quarterly reviews including top-down and bottom-up planning approaches",
          "Monitoring budget vs actual performance with variance analysis and exception reporting for proactive budget management",
          "Managing budget transfers, supplements, and return processes with proper approval workflows and audit trails"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calculator className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">${(totalBudget / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-muted-foreground">Total Budget</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">${(totalSpent / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{utilizationPercent}%</div>
            <div className="text-sm text-muted-foreground">Budget Utilization</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">${(totalAvailable / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="budgets">Budget Management</TabsTrigger>
          <TabsTrigger value="planning">Budget Planning</TabsTrigger>
          <TabsTrigger value="analysis">Variance Analysis</TabsTrigger>
          <TabsTrigger value="versions">Version Control</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Budget Overview
                <Button onClick={() => toast({ title: 'New Budget', description: 'Opening budget creation form' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Budget
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={budgetColumns}
                data={budgets}
                actions={budgetActions}
                searchPlaceholder="Search budgets..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Planning Wizard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="budgetYear">Budget Year</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budgetType">Budget Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operating">Operating Budget</SelectItem>
                      <SelectItem value="capital">Capital Budget</SelectItem>
                      <SelectItem value="project">Project Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="planningMethod">Planning Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="topdown">Top-Down</SelectItem>
                      <SelectItem value="bottomup">Bottom-Up</SelectItem>
                      <SelectItem value="zerobased">Zero-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Budget Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    'Annual Operating Budget',
                    'Quarterly Review Budget',
                    'Department Budget Template',
                    'Project Budget Template',
                    'Capital Expenditure Budget',
                    'Emergency Budget Template'
                  ].map((template, index) => (
                    <Card key={index} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <h4 className="font-semibold">{template}</h4>
                      <p className="text-sm text-muted-foreground">Pre-configured template for {template.toLowerCase()}</p>
                      <Button size="sm" className="mt-2" variant="outline">Use Template</Button>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Variance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgets.map((budget) => (
                    <div key={budget.id} className="p-3 border rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{budget.name}</h4>
                        <Badge className={getStatusColor(budget.status)}>
                          {budget.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Budget: ${budget.budgetAmount.toLocaleString()}</div>
                        <div>Spent: ${budget.actualSpent.toLocaleString()}</div>
                        <div>Available: ${budget.available.toLocaleString()}</div>
                        <div className={getVarianceColor(budget.variance)}>
                          Variance: ${Math.abs(budget.variance).toLocaleString()} ({budget.variancePercent}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Budget Allocated</span>
                    <span className="font-medium">${totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount Spent</span>
                    <span className="font-medium">${totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Available</span>
                    <span className="font-medium">${totalAvailable.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Budget Utilization</span>
                    <span className="font-medium">{utilizationPercent}%</span>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Department Performance</h4>
                    <div className="space-y-2">
                      {['Information Technology', 'Marketing', 'Human Resources'].map((dept) => {
                        const deptBudgets = budgets.filter(b => b.department === dept);
                        const deptSpent = deptBudgets.reduce((sum, b) => sum + b.actualSpent, 0);
                        const deptTotal = deptBudgets.reduce((sum, b) => sum + b.budgetAmount, 0);
                        const deptUtil = deptTotal > 0 ? ((deptSpent / deptTotal) * 100).toFixed(1) : '0';
                        
                        return (
                          <div key={dept} className="flex justify-between text-sm">
                            <span>{dept}</span>
                            <span>{deptUtil}% utilized</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Budget Version Control
                <Button onClick={() => toast({ title: 'New Version', description: 'Creating new budget version' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Version
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={versionColumns}
                data={budgetVersions}
                searchPlaceholder="Search budget versions..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetPlanning;
