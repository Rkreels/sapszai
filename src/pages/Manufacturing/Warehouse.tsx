
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { ArrowLeft } from 'lucide-react';
import SAPSection from '../../components/SAPSection';
import InventoryManagement from './components/InventoryManagement';

const WarehousePage: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now in the Warehouse Management page. Here you can manage inventory, stock movements, and warehouse operations.');
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
          title="Warehouse Management"
          description="Manage inventory, stock movements, and warehouse operations"
          voiceIntroduction="Welcome to Warehouse Management. Here you can manage all warehouse operations."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Total Inventory</h3>
          <div className="text-3xl font-semibold mb-2">$4,756,329</div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">↑ 4.2%</span>
            <span className="text-xs text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Warehouse Utilization</h3>
          <div className="text-3xl font-semibold mb-2">78.3%</div>
          <div className="flex items-center">
            <span className="text-red-500 text-sm font-medium">↓ 2.1%</span>
            <span className="text-xs text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Inbound Orders</h3>
          <div className="text-3xl font-semibold mb-2">42</div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">↑ 8</span>
            <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Outbound Orders</h3>
          <div className="text-3xl font-semibold mb-2">87</div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">↑ 12</span>
            <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Inventory Management</h2>
        </div>
        <div className="p-6">
          <SAPSection 
            title="Inventory Functions"
            description="Core functions for inventory management"
            isVoiceAssistantEnabled={isEnabled}
          >
            <InventoryManagement />
          </SAPSection>
        </div>
      </div>
    </div>
  );
};

export default WarehousePage;
