
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import BarChartComponent from '../../components/charts/BarChartComponent';

const performanceMetrics = [
  { metric: 'Project Success Rate', value: 87, target: 90, trend: '+5%' },
  { metric: 'On-Time Delivery', value: 92, target: 95, trend: '+3%' },
  { metric: 'Budget Adherence', value: 94, target: 90, trend: '+2%' },
  { metric: 'Resource Utilization', value: 78, target: 80, trend: '-1%' },
];

const projectStatusData = [
  { status: 'Completed', count: 24 },
  { status: 'In Progress', count: 12 },
  { status: 'Planning', count: 8 },
  { status: 'On Hold', count: 3 },
];

const budgetAnalysis = [
  { project: 'ERP Implementation', planned: 350000, actual: 320000, variance: -30000 },
  { project: 'Website Redesign', planned: 120000, actual: 115000, variance: -5000 },
  { project: 'Mobile App', planned: 200000, actual: 225000, variance: 25000 },
  { project: 'Data Center', planned: 400000, actual: 380000, variance: -20000 },
];

const ProjectAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Project Analytics. Here you can analyze project performance, track KPIs, monitor trends, and generate comprehensive reports for data-driven decision making.');
    }
  }, [isEnabled, speak]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/project-management')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Project Analytics"
          description="Comprehensive project performance analysis and reporting"
          voiceIntroduction="Welcome to Project Analytics."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <PieChart className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">ROI Average</p>
              <p className="text-2xl font-bold">28%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold">€2.8M</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
              <BarChartComponent
                data={projectStatusData}
                dataKey="count"
                xAxisKey="status"
                height={250}
                color="#4f46e5"
              />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{metric.value}%</span>
                        <span className={`text-xs font-medium ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                    <div className="text-xs text-gray-500">Target: {metric.target}%</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Performance Trend</h4>
                <p className="text-sm text-blue-700">Project delivery performance has improved by 15% over the last quarter</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Budget Efficiency</h4>
                <p className="text-sm text-green-700">94% of projects are delivered within or under budget</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">Resource Optimization</h4>
                <p className="text-sm text-orange-700">Current resource utilization is at 78%, with room for optimization</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Analytics Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Timeline Performance</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>On Schedule</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Ahead of Schedule</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Behind Schedule</span>
                      <span>8%</span>
                    </div>
                    <Progress value={8} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Quality Metrics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Defect Rate</span>
                      <span>2.3%</span>
                    </div>
                    <Progress value={2.3} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Customer Satisfaction</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Rework Rate</span>
                      <span>5.1%</span>
                    </div>
                    <Progress value={5.1} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Financial Performance Analysis</h3>
            <BarChartComponent
              data={budgetAnalysis}
              dataKey="actual"
              xAxisKey="project"
              height={300}
              title="Budget vs Actual Spend"
              subtitle="In EUR"
              color="#0284c7"
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Budget</span>
                  <span className="font-semibold">€1.07M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Actual Spend</span>
                  <span className="font-semibold">€1.04M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Variance</span>
                  <span className="font-semibold text-green-600">-€30K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Forecast to Complete</span>
                  <span className="font-semibold">€1.05M</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">ROI Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Average ROI</span>
                  <span className="font-semibold">28%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Best Performing</span>
                  <span className="font-semibold text-green-600">42%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Lowest ROI</span>
                  <span className="font-semibold text-red-600">12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Projected ROI</span>
                  <span className="font-semibold">31%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Cost Categories</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Personnel (65%)</span>
                    <span>€676K</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Equipment (20%)</span>
                    <span>€208K</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Software (15%)</span>
                    <span>€156K</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Analytics Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 text-center">
                <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">Executive Dashboard</h4>
                <p className="text-sm text-gray-600 mb-3">High-level project portfolio overview</p>
                <Button variant="outline" size="sm">Generate Report</Button>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">Performance Report</h4>
                <p className="text-sm text-gray-600 mb-3">Detailed performance metrics and trends</p>
                <Button variant="outline" size="sm">Generate Report</Button>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <PieChart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">Financial Report</h4>
                <p className="text-sm text-gray-600 mb-3">Budget analysis and financial insights</p>
                <Button variant="outline" size="sm">Generate Report</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Custom Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Report Builder</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Report Type</label>
                    <select className="w-full p-2 border rounded">
                      <option>Performance Analysis</option>
                      <option>Financial Summary</option>
                      <option>Resource Utilization</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Time Period</label>
                    <select className="w-full p-2 border rounded">
                      <option>Last 30 Days</option>
                      <option>Last Quarter</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                  <Button className="w-full">Build Custom Report</Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Scheduled Reports</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Weekly Status Report</span>
                    <span className="text-gray-600">Every Monday</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Executive Summary</span>
                    <span className="text-gray-600">1st of month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quarterly Review</span>
                    <span className="text-gray-600">End of quarter</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectAnalytics;
