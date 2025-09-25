import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Download, Filter, Target, DollarSign, TrendingUp, BarChart } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import DataTable, { Column } from '../../components/data/DataTable';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { useToast } from '../../hooks/use-toast';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

const FinancialPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('budgets');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      budgetName: '',
      period: '',
      version: '',
      department: '',
      amount: '',
      currency: 'USD'
    }
  });

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now in Financial Planning. Here you can manage budgets, forecasts, and strategic financial planning activities.');
    }
  }, [isEnabled, speak]);

  const [budgets, setBudgets] = useState([
    { 
      id: 'BUD-001',
      budgetName: 'Annual Operating Budget 2024',
      period: '2024',
      version: 'V1.2',
      department: 'Corporate',
      totalAmount: 5000000,
      approvedAmount: 4800000,
      variance: 200000,
      status: 'Approved',
      owner: 'CFO Office'
    },
    { 
      id: 'BUD-002',
      budgetName: 'Marketing Budget Q3-Q4',
      period: '2024-Q3/Q4',
      version: 'V2.0',
      department: 'Marketing',
      totalAmount: 800000,
      approvedAmount: 750000,
      variance: 50000,
      status: 'In Review',
      owner: 'Marketing Director'
    },
    { 
      id: 'BUD-003',
      budgetName: 'IT Infrastructure Budget',
      period: '2024',
      version: 'V1.0',
      department: 'IT',
      totalAmount: 1200000,
      approvedAmount: 1200000,
      variance: 0,
      status: 'Approved',
      owner: 'IT Director'
    }
  ]);

  const [forecasts, setForecasts] = useState([
    { id: 'FC-001', scenario: 'Base Case', period: '2024-Q3', revenue: 1250000, expenses: 950000, profit: 300000, margin: 24.0, confidence: 85 },
    { id: 'FC-002', scenario: 'Optimistic', period: '2024-Q3', revenue: 1400000, expenses: 1000000, profit: 400000, margin: 28.6, confidence: 65 },
    { id: 'FC-003', scenario: 'Conservative', period: '2024-Q3', revenue: 1100000, expenses: 900000, profit: 200000, margin: 18.2, confidence: 90 },
    { id: 'FC-004', scenario: 'Base Case', period: '2024-Q4', revenue: 1350000, expenses: 1020000, profit: 330000, margin: 24.4, confidence: 75 }
  ]);

  const [planning, setPlanning] = useState([
    { id: 'PL-001', initiative: 'Digital Transformation', category: 'Strategic', budget: 2000000, timeline: '18 months', roi: 15.5, status: 'Planning', priority: 'High' },
    { id: 'PL-002', initiative: 'Market Expansion', category: 'Growth', budget: 1500000, timeline: '12 months', roi: 22.3, status: 'Approved', priority: 'High' },
    { id: 'PL-003', initiative: 'Cost Optimization', category: 'Efficiency', budget: 500000, timeline: '6 months', roi: 18.0, status: 'In Progress', priority: 'Medium' },
    { id: 'PL-004', initiative: 'Product Development', category: 'Innovation', budget: 3000000, timeline: '24 months', roi: 12.8, status: 'Planning', priority: 'High' }
  ]);

  // Forecast form state
  const [isForecastDialogOpen, setIsForecastDialogOpen] = useState(false);
  const [isEditForecastDialogOpen, setIsEditForecastDialogOpen] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState(null);
  
  const forecastForm = useForm({
    defaultValues: {
      scenario: '',
      period: '',
      revenue: '',
      expenses: '',
      confidence: ''
    }
  });

  // Strategic planning form state
  const [isPlanningDialogOpen, setIsPlanningDialogOpen] = useState(false);
  const [isEditPlanningDialogOpen, setIsEditPlanningDialogOpen] = useState(false);
  const [selectedPlanning, setSelectedPlanning] = useState(null);
  
  const planningForm = useForm({
    defaultValues: {
      initiative: '',
      category: '',
      budget: '',
      timeline: '',
      roi: '',
      priority: ''
    }
  });

  const handleCreate = (data: any) => {
    const newBudget = {
      id: `BUD-${String(budgets.length + 1).padStart(3, '0')}`,
      budgetName: data.budgetName,
      period: data.period,
      version: data.version,
      department: data.department,
      totalAmount: parseFloat(data.amount),
      approvedAmount: 0,
      variance: parseFloat(data.amount),
      status: 'Draft',
      owner: 'Current User'
    };
    setBudgets([...budgets, newBudget]);
    setIsCreateDialogOpen(false);
    form.reset();
    toast({
      title: 'Budget Created',
      description: `${data.budgetName} has been created successfully.`,
    });
  };

  const handleEdit = (budget: any) => {
    setSelectedBudget(budget);
    form.reset({
      budgetName: budget.budgetName,
      period: budget.period,
      version: budget.version,
      department: budget.department,
      amount: budget.totalAmount.toString(),
      currency: 'USD'
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: any) => {
    setBudgets(budgets.map(b => 
      b.id === selectedBudget?.id 
        ? { 
            ...b, 
            budgetName: data.budgetName,
            period: data.period,
            version: data.version,
            department: data.department,
            totalAmount: parseFloat(data.amount),
            variance: parseFloat(data.amount) - b.approvedAmount
          } 
        : b
    ));
    setIsEditDialogOpen(false);
    setSelectedBudget(null);
    toast({
      title: 'Budget Updated',
      description: `${data.budgetName} has been updated successfully.`,
    });
  };

  const handleDelete = (id: string) => {
    const budget = budgets.find(b => b.id === id);
    setBudgets(budgets.filter(b => b.id !== id));
    if (budget) {
      toast({
        title: 'Budget Deleted',
        description: `${budget.budgetName} has been deleted successfully.`,
      });
    }
  };

  // Forecast CRUD operations
  const handleCreateForecast = (data: any) => {
    const newForecast = {
      id: `FC-${String(forecasts.length + 1).padStart(3, '0')}`,
      scenario: data.scenario,
      period: data.period,
      revenue: parseFloat(data.revenue),
      expenses: parseFloat(data.expenses),
      profit: parseFloat(data.revenue) - parseFloat(data.expenses),
      margin: ((parseFloat(data.revenue) - parseFloat(data.expenses)) / parseFloat(data.revenue)) * 100,
      confidence: parseInt(data.confidence)
    };
    setForecasts([...forecasts, newForecast]);
    setIsForecastDialogOpen(false);
    forecastForm.reset();
    toast({
      title: 'Forecast Created',
      description: `${data.scenario} forecast has been created successfully.`,
    });
  };

  const handleEditForecast = (forecast: any) => {
    setSelectedForecast(forecast);
    forecastForm.reset({
      scenario: forecast.scenario,
      period: forecast.period,
      revenue: forecast.revenue.toString(),
      expenses: forecast.expenses.toString(),
      confidence: forecast.confidence.toString()
    });
    setIsEditForecastDialogOpen(true);
  };

  const handleUpdateForecast = (data: any) => {
    setForecasts(forecasts.map(f => 
      f.id === selectedForecast?.id 
        ? { 
            ...f, 
            scenario: data.scenario,
            period: data.period,
            revenue: parseFloat(data.revenue),
            expenses: parseFloat(data.expenses),
            profit: parseFloat(data.revenue) - parseFloat(data.expenses),
            margin: ((parseFloat(data.revenue) - parseFloat(data.expenses)) / parseFloat(data.revenue)) * 100,
            confidence: parseInt(data.confidence)
          } 
        : f
    ));
    setIsEditForecastDialogOpen(false);
    setSelectedForecast(null);
    toast({
      title: 'Forecast Updated',
      description: `${data.scenario} forecast has been updated successfully.`,
    });
  };

  const handleDeleteForecast = (id: string) => {
    const forecast = forecasts.find(f => f.id === id);
    setForecasts(forecasts.filter(f => f.id !== id));
    if (forecast) {
      toast({
        title: 'Forecast Deleted',
        description: `${forecast.scenario} forecast has been deleted successfully.`,
      });
    }
  };

  // Strategic Planning CRUD operations
  const handleCreatePlanning = (data: any) => {
    const newPlanning = {
      id: `PL-${String(planning.length + 1).padStart(3, '0')}`,
      initiative: data.initiative,
      category: data.category,
      budget: parseFloat(data.budget),
      timeline: data.timeline,
      roi: parseFloat(data.roi),
      status: 'Planning',
      priority: data.priority
    };
    setPlanning([...planning, newPlanning]);
    setIsPlanningDialogOpen(false);
    planningForm.reset();
    toast({
      title: 'Initiative Created',
      description: `${data.initiative} has been created successfully.`,
    });
  };

  const handleEditPlanning = (plan: any) => {
    setSelectedPlanning(plan);
    planningForm.reset({
      initiative: plan.initiative,
      category: plan.category,
      budget: plan.budget.toString(),
      timeline: plan.timeline,
      roi: plan.roi.toString(),
      priority: plan.priority
    });
    setIsEditPlanningDialogOpen(true);
  };

  const handleUpdatePlanning = (data: any) => {
    setPlanning(planning.map(p => 
      p.id === selectedPlanning?.id 
        ? { 
            ...p, 
            initiative: data.initiative,
            category: data.category,
            budget: parseFloat(data.budget),
            timeline: data.timeline,
            roi: parseFloat(data.roi),
            priority: data.priority
          } 
        : p
    ));
    setIsEditPlanningDialogOpen(false);
    setSelectedPlanning(null);
    toast({
      title: 'Initiative Updated',
      description: `${data.initiative} has been updated successfully.`,
    });
  };

  const handleDeletePlanning = (id: string) => {
    const plan = planning.find(p => p.id === id);
    setPlanning(planning.filter(p => p.id !== id));
    if (plan) {
      toast({
        title: 'Initiative Deleted',
        description: `${plan.initiative} has been deleted successfully.`,
      });
    }
  };

  const budgetColumns: Column[] = [
    { key: 'budgetName', header: 'Budget Name' },
    { key: 'period', header: 'Period' },
    { key: 'version', header: 'Version' },
    { key: 'department', header: 'Department' },
    { 
      key: 'totalAmount', 
      header: 'Total Amount',
      render: (value) => `$${(value / 1000000).toFixed(1)}M`
    },
    { 
      key: 'approvedAmount', 
      header: 'Approved Amount',
      render: (value) => `$${(value / 1000000).toFixed(1)}M`
    },
    { key: 'owner', header: 'Owner' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <Badge variant={
          value === 'Approved' ? 'default' : 
          value === 'In Review' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast({
                title: 'View Budget',
                description: `Viewing details for budget ${row.budgetName}`,
              });
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEdit(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${row.budgetName}?`)) {
                handleDelete(row.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const forecastColumns: Column[] = [
    { key: 'scenario', header: 'Scenario' },
    { key: 'period', header: 'Period' },
    { 
      key: 'revenue', 
      header: 'Revenue',
      render: (value) => `$${(value / 1000000).toFixed(1)}M`
    },
    { 
      key: 'expenses', 
      header: 'Expenses',
      render: (value) => `$${(value / 1000000).toFixed(1)}M`
    },
    { 
      key: 'profit', 
      header: 'Profit',
      render: (value) => `$${(value / 1000).toFixed(0)}K`
    },
    { 
      key: 'margin', 
      header: 'Margin %',
      render: (value) => `${value.toFixed(1)}%`
    },
    { 
      key: 'confidence', 
      header: 'Confidence',
      render: (value) => `${value}%`
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast({
                title: 'View Forecast',
                description: `Viewing details for ${row.scenario} forecast`,
              });
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditForecast(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${row.scenario} forecast?`)) {
                handleDeleteForecast(row.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast({
                title: 'Download Forecast',
                description: `Downloading ${row.scenario} forecast data`,
              });
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const planningColumns: Column[] = [
    { key: 'initiative', header: 'Initiative' },
    { key: 'category', header: 'Category' },
    { 
      key: 'budget', 
      header: 'Budget',
      render: (value) => `$${(value / 1000000).toFixed(1)}M`
    },
    { key: 'timeline', header: 'Timeline' },
    { 
      key: 'roi', 
      header: 'Expected ROI',
      render: (value) => `${value.toFixed(1)}%`
    },
    { 
      key: 'priority', 
      header: 'Priority',
      render: (value) => (
        <Badge variant={
          value === 'High' ? 'destructive' : 
          value === 'Medium' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <Badge variant={
          value === 'Approved' ? 'default' : 
          value === 'In Progress' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast({
                title: 'View Initiative',
                description: `Viewing details for ${row.initiative}`,
              });
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleEditPlanning(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${row.initiative}?`)) {
                handleDeletePlanning(row.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast({
                title: 'Download Initiative',
                description: `Downloading ${row.initiative} details`,
              });
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
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
          onClick={() => navigate('/finance')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Financial Planning"
          description="Manage budgets, forecasts, and strategic financial planning activities"
          voiceIntroduction="Welcome to Financial Planning. Manage your budgets, forecasts, and strategic initiatives."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{budgets.length}</p>
                <p className="text-xs text-muted-foreground">Active Budgets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">$7.0M</p>
                <p className="text-xs text-muted-foreground">Total Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">$6.75M</p>
                <p className="text-xs text-muted-foreground">Approved Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">24.0%</p>
                <p className="text-xs text-muted-foreground">Forecast Margin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="budgets">Budget Management</TabsTrigger>
          <TabsTrigger value="forecasts">Financial Forecasting</TabsTrigger>
          <TabsTrigger value="planning">Strategic Planning</TabsTrigger>
          <TabsTrigger value="analytics">Planning Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Budget Management</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: 'Filter Options',
                        description: 'Opening filter options for budgets',
                      });
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Budget
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Budget</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="budgetName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Budget Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="period"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Budget Period</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="2024">2024 (Annual)</SelectItem>
                                    <SelectItem value="2024-Q1">2024 Q1</SelectItem>
                                    <SelectItem value="2024-Q2">2024 Q2</SelectItem>
                                    <SelectItem value="2024-Q3">2024 Q3</SelectItem>
                                    <SelectItem value="2024-Q4">2024 Q4</SelectItem>
                                    <SelectItem value="2025">2025 (Annual)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="version"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Version</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., V1.0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Corporate">Corporate</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="IT">IT</SelectItem>
                                    <SelectItem value="Operations">Operations</SelectItem>
                                    <SelectItem value="HR">HR</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Budget Amount</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Create Budget</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={budgetColumns} data={budgets} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Financial Forecasts</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: 'Filter Forecasts',
                        description: 'Opening filter options for forecasts',
                      });
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Dialog open={isForecastDialogOpen} onOpenChange={setIsForecastDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Forecast
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Forecast</DialogTitle>
                      </DialogHeader>
                      <Form {...forecastForm}>
                        <form onSubmit={forecastForm.handleSubmit(handleCreateForecast)} className="space-y-4">
                          <FormField
                            control={forecastForm.control}
                            name="scenario"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Scenario Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Base Case, Optimistic, Conservative" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={forecastForm.control}
                            name="period"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Forecast Period</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="2024-Q1">2024 Q1</SelectItem>
                                    <SelectItem value="2024-Q2">2024 Q2</SelectItem>
                                    <SelectItem value="2024-Q3">2024 Q3</SelectItem>
                                    <SelectItem value="2024-Q4">2024 Q4</SelectItem>
                                    <SelectItem value="2025-Q1">2025 Q1</SelectItem>
                                    <SelectItem value="2025-Q2">2025 Q2</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={forecastForm.control}
                            name="revenue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expected Revenue ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={forecastForm.control}
                            name="expenses"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expected Expenses ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={forecastForm.control}
                            name="confidence"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confidence Level (%)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select confidence" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="50">50% - Low Confidence</SelectItem>
                                    <SelectItem value="65">65% - Medium-Low Confidence</SelectItem>
                                    <SelectItem value="75">75% - Medium Confidence</SelectItem>
                                    <SelectItem value="85">85% - Medium-High Confidence</SelectItem>
                                    <SelectItem value="95">95% - High Confidence</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsForecastDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Create Forecast</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Edit Forecast Dialog */}
                  <Dialog open={isEditForecastDialogOpen} onOpenChange={setIsEditForecastDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Forecast</DialogTitle>
                      </DialogHeader>
                      <Form {...forecastForm}>
                        <form onSubmit={forecastForm.handleSubmit(handleUpdateForecast)} className="space-y-4">
                          <FormField
                            control={forecastForm.control}
                            name="scenario"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Scenario Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={forecastForm.control}
                            name="period"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Forecast Period</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="2024-Q1">2024 Q1</SelectItem>
                                    <SelectItem value="2024-Q2">2024 Q2</SelectItem>
                                    <SelectItem value="2024-Q3">2024 Q3</SelectItem>
                                    <SelectItem value="2024-Q4">2024 Q4</SelectItem>
                                    <SelectItem value="2025-Q1">2025 Q1</SelectItem>
                                    <SelectItem value="2025-Q2">2025 Q2</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={forecastForm.control}
                            name="revenue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expected Revenue ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={forecastForm.control}
                            name="expenses"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expected Expenses ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={forecastForm.control}
                            name="confidence"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confidence Level (%)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select confidence" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="50">50% - Low Confidence</SelectItem>
                                    <SelectItem value="65">65% - Medium-Low Confidence</SelectItem>
                                    <SelectItem value="75">75% - Medium Confidence</SelectItem>
                                    <SelectItem value="85">85% - Medium-High Confidence</SelectItem>
                                    <SelectItem value="95">95% - High Confidence</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditForecastDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Update Forecast</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={forecastColumns} data={forecasts} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Strategic Initiatives</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: 'Filter Initiatives',
                        description: 'Opening filter options for initiatives',
                      });
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Dialog open={isPlanningDialogOpen} onOpenChange={setIsPlanningDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Initiative
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Strategic Initiative</DialogTitle>
                      </DialogHeader>
                      <Form {...planningForm}>
                        <form onSubmit={planningForm.handleSubmit(handleCreatePlanning)} className="space-y-4">
                          <FormField
                            control={planningForm.control}
                            name="initiative"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Initiative Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Digital Transformation" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={planningForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Strategic">Strategic</SelectItem>
                                    <SelectItem value="Growth">Growth</SelectItem>
                                    <SelectItem value="Efficiency">Efficiency</SelectItem>
                                    <SelectItem value="Innovation">Innovation</SelectItem>
                                    <SelectItem value="Compliance">Compliance</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={planningForm.control}
                            name="budget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Budget ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={planningForm.control}
                            name="timeline"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Timeline</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 12 months, 2 years" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={planningForm.control}
                            name="roi"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expected ROI (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={planningForm.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsPlanningDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Create Initiative</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Edit Planning Dialog */}
                  <Dialog open={isEditPlanningDialogOpen} onOpenChange={setIsEditPlanningDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Strategic Initiative</DialogTitle>
                      </DialogHeader>
                      <Form {...planningForm}>
                        <form onSubmit={planningForm.handleSubmit(handleUpdatePlanning)} className="space-y-4">
                          <FormField
                            control={planningForm.control}
                            name="initiative"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Initiative Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={planningForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Strategic">Strategic</SelectItem>
                                    <SelectItem value="Growth">Growth</SelectItem>
                                    <SelectItem value="Efficiency">Efficiency</SelectItem>
                                    <SelectItem value="Innovation">Innovation</SelectItem>
                                    <SelectItem value="Compliance">Compliance</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={planningForm.control}
                            name="budget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Budget ($)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={planningForm.control}
                            name="timeline"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Timeline</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={planningForm.control}
                            name="roi"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expected ROI (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={planningForm.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditPlanningDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Update Initiative</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={planningColumns} data={planning} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Planned Budget</span>
                    <span className="font-semibold">$7.0M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved Budget</span>
                    <span className="font-semibold text-green-600">$6.75M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approval Rate</span>
                    <span className="font-semibold">96.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget Variance</span>
                    <span className="font-semibold text-red-600">$250K</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Forecast Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Revenue Forecast Accuracy</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expense Forecast Accuracy</span>
                    <span className="font-semibold">88%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Forecast Accuracy</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overall Confidence</span>
                    <span className="font-semibold text-green-600">79%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
              <FormField
                control={form.control}
                name="budgetName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Period</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2024">2024 (Annual)</SelectItem>
                        <SelectItem value="2024-Q1">2024 Q1</SelectItem>
                        <SelectItem value="2024-Q2">2024 Q2</SelectItem>
                        <SelectItem value="2024-Q3">2024 Q3</SelectItem>
                        <SelectItem value="2024-Q4">2024 Q4</SelectItem>
                        <SelectItem value="2025">2025 (Annual)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., V1.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Budget</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialPlanning;
