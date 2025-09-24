
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, BarChart3, PieChart, LineChart, Plus, Settings, Download } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import BarChartComponent from '../../components/charts/BarChartComponent';

const DataVisualization: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [selectedChartType, setSelectedChartType] = useState('bar');
  const [selectedDataSource, setSelectedDataSource] = useState('');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Data Visualization. Create interactive charts and visual analytics dashboards.');
    }
  }, [isEnabled, speak]);

  const salesData = [
    { name: 'Jan', value: 4000, target: 3800 },
    { name: 'Feb', value: 3000, target: 3200 },
    { name: 'Mar', value: 5000, target: 4500 },
    { name: 'Apr', value: 2780, target: 3000 },
    { name: 'May', value: 5890, target: 5500 },
    { name: 'Jun', value: 4390, target: 4200 }
  ];

  const financeData = [
    { name: 'Q1', revenue: 1250000, expenses: 980000, profit: 270000 },
    { name: 'Q2', revenue: 1180000, expenses: 890000, profit: 290000 },
    { name: 'Q3', revenue: 1420000, expenses: 1050000, profit: 370000 },
    { name: 'Q4', revenue: 1380000, expenses: 920000, profit: 460000 }
  ];

  const productData = [
    { name: 'Product A', value: 400, percentage: 35 },
    { name: 'Product B', value: 300, percentage: 26 },
    { name: 'Product C', value: 250, percentage: 22 },
    { name: 'Product D', value: 200, percentage: 17 }
  ];

  const handleCreateChart = () => {
    alert(`Creating new ${selectedChartType} chart with data source: ${selectedDataSource || 'Default'}`);
  };

  const handleConfigureFilters = () => {
    alert('Opening filter configuration dialog...');
  };

  const handlePreviewData = () => {
    alert('Previewing sample data...');
  };

  const handleUseTemplate = (templateId: number) => {
    alert(`Using template ${templateId} for new dashboard`);
  };

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
                data={salesData}
                dataKey="value"
                xAxisKey="name"
                title="Monthly Sales Performance"
                subtitle="Actual vs Target comparison"
                height={300}
                color="#3b82f6"
                showGrid={true}
                showLegend={true}
              />
            </Card>
            <Card className="p-6">
              <BarChartComponent
                data={financeData}
                dataKey="profit"
                xAxisKey="name"
                title="Quarterly Financial Performance"
                subtitle="Revenue, expenses, and profit analysis"
                height={300}
                color="#10b981"
                showGrid={true}
                showLegend={true}
              />
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <BarChartComponent
                data={productData}
                dataKey="value"
                xAxisKey="name"
                title="Product Sales Distribution"
                subtitle="Sales by product category"
                height={300}
                color="#f59e0b"
                showGrid={true}
                horizontal={true}
              />
            </Card>
            <Card className="p-6">
              <div className="h-[300px] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded">
                <div className="text-center">
                  <LineChart className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Trend Analysis Chart</h3>
                  <p className="text-gray-600 mb-4">Interactive line chart showing trends over time</p>
                  <Button variant="outline" size="sm" onClick={() => alert('Opening trend analysis chart...')}>
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dashboards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => alert('Opening Sales Dashboard...')}>
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-blue-500" />
                <h3 className="font-semibold">Sales Dashboard</h3>
                <p className="text-sm text-gray-600 mt-2">15 visualizations</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Open Dashboard
                </Button>
              </div>
            </Card>
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => alert('Opening Finance Dashboard...')}>
              <div className="text-center">
                <LineChart className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <h3 className="font-semibold">Finance Dashboard</h3>
                <p className="text-sm text-gray-600 mt-2">12 visualizations</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Open Dashboard
                </Button>
              </div>
            </Card>
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => alert('Opening Operations Dashboard...')}>
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto mb-3 text-purple-500" />
                <h3 className="font-semibold">Operations Dashboard</h3>
                <p className="text-sm text-gray-600 mt-2">18 visualizations</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Open Dashboard
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="designer" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chart Designer</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" onClick={handleCreateChart}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Chart
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Chart Type</h4>
                <div className="space-y-2">
                  <Button 
                    variant={selectedChartType === 'bar' ? 'default' : 'outline'} 
                    className="w-full justify-start"
                    onClick={() => setSelectedChartType('bar')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Bar Chart
                  </Button>
                  <Button 
                    variant={selectedChartType === 'line' ? 'default' : 'outline'} 
                    className="w-full justify-start"
                    onClick={() => setSelectedChartType('line')}
                  >
                    <LineChart className="h-4 w-4 mr-2" />
                    Line Chart
                  </Button>
                  <Button 
                    variant={selectedChartType === 'pie' ? 'default' : 'outline'} 
                    className="w-full justify-start"
                    onClick={() => setSelectedChartType('pie')}
                  >
                    <PieChart className="h-4 w-4 mr-2" />
                    Pie Chart
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Data Source</h4>
                <div className="space-y-2">
                  <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Data Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Data</SelectItem>
                      <SelectItem value="finance">Financial Data</SelectItem>
                      <SelectItem value="inventory">Inventory Data</SelectItem>
                      <SelectItem value="hr">HR Data</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="w-full" onClick={handleConfigureFilters}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Filters
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handlePreviewData}>
                    Preview Data
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded mb-3 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
                <h4 className="font-medium">Template {i + 1}</h4>
                <p className="text-sm text-gray-600 mb-3">Business dashboard template</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">12 widgets</span>
                  <Button size="sm" onClick={() => handleUseTemplate(i + 1)}>
                    Use Template
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataVisualization;
