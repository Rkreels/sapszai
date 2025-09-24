
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { ArrowLeft, BarChart2, Calendar, Download, FileText, Printer } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const ProductionReports: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now viewing Production Reports. This page provides various reports on production performance and activities.');
    }
  }, [isEnabled, speak]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/manufacturing')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Production Reports"
          description="View and analyze production performance and activities"
          voiceIntroduction="Welcome to Production Reports. Here you can access various reports on your production activities."
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Production Reports</h2>
          <p className="text-sm text-gray-500">May 2025</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Change Period
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="cost">Cost</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Production Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Production Orders</span>
                    <span>847</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Completed Orders</span>
                    <span>732</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Production Efficiency</span>
                    <span className="text-green-600">92.5%</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">On-Time Completion</span>
                    <span className="text-yellow-600">86.4%</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Quality Rate</span>
                    <span className="text-green-600">96.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Production Cost Variance</span>
                    <span className="text-red-600">+2.8%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Production Output</h3>
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <BarChart2 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Production output chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Recent Reports</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-3 text-left">Report Name</th>
                      <th className="border p-3 text-left">Period</th>
                      <th className="border p-3 text-left">Generated On</th>
                      <th className="border p-3 text-left">Format</th>
                      <th className="border p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span>Monthly Production Summary</span>
                        </div>
                      </td>
                      <td className="border p-3">Apr 2025</td>
                      <td className="border p-3">May 1, 2025</td>
                      <td className="border p-3">Excel, PDF</td>
                      <td className="border p-3">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span>Production Efficiency Analysis</span>
                        </div>
                      </td>
                      <td className="border p-3">Q1 2025</td>
                      <td className="border p-3">Apr 15, 2025</td>
                      <td className="border p-3">PDF</td>
                      <td className="border p-3">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span>Quality Defect Analysis</span>
                        </div>
                      </td>
                      <td className="border p-3">Apr 2025</td>
                      <td className="border p-3">Apr 30, 2025</td>
                      <td className="border p-3">Excel, PDF</td>
                      <td className="border p-3">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="efficiency">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Efficiency Reports</h2>
            <p className="text-gray-500 mb-6">Detailed reports on production efficiency metrics</p>
            <div className="text-center py-12 border-dashed border-2 border-gray-300 rounded-md">
              <BarChart2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Production efficiency reports will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Including OEE, throughput, and capacity utilization</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="quality">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quality Reports</h2>
            <p className="text-gray-500 mb-6">Quality metrics and defect analysis reports</p>
            <div className="text-center py-12 border-dashed border-2 border-gray-300 rounded-md">
              <BarChart2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Quality reports will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Including defect rates, quality inspections, and root cause analysis</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="cost">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Cost Reports</h2>
            <p className="text-gray-500 mb-6">Production cost analysis and variance reports</p>
            <div className="text-center py-12 border-dashed border-2 border-gray-300 rounded-md">
              <BarChart2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Production cost reports will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Including unit costs, cost variances, and cost reduction opportunities</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Custom Reports</h2>
            <p className="text-gray-500 mb-6">Generate custom reports based on your specific requirements</p>
            <div className="text-center py-12 border-dashed border-2 border-gray-300 rounded-md">
              <BarChart2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Custom report builder will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Select metrics, time periods, and visualization options</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionReports;
