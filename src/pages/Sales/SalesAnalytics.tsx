
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Download, Filter, TrendingUp, TrendingDown, Calendar, Users, DollarSign, Target } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area, ComposedChart } from 'recharts';

const SalesAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('12months');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Sample data for analytics
  const salesData = [
    { month: 'Jan', revenue: 125000, orders: 45, newCustomers: 12, target: 120000 },
    { month: 'Feb', revenue: 142000, orders: 52, newCustomers: 18, target: 140000 },
    { month: 'Mar', revenue: 138000, orders: 48, newCustomers: 15, target: 135000 },
    { month: 'Apr', revenue: 165000, orders: 61, newCustomers: 22, target: 160000 },
    { month: 'May', revenue: 158000, orders: 55, newCustomers: 19, target: 155000 },
    { month: 'Jun', revenue: 172000, orders: 63, newCustomers: 25, target: 170000 },
    { month: 'Jul', revenue: 145000, orders: 49, newCustomers: 16, target: 150000 },
    { month: 'Aug', revenue: 189000, orders: 68, newCustomers: 28, target: 180000 },
    { month: 'Sep', revenue: 176000, orders: 59, newCustomers: 21, target: 175000 },
    { month: 'Oct', revenue: 195000, orders: 72, newCustomers: 32, target: 190000 },
    { month: 'Nov', revenue: 182000, orders: 64, newCustomers: 24, target: 185000 },
    { month: 'Dec', revenue: 205000, orders: 78, newCustomers: 35, target: 200000 }
  ];

  const productPerformance = [
    { product: 'Enterprise Software', revenue: 450000, units: 125, growth: 15.2 },
    { product: 'Professional Services', revenue: 320000, units: 89, growth: 8.7 },
    { product: 'Hardware Solutions', revenue: 280000, units: 156, growth: -2.3 },
    { product: 'Support Packages', revenue: 180000, units: 234, growth: 22.1 },
    { product: 'Training Services', revenue: 120000, units: 67, growth: 12.8 }
  ];

  const salesRepPerformance = [
    { name: 'Sarah Johnson', revenue: 285000, orders: 45, conversion: 68, target: 280000 },
    { name: 'Mike Wilson', revenue: 245000, orders: 38, conversion: 62, target: 250000 },
    { name: 'Lisa Chen', revenue: 195000, orders: 32, conversion: 58, target: 200000 },
    { name: 'David Brown', revenue: 175000, orders: 28, conversion: 55, target: 180000 },
    { name: 'Emma Davis', revenue: 165000, orders: 25, conversion: 52, target: 170000 }
  ];

  const regionData = [
    { region: 'North America', revenue: 580000, share: 35, color: '#8884d8' },
    { region: 'Europe', revenue: 450000, share: 27, color: '#82ca9d' },
    { region: 'Asia Pacific', revenue: 320000, share: 19, color: '#ffc658' },
    { region: 'Latin America', revenue: 180000, share: 11, color: '#ff7300' },
    { region: 'Middle East', revenue: 130000, share: 8, color: '#00ff88' }
  ];

  const customerSegments = [
    { segment: 'Enterprise', revenue: 850000, customers: 45, avgOrder: 18888 },
    { segment: 'Mid-Market', revenue: 520000, customers: 128, avgOrder: 4062 },
    { segment: 'Small Business', revenue: 280000, customers: 234, avgOrder: 1196 },
    { segment: 'Startup', revenue: 120000, customers: 156, avgOrder: 769 }
  ];

  const kpiMetrics = [
    { title: 'Total Revenue', value: '$2.1M', change: '+18.5%', trend: 'up', icon: DollarSign },
    { title: 'Total Orders', value: '672', change: '+12.3%', trend: 'up', icon: Target },
    { title: 'New Customers', value: '287', change: '+25.7%', trend: 'up', icon: Users },
    { title: 'Avg Order Value', value: '$3,125', change: '+5.2%', trend: 'up', icon: TrendingUp },
    { title: 'Conversion Rate', value: '14.8%', change: '+2.1%', trend: 'up', icon: TrendingUp },
    { title: 'Customer Retention', value: '89.2%', change: '-1.3%', trend: 'down', icon: TrendingDown }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Sales Analytics</h1>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className={`text-sm flex items-center ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    {metric.change}
                  </div>
                </div>
                <metric.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="salesreps">Sales Reps</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Target</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={salesData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Actual Revenue" />
                    <Line type="monotone" dataKey="target" stroke="#ff7300" strokeWidth={2} name="Target" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ region, share }) => `${region} ${share}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={salesData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" name="Revenue" />
                  <Area type="monotone" dataKey="orders" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Orders (scaled)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="newCustomers" fill="#82ca9d" name="New Customers" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformance.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{product.product}</div>
                      <div className="text-sm text-muted-foreground">
                        ${product.revenue.toLocaleString()} revenue • {product.units} units sold
                      </div>
                    </div>
                    <Badge variant={product.growth > 0 ? 'default' : 'destructive'}>
                      {product.growth > 0 ? '+' : ''}{product.growth}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productPerformance}>
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salesreps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Representative Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesRepPerformance.map((rep, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{rep.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ${rep.revenue.toLocaleString()} revenue • {rep.orders} orders • {rep.conversion}% conversion
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(rep.revenue / rep.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <Badge variant={rep.revenue >= rep.target ? 'default' : 'secondary'}>
                      {Math.round((rep.revenue / rep.target) * 100)}% of target
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Rep Revenue Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesRepPerformance}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                  <Bar dataKey="revenue" fill="#8884d8" name="Actual" />
                  <Bar dataKey="target" fill="#82ca9d" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded mr-3" 
                          style={{ backgroundColor: region.color }}
                        ></div>
                        <span>{region.region}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${region.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{region.share}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ region, share }) => `${share}%`}
                    >
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerSegments.map((segment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{segment.segment}</div>
                      <div className="text-sm text-muted-foreground">
                        {segment.customers} customers • Avg order: ${segment.avgOrder.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${segment.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Segment Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerSegments}>
                  <XAxis dataKey="segment" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesAnalytics;
