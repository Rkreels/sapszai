
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import SAPSection from '../../components/SAPSection';
import { FileText, Users, BarChart, Layers, ShoppingCart, TrendingUp, Calendar, Clock, Settings } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import PurchaseOrders from './components/PurchaseOrders';
import SupplierManagement from './components/SupplierManagement';
import ProcurementAnalytics from './components/ProcurementAnalytics';
import DataTable from '../../components/data/DataTable';
import { useToast } from '../../hooks/use-toast';

// Sample data for the procurement dashboard
const recentPurchaseOrders = [
  { id: "PO-10045", supplier: "Tech Components Inc.", amount: "€124,500.00", status: "Pending Approval", date: "2025-05-18" },
  { id: "PO-10044", supplier: "Office Supplies Ltd.", amount: "€8,750.00", status: "Approved", date: "2025-05-17" },
  { id: "PO-10043", supplier: "Global Logistics", amount: "€52,300.00", status: "In Progress", date: "2025-05-16" },
  { id: "PO-10042", supplier: "Electronics Wholesale", amount: "€215,800.00", status: "Received", date: "2025-05-15" },
  { id: "PO-10041", supplier: "Industrial Parts Co.", amount: "€86,200.00", status: "In Progress", date: "2025-05-14" }
];

const topSuppliers = [
  { id: "SUP-10045", name: "Tech Components Inc.", category: "Electronics", spend: "€1,245,800.00", rating: 4.8, reliability: "High" },
  { id: "SUP-10022", name: "Office Supplies Ltd.", category: "Office Supplies", spend: "€426,350.00", rating: 4.2, reliability: "Medium" },
  { id: "SUP-10018", name: "Global Logistics", category: "Transportation", spend: "€879,600.00", rating: 4.5, reliability: "High" },
  { id: "SUP-10031", name: "Electronics Wholesale", category: "Electronics", spend: "€1,352,800.00", rating: 4.7, reliability: "High" },
  { id: "SUP-10027", name: "Industrial Parts Co.", category: "Manufacturing", spend: "€965,400.00", rating: 4.4, reliability: "Medium" }
];

const upcomingDeliveries = [
  { id: "DEL-5821", poNumber: "PO-10045", supplier: "Tech Components Inc.", expectedDate: "2025-05-25", status: "On Schedule" },
  { id: "DEL-5820", poNumber: "PO-10043", supplier: "Global Logistics", expectedDate: "2025-05-24", status: "Delayed" },
  { id: "DEL-5819", poNumber: "PO-10041", supplier: "Industrial Parts Co.", expectedDate: "2025-05-23", status: "On Schedule" }
];

