
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Search, Plus, Filter, Edit, Trash2, Download, Upload, Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import DataTable from '../../components/data/DataTable';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface CommissionRecord {
  id: string;
  salesRep: string;
  salesRepId: string;
  period: string;
  totalSales: number;
  commissionRate: number;
  commissionAmount: number;
  bonus: number;
  totalEarnings: number;
  status: 'Calculated' | 'Paid' | 'Pending' | 'Disputed';
  paidDate?: string;
  orders: string[];
}

interface CommissionPlan {
  id: string;
  name: string;
  type: 'Flat Rate' | 'Tiered' | 'Progressive';
  baseRate: number;
  tiers?: CommissionTier[];
  isActive: boolean;
}

interface CommissionTier {
  minAmount: number;
  maxAmount?: number;
  rate: number;
}

const Commission: React.FC = () => {
  const [activeTab, setActiveTab] = useState('records');
  const [commissionRecords, setCommissionRecords] = useState<CommissionRecord[]>([]);
  const [commissionPlans, setCommissionPlans] = useState<CommissionPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<CommissionRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const sampleRecords: CommissionRecord[] = [
      {
        id: 'COM-2025-001',
        salesRep: 'Sarah Johnson',
        salesRepId: 'REP-001',
        period: '2025-05',
        totalSales: 285000,
        commissionRate: 8.5,
        commissionAmount: 24225,
        bonus: 2000,
        totalEarnings: 26225,
        status: 'Paid',
        paidDate: '2025-06-05',
        orders: ['SO-2025-001', 'SO-2025-005', 'SO-2025-012']
      },
      {
        id: 'COM-2025-002',
        salesRep: 'Mike Wilson',
        salesRepId: 'REP-002',
        period: '2025-05',
        totalSales: 245000,
        commissionRate: 7.5,
        commissionAmount: 18375,
        bonus: 1500,
        totalEarnings: 19875,
        status: 'Calculated',
        orders: ['SO-2025-003', 'SO-2025-008', 'SO-2025-015']
      },
      {
        id: 'COM-2025-003',
        salesRep: 'Lisa Chen',
        salesRepId: 'REP-003',
        period: '2025-05',
        totalSales: 195000,
        commissionRate: 6.5,
        commissionAmount: 12675,
        bonus: 1000,
        totalEarnings: 13675,
        status: 'Pending',
        orders: ['SO-2025-007', 'SO-2025-011']
      },
      {
        id: 'COM-2025-004',
        salesRep: 'David Brown',
        salesRepId: 'REP-004',
        period: '2025-05',
        totalSales: 175000,
        commissionRate: 6.0,
        commissionAmount: 10500,
        bonus: 500,
        totalEarnings: 11000,
        status: 'Calculated',
        orders: ['SO-2025-009', 'SO-2025-014']
      }
    ];

    const samplePlans: CommissionPlan[] = [
      {
        id: 'PLAN-001',
        name: 'Standard Sales Plan',
        type: 'Tiered',
        baseRate: 5.0,
        isActive: true,
        tiers: [
          { minAmount: 0, maxAmount: 100000, rate: 5.0 },
          { minAmount: 100000, maxAmount: 200000, rate: 7.0 },
          { minAmount: 200000, rate: 8.5 }
        ]
      },
      {
        id: 'PLAN-002',
        name: 'New Rep Plan',
        type: 'Flat Rate',
        baseRate: 6.0,
        isActive: true
      },
      {
        id: 'PLAN-003',
        name: 'Senior Rep Plan',
        type: 'Progressive',
        baseRate: 8.0,
        isActive: true,
        tiers: [
          { minAmount: 0, maxAmount: 150000, rate: 8.0 },
          { minAmount: 150000, maxAmount: 300000, rate: 9.0 },
          { minAmount: 300000, rate: 10.0 }
        ]
      }
    ];

    setTimeout(() => {
      setCommissionRecords(sampleRecords);
      setCommissionPlans(samplePlans);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredRecords = commissionRecords.filter(record => {
    const matchesSearch = record.salesRep.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status.toLowerCase() === filterStatus;
    const matchesPeriod = filterPeriod === 'all' || record.period === filterPeriod;
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const handleCalculateCommissions = () => {
    toast({
      title: 'Commissions Calculated',
      description: 'Commission calculations have been updated for all sales representatives.',
    });
  };

  const handlePayCommissions = () => {
    toast({
      title: 'Commissions Processed',
      description: 'Commission payments have been initiated.',
    });
  };

  const handleEditRecord = (record: CommissionRecord) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const recordColumns = [
    { key: 'id', header: 'Commission ID' },
    { key: 'salesRep', header: 'Sales Rep' },
    { key: 'period', header: 'Period' },
    { 
      key: 'totalSales', 
      header: 'Total Sales',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'commissionRate', 
      header: 'Rate',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'totalEarnings', 
      header: 'Total Earnings',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Paid' ? 'default' : 
          value === 'Calculated' ? 'secondary' : 
          value === 'Disputed' ? 'destructive' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: CommissionRecord) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditRecord(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const planColumns = [
    { key: 'name', header: 'Plan Name' },
    { key: 'type', header: 'Type' },
    { 
      key: 'baseRate', 
      header: 'Base Rate',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'isActive', 
      header: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: CommissionPlan) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const commissionMetrics = [
    { 
      title: 'Total Commissions', 
      value: `$${commissionRecords.reduce((sum, r) => sum + r.totalEarnings, 0).toLocaleString()}`, 
      change: '+12.5%',
      icon: DollarSign
    },
    { 
      title: 'Paid This Month', 
      value: `$${commissionRecords.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.totalEarnings, 0).toLocaleString()}`, 
      change: '+8.2%',
      icon: TrendingUp
    },
    { 
      title: 'Pending Payment', 
      value: `$${commissionRecords.filter(r => r.status === 'Calculated' || r.status === 'Pending').reduce((sum, r) => sum + r.totalEarnings, 0).toLocaleString()}`, 
      change: '+15.7%',
      icon: Calculator
    },
    { 
      title: 'Active Reps', 
      value: commissionRecords.length.toString(), 
      change: '+3.1%',
      icon: TrendingUp
    }
  ];

  const monthlyCommissionData = [
    { month: 'Jan', total: 89500, paid: 89500 },
    { month: 'Feb', total: 92000, paid: 92000 },
    { month: 'Mar', total: 87500, paid: 87500 },
    { month: 'Apr', total: 95000, paid: 95000 },
    { month: 'May', total: 70775, paid: 26225 },
  ];

  const salesRepData = commissionRecords.map(record => ({
    name: record.salesRep,
    sales: record.totalSales,
    commission: record.totalEarnings
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Commission Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCalculateCommissions}>
            <Calculator className="h-4 w-4 mr-2" />
            Calculate
          </Button>
          <Button variant="outline" onClick={handlePayCommissions}>
            <DollarSign className="h-4 w-4 mr-2" />
            Process Payments
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {commissionMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-green-600">{metric.change}</div>
                </div>
                <metric.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="records">Commission Records</TabsTrigger>
          <TabsTrigger value="plans">Commission Plans</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search records..." 
                      className="pl-8 w-80"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="calculated">Calculated</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Periods</SelectItem>
                      <SelectItem value="2025-05">May 2025</SelectItem>
                      <SelectItem value="2025-04">April 2025</SelectItem>
                      <SelectItem value="2025-03">March 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable columns={recordColumns} data={filteredRecords} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Commission Plans</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable columns={planColumns} data={commissionPlans} />
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {commissionPlans.filter(p => p.isActive).map(plan => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <Badge variant="outline">{plan.type}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Base Rate:</span>
                      <span className="ml-2 font-medium">{plan.baseRate}%</span>
                    </div>
                    {plan.tiers && (
                      <div>
                        <span className="text-sm text-muted-foreground">Tiers:</span>
                        <div className="mt-1 space-y-1">
                          {plan.tiers.map((tier, index) => (
                            <div key={index} className="text-xs">
                              ${tier.minAmount.toLocaleString()}{tier.maxAmount ? ` - $${tier.maxAmount.toLocaleString()}` : '+'}: {tier.rate}%
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Commission Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyCommissionData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Commissions" />
                    <Line type="monotone" dataKey="paid" stroke="#82ca9d" name="Paid Commissions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Rep Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesRepData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                    <Bar dataKey="commission" fill="#82ca9d" name="Commission" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="salesAmount">Sales Amount</Label>
                    <Input id="salesAmount" type="number" placeholder="Enter sales amount" />
                  </div>
                  <div>
                    <Label htmlFor="commissionPlan">Commission Plan</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {commissionPlans.filter(p => p.isActive).map(plan => (
                          <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bonus">Bonus Amount</Label>
                    <Input id="bonus" type="number" placeholder="Enter bonus amount" />
                  </div>
                  <Button className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Commission
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-4">Calculation Result</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sales Amount:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commission Rate:</span>
                      <span>0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commission Amount:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonus:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Earnings:</span>
                        <span>$0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Monthly Commission Summary</span>
                  <span className="text-xs text-muted-foreground">Detailed monthly breakdown</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Sales Rep Performance</span>
                  <span className="text-xs text-muted-foreground">Individual performance metrics</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Commission Variance Report</span>
                  <span className="text-xs text-muted-foreground">Plan comparison analysis</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Annual Commission Summary</span>
                  <span className="text-xs text-muted-foreground">Year-to-date overview</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Commission Record Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sales Representative</Label>
                  <div className="font-medium">{selectedRecord.salesRep}</div>
                </div>
                <div>
                  <Label>Period</Label>
                  <div className="font-medium">{selectedRecord.period}</div>
                </div>
                <div>
                  <Label>Total Sales</Label>
                  <div className="font-medium">${selectedRecord.totalSales.toLocaleString()}</div>
                </div>
                <div>
                  <Label>Commission Rate</Label>
                  <div className="font-medium">{selectedRecord.commissionRate}%</div>
                </div>
                <div>
                  <Label>Commission Amount</Label>
                  <div className="font-medium">${selectedRecord.commissionAmount.toLocaleString()}</div>
                </div>
                <div>
                  <Label>Bonus</Label>
                  <div className="font-medium">${selectedRecord.bonus.toLocaleString()}</div>
                </div>
              </div>
              <div>
                <Label>Related Orders</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedRecord.orders.map(order => (
                    <Badge key={order} variant="outline">{order}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button>
                  Edit Record
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Commission;
