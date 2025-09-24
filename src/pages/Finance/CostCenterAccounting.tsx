import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Download, Filter, Building2, DollarSign, TrendingUp, BarChart } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import DataTable, { Column } from '../../components/data/DataTable';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';

interface CostCenter {
  id: string;
  costCenterCode: string;
  name: string;
  description: string;
  responsiblePerson: string;
  department: string;
  budget: number;
  actualCosts: number;
  variance: number;
  status: string;
}

interface Allocation {
  id: string;
  period: string;
  costCenter: string;
  costElement: string;
  amount: number;
  percentage: number;
  status: string;
}

interface BudgetAnalysis {
  period: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
}

interface FormValues {
  costCenterCode: string;
  name: string;
  description: string;
  responsiblePerson: string;
  department: string;
  budget: string;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: RenderableRow) => React.ReactNode;
}

interface RenderableRow {
  id: string;
}

import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';

const CostCenterAccounting: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('centers');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      costCenterCode: '',
      name: '',
      description: '',
      responsiblePerson: '',
      department: '',
      budget: ''
    }
  });

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now in Cost Center Accounting. Here you can manage cost centers, budgets, and cost allocations for organizational control.');
    }
  }, [isEnabled, speak]);

  const [costCenters, setCostCenters] = useState<CostCenter[]>([
    { 
      id: 'CC-001',
      costCenterCode: 'CC-1000',
      name: 'Production Department',
      description: 'Manufacturing and production activities',
      responsiblePerson: 'John Smith',
      department: 'Manufacturing',
      budget: 500000,
      actualCosts: 425000,
      variance: 75000,
      status: 'Active'
    },
    { 
      id: 'CC-002',
      costCenterCode: 'CC-2000',
      name: 'IT Department',
      description: 'Information technology services',
      responsiblePerson: 'Sarah Johnson',
      department: 'IT',
      budget: 200000,
      actualCosts: 180000,
      variance: 20000,
      status: 'Active'
    },
    { 
      id: 'CC-003',
      costCenterCode: 'CC-3000',
      name: 'Human Resources',
      description: 'HR operations and employee services',
      responsiblePerson: 'Mike Davis',
      department: 'HR',
      budget: 150000,
      actualCosts: 165000,
      variance: -15000,
      status: 'Active'
    }
  ]);

  const [allocations, setAllocations] = useState<Allocation[]>([
    { id: 'AL-001', period: '2024-05', costCenter: 'CC-1000', costElement: 'Labor Costs', amount: 45000, percentage: 60, status: 'Posted' },
    { id: 'AL-002', period: '2024-05', costCenter: 'CC-2000', costElement: 'Software Licenses', amount: 15000, percentage: 100, status: 'Posted' },
    { id: 'AL-003', period: '2024-05', costCenter: 'CC-3000', costElement: 'Training Expenses', amount: 8000, percentage: 80, status: 'Posted' },
    { id: 'AL-004', period: '2024-06', costCenter: 'CC-1000', costElement: 'Utilities', amount: 12000, percentage: 40, status: 'Calculated' }
  ]);

  const [budgetAnalysis, setBudgetAnalysis] = useState<BudgetAnalysis[]>([
    { period: '2024-01', budgeted: 850000, actual: 795000, variance: 55000, variancePercent: 6.5 },
    { period: '2024-02', budgeted: 850000, actual: 820000, variance: 30000, variancePercent: 3.5 },
    { period: '2024-03', budgeted: 850000, actual: 875000, variance: -25000, variancePercent: -2.9 },
    { period: '2024-04', budgeted: 850000, actual: 840000, variance: 10000, variancePercent: 1.2 },
    { period: '2024-05', budgeted: 850000, actual: 770000, variance: 80000, variancePercent: 9.4 }
  ]);

  const handleCreate = (data: FormValues) => {
    const newCostCenter = {
      id: `CC-${String(costCenters.length + 1).padStart(3, '0')}`,
      costCenterCode: data.costCenterCode,
      name: data.name,
      description: data.description,
      responsiblePerson: data.responsiblePerson,
      department: data.department,
      budget: parseFloat(data.budget),
      actualCosts: 0,
      variance: parseFloat(data.budget),
      status: 'Active'
    };
    setCostCenters([...costCenters, newCostCenter]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEdit = (costCenter: CostCenter) => {
    setSelectedCostCenter(costCenter);
    form.reset({
      costCenterCode: costCenter.costCenterCode,
      name: costCenter.name,
      description: costCenter.description,
      responsiblePerson: costCenter.responsiblePerson,
      department: costCenter.department,
      budget: costCenter.budget.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: FormValues) => {
    setCostCenters(costCenters.map(cc => 
      cc.id === selectedCostCenter?.id 
        ? { 
            ...cc, 
            costCenterCode: data.costCenterCode,
            name: data.name,
            description: data.description,
            responsiblePerson: data.responsiblePerson,
            department: data.department,
            budget: parseFloat(data.budget),
            variance: parseFloat(data.budget) - cc.actualCosts
          } 
        : cc
    ));
    setIsEditDialogOpen(false);
    setSelectedCostCenter(null);
  };

  const handleDelete = (id: string) => {
    setCostCenters(costCenters.filter(cc => cc.id !== id));
  };

  const costCenterColumns: Column[] = [
    { key: 'costCenterCode', header: 'Cost Center Code' },
    { key: 'name', header: 'Name' },
    { key: 'responsiblePerson', header: 'Responsible Person' },
    { key: 'department', header: 'Department' },
    { 
      key: 'budget', 
      header: 'Budget',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'actualCosts', 
      header: 'Actual Costs',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'variance', 
      header: 'Variance',
      render: (value: number) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          ${Math.abs(value).toLocaleString()}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>{value}</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: string | number, row: RenderableRow) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      )
    }
  ];

  const allocationColumns: Column[] = [
    { key: 'period', header: 'Period' },
    { key: 'costCenter', header: 'Cost Center' },
    { key: 'costElement', header: 'Cost Element' },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'percentage', 
      header: 'Allocation %',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Posted' ? 'default' : 'secondary'}>{value}</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: string | number, row: RenderableRow) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
        </div>
      )
    }
  ];

  const budgetColumns: Column[] = [
    { key: 'period', header: 'Period' },
    { 
      key: 'budgeted', 
      header: 'Budgeted',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'actual', 
      header: 'Actual',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'variance', 
      header: 'Variance',
      render: (value: number) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          ${Math.abs(value).toLocaleString()}
        </span>
      )
    },
    { 
      key: 'variancePercent', 
      header: 'Variance %',
      render: (value: number) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          {value >= 0 ? '+' : ''}{value}%
        </span>
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
          title="Cost Center Accounting"
          description="Manage cost centers, budgets, and cost allocations for organizational control"
          voiceIntroduction="Welcome to Cost Center Accounting. Manage organizational cost centers and budget control."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{costCenters.length}</p>
                <p className="text-xs text-muted-foreground">Active Cost Centers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">$850K</p>
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
                <p className="text-2xl font-bold">$770K</p>
                <p className="text-xs text-muted-foreground">Actual Costs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">9.4%</p>
                <p className="text-xs text-muted-foreground">Budget Variance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="centers">Cost Centers</TabsTrigger>
          <TabsTrigger value="allocations">Cost Allocations</TabsTrigger>
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="centers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Cost Center Management</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Cost Center
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Cost Center</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="costCenterCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cost Center Code</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="responsiblePerson"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Responsible Person</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                    <SelectItem value="IT">IT</SelectItem>
                                    <SelectItem value="HR">HR</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Annual Budget</FormLabel>
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
                            <Button type="submit">Create Cost Center</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={costCenterColumns} data={costCenters} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Cost Allocations</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Allocation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={allocationColumns} data={allocations} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Budget vs Actual Analysis</CardTitle>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={budgetColumns} data={budgetAnalysis} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cost Center Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Best Performing</span>
                    <span className="font-semibold text-green-600">IT Department</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Needs Attention</span>
                    <span className="font-semibold text-red-600">Human Resources</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Variance</span>
                    <span className="font-semibold">4.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Budget Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Production</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IT</span>
                    <span className="font-semibold">90%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HR</span>
                    <span className="font-semibold">110%</span>
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
            <DialogTitle>Edit Cost Center</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
              <FormField
                control={form.control}
                name="costCenterCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Center Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="responsiblePerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsible Person</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Budget</FormLabel>
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
                <Button type="submit">Update Cost Center</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CostCenterAccounting;
