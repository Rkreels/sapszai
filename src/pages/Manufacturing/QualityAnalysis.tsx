
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { ArrowLeft, BarChart2, Download, FileText, Filter, Search } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const QualityAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now viewing Quality Analysis. This page helps you analyze quality metrics and identify improvement opportunities.');
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
          title="Quality Analysis"
          description="Analyze quality metrics and identify improvement opportunities"
          voiceIntroduction="Welcome to Quality Analysis. Here you can analyze quality performance and identify areas for improvement."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Overall Quality Rating</h3>
          <div className="text-3xl font-semibold mb-2">96.3%</div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">↑ 0.8%</span>
            <span className="text-xs text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Defect Rate</h3>
          <div className="text-3xl font-semibold mb-2">3.7%</div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">↓ 0.5%</span>
            <span className="text-xs text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Quality Incidents</h3>
          <div className="text-3xl font-semibold mb-2">12</div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">↓ 3</span>
            <span className="text-xs text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Quality Cost</h3>
          <div className="text-3xl font-semibold mb-2">$43.2K</div>
          <div className="flex items-center">
            <span className="text-red-500 text-sm font-medium">↑ 4.5%</span>
            <span className="text-xs text-gray-500 ml-2">vs budget</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Quality Analysis</h2>
          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="defects">Defect Analysis</TabsTrigger>
          <TabsTrigger value="trends">Quality Trends</TabsTrigger>
          <TabsTrigger value="costs">Quality Costs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Quality by Product Line</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Product Line A</span>
                      <span className="font-medium">97.8%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: '97.8%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Product Line B</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: '94.2%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Product Line C</span>
                      <span className="font-medium text-yellow-600">89.6%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-full" style={{ width: '89.6%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Product Line D</span>
                      <span className="font-medium">96.5%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: '96.5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Quality Trend</h3>
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <BarChart2 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Quality trend chart will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Recent Quality Incidents</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-3 text-left">Incident ID</th>
                      <th className="border p-3 text-left">Product</th>
                      <th className="border p-3 text-left">Type</th>
                      <th className="border p-3 text-left">Date</th>
                      <th className="border p-3 text-left">Status</th>
                      <th className="border p-3 text-left">Impact</th>
                      <th className="border p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">QI-2025-042</td>
                      <td className="border p-3">Widget C</td>
                      <td className="border p-3">Dimensional Variance</td>
                      <td className="border p-3">May 12, 2025</td>
                      <td className="border p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">In Progress</span>
                      </td>
                      <td className="border p-3">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Medium</span>
                      </td>
                      <td className="border p-3">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">QI-2025-041</td>
                      <td className="border p-3">Widget A</td>
                      <td className="border p-3">Material Defect</td>
                      <td className="border p-3">May 10, 2025</td>
                      <td className="border p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Resolved</span>
                      </td>
                      <td className="border p-3">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">High</span>
                      </td>
                      <td className="border p-3">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">QI-2025-040</td>
                      <td className="border p-3">Widget B</td>
                      <td className="border p-3">Assembly Error</td>
                      <td className="border p-3">May 8, 2025</td>
                      <td className="border p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Resolved</span>
                      </td>
                      <td className="border p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Low</span>
                      </td>
                      <td className="border p-3">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="defects">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Defect Analysis</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 rounded-md h-64 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Defect Pareto Chart</p>
                  <p className="text-xs text-gray-400 mt-2">Showing main defect categories and frequencies</p>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-md h-64 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Defect Distribution by Location</p>
                  <p className="text-xs text-gray-400 mt-2">Showing defect distribution across production stages</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Top Defect Categories</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-3 text-left">Defect Category</th>
                      <th className="border p-3 text-left">Count</th>
                      <th className="border p-3 text-left">% of Total</th>
                      <th className="border p-3 text-left">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Dimensional Variance</td>
                      <td className="border p-3">124</td>
                      <td className="border p-3">31.5%</td>
                      <td className="border p-3 text-red-500">↑ 2.3%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Surface Finish</td>
                      <td className="border p-3">87</td>
                      <td className="border p-3">22.1%</td>
                      <td className="border p-3 text-green-500">↓ 1.4%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Assembly Error</td>
                      <td className="border p-3">65</td>
                      <td className="border p-3">16.5%</td>
                      <td className="border p-3 text-green-500">↓ 3.7%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Material Defect</td>
                      <td className="border p-3">42</td>
                      <td className="border p-3">10.7%</td>
                      <td className="border p-3 text-green-500">↓ 0.8%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border p-3">Electrical Failure</td>
                      <td className="border p-3">36</td>
                      <td className="border p-3">9.2%</td>
                      <td className="border p-3 text-red-500">↑ 1.1%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quality Trends</h2>
            <p className="text-gray-500 mb-6">Long-term quality performance trends and analysis</p>
            <div className="text-center py-12 border-dashed border-2 border-gray-300 rounded-md">
              <BarChart2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Quality trend charts will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Including historical quality metrics and trend analysis</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="costs">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quality Costs</h2>
            <p className="text-gray-500 mb-6">Analysis of quality-related costs and improvement opportunities</p>
            <div className="text-center py-12 border-dashed border-2 border-gray-300 rounded-md">
              <BarChart2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Quality cost analysis will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Including prevention, appraisal, and failure costs</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QualityAnalysis;
