import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceAssistantContext } from '../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart2, Box, Truck, ArrowRight, Package, ClipboardCheck, FileText } from 'lucide-react';
import PageHeader from '../components/page/PageHeader';
import SupplyChainMetrics from './SupplyChain/components/SupplyChainMetrics';
import { useToast } from '../components/ui/use-toast';

const SupplyChain: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const { toast } = useToast();
  
  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to the Supply Chain module. This area provides access to all supply chain functions including procurement, inventory, logistics, and supplier management.');
    }
  }, [isEnabled, speak]);

  const handleNavigation = (path: string) => {
    navigate(`/supply-chain/${path}`);
  };

  const handleCardClick = (action: string, description: string) => {
    toast({
      title: action,
      description: description,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <PageHeader 
        title="Supply Chain Management"
        description="Manage procurement, inventory, logistics, and supplier relationships"
        voiceIntroduction="Welcome to Supply Chain Management. Here you can manage all procurement and logistic operations."
      />

      <SupplyChainMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Box className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">Procurement</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between" 
                    onClick={() => handleNavigation('purchase-orders')}>
              <span>Purchase Orders</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('requisitions')}>
              <span>Purchase Requisitions</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('supplier-management')}>
              <span>Supplier Management</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <Card className="col-span-1 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">Logistics</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('inbound-deliveries')}>
              <span>Inbound Deliveries</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('outbound-deliveries')}>
              <span>Outbound Deliveries</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('transportation')}>
              <span>Transportation Management</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <Card className="col-span-1 p-6">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <BarChart2 className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold">Analytics</h2>
          </div>
          
          <div className="space-y-3">
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('supply-chain-visibility')}>
              <span>Supply Chain Visibility</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('procurement-analysis')}>
              <span>Procurement Analysis</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center justify-between"
                    onClick={() => handleNavigation('supplier-performance')}>
              <span>Supplier Performance</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="purchase-orders" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="purchase-orders" onClick={() => handleNavigation('purchase-orders')}>Purchase Orders</TabsTrigger>
          <TabsTrigger value="inventory" onClick={() => handleNavigation('inventory')}>Inventory Management</TabsTrigger>
          <TabsTrigger value="suppliers" onClick={() => handleNavigation('supplier-management')}>Supplier Management</TabsTrigger>
          <TabsTrigger value="logistics" onClick={() => handleNavigation('transportation')}>Logistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="purchase-orders">
          <section>
            <h2 className="text-xl font-semibold mb-4">Purchase Orders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Create Purchase Order', 'Create new purchase orders form would open here')}>
                <div className="flex items-center">
                  <Box className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Create Purchase Order</h3>
                    <p className="text-xs text-gray-500 mt-1">Create new purchase orders</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Display Purchase Orders', 'View existing purchase orders list would open here')}>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Display Purchase Orders</h3>
                    <p className="text-xs text-gray-500 mt-1">View existing purchase orders</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Approve Purchase Orders', 'Review and approve pending orders interface would open here')}>
                <div className="flex items-center">
                  <ClipboardCheck className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Approve Purchase Orders</h3>
                    <p className="text-xs text-gray-500 mt-1">Review and approve pending orders</p>
                  </div>
                </div>
                <div className="mt-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
                  24
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Goods Receipt', 'Process goods receipts interface would open here')}>
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Goods Receipt</h3>
                    <p className="text-xs text-gray-500 mt-1">Process goods receipts</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>

        
        <TabsContent value="inventory">
          <section>
            <h2 className="text-xl font-semibold mb-4">Inventory Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Stock Overview', 'View current stock levels interface would open here')}>
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Stock Overview</h3>
                    <p className="text-xs text-gray-500 mt-1">View current stock levels</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Physical Inventory', 'Perform stock counts interface would open here')}>
                <div className="flex items-center">
                  <ClipboardCheck className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Physical Inventory</h3>
                    <p className="text-xs text-gray-500 mt-1">Perform stock counts</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Stock Transfers', 'Transfer stock between locations interface would open here')}>
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Stock Transfers</h3>
                    <p className="text-xs text-gray-500 mt-1">Transfer stock between locations</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Inventory Analytics', 'Analyze inventory trends interface would open here')}>
                <div className="flex items-center">
                  <BarChart2 className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Inventory Analytics</h3>
                    <p className="text-xs text-gray-500 mt-1">Analyze inventory trends</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="suppliers">
          <section>
            <h2 className="text-xl font-semibold mb-4">Supplier Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Supplier Master', 'Manage supplier data interface would open here')}>
                <div className="flex items-center">
                  <Box className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Supplier Master</h3>
                    <p className="text-xs text-gray-500 mt-1">Manage supplier data</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Supplier Evaluation', 'Evaluate supplier performance interface would open here')}>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Supplier Evaluation</h3>
                    <p className="text-xs text-gray-500 mt-1">Evaluate supplier performance</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Contracts', 'Manage supplier contracts interface would open here')}>
                <div className="flex items-center">
                  <ClipboardCheck className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Contracts</h3>
                    <p className="text-xs text-gray-500 mt-1">Manage supplier contracts</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Spend Analysis', 'Analyze supplier spending interface would open here')}>
                <div className="flex items-center">
                  <BarChart2 className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Spend Analysis</h3>
                    <p className="text-xs text-gray-500 mt-1">Analyze supplier spending</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="logistics">
          <section>
            <h2 className="text-xl font-semibold mb-4">Logistics Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Inbound Deliveries', 'Process incoming goods interface would open here')}>
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Inbound Deliveries</h3>
                    <p className="text-xs text-gray-500 mt-1">Process incoming goods</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Outbound Deliveries', 'Process outgoing shipments interface would open here')}>
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Outbound Deliveries</h3>
                    <p className="text-xs text-gray-500 mt-1">Process outgoing shipments</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Shipment Tracking', 'Track shipments in transit interface would open here')}>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Shipment Tracking</h3>
                    <p className="text-xs text-gray-500 mt-1">Track shipments in transit</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick('Transportation', 'Manage transportation interface would open here')}>
                <div className="flex items-center">
                  <BarChart2 className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Transportation</h3>
                    <p className="text-xs text-gray-500 mt-1">Manage transportation</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplyChain;
