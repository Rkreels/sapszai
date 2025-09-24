
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, TrendingUp, BarChart3, Target, Calendar } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const DemandPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('forecast');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Demand Planning. Forecast demand, analyze trends, and optimize inventory planning.');
    }
  }, [isEnabled, speak]);

  const forecastData = [
    { material: 'Steel Pipes', currentMonth: '2,500', nextMonth: '2,750', threeMonth: '8,100', accuracy: '94%', trend: 'Increasing' },
    { material: 'Copper Wire', currentMonth: '150', nextMonth: '140', threeMonth: '420', accuracy: '89%', trend: 'Stable' },
    { material: 'Aluminum Sheets', currentMonth: '800', nextMonth: '850', threeMonth: '2,450', accuracy: '91%', trend: 'Increasing' },
  ];

  const demandData = [
    { period: 'Jan 2025', actual: '12,500', forecast: '12,200', variance: '+300', accuracy: '97.6%' },
    { period: 'Feb 2025', actual: '13,200', forecast: '13,100', variance: '+100', accuracy: '99.2%' },
    { period: 'Mar 2025', actual: '11,800', forecast: '12,500', variance: '-700', accuracy: '94.4%' },
    { period: 'Apr 2025', actual: '14,100', forecast: '13,800', variance: '+300', accuracy: '97.9%' },
  ];

  const forecastColumns = [
    { key: 'material', header: 'Material' },
    { key: 'currentMonth', header: 'Current Month' },
    { key: 'nextMonth', header: 'Next Month' },
    { key: 'threeMonth', header: '3-Month Forecast' },
    { key: 'accuracy', header: 'Forecast Accuracy' },
    { key: 'trend', header: 'Trend' },
  ];

  const demandColumns = [
    { key: 'period', header: 'Period' },
    { key: 'actual', header: 'Actual Demand' },
    { key: 'forecast', header: 'Forecasted' },
    { key: 'variance', header: 'Variance' },
    { key: 'accuracy', header: 'Accuracy' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/supply-chain')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Demand Planning"
          description="Forecast demand, analyze trends, and optimize inventory planning"
          voiceIntroduction="Welcome to Demand Planning. Optimize your demand forecasting and planning."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">95.2%</h3>
              <p className="text-sm text-gray-600">Forecast Accuracy</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">847</h3>
              <p className="text-sm text-gray-600">SKUs Forecasted</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">12.5M</h3>
              <p className="text-sm text-gray-600">Total Demand ($)</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">12</h3>
              <p className="text-sm text-gray-600">Months Horizon</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
          <TabsTrigger value="analysis">Demand Analysis</TabsTrigger>
          <TabsTrigger value="models">Forecast Models</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Material Demand Forecast</h2>
            <Button size="sm">Generate Forecast</Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={forecastColumns} data={forecastData} />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Forecast Accuracy Trend</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>January</span>
                  <span className="font-medium">97.6%</span>
                </div>
                <div className="flex justify-between">
                  <span>February</span>
                  <span className="font-medium">99.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>March</span>
                  <span className="font-medium">94.4%</span>
                </div>
                <div className="flex justify-between">
                  <span>April</span>
                  <span className="font-medium">97.9%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Demand Drivers</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Seasonal Trends</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="flex justify-between">
                  <span>Market Growth</span>
                  <span className="font-medium">28%</span>
                </div>
                <div className="flex justify-between">
                  <span>Promotional Activities</span>
                  <span className="font-medium">22%</span>
                </div>
                <div className="flex justify-between">
                  <span>Economic Factors</span>
                  <span className="font-medium">15%</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Historical Demand Analysis</h2>
            <Button size="sm">Export Analysis</Button>
          </div>
          
          <Card className="p-6">
            <DataTable columns={demandColumns} data={demandData} />
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Forecasting Models</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Moving Average</h4>
                <p className="text-sm text-gray-600 mb-3">Simple moving average for stable demand patterns</p>
                <div className="flex justify-between text-sm">
                  <span>Accuracy:</span>
                  <span className="font-medium">87%</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Exponential Smoothing</h4>
                <p className="text-sm text-gray-600 mb-3">Weighted historical data for trend analysis</p>
                <div className="flex justify-between text-sm">
                  <span>Accuracy:</span>
                  <span className="font-medium">92%</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Seasonal ARIMA</h4>
                <p className="text-sm text-gray-600 mb-3">Advanced model for seasonal patterns</p>
                <div className="flex justify-between text-sm">
                  <span>Accuracy:</span>
                  <span className="font-medium">95%</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Machine Learning</h4>
                <p className="text-sm text-gray-600 mb-3">AI-powered forecasting with multiple variables</p>
                <div className="flex justify-between text-sm">
                  <span>Accuracy:</span>
                  <span className="font-medium">97%</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Demand Planning Configuration</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Planning Parameters</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Planning Horizon</span>
                      <span className="font-medium">12 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Forecast Frequency</span>
                      <span className="font-medium">Monthly</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Safety Stock Days</span>
                      <span className="font-medium">30 days</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Model Selection</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Primary Model</span>
                      <span className="font-medium">Machine Learning</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Backup Model</span>
                      <span className="font-medium">Seasonal ARIMA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Override Threshold</span>
                      <span className="font-medium">85% accuracy</span>
                    </div>
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

export default DemandPlanning;