const Procurement: React.FC = () => {
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (isEnabled) {
      speak("Welcome to the Procurement module. Here you can manage purchasing, supplier relationships, and sourcing activities. This module streamlines your procurement process from requisition to payment.");
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isEnabled, speak]);
  
  const handleNavigateToSupplier = (supplierId: string) => {
    navigate(`/procurement/supplier/${supplierId}`);
  };
  
  const handleCreatePurchaseOrder = () => {
    toast({
      title: "Create Purchase Order",
      description: "Purchase order creation form has been opened.",
    });
    // In a real application, this would open a form or modal
  };

  // Order columns configuration for DataTable
  const orderColumns = [
    { key: "id", header: "PO Number" },
    { 
      key: "supplier", 
      header: "Supplier",
      render: (value: string) => (
        <span className="text-blue-600 underline cursor-pointer">{value}</span>
      )
    },
    { key: "amount", header: "Amount" },
    { 
      key: "status", 
      header: "Status",
      render: (value: string) => (
        <Badge variant={
          value === 'Approved' ? 'outline' : 
          value === 'Received' ? 'default' :
          value === 'Pending Approval' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { key: "date", header: "Date" },
    { 
      key: "actions", 
      header: "Actions",
      render: (_, row: any) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => toast({ description: `Viewing details for PO ${row.id}` })}
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];
  
  // Supplier columns configuration
  const supplierColumns = [
    { key: "id", header: "ID" },
    { 
      key: "name", 
      header: "Name",
      render: (value: string, row: any) => (
        <span 
          className="text-blue-600 underline cursor-pointer"
          onClick={() => handleNavigateToSupplier(row.id)}
        >
          {value}
        </span>
      )
    },
    { key: "category", header: "Category" },
    { key: "spend", header: "Total Spend" },
    { 
      key: "rating", 
      header: "Rating",
      render: (value: number) => (
        <div className="flex items-center">
          {Array(5).fill(0).map((_, i) => (
            <svg 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.45 4.73L5.82 21 12 17.27z" />
            </svg>
          ))}
          <span className="ml-1 text-sm">{value.toFixed(1)}</span>
        </div>
      )
    },
    { 
      key: "reliability", 
      header: "Reliability",
      render: (value: string) => (
        <Badge variant={value === 'High' ? 'default' : 'outline'}>
          {value}
        </Badge>
      )
    }
  ];
  
  // Delivery columns configuration
  const deliveryColumns = [
    { key: "id", header: "Delivery ID" },
    { key: "poNumber", header: "PO Number" },
    { key: "supplier", header: "Supplier" },
    { key: "expectedDate", header: "Expected Date" },
    { 
      key: "status", 
      header: "Status",
      render: (value: string) => (
        <Badge variant={value === 'On Schedule' ? 'default' : 'destructive'}>
          {value}
        </Badge>
      )
    }
  ];
  
  return (
    <div>
      <PageHeader 
        title="Procurement" 
        voiceIntroduction="Welcome to the Procurement module. Here you can manage purchasing, supplier relationships, and sourcing activities. This module streamlines your procurement process from requisition to payment."
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="purchasing">Purchasing</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center text-sm text-muted-foreground">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>Purchase Orders</span>
                </div>
                <div className="text-2xl font-bold mt-2">247</div>
                <div className="text-xs text-muted-foreground mt-1">18 pending approval</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span>Monthly Spend</span>
                </div>
                <div className="text-2xl font-bold mt-2">€1.24M</div>
                <div className="text-xs text-green-600 mt-1">↑ 4.3% vs last month</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Active Suppliers</span>
                </div>
                <div className="text-2xl font-bold mt-2">128</div>
                <div className="text-xs text-muted-foreground mt-1">5 pending evaluation</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Avg. Processing Time</span>
                </div>
                <div className="text-2xl font-bold mt-2">3.2 days</div>
                <div className="text-xs text-green-600 mt-1">↓ 0.5 days improvement</div>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Purchase Orders</h3>
                <Button onClick={handleCreatePurchaseOrder}>
                  Create Purchase Order
                </Button>
              </div>
              
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable 
                  columns={orderColumns}
                  data={recentPurchaseOrders}
                  className="border rounded-md"
                />
              )}
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Suppliers</h3>
              
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable 
                  columns={supplierColumns}
                  data={topSuppliers}
                  className="border rounded-md"
                />
              )}
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Deliveries</h3>
              
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable 
                  columns={deliveryColumns}
                  data={upcomingDeliveries}
                  className="border rounded-md"
                />
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="purchasing">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold">Purchase Orders</h2>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={handleCreatePurchaseOrder}
                  className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center"
                >
                  <span className="w-6 h-6 mr-2 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-xs">+</span>
                  Create Purchase Order
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Purchase Order Overview
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Purchase Requisitions
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Goods Receipt
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Invoice Verification
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Procurement Settings</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Approval Workflows
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Purchase Types
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Material Groups
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Purchasing Organizations
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <Layers className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Source Management</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  RFQ Management
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Bidding & Auctions
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Contract Management
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Source Determination
                </button>
              </div>
            </div>
          </div>
          
          <SAPSection title="Purchase Order Management" isVoiceAssistantEnabled={isEnabled}>
            <div className="col-span-full">
              <PurchaseOrders />
            </div>
          </SAPSection>
        </TabsContent>
        
        <TabsContent value="suppliers">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Supplier Management</h2>
            <Button 
              onClick={() => toast({ description: "Supplier creation form has been opened" })}
            >
              Register New Supplier
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                <span>Supplier Directory</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Access and manage your complete supplier database with detailed information.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Suppliers</span>
                  <span className="font-medium">128</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Suppliers</span>
                  <span className="font-medium">112</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>On Hold</span>
                  <span className="font-medium">16</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>New (Last 30 days)</span>
                  <span className="font-medium">5</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('supplierDirectory')}>
                View Directory
              </Button>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                <span>Contracts</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage supplier contracts, agreements and terms.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Active Contracts</span>
                  <span className="font-medium">87</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expiring (90 days)</span>
                  <span className="font-medium text-amber-600">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Recently Renewed</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Draft Contracts</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Manage Contracts
              </Button>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-green-600" />
                <span>Supplier Evaluation</span>
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Track and analyze supplier performance metrics.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Top Performers</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Good Standing</span>
                  <span className="font-medium">78</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Needs Improvement</span>
                  <span className="font-medium text-amber-600">18</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Critical Issues</span>
                  <span className="font-medium text-red-600">8</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Performance Dashboard
              </Button>
            </Card>
          </div>
          
          <SAPSection title="Supplier Management" isVoiceAssistantEnabled={isEnabled}>
            <div className="col-span-full">
              <SupplierManagement />
            </div>
          </SAPSection>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Spend Analysis</h3>
              <div className="h-80">
                <ProcurementAnalytics />
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Procurement KPIs</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Cost Savings</span>
                    <span className="text-sm font-medium">12.4%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Target: 10.0%</span>
                    <span>Best in class: 15.0%</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">On-time Delivery</span>
                    <span className="text-sm font-medium">87.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '87.5%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Target: 95.0%</span>
                    <span>Best in class: 98.0%</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Approval Cycle Time</span>
                    <span className="text-sm font-medium">1.8 days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Target: 1.0 days</span>
                    <span>Best in class: 0.5 days</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Contract Compliance</span>
                    <span className="text-sm font-medium">94.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Target: 90.0%</span>
                    <span>Best in class: 98.0%</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">View All Metrics</Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Procurement;
