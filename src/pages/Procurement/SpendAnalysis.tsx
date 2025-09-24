import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, TrendingUp, DollarSign, BarChart3, PieChart } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { useToast } from '../../hooks/use-toast';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const SpendAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Spend Analysis. Analyze procurement spending patterns, identify cost savings opportunities, and track budget performance.');
    }
  }, [isEnabled, speak]);

  const spendData = [
    { month: 'Jan', spend: 2100000, budget: 2500000, savings: 210000 },
    { month: 'Feb', spend: 2300000, budget: 2500000, savings: 230000 },
    { month: 'Mar', spend: 1950000, budget: 2500000, savings: 195000 },
    { month: 'Apr', spend: 2450000, budget: 2500000, savings: 245000 },
    { month: 'May', spend: 2200000, budget: 2500000, savings: 220000 },
    { month: 'Jun', spend: 1800000, budget: 2500000, savings: 180000 }
  ];

  const categorySpend = [
    { name: 'IT Equipment', value: 4500000, color: '#8884d8' },
    { name: 'Office Supplies', value: 850000, color: '#82ca9d' },
    { name: 'Services', value: 2200000, color: '#ffc658' },
    { name: 'Manufacturing', value: 3100000, color: '#ff7300' },
    { name: 'Maintenance', value: 1200000, color: '#8dd1e1' }
  ];

  const supplierSpend = [
    { supplier: 'Dell Technologies', spend: 1250000, percentage: 15.2 },
    { supplier: 'Microsoft Corp', spend: 890000, percentage: 10.8 },
    { supplier: 'Oracle Corp', spend: 750000, percentage: 9.1 },
    { supplier: 'Acme Manufacturing', spend: 650000, percentage: 7.9 },
    { supplier: 'Global Services Ltd', spend: 580000, percentage: 7.0 }
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
          title="Spend Analysis"
          description="Analyze procurement spending patterns and identify cost optimization opportunities"
          voiceIntroduction="Welcome to Spend Analysis for comprehensive spending insights."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">$12.8M</div>
            <div className="text-sm text-muted-foreground">Total Spend YTD</div>
            <div className="text-sm text-green-600">+8.5% vs last year</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">$1.2M</div>
            <div className="text-sm text-muted-foreground">Cost Savings</div>
            <div className="text-sm text-green-600">15.3% improvement</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">87%</div>
            <div className="text-sm text-muted-foreground">Budget Utilization</div>
            <div className="text-sm text-orange-600">Within target</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">245</div>
            <div className="text-sm text-muted-foreground">Active Suppliers</div>
            <div className="text-sm text-blue-600">Well diversified</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Spending Trends</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="suppliers">By Supplier</TabsTrigger>
          <TabsTrigger value="savings">Savings Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Spend vs Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={spendData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                    <Legend />
                    <Line type="monotone" dataKey="spend" stroke="#8884d8" name="Actual Spend" />
                    <Line type="monotone" dataKey="budget" stroke="#82ca9d" name="Budget" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Spend by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={categorySpend}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categorySpend.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Spend']} />
                  </RechartsPieChart>
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
                <div className="p-4 border rounded">
                  <h4 className="font-semibold mb-2 text-green-600">Cost Savings Opportunity</h4>
                  <p className="text-sm">IT Equipment category shows 12% potential savings through bulk purchasing agreements.</p>
                </div>
                <div className="p-4 border rounded">
                  <h4 className="font-semibold mb-2 text-orange-600">Budget Alert</h4>
                  <p className="text-sm">Services category is trending 15% over budget. Consider contract renegotiation.</p>
                </div>
                <div className="p-4 border rounded">
                  <h4 className="font-semibold mb-2 text-blue-600">Supplier Optimization</h4>
                  <p className="text-sm">Top 10 suppliers account for 78% of spend. Consider strategic partnerships.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={spendData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="spend" fill="#8884d8" name="Actual Spend" />
                  <Bar dataKey="budget" fill="#82ca9d" name="Budget" />
                  <Bar dataKey="savings" fill="#ffc658" name="Savings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categorySpend.map((category, index) => (
                  <div key={index} className="p-4 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{category.name}</h4>
                      <Badge variant="outline">${(category.value / 1000000).toFixed(1)}M</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Budget Utilization</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: '85%',
                            backgroundColor: category.color 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Optimize</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Suppliers by Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplierSpend.map((supplier, index) => (
                  <div key={index} className="p-4 border rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{supplier.supplier}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${supplier.spend.toLocaleString()} ({supplier.percentage}% of total spend)
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="outline">Negotiate</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Savings Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Realized Savings</h4>
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold text-green-600">$1.2M</div>
                    <div className="text-sm text-muted-foreground">YTD Savings</div>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Contract Negotiations:</span>
                        <span>$650K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Volume Discounts:</span>
                        <span>$350K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Process Improvements:</span>
                        <span>$200K</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Potential Savings</h4>
                  <div className="p-4 border rounded">
                    <div className="text-2xl font-bold text-orange-600">$850K</div>
                    <div className="text-sm text-muted-foreground">Identified Opportunities</div>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Supplier Consolidation:</span>
                        <span>$400K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Alternative Sourcing:</span>
                        <span>$300K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Specification Changes:</span>
                        <span>$150K</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpendAnalysis;
