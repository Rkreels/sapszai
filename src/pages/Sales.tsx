
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SAPSection from '../components/SAPSection';
import SAPTile from '../components/SAPTile';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '../components/ui/use-toast';
import SalesMetrics from './Sales/components/SalesMetrics';
import SalesSummaryCards from './Sales/components/SalesSummaryCards';
import SalesOrdersTable from './Sales/components/SalesOrdersTable';
import CustomersTable from './Sales/components/CustomersTable';
import InvoicesTable from './Sales/components/InvoicesTable';

const Sales: React.FC = () => {
  const [isVoiceAssistantEnabled, setIsVoiceAssistantEnabled] = useState(false);
  const [salesFilter, setSalesFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const navigate = useNavigate();
  const { speak } = useVoiceAssistant();
  
  useEffect(() => {
    const checkVoiceAssistant = () => {
      const enabled = localStorage.getItem('voiceAssistantEnabled') === 'true';
      setIsVoiceAssistantEnabled(enabled);
      
      if (enabled) {
        speak(`Welcome to the Sales module. This is where you manage all aspects of your sales operations. 
        You can create and track sales orders, manage customer relationships, review sales analytics, and handle billing activities. 
        For example, you can use the 'Create Sales Order' tile to initiate a new customer order, or view your recent sales in the 
        'Sales Overview' section. The 'Customer Analytics' feature allows you to understand customer behavior and preferences.`);
      }
    };
    
    checkVoiceAssistant();
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [speak]);

  // Handle creating a new sales order
  const handleCreateSalesOrder = () => {
    toast({
      title: "Creating new sales order",
      description: "The sales order creation form has been opened.",
    });
    // In a real app, this would redirect to a form or open a modal
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Sales</h1>

      <SAPSection 
        title="Sales Overview" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Get a comprehensive view of your sales performance and recent activities."
      >
        <SalesMetrics isLoading={isLoading} />

        <SAPTile 
          title="Total Sales"
          subtitle="Current Quarter"
          value="€3.2M" 
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="This tile shows your total sales for the current quarter. It's a key performance indicator that helps you track your revenue goals."
        >
          <SalesSummaryCards isLoading={isLoading} />
        </SAPTile>
      </SAPSection>

      <SAPSection 
        title="Sales Forecast" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="View and analyze sales forecasts and projections."
      >
        <div className="col-span-full">
          <SAPTile 
            title="Quarterly Sales Forecast"
            isVoiceAssistantEnabled={isVoiceAssistantEnabled}
            description="This chart compares forecasted sales against actual performance by quarter."
          >
            <SalesMetrics isLoading={isLoading} />
          </SAPTile>
        </div>
      </SAPSection>

      <SAPSection 
        title="Sales Data Management" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Manage sales orders, customers, and invoices."
      >
        <div className="col-span-full">
          <SAPTile 
            title="Sales Data"
            isVoiceAssistantEnabled={isVoiceAssistantEnabled}
            description="This section provides comprehensive access to your sales data, including orders, customers, and invoices."
          >
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="orders">Sales Orders</TabsTrigger>
                  <TabsTrigger value="customers">Customers</TabsTrigger>
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                </TabsList>
                
                <TabsContent value="orders" className="mt-4">
                  <SalesOrdersTable 
                    isLoading={isLoading}
                    salesFilter={salesFilter}
                    setSalesFilter={setSalesFilter}
                  />
                </TabsContent>
                
                <TabsContent value="customers" className="mt-4">
                  <CustomersTable isLoading={isLoading} />
                </TabsContent>
                
                <TabsContent value="invoices" className="mt-4">
                  <InvoicesTable isLoading={isLoading} />
                </TabsContent>
              </Tabs>
            </div>
          </SAPTile>
        </div>
      </SAPSection>

      <SAPSection 
        title="Quick Actions" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Frequently used actions and processes."
      >
        <SAPTile 
          title="Create Sales Order"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="This tile allows you to create new sales orders for customers. When creating a sales order, you'll need to specify the customer, products, quantities, pricing, and delivery terms."
          icon={<span className="text-xl">📝</span>}
          onClick={handleCreateSalesOrder}
        />
        <SAPTile 
          title="Order Overview"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="This tile provides access to view and manage existing sales orders. You can monitor order status, make changes to pending orders, and track order fulfillment."
          icon={<span className="text-xl">📊</span>}
          onClick={() => setActiveTab('orders')}
        />
        <SAPTile 
          title="Quotations"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Use this tile to create and manage sales quotations before they become orders. Quotations allow you to provide pricing information to potential customers."
          icon={<span className="text-xl">💰</span>}
          onClick={() => toast({ title: "Quotation Module", description: "Opening quotation management interface" })}
        />
        <SAPTile 
          title="Returns and Credits"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="This tile helps you process customer returns and issue credit notes. It's essential for managing product returns and customer refunds."
          icon={<span className="text-xl">↩️</span>}
          onClick={() => toast({ title: "Returns Module", description: "Opening returns and credits interface" })}
        />
      </SAPSection>

      <SAPSection 
        title="Customer Management" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Manage customer relationships and accounts."
      >
        <SAPTile 
          title="Customer Directory"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Access your complete customer database with this tile. You can view customer details, contact information, purchase history, and account settings."
          icon={<span className="text-xl">👥</span>}
          onClick={() => setActiveTab('customers')}
        />
        <SAPTile 
          title="Customer Analytics"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="This tile provides detailed analytics and reports about customer behavior and purchasing patterns. You can use these insights for targeted marketing and sales strategies."
          icon={<span className="text-xl">📈</span>}
          onClick={() => toast({ title: "Customer Analytics", description: "Opening customer analytics dashboard" })}
        />
        <SAPTile 
          title="Customer Segmentation"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Use this tile to group customers based on criteria like purchase history, location, or industry. Customer segmentation helps in creating targeted marketing campaigns."
          icon={<span className="text-xl">🔍</span>}
          onClick={() => toast({ title: "Customer Segmentation", description: "Opening customer segmentation tool" })}
        />
        <SAPTile 
          title="Customer Feedback"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Access and analyze customer feedback and satisfaction ratings. This information is valuable for improving products, services, and customer experience."
          icon={<span className="text-xl">💬</span>}
          onClick={() => toast({ title: "Customer Feedback", description: "Opening customer feedback analytics" })}
        />
      </SAPSection>

      <SAPSection 
        title="Billing and Invoicing" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Manage billing documents and customer payments."
      >
        <SAPTile 
          title="Create Invoice"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="This tile allows you to create and send invoices to customers. You can generate invoices from sales orders or create standalone invoices as needed."
          icon={<span className="text-xl">📄</span>}
          onClick={() => {
            setActiveTab('invoices');
            toast({ title: "Invoice Creation", description: "Opening invoice creation form" });
          }}
        />
        <SAPTile 
          title="Invoice Overview"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Use this tile to view and manage all customer invoices. You can track payment status, send reminders, and process payments."
          icon={<span className="text-xl">📋</span>}
          onClick={() => setActiveTab('invoices')}
        />
        <SAPTile 
          title="Billing Plans"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="This tile helps you set up and manage recurring billing plans for customers with subscription services or installment payments."
          icon={<span className="text-xl">📅</span>}
          onClick={() => toast({ title: "Billing Plans", description: "Opening billing plan management" })}
        />
        <SAPTile 
          title="Payment Processing"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Access tools for processing customer payments, including credit cards, bank transfers, and other payment methods."
          icon={<span className="text-xl">💳</span>}
          onClick={() => toast({ title: "Payment Processing", description: "Opening payment processing interface" })}
        />
      </SAPSection>
    </div>
  );
};

export default Sales;
