
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SAPSection from '../components/SAPSection';
import SAPTile from '../components/SAPTile';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useVoiceAssistantContext } from '../context/VoiceAssistantContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ShoppingCart, Users, FileText, Package, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Procurement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak, teachAbout } = useVoiceAssistant();
  const [dashboardData, setDashboardData] = useState({
    totalSpend: 12800000,
    activeSuppliers: 347,
    pendingOrders: 89,
    costSavings: 1200000,
    contracts: { active: 156, expiring: 23 },
    rfqs: { open: 12, pending: 5 },
    invoices: { pending: 67, overdue: 8 }
  });

  useEffect(() => {
    if (isEnabled) {
      const introText = `Welcome to SAP S/4HANA Procurement module. This is your central hub for managing the complete procure-to-pay process. 
      Here you can access Purchase Orders for creating and tracking orders, Supplier Management for maintaining vendor relationships, 
      RFQ Management for requesting quotes, Goods Receipt for processing deliveries, Invoice Verification for payment processing, 
      Contract Management for agreements, Source Determination for supplier selection, and Bidding & Auctions for competitive sourcing. 
      The Procurement Analytics provides insights into spending patterns and supplier performance.`;
      speak(introText);
    }
  }, [isEnabled, speak]);

  const handleTileClick = (path: string, description: string) => {
    if (isEnabled) {
      speak(`Navigating to ${description}`);
    }
    navigate(path);
  };

  const handleVoiceTraining = (topic: string) => {
    if (isEnabled) {
      teachAbout('procurement', `Let me explain ${topic} in detail.`);
    }
  };

  const procurementMetrics = [
    { name: 'Total Spend', value: `$${(dashboardData.totalSpend / 1000000).toFixed(1)}M`, change: '+8.5%', icon: DollarSign },
    { name: 'Active Suppliers', value: dashboardData.activeSuppliers, change: '+5.2%', icon: Users },
    { name: 'Pending Orders', value: dashboardData.pendingOrders, change: '-12%', icon: ShoppingCart },
    { name: 'Cost Savings', value: `$${(dashboardData.costSavings / 1000000).toFixed(1)}M`, change: '+15.3%', icon: TrendingUp }
  ];

  const trendData = [
    { month: 'Jan', spend: 2100000, savings: 210000 },
    { month: 'Feb', spend: 2300000, savings: 230000 },
    { month: 'Mar', spend: 1950000, savings: 195000 },
    { month: 'Apr', spend: 2450000, savings: 245000 },
    { month: 'May', spend: 2200000, savings: 220000 },
    { month: 'Jun', spend: 1800000, savings: 180000 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Procurement Management</h1>
          <p className="text-muted-foreground mt-2">Manage your complete procure-to-pay process</p>
        </div>
        <Button onClick={() => handleVoiceTraining('procurement overview')}>
          Voice Training
        </Button>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {procurementMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.name}</div>
                  <div className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </div>
                </div>
                <metric.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Spending Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Procurement Spending Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
              <Legend />
              <Bar dataKey="spend" fill="#8884d8" name="Total Spend" />
              <Bar dataKey="savings" fill="#82ca9d" name="Cost Savings" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/procurement/purchase-orders')}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Create Purchase Order
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/procurement/rfq')}>
              <FileText className="h-4 w-4 mr-2" />
              Request for Quote
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/procurement/supplier-management')}>
              <Users className="h-4 w-4 mr-2" />
              Add New Supplier
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Purchase Requisitions</span>
              <Badge variant="outline">{dashboardData.pendingOrders}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Contract Renewals</span>
              <Badge variant="destructive">{dashboardData.contracts.expiring}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Invoice Approvals</span>
              <Badge variant="secondary">{dashboardData.invoices.pending}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Budget threshold exceeded</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Supplier evaluation complete</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm">Contract expiring soon</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <SAPSection 
        title="Purchase Management" 
        isVoiceAssistantEnabled={isEnabled}
        description="Create and manage purchase orders and requisitions."
      >
        <SAPTile 
          title="Purchase Orders"
          isVoiceAssistantEnabled={isEnabled}
          description="Create, track, and manage purchase orders for goods and services."
          icon={<ShoppingCart className="text-xl" />}
          examples="Purchase Orders handle the complete ordering process from creation to delivery. You can create orders, track delivery status, manage approvals, and monitor spending against budgets."
          onClick={() => handleTileClick('/procurement/purchase-orders', 'Purchase Orders')}
        />
        <SAPTile 
          title="Purchase Requisitions"
          isVoiceAssistantEnabled={isEnabled}
          description="Manage internal purchase requests and approval workflows."
          icon={<FileText className="text-xl" />}
          examples="Purchase Requisitions are internal requests for goods or services. They go through approval workflows before being converted to purchase orders."
          onClick={() => handleTileClick('/procurement/purchase-requisitions', 'Purchase Requisitions')}
        />
        <SAPTile 
          title="RFQ Management"
          isVoiceAssistantEnabled={isEnabled}
          description="Request quotes from suppliers and manage bidding processes."
          icon={<span className="text-xl">📋</span>}
          examples="RFQ Management allows you to request quotes from multiple suppliers, compare responses, and select the best offers based on price, quality, and delivery terms."
          onClick={() => handleTileClick('/procurement/rfq', 'RFQ Management')}
        />
      </SAPSection>

      <SAPSection 
        title="Supplier Management" 
        isVoiceAssistantEnabled={isEnabled}
        description="Manage supplier relationships, contracts, and performance."
      >
        <SAPTile 
          title="Supplier Management"
          isVoiceAssistantEnabled={isEnabled}
          description="Maintain comprehensive supplier database and relationships."
          icon={<Users className="text-xl" />}
          examples="The Supplier Management contains all registered suppliers with their contact information, certifications, performance history, and qualification status."
          onClick={() => handleTileClick('/procurement/supplier-management', 'Supplier Management')}
        />
        <SAPTile 
          title="Contract Management"
          isVoiceAssistantEnabled={isEnabled}
          description="Create, manage, and track supplier contracts and agreements."
          icon={<span className="text-xl">📄</span>}
          examples="Contract Management handles all supplier agreements including pricing contracts, service level agreements, delivery terms, and renewal tracking."
          onClick={() => handleTileClick('/procurement/contract-management', 'Contract Management')}
        />
        <SAPTile 
          title="Source Determination"
          isVoiceAssistantEnabled={isEnabled}
          description="Determine optimal suppliers for materials and services."
          icon={<span className="text-xl">🎯</span>}
          examples="Source Determination helps identify the best suppliers based on criteria like price, quality, delivery time, and strategic fit."
          onClick={() => handleTileClick('/procurement/source-determination', 'Source Determination')}
        />
        <SAPTile 
          title="Supplier Performance"
          isVoiceAssistantEnabled={isEnabled}
          description="Monitor and evaluate supplier performance metrics."
          icon={<TrendingUp className="text-xl" />}
          examples="Supplier Performance tracking monitors delivery times, quality scores, cost competitiveness, and overall supplier ratings."
          onClick={() => handleTileClick('/procurement/supplier-performance', 'Supplier Performance')}
        />
      </SAPSection>

      <SAPSection 
        title="Procurement Operations" 
        isVoiceAssistantEnabled={isEnabled}
        description="Handle goods receipt, invoice processing, and payments."
      >
        <SAPTile 
          title="Goods Receipt"
          isVoiceAssistantEnabled={isEnabled}
          description="Record and verify receipt of goods from purchase orders."
          icon={<Package className="text-xl" />}
          examples="Goods Receipt processes incoming deliveries, verifies quantities and quality, and updates inventory records automatically."
          onClick={() => handleTileClick('/procurement/goods-receipt', 'Goods Receipt')}
        />
        <SAPTile 
          title="Invoice Verification"
          isVoiceAssistantEnabled={isEnabled}
          description="Verify and process supplier invoices for payment."
          icon={<span className="text-xl">💰</span>}
          examples="Invoice Verification matches supplier invoices with purchase orders and goods receipts to ensure accurate payment processing."
          onClick={() => handleTileClick('/procurement/invoice-verification', 'Invoice Verification')}
        />
        <SAPTile 
          title="Bidding & Auctions"
          isVoiceAssistantEnabled={isEnabled}
          description="Manage competitive bidding and reverse auction processes."
          icon={<span className="text-xl">🏆</span>}
          examples="Bidding & Auctions enables competitive sourcing through online bidding platforms and reverse auctions to optimize pricing."
          onClick={() => handleTileClick('/procurement/bidding-auctions', 'Bidding & Auctions')}
        />
      </SAPSection>

      <SAPSection 
        title="Analytics & Reporting" 
        isVoiceAssistantEnabled={isEnabled}
        description="Monitor procurement performance and generate insights."
      >
        <SAPTile 
          title="Procurement Analytics"
          isVoiceAssistantEnabled={isEnabled}
          description="Analyze spending patterns, supplier performance, and cost savings."
          icon={<TrendingUp className="text-xl" />}
          examples="Procurement Analytics provides dashboards and reports on spending trends, supplier performance metrics, cost savings achievements, and compliance monitoring."
          onClick={() => handleTileClick('/procurement/analytics', 'Procurement Analytics')}
        />
        <SAPTile 
          title="Spend Analysis"
          isVoiceAssistantEnabled={isEnabled}
          description="Analyze procurement spending patterns and identify cost optimization opportunities."
          icon={<DollarSign className="text-xl" />}
          examples="Spend Analysis provides insights into spending by category, supplier, and time period to identify cost savings opportunities."
          onClick={() => handleTileClick('/procurement/spend-analysis', 'Spend Analysis')}
        />
        <SAPTile 
          title="Catalog Management"
          isVoiceAssistantEnabled={isEnabled}
          description="Manage product catalogs, pricing, and supplier catalogs."
          icon={<span className="text-xl">📚</span>}
          examples="Catalog Management handles all product catalogs, pricing updates, and supplier catalog integration for streamlined procurement."
          onClick={() => handleTileClick('/procurement/catalog-management', 'Catalog Management')}
        />
      </SAPSection>
    </div>
  );
};

export default Procurement;
