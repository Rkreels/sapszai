
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, FileText, Download, Share } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';
import { useToast } from '../../components/ui/use-toast';

const ReportBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Report Builder. Create custom reports and analytics with drag-and-drop functionality.');
    }
  }, [isEnabled, speak]);

  const reports = [
    { name: 'Monthly Sales Report', type: 'Sales', lastRun: '2024-01-15', status: 'Scheduled' },
    { name: 'Financial Summary', type: 'Finance', lastRun: '2024-01-14', status: 'Active' },
    { name: 'Inventory Analysis', type: 'Operations', lastRun: '2024-01-13', status: 'Draft' },
    { name: 'HR Metrics', type: 'Human Resources', lastRun: '2024-01-12', status: 'Active' }
  ];

  const columns = [
    { key: 'name', header: 'Report Name' },
    { key: 'type', header: 'Type' },
    { key: 'lastRun', header: 'Last Run' },
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
          title="Report Builder"
          description="Create custom reports and analytics"
          voiceIntroduction="Welcome to Report Builder."
        />
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Existing Reports</h3>
            <Button onClick={() => {
              toast({
                title: "New Report",
                description: "Report creation wizard would open here.",
              });
            }}>
              <FileText className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </div>
          <Card className="p-6">
            <DataTable columns={columns} data={reports} />
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h4 className="font-medium mb-4">Data Sources</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded cursor-pointer hover:bg-gray-50">Sales Data</div>
                <div className="p-3 border rounded cursor-pointer hover:bg-gray-50">Financial Data</div>
                <div className="p-3 border rounded cursor-pointer hover:bg-gray-50">Inventory Data</div>
                <div className="p-3 border rounded cursor-pointer hover:bg-gray-50">HR Data</div>
              </div>
            </Card>
            <Card className="p-6">
              <h4 className="font-medium mb-4">Report Elements</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded cursor-pointer hover:bg-gray-50">Table</div>
                <div className="p-3 border rounded cursor-pointer hover:bg-gray-50">Chart</div>
                <div className="p-3 border rounded cursor-pointer hover:bg-gray-50">KPI Card</div>
                <div className="p-3 border rounded cursor-pointer hover:bg-gray-50">Text Block</div>
              </div>
            </Card>
            <Card className="p-6">
              <h4 className="font-medium mb-4">Report Canvas</h4>
              <div className="h-64 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                <p className="text-gray-500">Drag elements here to build your report</p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Executive Summary',
              'Sales Performance',
              'Financial Dashboard',
              'Operational Metrics',
              'Customer Analytics',
              'Procurement Report'
            ].map((template, i) => (
              <Card key={i} className="p-4">
                <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="font-medium">{template}</h4>
                <p className="text-sm text-gray-600 mb-3">Pre-built report template</p>
                <Button size="sm" variant="outline" className="w-full" onClick={() => {
                  toast({
                    title: "Use Template",
                    description: `Template "${template}" would be applied to create a new report.`,
                  });
                }}>Use Template</Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-6">
          <Card className="p-6">
            <h4 className="font-medium mb-4">Scheduled Reports</h4>
            <div className="space-y-4">
              {reports.filter(r => r.status === 'Scheduled').map((report, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h5 className="font-medium">{report.name}</h5>
                    <p className="text-sm text-gray-600">Next run: Tomorrow 9:00 AM</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      toast({
                        title: "Download Report",
                        description: `Report "${report.name}" would be downloaded.`,
                      });
                    }}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      toast({
                        title: "Share Report",
                        description: `Sharing options for "${report.name}" would be displayed.`,
                      });
                    }}>
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportBuilder;
