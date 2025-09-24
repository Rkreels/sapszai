
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Factory, Gauge, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import MetricCard from '../../components/metrics/MetricCard';
import BarChartComponent from '../../components/charts/BarChartComponent';

const ManufacturingAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Manufacturing Analytics. Monitor production efficiency, quality metrics, and operational performance.');
    }
  }, [isEnabled, speak]);

  const productionData = [
    { month: 'Jan', efficiency: 92, quality: 97, downtime: 3.2 },
    { month: 'Feb', efficiency: 94, quality: 96, downtime: 2.8 },
    { month: 'Mar', efficiency: 96, quality: 98, downtime: 2.1 },
    { month: 'Apr', efficiency: 93, quality: 97, downtime: 2.9 },
    { month: 'May', efficiency: 97, quality: 99, downtime: 1.8 },
    { month: 'Jun', efficiency: 95, quality: 98, downtime: 2.3 }
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
          title="Manufacturing Analytics"
          description="Production efficiency and quality analytics"
          voiceIntroduction="Welcome to Manufacturing Analytics."
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <MetricCard
                title="Overall Efficiency"
                value="94.8%"
                trend={{ value: "2.3%", direction: "up", label: "vs last month" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Quality Score"
                value="97.5%"
                trend={{ value: "1.2%", direction: "up", label: "vs last month" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Downtime"
                value="2.4%"
                trend={{ value: "0.8%", direction: "down", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Units Produced"
                value="12,450"
                trend={{ value: "8.7%", direction: "up", label: "vs last month" }}
              />
            </Card>
          </div>

          <Card className="p-6">
            <BarChartComponent
              data={productionData}
              dataKey="efficiency"
              xAxisKey="month"
              title="Production Efficiency Trend"
              subtitle="Monthly efficiency performance"
              height={400}
              color="#ea580c"
            />
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="OEE"
                value="84.2%"
                trend={{ value: "3.1%", direction: "up", label: "vs last month" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Availability"
                value="97.6%"
                trend={{ value: "0.8%", direction: "up", label: "vs last month" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Performance"
                value="86.3%"
                trend={{ value: "2.4%", direction: "up", label: "vs last month" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="First Pass Yield"
                value="96.8%"
                trend={{ value: "1.5%", direction: "up", label: "vs last month" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Defect Rate"
                value="0.8%"
                trend={{ value: "0.2%", direction: "down", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Rework Rate"
                value="1.2%"
                trend={{ value: "0.3%", direction: "down", label: "improvement" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="MTTR"
                value="2.4 hrs"
                trend={{ value: "0.6 hrs", direction: "down", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="MTBF"
                value="240 hrs"
                trend={{ value: "15 hrs", direction: "up", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Planned Maintenance"
                value="92%"
                trend={{ value: "3%", direction: "up", label: "vs last month" }}
              />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManufacturingAnalytics;
