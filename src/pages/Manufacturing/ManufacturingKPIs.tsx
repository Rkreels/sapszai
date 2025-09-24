
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { ArrowLeft, BarChart2 } from 'lucide-react';
import { Card } from '../../components/ui/card';

const ManufacturingKPIs: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now viewing Manufacturing KPIs. This page provides key performance indicators for manufacturing operations.');
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
          title="Manufacturing KPIs"
          description="Key performance indicators for manufacturing operations"
          voiceIntroduction="Welcome to Manufacturing KPIs. Here you can monitor key performance indicators for your manufacturing operations."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-md mr-3">
              <BarChart2 className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold">Production Metrics</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-500">Production Efficiency</h3>
              <div className="flex items-end justify-between mt-1">
                <div className="text-2xl font-semibold">92.5%</div>
                <div className="text-sm text-green-600 flex items-center">
                  <span>↑ 3.2%</span>
                </div>
              </div>
              <div className="h-1 bg-gray-200 w-full mt-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '92.5%' }}></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500">OEE (Overall Equipment Effectiveness)</h3>
              <div className="flex items-end justify-between mt-1">
                <div className="text-2xl font-semibold">87.2%</div>
                <div className="text-sm text-green-600 flex items-center">
                  <span>↑ 1.8%</span>
                </div>
              </div>
              <div className="h-1 bg-gray-200 w-full mt-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '87.2%' }}></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500">First Pass Yield</h3>
              <div className="flex items-end justify-between mt-1">
                <div className="text-2xl font-semibold">96.3%</div>
                <div className="text-sm text-green-600 flex items-center">
                  <span>↑ 0.5%</span>
                </div>
              </div>
              <div className="h-1 bg-gray-200 w-full mt-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '96.3%' }}></div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-md mr-3">
              <BarChart2 className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold">Cost Metrics</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-500">Unit Production Cost</h3>
              <div className="flex items-end justify-between mt-1">
                <div className="text-2xl font-semibold">$4.32</div>
                <div className="text-sm text-green-600 flex items-center">
                  <span>↓ $0.18</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500">Total Manufacturing Cost</h3>
              <div className="flex items-end justify-between mt-1">
                <div className="text-2xl font-semibold">$1.24M</div>
                <div className="text-sm text-red-600 flex items-center">
                  <span>↑ 2.1%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500">Maintenance Cost Ratio</h3>
              <div className="flex items-end justify-between mt-1">
                <div className="text-2xl font-semibold">3.8%</div>
                <div className="text-sm text-green-600 flex items-center">
                  <span>↓ 0.3%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-md mr-3">
              <BarChart2 className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold">Time Metrics</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-500">Manufacturing Lead Time</h3>
              <div className="flex items-end justify-between mt-1">
                <div className="text-2xl font-semibold">5.8 days</div>
                <div className="text-sm text-green-600 flex items-center">
                  <span>↓ 0.6 days</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500">Cycle Time</h3>
              <div className="flex items-end justify-between mt-1">
                <div className="text-2xl font-semibold">36 mins</div>
                <div className="text-sm text-green-600 flex items-center">
                  <span>↓ 3 mins</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500">On-Time Delivery</h3>
              <div className="flex items-end justify-between mt-1">
                <div className="text-2xl font-semibold">94.2%</div>
                <div className="text-sm text-red-600 flex items-center">
                  <span>↓ 1.3%</span>
                </div>
              </div>
              <div className="h-1 bg-gray-200 w-full mt-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">KPI Trends & Analysis</h2>
        <p className="text-gray-500 mb-6">Select a time period and metrics to view detailed trends and analysis.</p>
        <div className="text-center py-12 border-dashed border-2 border-gray-300 rounded-md">
          <p className="text-gray-400">KPI charts and detailed analysis will be displayed here</p>
          <p className="text-sm text-gray-400 mt-2">Select metrics from the filters above to generate reports</p>
        </div>
      </Card>
    </div>
  );
};

export default ManufacturingKPIs;
