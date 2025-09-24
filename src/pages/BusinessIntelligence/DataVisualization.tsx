
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, BarChart3, PieChart, LineChart } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import BarChartComponent from '../../components/charts/BarChartComponent';

const DataVisualization: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Data Visualization. Create interactive charts and visual analytics dashboards.');
    }
  }, [isEnabled, speak]);

  const chartData = [
    { name: 'Q1', value: 400 },
    { name: 'Q2', value: 300 },
    { name: 'Q3', value: 500 },
    { name: 'Q4', value: 280 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/business-intelligence')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Data Visualization"
          description="Interactive charts and visual analytics"
          voiceIntroduction="Welcome to Data Visualization."
        />
      </div>

      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="charts">Chart Gallery</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="designer">Chart Designer</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <BarChartComponent
                data={chartData}
                dataKey="value"
                xAxisKey="name"
                title="Sample Bar Chart"
                subtitle="Quarterly performance data"
                height={300}
                color="#3b82f6"
              />
            </Card>
            <Card className="p-6">
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <PieChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Pie Chart Placeholder</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dashboards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-blue-500" />
                <h3 className="font-semibold">Sales Dashboard</h3>
                <p className="text-sm text-gray-600 mt-2">15 visualizations</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-center">
                <LineChart className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <h3 className="font-semibold">Finance Dashboard</h3>
                <p className="text-sm text-gray-600 mt-2">12 visualizations</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto mb-3 text-purple-500" />
                <h3 className="font-semibold">Operations Dashboard</h3>
                <p className="text-sm text-gray-600 mt-2">18 visualizations</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="designer" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Chart Designer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Chart Type</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Bar Chart
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <LineChart className="h-4 w-4 mr-2" />
                    Line Chart
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <PieChart className="h-4 w-4 mr-2" />
                    Pie Chart
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Data Source</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">Select Data Source</Button>
                  <Button variant="outline" className="w-full">Configure Filters</Button>
                  <Button variant="outline" className="w-full">Preview Data</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="aspect-video bg-gray-100 rounded mb-3"></div>
                <h4 className="font-medium">Template {i + 1}</h4>
                <p className="text-sm text-gray-600">Business dashboard template</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataVisualization;
