
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { ArrowLeft, TrendingUp, BarChart2, PieChart, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const PerformanceAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now in Performance Analytics. Here you can analyze manufacturing performance, efficiency, and KPIs.');
    }
  }, [isEnabled, speak]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/manufacturing')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Performance Analytics"
          description="Analyze manufacturing performance, efficiency metrics, and KPIs"
          voiceIntroduction="Welcome to Performance Analytics."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Overall Efficiency</div>
              <div className="text-2xl font-bold">94.7%</div>
              <div className="text-sm text-green-600">↑ 1.2%</div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Production Volume</div>
              <div className="text-2xl font-bold">12.4K</div>
              <div className="text-sm text-blue-600">units/month</div>
            </div>
            <BarChart2 className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Quality Rate</div>
              <div className="text-2xl font-bold">98.3%</div>
              <div className="text-sm text-green-600">↑ 0.3%</div>
            </div>
            <PieChart className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Machine Uptime</div>
              <div className="text-2xl font-bold">96.8%</div>
              <div className="text-sm text-green-600">Target: 95%</div>
            </div>
            <Activity className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency Analysis</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Production Trend</h3>
              <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                <p className="text-gray-500">Production trend chart will display here</p>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Efficiency by Work Center</h3>
              <div className="space-y-4">
                {['WC-001', 'WC-002', 'WC-003', 'WC-004'].map((wc, index) => (
                  <div key={wc} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{wc}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${88 + index * 3}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{88 + index * 3}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Efficiency Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-3">Machine Efficiency</h4>
                <div className="text-3xl font-bold text-blue-600 mb-2">92.5%</div>
                <div className="text-sm text-gray-500">Average across all machines</div>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-3">Labor Efficiency</h4>
                <div className="text-3xl font-bold text-green-600 mb-2">89.2%</div>
                <div className="text-sm text-gray-500">Productivity index</div>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-3">Material Efficiency</h4>
                <div className="text-3xl font-bold text-purple-600 mb-2">96.8%</div>
                <div className="text-sm text-gray-500">Material utilization rate</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="quality">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quality Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">First Pass Yield</span>
                    <span className="text-lg font-bold">96.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '96.3%' }}></div>
                  </div>
                </div>
                <div className="p-4 border rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Defect Rate</span>
                    <span className="text-lg font-bold">3.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '3.7%' }}></div>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-3">Quality Trend</h4>
                <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Quality trend chart</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="capacity">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Capacity Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Capacity Utilization by Work Center</h4>
                {[
                  { name: 'Assembly Line 1', utilization: 85 },
                  { name: 'Assembly Line 2', utilization: 92 },
                  { name: 'Quality Control', utilization: 76 },
                  { name: 'Packaging', utilization: 88 }
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm">{item.name}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className={`h-2 rounded-full ${item.utilization > 90 ? 'bg-red-500' : item.utilization > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${item.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{item.utilization}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-3">Capacity Planning</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Capacity</span>
                    <span className="font-medium">680 hrs/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Utilized Capacity</span>
                    <span className="font-medium">595 hrs/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Available Capacity</span>
                    <span className="font-medium">85 hrs/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Utilization Rate</span>
                    <span className="font-medium text-blue-600">87.5%</span>
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

export default PerformanceAnalytics;
