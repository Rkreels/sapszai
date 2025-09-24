
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Activity, Zap, Clock } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import MetricCard from '../../components/metrics/MetricCard';

const RealtimeAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Real-time Analytics. Monitor live data streams and get instant business insights.');
    }
  }, [isEnabled, speak]);

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
          title="Real-time Analytics"
          description="Live data processing and instant insights"
          voiceIntroduction="Welcome to Real-time Analytics."
        />
      </div>

      <Tabs defaultValue="live" className="space-y-6">
        <TabsList>
          <TabsTrigger value="live">Live Dashboard</TabsTrigger>
          <TabsTrigger value="streaming">Data Streaming</TabsTrigger>
          <TabsTrigger value="alerts">Real-time Alerts</TabsTrigger>
          <TabsTrigger value="monitoring">System Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <MetricCard
                title="Active Sessions"
                value="2,847"
                trend={{ value: "12%", direction: "up", label: "live users" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Transactions/Min"
                value="156"
                trend={{ value: "8", direction: "up", label: "vs avg" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="System Load"
                value="72%"
                trend={{ value: "5%", direction: "down", label: "optimized" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Response Time"
                value="145ms"
                trend={{ value: "25ms", direction: "down", label: "improvement" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="streaming" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Data Streams"
                value="24"
                trend={{ value: "3", direction: "up", label: "active streams" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Events/Second"
                value="15,420"
                trend={{ value: "2,100", direction: "up", label: "peak load" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Processing Latency"
                value="12ms"
                trend={{ value: "3ms", direction: "down", label: "improvement" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Active Alerts"
                value="3"
                trend={{ value: "2", direction: "down", label: "resolved" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Alert Response Time"
                value="2.3min"
                trend={{ value: "0.8min", direction: "down", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="False Positives"
                value="5%"
                trend={{ value: "2%", direction: "down", label: "reduced" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Uptime"
                value="99.98%"
                trend={{ value: "0.02%", direction: "up", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="CPU Usage"
                value="45%"
                trend={{ value: "10%", direction: "down", label: "optimized" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Memory Usage"
                value="68%"
                trend={{ value: "5%", direction: "down", label: "optimized" }}
              />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealtimeAnalytics;
