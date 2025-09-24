
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, ShoppingCart, Users, Target } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import MetricCard from '../../components/metrics/MetricCard';
import BarChartComponent from '../../components/charts/BarChartComponent';
import DataTable from '../../components/data/DataTable';

const SalesAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Sales Analytics. Track sales performance, customer behavior, and revenue trends across all channels.');
    }
  }, [isEnabled, speak]);

  const salesData = [
    { month: 'Jan', sales: 450000, target: 400000, orders: 245 },
    { month: 'Feb', sales: 520000, target: 450000, orders: 289 },
    { month: 'Mar', sales: 610000, target: 500000, orders: 342 },
    { month: 'Apr', sales: 580000, target: 520000, orders: 318 },
    { month: 'May', sales: 720000, target: 600000, orders: 398 },
    { month: 'Jun', sales: 680000, target: 650000, orders: 376 }
  ];

  const topProducts = [
    { product: 'Product A', revenue: 125000, units: 450, margin: '35%' },
    { product: 'Product B', revenue: 98000, units: 320, margin: '42%' },
    { product: 'Product C', revenue: 87000, units: 290, margin: '38%' },
    { product: 'Product D', revenue: 76000, units: 210, margin: '29%' }
  ];

  const columns = [
    { key: 'product', header: 'Product' },
    { key: 'revenue', header: 'Revenue', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'units', header: 'Units Sold' },
    { key: 'margin', header: 'Margin' }
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
          title="Sales Analytics"
          description="Sales performance and customer analytics"
          voiceIntroduction="Welcome to Sales Analytics."
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="products">Product Analysis</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <MetricCard
                title="Total Sales"
                value="$3.6M"
                trend={{ value: "18.5%", direction: "up", label: "YTD" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Orders"
                value="1,968"
                trend={{ value: "12.3%", direction: "up", label: "YTD" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Avg Order Value"
                value="$1,829"
                trend={{ value: "5.1%", direction: "up", label: "YTD" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Conversion Rate"
                value="3.8%"
                trend={{ value: "0.4%", direction: "up", label: "YTD" }}
              />
            </Card>
          </div>

          <Card className="p-6">
            <BarChartComponent
              data={salesData}
              dataKey="sales"
              xAxisKey="month"
              title="Sales vs Target"
              subtitle="Monthly sales performance against targets"
              height={400}
              color="#059669"
            />
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Sales Growth"
                value="18.5%"
                trend={{ value: "2.3%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Target Achievement"
                value="106.2%"
                trend={{ value: "4.1%", direction: "up", label: "vs last month" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Sales Cycle"
                value="28 days"
                trend={{ value: "3 days", direction: "down", label: "improvement" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
            <DataTable columns={columns} data={topProducts} />
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Customer Lifetime Value"
                value="$8,450"
                trend={{ value: "12.3%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Customer Retention"
                value="87.5%"
                trend={{ value: "2.1%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Churn Rate"
                value="2.3%"
                trend={{ value: "0.5%", direction: "down", label: "improvement" }}
              />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesAnalytics;
