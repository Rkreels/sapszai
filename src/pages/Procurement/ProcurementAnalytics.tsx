
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, TrendingUp, DollarSign, Users, Package, BarChart3 } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { useToast } from '../../hooks/use-toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const ProcurementAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Procurement Analytics. Analyze spending patterns, supplier performance, and cost savings achievements.');
    }
  }, [isEnabled, speak]);

  const spendingTrends = [
    { month: 'Jan', totalSpend: 2100000, planned: 2200000, savings: 150000 },
    { month: 'Feb', totalSpend: 2300000, planned: 2400000, savings: 180000 },
    { month: 'Mar', totalSpend: 1950000, planned: 2100000, savings: 165000 },
    { month: 'Apr', totalSpend: 2450000, planned: 2500000, savings: 210000 },
    { month: 'May', totalSpend: 2200000, planned: 2350000, savings: 195000 },
    { month: 'Jun', totalSpend: 1800000, planned: 2000000, savings: 220000 }
  ];

  const categoryData = [
    { name: 'IT Equipment', value: 4500000, color: '#8884d8' },
    { name: 'Office Supplies', value: 850000, color: '#82ca9d' },
    { name: 'Services', value: 2200000, color: '#ffc658' },
    { name: 'Manufacturing', value: 3100000, color: '#ff7300' },
    { name: 'Maintenance', value: 1200000, color: '#8dd1e1' }
  ];

  const supplierPerformance = [
    { supplier: 'Dell Technologies', orders: 45, onTime: 95, quality: 4.7, spend: 275000 },
    { supplier: 'Office Depot', orders: 78, onTime: 92, quality: 4.3, spend: 89000 },
    { supplier: 'Safety First Corp', orders: 23, onTime: 98, quality: 4.9, spend: 156000 },
    { supplier: 'Global Services', orders: 34, onTime: 88, quality: 4.1, spend: 198000 }
  ];

  const kpiData = [
    { title: 'Total Spend YTD', value: '$12.8M', change: '+8.5%', icon: DollarSign, trend: 'up' },
    { title: 'Cost Savings', value: '$1.2M', change: '+15.3%', icon: TrendingUp, trend: 'up' },
    { title: 'Active Suppliers', value: '347', change: '+5.2%', icon: Users, trend: 'up' },
    { title: 'Purchase Orders', value: '1,234', change: '-2.1%', icon: Package, trend: 'down' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/procurement')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Procurement Analytics"
          description="Analyze spending patterns, supplier performance, and procurement KPIs"
          voiceIntroduction="Welcome to Procurement Analytics for comprehensive procurement insights."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className="text-sm text-muted-foreground">{kpi.title}</div>
                  <div className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </div>
                </div>
                <kpi.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={spendingTrends}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                    <Legend />
                    <Line type="monotone" dataKey="totalSpend" stroke="#8884d8" name="Actual Spend" />
                    <Line type="monotone" dataKey="planned" stroke="#82ca9d" name="Planned Spend" />
                    <Line type="monotone" dataKey="savings" stroke="#ffc658" name="Savings" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spend by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Spend']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded bg-green-50">
                  <h4 className="font-semibold text-green-800 mb-2">Savings Achievement</h4>
                  <p className="text-sm">Cost savings exceeded target by 15.3%, driven by strategic sourcing initiatives.</p>
                </div>
                <div className="p-4 border rounded bg-blue-50">
                  <h4 className="font-semibold text-blue-800 mb-2">Supplier Consolidation</h4>
                  <p className="text-sm">Reduced supplier base by 12% while maintaining quality and delivery standards.</p>
                </div>
                <div className="p-4 border rounded bg-orange-50">
                  <h4 className="font-semibold text-orange-800 mb-2">Process Efficiency</h4>
                  <p className="text-sm">Purchase order cycle time reduced by 25% through automation improvements.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={spendingTrends}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="totalSpend" fill="#8884d8" name="Actual Spend" />
                  <Bar dataKey="planned" fill="#82ca9d" name="Planned Spend" />
                  <Bar dataKey="savings" fill="#ffc658" name="Savings Achieved" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => {
                    const percentage = Math.round((category.value / categoryData.reduce((sum, c) => sum + c.value, 0)) * 100);
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{category.name}</span>
                          <span className="font-medium">${(category.value / 1000000).toFixed(1)}M ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: category.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold">87%</div>
                    <div className="text-sm text-muted-foreground">Budget Utilization</div>
                    <div className="text-sm text-orange-600">Within target range</div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold">$1.8M</div>
                    <div className="text-sm text-muted-foreground">Remaining Budget</div>
                    <div className="text-sm text-blue-600">Available for Q4</div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold">+5.2%</div>
                    <div className="text-sm text-muted-foreground">Variance</div>
                    <div className="text-sm text-green-600">Under budget</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Supplier Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={supplierPerformance}>
                  <XAxis dataKey="supplier" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="onTime" fill="#8884d8" name="On-Time Delivery %" />
                  <Bar dataKey="quality" fill="#82ca9d" name="Quality Rating" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Concentration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplierPerformance.map((supplier, index) => {
                    const totalSpend = supplierPerformance.reduce((sum, s) => sum + s.spend, 0);
                    const percentage = Math.round((supplier.spend / totalSpend) * 100);
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{supplier.supplier}</span>
                          <span className="font-medium">${supplier.spend.toLocaleString()} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded bg-green-50">
                    <h4 className="font-semibold text-green-800">Low Risk</h4>
                    <p className="text-sm">285 suppliers (82%)</p>
                  </div>
                  <div className="p-4 border rounded bg-yellow-50">
                    <h4 className="font-semibold text-yellow-800">Medium Risk</h4>
                    <p className="text-sm">45 suppliers (13%)</p>
                  </div>
                  <div className="p-4 border rounded bg-red-50">
                    <h4 className="font-semibold text-red-800">High Risk</h4>
                    <p className="text-sm">17 suppliers (5%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Process Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-muted-foreground">PO Automation Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">3.2</div>
                    <div className="text-sm text-muted-foreground">Avg Days to Process</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">98%</div>
                    <div className="text-sm text-muted-foreground">Invoice Match Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">96%</div>
                    <div className="text-sm text-muted-foreground">Contract Compliance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">89%</div>
                    <div className="text-sm text-muted-foreground">Policy Adherence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">12</div>
                    <div className="text-sm text-muted-foreground">Audit Findings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">4.6</div>
                    <div className="text-sm text-muted-foreground">Avg Quality Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">92%</div>
                    <div className="text-sm text-muted-foreground">On-Time Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">2.1%</div>
                    <div className="text-sm text-muted-foreground">Defect Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={[
                  ...spendingTrends,
                  { month: 'Jul', totalSpend: 2100000, planned: 2200000, forecast: 2050000 },
                  { month: 'Aug', totalSpend: null, planned: 2300000, forecast: 2180000 },
                  { month: 'Sep', totalSpend: null, planned: 2250000, forecast: 2200000 },
                  { month: 'Oct', totalSpend: null, planned: 2400000, forecast: 2300000 }
                ]}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                  <Legend />
                  <Line type="monotone" dataKey="totalSpend" stroke="#8884d8" name="Actual" strokeDasharray="0" />
                  <Line type="monotone" dataKey="forecast" stroke="#ff7300" name="Forecast" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="planned" stroke="#82ca9d" name="Planned" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Forecast Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold">91%</div>
                    <div className="text-sm text-muted-foreground">Forecast Accuracy</div>
                    <div className="text-sm text-green-600">Excellent performance</div>
                  </div>
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold">±5.2%</div>
                    <div className="text-sm text-muted-foreground">Average Variance</div>
                    <div className="text-sm text-blue-600">Within tolerance</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trend Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded bg-blue-50">
                    <h4 className="font-semibold text-blue-800">Q4 Outlook</h4>
                    <p className="text-sm">Expected 8% increase in IT spending due to digital transformation projects.</p>
                  </div>
                  <div className="p-4 border rounded bg-green-50">
                    <h4 className="font-semibold text-green-800">Cost Optimization</h4>
                    <p className="text-sm">Projected additional 5% savings through strategic sourcing initiatives.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcurementAnalytics;
