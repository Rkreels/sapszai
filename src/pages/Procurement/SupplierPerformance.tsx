
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, TrendingUp, Award, AlertTriangle, Target } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const SupplierPerformance: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Supplier Performance Analytics. Monitor and evaluate supplier performance metrics, delivery reliability, and quality standards.');
    }
  }, [isEnabled, speak]);

  const performanceData = [
    { month: 'Jan', onTime: 95, quality: 98, cost: 92 },
    { month: 'Feb', onTime: 92, quality: 96, cost: 94 },
    { month: 'Mar', onTime: 98, quality: 99, cost: 89 },
    { month: 'Apr', onTime: 94, quality: 97, cost: 93 },
    { month: 'May', onTime: 96, quality: 98, cost: 91 },
    { month: 'Jun', onTime: 99, quality: 99, cost: 95 }
  ];

  const supplierScores = [
    { supplier: 'Dell Technologies', score: 4.8, onTime: 98, quality: 99, cost: 4.5 },
    { supplier: 'Microsoft Corp', score: 4.6, onTime: 95, quality: 98, cost: 4.2 },
    { supplier: 'Oracle Corp', score: 4.4, onTime: 92, quality: 96, cost: 4.6 },
    { supplier: 'Acme Manufacturing', score: 4.2, onTime: 89, quality: 94, cost: 4.8 },
    { supplier: 'Global Services Ltd', score: 4.0, onTime: 85, quality: 92, cost: 4.3 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/procurement')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Supplier Performance"
          description="Monitor and evaluate supplier performance metrics and quality standards"
          voiceIntroduction="Welcome to Supplier Performance Analytics for comprehensive vendor evaluation."
        />
      </div>

      <VoiceTrainingComponent 
        module="Supplier Management"
        topic="Performance Analytics"
        examples={[
          "Tracking supplier performance metrics including on-time delivery, quality scores, and cost competitiveness",
          "Creating supplier scorecards with weighted criteria for delivery, quality, service, and innovation",
          "Implementing performance improvement plans and monitoring supplier development initiatives"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">96.2%</div>
            <div className="text-sm text-muted-foreground">Avg On-Time Delivery</div>
            <div className="text-sm text-green-600">+2.1% vs last quarter</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">97.8%</div>
            <div className="text-sm text-muted-foreground">Quality Score</div>
            <div className="text-sm text-green-600">Excellent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">4.4</div>
            <div className="text-sm text-muted-foreground">Avg Supplier Rating</div>
            <div className="text-sm text-blue-600">Out of 5.0</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Improvement Plans</div>
            <div className="text-sm text-orange-600">In progress</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scorecards">Scorecards</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="improvement">Improvement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="onTime" stroke="#8884d8" name="On-Time Delivery %" />
                  <Line type="monotone" dataKey="quality" stroke="#82ca9d" name="Quality Score %" />
                  <Line type="monotone" dataKey="cost" stroke="#ffc658" name="Cost Performance %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scorecards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Scorecards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplierScores.map((supplier, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">{supplier.supplier}</h4>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold">{supplier.score}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{supplier.onTime}%</div>
                        <div className="text-sm text-muted-foreground">On-Time Delivery</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{supplier.quality}%</div>
                        <div className="text-sm text-muted-foreground">Quality Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{supplier.cost}</div>
                        <div className="text-sm text-muted-foreground">Cost Rating</div>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Performance Plan</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="onTime" fill="#8884d8" name="On-Time %" />
                  <Bar dataKey="quality" fill="#82ca9d" name="Quality %" />
                  <Bar dataKey="cost" fill="#ffc658" name="Cost %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Improvement Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg border-orange-200 bg-orange-50">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                    <h4 className="font-semibold">Global Services Ltd - Delivery Improvement</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    On-time delivery rate below target (85% vs 90% target)
                  </p>
                  <div className="flex space-x-2">
                    <Badge className="bg-orange-100 text-orange-800">In Progress</Badge>
                    <span className="text-sm">Target: 90% by Q2 2025</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg border-blue-200 bg-blue-50">
                  <div className="flex items-center mb-2">
                    <Target className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold">Acme Manufacturing - Quality Enhancement</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Quality score improvement initiative with monthly reviews
                  </p>
                  <div className="flex space-x-2">
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                    <span className="text-sm">Target: 98% quality score</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg border-green-200 bg-green-50">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-semibold">Dell Technologies - Excellence Program</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Strategic partnership development and innovation collaboration
                  </p>
                  <div className="flex space-x-2">
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    <span className="text-sm">Achieved 4.8/5.0 rating</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierPerformance;
