import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Download, Filter, Calendar, Building, DollarSign, TrendingDown, BarChart } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import DataTable, { Column } from '../../components/data/DataTable';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';

interface Asset {
  id: string;
  assetNumber: string;
  description: string;
  assetClass: string;
  acquisitionValue: number;
  acquisitionDate: string;
  usefulLife: number;
  depreciationMethod: string;
  accumulatedDepreciation: number;
  bookValue: number;
  status: string;
  costCenter: string;
}

interface AssetFormData {
  assetNumber: string;
  description: string;
  assetClass: string;
  acquisitionValue: string;
  usefulLife: string;
  depreciationMethod: string;
  costCenter: string;
}

const AssetAccounting: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('assets');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const form = useForm<AssetFormData>({
    defaultValues: {
      assetNumber: '',
      description: '',
      assetClass: '',
      acquisitionValue: '',
      usefulLife: '',
      depreciationMethod: '',
      costCenter: ''
    }
  });

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now in Asset Accounting. Here you can manage fixed assets, depreciation, and asset lifecycle.');
    }
  }, [isEnabled, speak]);

  const [assets, setAssets] = useState([
    { 
      id: 'AS-001',
      assetNumber: 'EQ-001',
      description: 'Manufacturing Equipment A',
      assetClass: 'Machinery',
      acquisitionValue: 250000,
      acquisitionDate: '2023-01-15',
      usefulLife: 10,
      depreciationMethod: 'Straight Line',
      accumulatedDepreciation: 25000,
      bookValue: 225000,
      status: 'Active',
      costCenter: 'Production'
    },
    { 
      id: 'AS-002',
      assetNumber: 'IT-001',
      description: 'Server Infrastructure',
      assetClass: 'IT Equipment',
      acquisitionValue: 150000,
      acquisitionDate: '2022-06-01',
      usefulLife: 5,
      depreciationMethod: 'Straight Line',
      accumulatedDepreciation: 60000,
      bookValue: 90000,
      status: 'Active',
      costCenter: 'IT'
    },
    { 
      id: 'AS-003',
      assetNumber: 'VH-001',
      description: 'Delivery Truck Fleet',
      assetClass: 'Vehicles',
      acquisitionValue: 85000,
      acquisitionDate: '2021-03-10',
      usefulLife: 8,
      depreciationMethod: 'Declining Balance',
      accumulatedDepreciation: 35000,
      bookValue: 50000,
      status: 'Active',
      costCenter: 'Logistics'
    }
  ]);

  const [depreciation, setDepreciation] = useState([
    { id: 'DEP-001', period: '2024-05', assetNumber: 'EQ-001', depreciationAmount: 2083.33, method: 'Straight Line', status: 'Posted' },
    { id: 'DEP-002', period: '2024-05', assetNumber: 'IT-001', depreciationAmount: 2500.00, method: 'Straight Line', status: 'Posted' },
    { id: 'DEP-003', period: '2024-05', assetNumber: 'VH-001', depreciationAmount: 850.00, method: 'Declining Balance', status: 'Posted' },
    { id: 'DEP-004', period: '2024-06', assetNumber: 'EQ-001', depreciationAmount: 2083.33, method: 'Straight Line', status: 'Calculated' }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 'TXN-001', date: '2024-05-20', assetNumber: 'EQ-001', transactionType: 'Acquisition', amount: 250000, description: 'Initial Purchase' },
    { id: 'TXN-002', date: '2024-05-15', assetNumber: 'IT-001', transactionType: 'Depreciation', amount: -2500, description: 'Monthly Depreciation' },
    { id: 'TXN-003', date: '2024-05-10', assetNumber: 'VH-001', transactionType: 'Maintenance', amount: 1500, description: 'Engine Repair' },
    { id: 'TXN-004', date: '2024-05-05', assetNumber: 'EQ-001', transactionType: 'Depreciation', amount: -2083.33, description: 'Monthly Depreciation' }
  ]);

  const handleCreate = (data: AssetFormData) => {
    const newAsset = {
      id: `AS-${String(assets.length + 1).padStart(3, '0')}`,
      assetNumber: data.assetNumber,
      description: data.description,
      assetClass: data.assetClass,
      acquisitionValue: parseFloat(data.acquisitionValue),
      acquisitionDate: new Date().toISOString().split('T')[0],
      usefulLife: parseInt(data.usefulLife),
      depreciationMethod: data.depreciationMethod,
      accumulatedDepreciation: 0,
      bookValue: parseFloat(data.acquisitionValue),
      status: 'Active',
      costCenter: data.costCenter
    };
    setAssets([...assets, newAsset]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    form.reset({
      assetNumber: asset.assetNumber,
      description: asset.description,
      assetClass: asset.assetClass,
      acquisitionValue: asset.acquisitionValue.toString(),
      usefulLife: asset.usefulLife.toString(),
      depreciationMethod: asset.depreciationMethod,
      costCenter: asset.costCenter
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: AssetFormData) => {
    setAssets(assets.map(a => 
      a.id === selectedAsset?.id 
        ? { 
            ...a, 
            assetNumber: data.assetNumber,
            description: data.description,
            assetClass: data.assetClass,
            acquisitionValue: parseFloat(data.acquisitionValue),
            usefulLife: parseInt(data.usefulLife),
            depreciationMethod: data.depreciationMethod,
            costCenter: data.costCenter,
            bookValue: parseFloat(data.acquisitionValue) - a.accumulatedDepreciation
          } 
        : a
    ));
    setIsEditDialogOpen(false);
    setSelectedAsset(null);
  };

  const handleDelete = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const assetColumns: Column[] = [
    { key: 'assetNumber', header: 'Asset Number' },
    { key: 'description', header: 'Description' },
    { key: 'assetClass', header: 'Asset Class' },
    { 
      key: 'acquisitionValue', 
      header: 'Acquisition Value',
      render: (value) => `$${value.toLocaleString()}`
    },
    { 
      key: 'bookValue', 
      header: 'Book Value',
      render: (value) => `$${value.toLocaleString()}`
    },
    { key: 'usefulLife', header: 'Useful Life (Years)' },
    { key: 'depreciationMethod', header: 'Depreciation Method' },
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
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      )
    }
  ];

  const depreciationColumns: Column[] = [
    { key: 'period', header: 'Period' },
    { key: 'assetNumber', header: 'Asset Number' },
    { 
      key: 'depreciationAmount', 
      header: 'Depreciation Amount',
      render: (value) => `$${value.toLocaleString()}`
    },
    { key: 'method', header: 'Method' },
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
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
        </div>
      )
    }
  ];

  const transactionColumns: Column[] = [
    { key: 'date', header: 'Transaction Date' },
    { key: 'assetNumber', header: 'Asset Number' },
    { key: 'transactionType', header: 'Transaction Type' },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (value) => `$${value.toLocaleString()}`
    },
    { key: 'description', header: 'Description' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
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
          title="Asset Accounting"
          description="Manage fixed assets, depreciation, and asset lifecycle"
          voiceIntroduction="Welcome to Asset Accounting. Manage your organization's fixed assets and depreciation."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{assets.length}</p>
                <p className="text-xs text-muted-foreground">Total Assets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">$485K</p>
                <p className="text-xs text-muted-foreground">Total Acquisition Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">$120K</p>
                <p className="text-xs text-muted-foreground">Accumulated Depreciation</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">$365K</p>
                <p className="text-xs text-muted-foreground">Net Book Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets">Asset Management</TabsTrigger>
          <TabsTrigger value="depreciation">Depreciation</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Fixed Assets</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Asset
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Asset</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="assetNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Asset Number</FormLabel>
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
                            name="assetClass"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Asset Class</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select asset class" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Machinery">Machinery</SelectItem>
                                    <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                                    <SelectItem value="Vehicles">Vehicles</SelectItem>
                                    <SelectItem value="Building">Building</SelectItem>
                                    <SelectItem value="Furniture">Furniture</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="acquisitionValue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Acquisition Value</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="usefulLife"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Useful Life (Years)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="depreciationMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Depreciation Method</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Straight Line">Straight Line</SelectItem>
                                    <SelectItem value="Declining Balance">Declining Balance</SelectItem>
                                    <SelectItem value="Units of Production">Units of Production</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="costCenter"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cost Center</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select cost center" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Production">Production</SelectItem>
                                    <SelectItem value="IT">IT</SelectItem>
                                    <SelectItem value="Logistics">Logistics</SelectItem>
                                    <SelectItem value="Administration">Administration</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Create Asset</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={assetColumns} data={assets} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depreciation" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Depreciation Schedule</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Run Depreciation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={depreciationColumns} data={depreciation} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Asset Transactions</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Transaction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={transactionColumns} data={transactions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Acquisition Cost</span>
                    <span className="font-semibold">$485,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accumulated Depreciation</span>
                    <span className="font-semibold">$120,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Book Value</span>
                    <span className="font-semibold text-green-600">$365,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Depreciation</span>
                    <span className="font-semibold">$5,433</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Asset Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Machinery</span>
                    <span className="font-semibold">$225,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IT Equipment</span>
                    <span className="font-semibold">$90,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicles</span>
                    <span className="font-semibold">$50,000</span>
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
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
              <FormField
                control={form.control}
                name="assetNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Number</FormLabel>
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
                name="assetClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Machinery">Machinery</SelectItem>
                        <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                        <SelectItem value="Vehicles">Vehicles</SelectItem>
                        <SelectItem value="Building">Building</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acquisitionValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acquisition Value</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usefulLife"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Useful Life (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="depreciationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciation Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Straight Line">Straight Line</SelectItem>
                        <SelectItem value="Declining Balance">Declining Balance</SelectItem>
                        <SelectItem value="Units of Production">Units of Production</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costCenter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Center</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cost center" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Logistics">Logistics</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Asset</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetAccounting;
