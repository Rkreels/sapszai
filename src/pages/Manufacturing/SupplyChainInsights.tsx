
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { ArrowLeft, BarChart2, Package, Truck, Warehouse } from 'lucide-react';
import { Card } from '../../components/ui/card';

const SupplyChainInsights: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now viewing Supply Chain Insights. This page provides key information about your supply chain operations.');
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
          title="Supply Chain Insights"
          description="Key information about your supply chain operations"
          voiceIntroduction="Welcome to Supply Chain Insights. Here you can monitor key metrics related to your supply chain."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 flex items-center">
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Inventory Level</h3>
            <p className="text-2xl font-semibold">$4.75M</p>
            <p className="text-xs text-gray-500">+2.3% vs Target</p>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center">
          <div className="bg-green-100 p-3 rounded-lg mr-4">
            <Truck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Perfect Order Rate</h3>
            <p className="text-2xl font-semibold">95.3%</p>
            <p className="text-xs text-green-600">+0.8% vs Last Month</p>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center">
          <div className="bg-purple-100 p-3 rounded-lg mr-4">
            <Warehouse className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Inventory Turnover</h3>
            <p className="text-2xl font-semibold">7.2x</p>
            <p className="text-xs text-red-600">-0.4x vs Target</p>
          </div>
        </Card>
        
        <Card className="p-6 flex items-center">
          <div className="bg-amber-100 p-3 rounded-lg mr-4">
            <BarChart2 className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Supplier On-time</h3>
            <p className="text-2xl font-semibold">92.8%</p>
            <p className="text-xs text-green-600">+1.2% vs Last Month</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Supply Risk Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Material Availability Risk</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Transportation Risk</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Supplier Financial Risk</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Geopolitical Risk</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Top Supply Chain Issues</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs mr-2">High</span>
                <span>Material shortage: Microchip XZ430</span>
              </div>
              <span className="text-sm text-gray-500">2 days ago</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs mr-2">Medium</span>
                <span>Logistics delay: Eastern Europe route</span>
              </div>
              <span className="text-sm text-gray-500">4 days ago</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs mr-2">Medium</span>
                <span>Quality issue: Supplier ABC components</span>
              </div>
              <span className="text-sm text-gray-500">1 week ago</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs mr-2">Low</span>
                <span>Price increase: Raw materials</span>
              </div>
              <span className="text-sm text-gray-500">1 week ago</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Supply Chain Network</h2>
        <p className="text-gray-500 mb-6">Interactive visualization of your global supply chain network</p>
        <div className="text-center py-12 border-dashed border-2 border-gray-300 rounded-md">
          <p className="text-gray-400">Supply chain network visualization will be displayed here</p>
          <p className="text-sm text-gray-400 mt-2">Click on nodes to view detailed information</p>
        </div>
      </Card>
    </div>
  );
};

export default SupplyChainInsights;
