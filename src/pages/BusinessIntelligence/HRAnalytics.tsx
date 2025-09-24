
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Users, TrendingUp, Award } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import MetricCard from '../../components/metrics/MetricCard';

const HRAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to HR Analytics. Analyze workforce metrics, employee performance, and human capital insights.');
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
          title="HR Analytics"
          description="Workforce analytics and human capital insights"
          voiceIntroduction="Welcome to HR Analytics."
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workforce">Workforce</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <MetricCard
                title="Total Employees"
                value="1,243"
                trend={{ value: "5.1%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Employee Satisfaction"
                value="4.2/5"
                trend={{ value: "0.3", direction: "up", label: "vs last survey" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Turnover Rate"
                value="8.5%"
                trend={{ value: "1.2%", direction: "down", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Training Hours"
                value="24.5"
                trend={{ value: "3.2", direction: "up", label: "per employee" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workforce" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Headcount Growth"
                value="5.1%"
                trend={{ value: "2.3%", direction: "up", label: "vs target" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Diversity Index"
                value="72%"
                trend={{ value: "4%", direction: "up", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Avg Age"
                value="34.2"
                trend={{ value: "0.8", direction: "up", label: "years" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Avg Performance Score"
                value="3.8/5"
                trend={{ value: "0.2", direction: "up", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Goal Achievement"
                value="87%"
                trend={{ value: "5%", direction: "up", label: "vs last quarter" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Promotion Rate"
                value="12%"
                trend={{ value: "2%", direction: "up", label: "vs last year" }}
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <MetricCard
                title="Retention Rate"
                value="91.5%"
                trend={{ value: "1.2%", direction: "up", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Time to Fill"
                value="28 days"
                trend={{ value: "5 days", direction: "down", label: "improvement" }}
              />
            </Card>
            <Card>
              <MetricCard
                title="Internal Mobility"
                value="23%"
                trend={{ value: "4%", direction: "up", label: "vs last year" }}
              />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRAnalytics;
