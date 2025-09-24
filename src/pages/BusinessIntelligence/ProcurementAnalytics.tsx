
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Package, TrendingDown, DollarSign } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import MetricCard from '../../components/metrics/MetricCard';
import BarChartComponent from '../../components/charts/BarChartComponent';
import DataTable from '../../components/data/DataTable';

const ProcurementAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Procurement Analytics. Analyze supplier performance, cost savings, and procurement efficiency metrics.');
    }
  }, [isEnabled, speak]);

  const spendData = [
    { category: 'Raw Materials', spend: 850000, savings: 45000, suppliers: 12 },
    { category: 'Services', spend: 420000, savings: 28000, suppliers: 8 },
    { category: 'Equipment', spend: 320000, savings: 35000, suppliers: 5 },
    { category: 'Utilities', spend: 180000, savings: 12000, suppliers: 3 }
  ];

  const supplierPerformance = [
    { supplier: 'Supplier A', onTime: '98%', quality: '97%', cost: '$$', rating: 'Excellent' },
    { supplier: 'Supplier B', onTime: '95%', quality: '99%', cost: '$$$', rating: 'Good' },
    { supplier: 'Supplier C', onTime: '92%', quality: '94%', cost: '$', rating: 'Good' },
    { supplier: 'Supplier D', onTime: '89%', quality: '96%', cost: '$$', rating: 'Average' }
  ];

  const spendColumns = [
    { key: 'category', header: 'Category' },
    { key: 'spend', header: 'Total Spend', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'savings', header: 'Savings', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'suppliers', header: 'Suppliers' }
  ];

  const supplierColumns = [
    { key: 'supplier', header: 'Supplier' },
    { key: 'onTime', header: 'On-Time Delivery' },
    { key: 'quality', header: 'Quality Score' },
    { key: 'cost', header: 'Cost Rating' },
    { key: 'rating', header: 'Overall Rating' }
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
          title="Procurement Analytics"
          description="Supplier performance and procurement cost analysis"
          voiceIntroduction="Welcome to Procurement Analytics."
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spend">Spend Analysis</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier Performance</TabsTrigger>
          <TabsTrigger value="savings">Cost Savings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <MetricCard
                title="Total Spend"
                value="$1.8M"
                trend={{ value: "5.2%", direction: "down", label: "cost reduction" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Cost Savings"
                value="$120K"
                trend={{ value: "18.5%", direction: "up", label: "vs target" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Active Suppliers"
                value="28"
                trend={{ value: "2", direction: "up", label: "new partnerships" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="On-Time Delivery"
                value="94.2%"
                trend={{ value: "2.3%", direction: "up", label: "improvement" }}
              />
            </Card>
          </div>

          <Card className="p-6">
            <BarChartComponent
              data={spendData}
              dataKey="spend"
              xAxisKey="category"
              title="Spend by Category"
              subtitle="Procurement spend distribution"
              height={400}
              color="#7c3aed"
            />
          </Card>
        </TabsContent>

        <TabsContent value="spend" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Spend Analysis by Category</h3>
            <DataTable columns={spendColumns} data={spendData} />
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Supplier Performance Scorecard</h3>
            <DataTable columns={supplierColumns} data={supplierPerformance} />
          </Card>
        </TabsContent>

        <TabsContent value="savings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="YTD Savings"
                value="$120K"
                trend={{ value: "15.3%", direction: "up", label: "vs target" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Savings Rate"
                value="6.7%"
                trend={{ value: "1.2%", direction: "up", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="ROI on Procurement"
                value="340%"
                trend={{ value: "45%", direction: "up", label: "vs last year" }}
              />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcurementAnalytics;
