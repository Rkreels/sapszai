
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Search, Plus, Filter, Edit, Trash2, MapPin, Users, TrendingUp, Target } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import DataTable from '../../components/data/DataTable';
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface Territory {
  id: string;
  name: string;
  region: string;
  salesRep: string;
  salesRepId: string;
  manager: string;
  countries: string[];
  states: string[];
  cities: string[];
  customers: number;
  prospects: number;
  revenue: number;
  target: number;
  achievement: number;
  lastQuarter: number;
  growth: number;
  status: 'Active' | 'Inactive' | 'Pending';
}

interface TerritoryRule {
  id: string;
  name: string;
  type: 'Geographic' | 'Industry' | 'Company Size' | 'Revenue';
  criteria: string;
  priority: number;
  isActive: boolean;
}

const TerritoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('territories');
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [territoryRules, setTerritoryRules] = useState<TerritoryRule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const sampleTerritories: Territory[] = [
      {
        id: 'TERR-001',
        name: 'Northeast USA',
        region: 'North America',
        salesRep: 'Sarah Johnson',
        salesRepId: 'REP-001',
        manager: 'Michael Smith',
        countries: ['United States'],
        states: ['New York', 'Massachusetts', 'Connecticut', 'Vermont', 'New Hampshire', 'Maine'],
        cities: ['New York', 'Boston', 'Hartford', 'Burlington'],
        customers: 145,
        prospects: 67,
        revenue: 2850000,
        target: 2800000,
        achievement: 101.8,
        lastQuarter: 2650000,
        growth: 7.5,
        status: 'Active'
      },
      {
        id: 'TERR-002',
        name: 'California West',
        region: 'North America',
        salesRep: 'Mike Wilson',
        salesRepId: 'REP-002',
        manager: 'Michael Smith',
        countries: ['United States'],
        states: ['California'],
        cities: ['San Francisco', 'Los Angeles', 'San Diego', 'Sacramento'],
        customers: 198,
        prospects: 89,
        revenue: 3240000,
        target: 3200000,
        achievement: 101.3,
        lastQuarter: 3100000,
        growth: 4.5,
        status: 'Active'
      },
      {
        id: 'TERR-003',
        name: 'UK & Ireland',
        region: 'Europe',
        salesRep: 'Lisa Chen',
        salesRepId: 'REP-003',
        manager: 'Emma Davis',
        countries: ['United Kingdom', 'Ireland'],
        states: ['England', 'Scotland', 'Wales'],
        cities: ['London', 'Manchester', 'Edinburgh', 'Dublin'],
        customers: 89,
        prospects: 45,
        revenue: 1950000,
        target: 2000000,
        achievement: 97.5,
        lastQuarter: 1850000,
        growth: 5.4,
        status: 'Active'
      },
      {
        id: 'TERR-004',
        name: 'APAC North',
        region: 'Asia Pacific',
        salesRep: 'David Brown',
        salesRepId: 'REP-004',
        manager: 'Kevin Wong',
        countries: ['Japan', 'South Korea', 'Taiwan'],
        states: [],
        cities: ['Tokyo', 'Seoul', 'Taipei'],
        customers: 67,
        prospects: 34,
        revenue: 1750000,
        target: 1800000,
        achievement: 97.2,
        lastQuarter: 1680000,
        growth: 4.2,
        status: 'Active'
      }
    ];

    const sampleRules: TerritoryRule[] = [
      {
        id: 'RULE-001',
        name: 'Geographic Assignment - US States',
        type: 'Geographic',
        criteria: 'Assign based on state boundaries',
        priority: 1,
        isActive: true
      },
      {
        id: 'RULE-002',
        name: 'Enterprise Accounts',
        type: 'Company Size',
        criteria: 'Companies with >1000 employees',
        priority: 2,
        isActive: true
      },
      {
        id: 'RULE-003',
        name: 'Technology Sector',
        type: 'Industry',
        criteria: 'Technology and software companies',
        priority: 3,
        isActive: true
      },
      {
        id: 'RULE-004',
        name: 'High Revenue Accounts',
        type: 'Revenue',
        criteria: 'Annual revenue >$50M',
        priority: 4,
        isActive: false
      }
    ];

    setTimeout(() => {
      setTerritories(sampleTerritories);
      setTerritoryRules(sampleRules);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredTerritories = territories.filter(territory => {
    const matchesSearch = territory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         territory.salesRep.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || territory.region === filterRegion;
    const matchesStatus = filterStatus === 'all' || territory.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const handleCreateTerritory = () => {
    setSelectedTerritory(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditTerritory = (territory: Territory) => {
    setSelectedTerritory(territory);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteTerritory = (territoryId: string) => {
    setTerritories(prev => prev.filter(t => t.id !== territoryId));
    toast({
      title: 'Territory Deleted',
      description: 'Territory has been successfully removed.',
    });
  };

  const territoryColumns = [
    { key: 'name', header: 'Territory Name' },
    { key: 'region', header: 'Region' },
    { key: 'salesRep', header: 'Sales Rep' },
    { key: 'customers', header: 'Customers' },
    { 
      key: 'revenue', 
      header: 'Revenue',
      render: (value: number) => `$${(value / 1000000).toFixed(1)}M`
    },
    { 
      key: 'achievement', 
      header: 'Achievement',
      render: (value: number) => (
        <Badge variant={value >= 100 ? 'default' : value >= 90 ? 'secondary' : 'destructive'}>
          {value.toFixed(1)}%
        </Badge>
      )
    },
    { 
      key: 'growth', 
      header: 'Growth',
      render: (value: number) => (
        <span className={value >= 0 ? 'text-green-600' : 'text-red-600'}>
          {value >= 0 ? '+' : ''}{value.toFixed(1)}%
        </span>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: Territory) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditTerritory(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteTerritory(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const ruleColumns = [
    { key: 'name', header: 'Rule Name' },
    { key: 'type', header: 'Type' },
    { key: 'criteria', header: 'Criteria' },
    { key: 'priority', header: 'Priority' },
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
      render: (_, row: TerritoryRule) => (
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

  const territoryMetrics = [
    { 
      title: 'Total Territories', 
      value: territories.length.toString(), 
      change: '+2',
      icon: MapPin
    },
    { 
      title: 'Total Customers', 
      value: territories.reduce((sum, t) => sum + t.customers, 0).toString(), 
      change: '+12%',
      icon: Users
    },
    { 
      title: 'Total Revenue', 
      value: `$${(territories.reduce((sum, t) => sum + t.revenue, 0) / 1000000).toFixed(1)}M`, 
      change: '+8.5%',
      icon: TrendingUp
    },
    { 
      title: 'Avg Achievement', 
      value: `${(territories.reduce((sum, t) => sum + t.achievement, 0) / territories.length).toFixed(1)}%`, 
      change: '+2.1%',
      icon: Target
    }
  ];

  const regionData = territories.reduce((acc, territory) => {
    if (!acc[territory.region]) {
      acc[territory.region] = { region: territory.region, revenue: 0, customers: 0, territories: 0 };
    }
    acc[territory.region].revenue += territory.revenue;
    acc[territory.region].customers += territory.customers;
    acc[territory.region].territories += 1;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(regionData);

  const performanceData = territories.map(territory => ({
    name: territory.name,
    achievement: territory.achievement,
    growth: territory.growth,
    revenue: territory.revenue / 1000000
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Territory Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Territory Rules
          </Button>
          <Button onClick={handleCreateTerritory}>
            <Plus className="h-4 w-4 mr-2" />
            Create Territory
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {territoryMetrics.map((metric, index) => (
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
          <TabsTrigger value="territories">Territories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="rules">Assignment Rules</TabsTrigger>
          <TabsTrigger value="planning">Territory Planning</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="territories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Territory Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search territories..." 
                      className="pl-8 w-80"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterRegion} onValueChange={setFilterRegion}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="North America">North America</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                      <SelectItem value="Latin America">Latin America</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable columns={territoryColumns} data={filteredTerritories} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'revenue' ? `$${(Number(value) / 1000000).toFixed(1)}M` : value,
                      name === 'revenue' ? 'Revenue' : name === 'customers' ? 'Customers' : 'Territories'
                    ]} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue (M)" />
                    <Bar dataKey="customers" fill="#82ca9d" name="Customers" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Territory Achievement vs Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="achievement" stroke="#8884d8" name="Achievement %" />
                    <Line type="monotone" dataKey="growth" stroke="#82ca9d" name="Growth %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Territory Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, revenue }) => `${name}: $${revenue.toFixed(1)}M`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(1)}M`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Territory Assignment Rules</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable columns={ruleColumns} data={territoryRules} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rule Execution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Execute territory assignment rules to automatically assign accounts to territories based on configured criteria.
                </p>
                <div className="flex space-x-2">
                  <Button>Run All Rules</Button>
                  <Button variant="outline">Preview Changes</Button>
                  <Button variant="outline">Validate Rules</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Territory Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Analyze and optimize territory boundaries for better coverage and performance.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Analyze Territory Balance
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Suggest Boundary Changes
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Workload Distribution
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacity Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Plan territory capacity and resource allocation.
                  </p>
                  <div className="space-y-3">
                    {territories.map(territory => (
                      <div key={territory.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <div className="font-medium">{territory.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {territory.customers} customers • {territory.prospects} prospects
                          </div>
                        </div>
                        <Badge variant={territory.customers > 150 ? 'destructive' : territory.customers > 100 ? 'secondary' : 'default'}>
                          {territory.customers > 150 ? 'Overloaded' : territory.customers > 100 ? 'High' : 'Normal'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Territory Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Territory Performance</span>
                  <span className="text-xs text-muted-foreground">Detailed performance metrics</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Coverage Analysis</span>
                  <span className="text-xs text-muted-foreground">Market coverage assessment</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Sales Rep Workload</span>
                  <span className="text-xs text-muted-foreground">Workload distribution analysis</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <span>Territory Comparison</span>
                  <span className="text-xs text-muted-foreground">Side-by-side territory comparison</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Territory' : 'Create New Territory'}</DialogTitle>
          </DialogHeader>
          <TerritoryForm 
            territory={selectedTerritory}
            onSave={(territoryData) => {
              if (isEditing && selectedTerritory) {
                setTerritories(prev => prev.map(t => 
                  t.id === selectedTerritory.id ? { ...t, ...territoryData } : t
                ));
                toast({ title: 'Territory Updated', description: 'Territory has been successfully updated.' });
              } else {
                const newTerritory: Territory = {
                  id: `TERR-${String(territories.length + 1).padStart(3, '0')}`,
                  customers: 0,
                  prospects: 0,
                  revenue: 0,
                  achievement: 0,
                  lastQuarter: 0,
                  growth: 0,
                  countries: [],
                  states: [],
                  cities: [],
                  ...territoryData as Territory
                };
                setTerritories(prev => [...prev, newTerritory]);
                toast({ title: 'Territory Created', description: 'New territory has been successfully created.' });
              }
              setIsDialogOpen(false);
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TerritoryForm: React.FC<{
  territory: Territory | null;
  onSave: (data: Partial<Territory>) => void;
  onCancel: () => void;
}> = ({ territory, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: territory?.name || '',
    region: territory?.region || '',
    salesRep: territory?.salesRep || '',
    manager: territory?.manager || '',
    target: territory?.target || 0,
    status: territory?.status || 'Active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Territory Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="North America">North America</SelectItem>
              <SelectItem value="Europe">Europe</SelectItem>
              <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
              <SelectItem value="Latin America">Latin America</SelectItem>
              <SelectItem value="Middle East">Middle East</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="salesRep">Sales Representative</Label>
          <Input
            id="salesRep"
            value={formData.salesRep}
            onChange={(e) => setFormData(prev => ({ ...prev, salesRep: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="manager">Territory Manager</Label>
          <Input
            id="manager"
            value={formData.manager}
            onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="target">Revenue Target</Label>
          <Input
            id="target"
            type="number"
            value={formData.target}
            onChange={(e) => setFormData(prev => ({ ...prev, target: Number(e.target.value) }))}
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Territory
        </Button>
      </div>
    </form>
  );
};

export default TerritoryManagement;
