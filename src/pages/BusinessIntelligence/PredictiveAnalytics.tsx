
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Brain, TrendingUp, Target } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import MetricCard from '../../components/metrics/MetricCard';

const PredictiveAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Predictive Analytics. Leverage machine learning and AI models for forecasting and predictive insights.');
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
          title="Predictive Analytics"
          description="Machine learning and predictive modeling"
          voiceIntroduction="Welcome to Predictive Analytics."
        />
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList>
          <TabsTrigger value="models">ML Models</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Active Models"
                value="12"
                trend={{ value: "3", direction: "up", label: "new models" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Model Accuracy"
                value="94.2%"
                trend={{ value: "2.1%", direction: "up", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Predictions Made"
                value="45,230"
                trend={{ value: "18%", direction: "up", label: "this month" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Demand Forecast"
                value="98.5%"
                trend={{ value: "1.5%", direction: "up", label: "accuracy" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Revenue Forecast"
                value="$15.2M"
                trend={{ value: "8.3%", direction: "up", label: "next quarter" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Forecast Horizon"
                value="90 days"
                trend={{ value: "15 days", direction: "up", label: "extended" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Risk Score"
                value="Low"
                trend={{ value: "5%", direction: "down", label: "risk reduction" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Fraud Detection"
                value="99.7%"
                trend={{ value: "0.3%", direction: "up", label: "accuracy" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Alert Precision"
                value="87%"
                trend={{ value: "4%", direction: "up", label: "improvement" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Process Efficiency"
                value="96.8%"
                trend={{ value: "3.2%", direction: "up", label: "optimization" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Cost Reduction"
                value="$250K"
                trend={{ value: "15%", direction: "up", label: "vs baseline" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Resource Utilization"
                value="89%"
                trend={{ value: "6%", direction: "up", label: "improvement" }}
              />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveAnalytics;
