import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Download, Filter, TrendingUp, DollarSign, Target, BarChart } from 'lucide-react';
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

const ProfitCenterAccounting: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('centers');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProfitCenter, setSelectedProfitCenter] = useState(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      profitCenterCode: '',
      name: '',
      description: '',
      manager: '',
      businessSegment: '',
      targetProfit: ''
    }
  });

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now in Profit Center Accounting. Here you can manage profit centers, analyze profitability, and track financial performance by business segments.');
    }
  }, [isEnabled, speak]);

  const [profitCenters, setProfitCenters] = useState([
    { 
      id: 'PC-001',
      profitCenterCode: 'PC-1000',
      name: 'North America Operations',
      description: 'Sales and operations in North America',
      manager: 'Alice Johnson',
      businessSegment: 'Regional Operations',
      revenue: 2500000,
      costs: 1800000,
      profit: 700000,
      targetProfit: 750000,
      profitMargin: 28.0,
      status: 'Active'
    },
    { 
      id: 'PC-002',
      profitCenterCode: 'PC-2000',
      name: 'Product Line A',
      description: 'Consumer electronics product line',
      manager: 'Bob Smith',
      businessSegment: 'Product Lines',
      revenue: 1800000,
      costs: 1350000,
      profit: 450000,
      targetProfit: 500000,
      profitMargin: 25.0,
      status: 'Active'
    },
    { 
      id: 'PC-003',
      profitCenterCode: 'PC-3000',
      name: 'Enterprise Services',
      description: 'B2B services and consulting',
      manager: 'Carol Davis',
      businessSegment: 'Services',
      revenue: 1200000,
      costs: 900000,
      profit: 300000,
      targetProfit: 320000,
      profitMargin: 25.0,
      status: 'Active'
    }
  ]);

  const [performance, setPerformance] = useState([
    { period: '2024-01', profitCenter: 'PC-1000', revenue: 480000, costs: 350000, profit: 130000, margin: 27.1 },
    { period: '2024-01', profitCenter: 'PC-2000', revenue: 350000, costs: 265000, profit: 85000, margin: 24.3 },
    { period: '2024-01', profitCenter: 'PC-3000', revenue: 230000, costs: 175000, profit: 55000, margin: 23.9 },
    { period: '2024-02', profitCenter: 'PC-1000', revenue: 510000, costs: 370000, profit: 140000, margin: 27.5 },
    { period: '2024-02', profitCenter: 'PC-2000', revenue: 380000, costs: 280000, profit: 100000, margin: 26.3 }
  ]);

  const [transfers, setTransfers] = useState([
    { id: 'TF-001', fromCenter: 'PC-1000', toCenter: 'PC-2000', amount: 50000, description: 'Shared IT Services', date: '2024-05-20', status: 'Posted' },
    { id: 'TF-002', fromCenter: 'PC-3000', toCenter: 'PC-1000', amount: 25000, description: 'Consulting Services', date: '2024-05-18', status: 'Posted' },
    { id: 'TF-003', fromCenter: 'PC-2000', toCenter: 'PC-3000', amount: 15000, description: 'Product Support', date: '2024-05-15', status: 'Pending' }
  ]);

  const handleCreate = (data: any) => {
    const newProfitCenter = {
      id: `PC-${String(profitCenters.length + 1).padStart(3, '0')}`,
      profitCenterCode: data.profitCenterCode,
      name: data.name,
      description: data.description,
      manager: data.manager,
      businessSegment: data.businessSegment,
      revenue: 0,
      costs: 0,
      profit: 0,
      targetProfit: parseFloat(data.targetProfit),
      profitMargin: 0,
      status: 'Active'
    };
    setProfitCenters([...profitCenters, newProfitCenter]);
    setIsCreateDialogOpen(false);
    form.reset();
    toast({
      title: 'Profit Center Created',
      description: `${data.profitCenterCode} - ${data.name} has been created successfully.`,
    });
  };

  const handleEdit = (profitCenter: any) => {
    setSelectedProfitCenter(profitCenter);
    form.reset({
      profitCenterCode: profitCenter.profitCenterCode,
      name: profitCenter.name,
      description: profitCenter.description,
      manager: profitCenter.manager,
      businessSegment: profitCenter.businessSegment,
      targetProfit: profitCenter.targetProfit.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: any) => {
    setProfitCenters(profitCenters.map(pc => 
      pc.id === selectedProfitCenter?.id 
        ? { 
            ...pc, 
            profitCenterCode: data.profitCenterCode,
            name: data.name,
            description: data.description,
            manager: data.manager,
            businessSegment: data.businessSegment,
            targetProfit: parseFloat(data.targetProfit)
          } 
        : pc
    ));
    setIsEditDialogOpen(false);
    setSelectedProfitCenter(null);
    toast({
      title: 'Profit Center Updated',
      description: `${data.profitCenterCode} has been updated successfully.`,
    });
  };

  const handleDelete = (id: string) => {
    setProfitCenters(profitCenters.filter(pc => pc.id !== id));
  };

  const profitCenterColumns: Column[] = [
    { key: 'profitCenterCode', header: 'Profit Center Code' },
    { key: 'name', header: 'Name' },
    { key: 'manager', header: 'Manager' },
    { key: 'businessSegment', header: 'Business Segment' },
    { 
      key: 'revenue', 
      header: 'Revenue',
      render: (value) => `$${(value / 1000).toFixed(0)}K`
    },
    { 
      key: 'profit', 
      header: 'Profit',
      render: (value) => `$${(value / 1000).toFixed(0)}K`
    },
    { 
      key: 'profitMargin', 
      header: 'Profit Margin',
      render: (value) => `${value.toFixed(1)}%`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>{value}</Badge>
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
                title: 'View Profit Center',
                description: `Viewing details for ${row.profitCenterCode}`,
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
              if (confirm(`Are you sure you want to delete ${row.profitCenterCode}?`)) {
                handleDelete(row.id);
                toast({
                  title: 'Profit Center Deleted',
                  description: `${row.profitCenterCode} has been deleted successfully.`,
                });
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const performanceColumns: Column[] = [
    { key: 'period', header: 'Period' },
    { key: 'profitCenter', header: 'Profit Center' },
    { 
      key: 'revenue', 
      header: 'Revenue',
      render: (value) => `$${(value / 1000).toFixed(0)}K`
    },
    { 
      key: 'costs', 
      header: 'Costs',
      render: (value) => `$${(value / 1000).toFixed(0)}K`
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
    }
  ];

  const transferColumns: Column[] = [
    { key: 'date', header: 'Transfer Date' },
    { key: 'fromCenter', header: 'From Center' },
    { key: 'toCenter', header: 'To Center' },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value) => `$${value.toLocaleString()}`
    },
    { key: 'description', header: 'Description' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <Badge variant={value === 'Posted' ? 'default' : 'secondary'}>{value}</Badge>
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
                title: 'View Transfer',
                description: `Viewing details for transfer ${row.id}`,
              });
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast({
                title: 'Edit Transfer',
                description: `Editing transfer ${row.id}`,
              });
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              toast({
                title: 'Download Transfer',
                description: `Downloading transfer ${row.id} details`,
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
          title="Profit Center Accounting"
          description="Manage profit centers, analyze profitability, and track financial performance by business segments"
          voiceIntroduction="Welcome to Profit Center Accounting. Analyze profitability and manage business segment performance."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{profitCenters.length}</p>
                <p className="text-xs text-muted-foreground">Active Profit Centers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">$5.5M</p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">$1.45M</p>
                <p className="text-xs text-muted-foreground">Total Profit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">26.4%</p>
                <p className="text-xs text-muted-foreground">Average Margin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="centers">Profit Centers</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="transfers">Internal Transfers</TabsTrigger>
          <TabsTrigger value="reports">Profitability Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="centers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profit Center Management</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: 'Filter Options',
                        description: 'Opening filter options for profit centers',
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
                        New Profit Center
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Profit Center</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="profitCenterCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Profit Center Code</FormLabel>
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
                            name="manager"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Manager</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="businessSegment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Business Segment</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select segment" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Regional Operations">Regional Operations</SelectItem>
                                    <SelectItem value="Product Lines">Product Lines</SelectItem>
                                    <SelectItem value="Services">Services</SelectItem>
                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                    <SelectItem value="Distribution">Distribution</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="targetProfit"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Target Profit</FormLabel>
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
                            <Button type="submit">Create Profit Center</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={profitCenterColumns} data={profitCenters} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Performance Analysis</CardTitle>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Analysis
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={performanceColumns} data={performance} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Internal Transfer Pricing</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Transfer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={transferColumns} data={transfers} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Profitability Ranking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>1. North America Ops</span>
                    <span className="font-semibold text-green-600">28.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2. Product Line A</span>
                    <span className="font-semibold text-green-600">25.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3. Enterprise Services</span>
                    <span className="font-semibold text-green-600">25.0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Target vs Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>North America</span>
                    <span className="font-semibold text-red-600">-6.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Product Line A</span>
                    <span className="font-semibold text-red-600">-10.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enterprise Services</span>
                    <span className="font-semibold text-red-600">-6.3%</span>
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
            <DialogTitle>Edit Profit Center</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
              <FormField
                control={form.control}
                name="profitCenterCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profit Center Code</FormLabel>
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
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessSegment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Segment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select segment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Regional Operations">Regional Operations</SelectItem>
                        <SelectItem value="Product Lines">Product Lines</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Distribution">Distribution</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetProfit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Profit</FormLabel>
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
                <Button type="submit">Update Profit Center</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfitCenterAccounting;
