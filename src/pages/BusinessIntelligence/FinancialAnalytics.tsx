
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, DollarSign, TrendingUp, PieChart } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import MetricCard from '../../components/metrics/MetricCard';
import BarChartComponent from '../../components/charts/BarChartComponent';
import DataTable from '../../components/data/DataTable';

const FinancialAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Financial Analytics. Analyze financial performance, cash flow, profitability, and budget variance reports.');
    }
  }, [isEnabled, speak]);

  const revenueData = [
    { month: 'Jan', revenue: 850000, expenses: 720000 },
    { month: 'Feb', revenue: 920000, expenses: 780000 },
    { month: 'Mar', revenue: 1100000, expenses: 850000 },
    { month: 'Apr', revenue: 980000, expenses: 790000 },
    { month: 'May', revenue: 1250000, expenses: 920000 },
    { month: 'Jun', revenue: 1180000, expenses: 880000 }
  ];

  const budgetVariance = [
    { category: 'Revenue', budget: 1200000, actual: 1180000, variance: -20000, status: 'Below' },
    { category: 'Operating Expenses', budget: 850000, actual: 880000, variance: 30000, status: 'Over' },
    { category: 'Marketing', budget: 120000, actual: 115000, variance: -5000, status: 'Under' },
    { category: 'R&D', budget: 200000, actual: 195000, variance: -5000, status: 'Under' }
  ];

  const columns = [
    { key: 'category', header: 'Category' },
    { key: 'budget', header: 'Budget', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'actual', header: 'Actual', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'variance', header: 'Variance', render: (value: number) => `$${value.toLocaleString()}` },
    { key: 'status', header: 'Status' }
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
          title="Financial Analytics"
          description="Comprehensive financial performance analysis"
          voiceIntroduction="Welcome to Financial Analytics."
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <MetricCard
                title="Total Revenue"
                value="$7.2M"
                trend={{ value: "12.5%", direction: "up", label: "YTD" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Gross Profit"
                value="$2.8M"
                trend={{ value: "8.3%", direction: "up", label: "YTD" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Operating Margin"
                value="24.5%"
                trend={{ value: "2.1%", direction: "up", label: "YTD" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="EBITDA"
                value="$1.9M"
                trend={{ value: "15.7%", direction: "up", label: "YTD" }}
              />
            </Card>
          </div>

          <Card className="p-6">
            <BarChartComponent
              data={revenueData}
              dataKey="revenue"
              xAxisKey="month"
              title="Monthly Revenue Trend"
              subtitle="Revenue performance over time"
              height={400}
              color="#0284c7"
            />
          </Card>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Gross Margin"
                value="38.7%"
                trend={{ value: "1.2%", direction: "up", label: "vs last month" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Net Margin"
                value="18.9%"
                trend={{ value: "0.8%", direction: "up", label: "vs last month" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="ROE"
                value="22.4%"
                trend={{ value: "3.1%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Operating Cash Flow"
                value="$1.8M"
                trend={{ value: "9.5%", direction: "up", label: "vs last month" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Free Cash Flow"
                value="$1.2M"
                trend={{ value: "7.2%", direction: "up", label: "vs last month" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Cash Conversion Cycle"
                value="45 days"
                trend={{ value: "3 days", direction: "down", label: "improvement" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Budget vs Actual Analysis</h3>
            <DataTable columns={columns} data={budgetVariance} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialAnalytics;
