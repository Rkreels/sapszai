
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calculator, PieChart, TrendingUp, Target } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

const CostAccounting: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Cost Accounting. Manage cost centers, profit centers, and internal orders for accurate cost allocation and management reporting.');
    }
  }, [isEnabled, speak]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/finance')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Cost Accounting"
          description="Manage cost centers, profit centers, and internal cost allocation"
          voiceIntroduction="Welcome to Cost Accounting for comprehensive cost management."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Cost Accounting Management"
        examples={[
          "Managing cost centers for departmental cost tracking and budget control with automated allocations",
          "Setting up profit centers for segment reporting and profitability analysis by business units",
          "Creating internal orders for project-based cost collection and WBS elements for complex projects"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calculator className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">125</div>
            <div className="text-sm text-muted-foreground">Cost Centers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <PieChart className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">45</div>
            <div className="text-sm text-muted-foreground">Profit Centers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">89</div>
            <div className="text-sm text-muted-foreground">Internal Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">$2.4M</div>
            <div className="text-sm text-muted-foreground">Monthly Costs</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost Centers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 'CC-1100', name: 'Administration', budget: '€450,000', actual: '€398,500', variance: '-11.4%' },
                { id: 'CC-2100', name: 'Production', budget: '€1,250,000', actual: '€1,287,300', variance: '+3.0%' },
                { id: 'CC-3100', name: 'Sales & Marketing', budget: '€680,000', actual: '€642,100', variance: '-5.6%' },
                { id: 'CC-4100', name: 'IT Department', budget: '€320,000', actual: '€334,800', variance: '+4.6%' }
              ].map((cc) => (
                <div key={cc.id} className="p-3 border rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{cc.name}</div>
                      <div className="text-sm text-muted-foreground">{cc.id}</div>
                    </div>
                    <Badge variant={cc.variance.startsWith('-') ? 'default' : 'secondary'}>
                      {cc.variance}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Budget: {cc.budget}</div>
                    <div>Actual: {cc.actual}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit Centers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 'PC-1000', name: 'North America', revenue: '€12,500,000', costs: '€8,750,000', profit: '€3,750,000' },
                { id: 'PC-2000', name: 'Europe', revenue: '€18,400,000', costs: '€13,480,000', profit: '€4,920,000' },
                { id: 'PC-3000', name: 'Asia Pacific', revenue: '€9,800,000', costs: '€7,350,000', profit: '€2,450,000' },
                { id: 'PC-4000', name: 'Latin America', revenue: '€5,200,000', costs: '€4,160,000', profit: '€1,040,000' }
              ].map((pc) => (
                <div key={pc.id} className="p-3 border rounded">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-medium">{pc.name}</div>
                      <div className="text-sm text-muted-foreground">{pc.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">{pc.profit}</div>
                      <div className="text-xs text-muted-foreground">Profit</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Revenue: {pc.revenue}</div>
                    <div>Costs: {pc.costs}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Internal Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'IO-100001', description: 'Office Renovation Project', budget: '€85,000', actual: '€72,450', status: 'Open' },
                { id: 'IO-100002', description: 'IT Infrastructure Upgrade', budget: '€125,000', actual: '€98,750', status: 'Open' },
                { id: 'IO-100003', description: 'Marketing Campaign Q1', budget: '€45,000', actual: '€45,000', status: 'Closed' },
                { id: 'IO-100004', description: 'Employee Training Program', budget: '€32,000', actual: '€28,900', status: 'Open' },
                { id: 'IO-100005', description: 'Quality Improvement Initiative', budget: '€68,000', actual: '€52,300', status: 'Open' },
                { id: 'IO-100006', description: 'Safety Compliance Project', budget: '€22,000', actual: '€22,000', status: 'Closed' }
              ].map((io) => (
                <div key={io.id} className="p-4 border rounded">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm font-medium">{io.id}</div>
                    <Badge variant={io.status === 'Open' ? 'secondary' : 'default'}>
                      {io.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">{io.description}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span className="font-medium">{io.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actual:</span>
                      <span className="font-medium">{io.actual}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Allocation & Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Direct Cost Allocation</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Material Costs</span>
                  <span className="font-medium">€8,450,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Labor Costs</span>
                  <span className="font-medium">€5,280,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Machine Costs</span>
                  <span className="font-medium">€2,650,000</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total Direct</span>
                  <span className="font-semibold">€16,380,000</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Overhead Allocation</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Manufacturing Overhead</span>
                  <span className="font-medium">€3,240,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Administrative Overhead</span>
                  <span className="font-medium">€1,890,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Facility Costs</span>
                  <span className="font-medium">€1,120,000</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total Overhead</span>
                  <span className="font-semibold">€6,250,000</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostAccounting;
