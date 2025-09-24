
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import MetricCard from '../../components/metrics/MetricCard';
import BarChartComponent from '../../components/charts/BarChartComponent';

const ExecutiveDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Executive Dashboard. Access comprehensive business performance insights and key metrics for strategic decision making.');
    }
  }, [isEnabled, speak]);

  const kpiData = [
    { name: 'Q1', revenue: 2400000, profit: 400000 },
    { name: 'Q2', revenue: 2800000, profit: 500000 },
    { name: 'Q3', revenue: 3200000, profit: 650000 },
    { name: 'Q4', revenue: 3600000, profit: 720000 }
  ];

  const departmentData = [
    { name: 'Sales', performance: 92 },
    { name: 'Manufacturing', performance: 87 },
    { name: 'Finance', performance: 95 },
    { name: 'HR', performance: 89 }
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
          title="Executive Dashboard"
          description="Strategic business intelligence and performance metrics"
          voiceIntroduction="Welcome to Executive Dashboard."
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial KPIs</TabsTrigger>
          <TabsTrigger value="operational">Operational Metrics</TabsTrigger>
          <TabsTrigger value="strategic">Strategic Initiatives</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <MetricCard
                title="Total Revenue"
                value="$14.2M"
                trend={{ value: "12.5%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Net Profit"
                value="$2.8M"
                trend={{ value: "8.3%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Active Customers"
                value="8,547"
                trend={{ value: "15.2%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Employee Count"
                value="1,243"
                trend={{ value: "5.1%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <BarChartComponent
                data={kpiData}
                dataKey="revenue"
                xAxisKey="name"
                title="Quarterly Revenue Trend"
                subtitle="Revenue performance by quarter"
                height={300}
                color="#0284c7"
              />
            </Card>
            <Card className="p-6">
              <BarChartComponent
                data={departmentData}
                dataKey="performance"
                xAxisKey="name"
                title="Department Performance"
                subtitle="Performance score by department"
                height={300}
                color="#059669"
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="EBITDA"
                value="$3.4M"
                trend={{ value: "9.2%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Cash Flow"
                value="$2.1M"
                trend={{ value: "6.7%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="ROI"
                value="18.5%"
                trend={{ value: "2.3%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Production Efficiency"
                value="94.2%"
                trend={{ value: "3.1%", direction: "up", label: "vs last month" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Quality Score"
                value="97.8%"
                trend={{ value: "1.2%", direction: "up", label: "vs last month" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Customer Satisfaction"
                value="4.7/5"
                trend={{ value: "0.3", direction: "up", label: "vs last month" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Active Initiatives</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Digital Transformation</span>
                  <span className="text-green-600">75% Complete</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Market Expansion</span>
                  <span className="text-blue-600">45% Complete</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sustainability Program</span>
                  <span className="text-orange-600">60% Complete</span>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Market Risk</span>
                  <span className="text-yellow-600">Medium</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Operational Risk</span>
                  <span className="text-green-600">Low</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Financial Risk</span>
                  <span className="text-green-600">Low</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExecutiveDashboard;
