
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, FileText, Download, Eye, BarChart3, TrendingUp, Calendar, Filter } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

interface FinancialReport {
  id: string;
  reportName: string;
  reportType: 'Balance Sheet' | 'Income Statement' | 'Cash Flow' | 'Trial Balance' | 'General Ledger';
  period: string;
  status: 'Generated' | 'Pending' | 'Draft' | 'Published';
  createdDate: string;
  createdBy: string;
  format: 'PDF' | 'Excel' | 'CSV';
}

const FinancialReporting: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('reports');
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Financial Reporting. Generate comprehensive financial statements, regulatory reports, and management reports with real-time data integration.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleReports: FinancialReport[] = [
      {
        id: 'rpt-001',
        reportName: 'Monthly Balance Sheet',
        reportType: 'Balance Sheet',
        period: 'January 2025',
        status: 'Generated',
        createdDate: '2025-01-28',
        createdBy: 'System',
        format: 'PDF'
      },
      {
        id: 'rpt-002',
        reportName: 'P&L Statement Q4 2024',
        reportType: 'Income Statement',
        period: 'Q4 2024',
        status: 'Published',
        createdDate: '2025-01-15',
        createdBy: 'Finance Team',
        format: 'Excel'
      },
      {
        id: 'rpt-003',
        reportName: 'Cash Flow Analysis',
        reportType: 'Cash Flow',
        period: 'January 2025',
        status: 'Pending',
        createdDate: '2025-01-28',
        createdBy: 'System',
        format: 'PDF'
      }
    ];
    setReports(sampleReports);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'Generated': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Draft': 'bg-gray-100 text-gray-800',
      'Published': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'reportName', header: 'Report Name', sortable: true, searchable: true },
    { 
      key: 'reportType', 
      header: 'Type',
      filterable: true,
      filterOptions: [
        { label: 'Balance Sheet', value: 'Balance Sheet' },
        { label: 'Income Statement', value: 'Income Statement' },
        { label: 'Cash Flow', value: 'Cash Flow' },
        { label: 'Trial Balance', value: 'Trial Balance' },
        { label: 'General Ledger', value: 'General Ledger' }
      ]
    },
    { key: 'period', header: 'Period', sortable: true },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Generated', value: 'Generated' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Draft', value: 'Draft' },
        { label: 'Published', value: 'Published' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'createdDate', header: 'Created Date', sortable: true },
    { key: 'createdBy', header: 'Created By', searchable: true },
    { key: 'format', header: 'Format' }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: FinancialReport) => {
        toast({
          title: 'View Report',
          description: `Opening ${row.reportName}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Download',
      icon: <Download className="h-4 w-4" />,
      onClick: (row: FinancialReport) => {
        toast({
          title: 'Download Report',
          description: `Downloading ${row.reportName} as ${row.format}`,
        });
      },
      variant: 'ghost'
    }
  ];

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
          title="Financial Reporting"
          description="Generate comprehensive financial statements and regulatory reports"
          voiceIntroduction="Welcome to Financial Reporting for comprehensive financial statement generation."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Financial Reporting and Statements"
        examples={[
          "Generating financial statements with real-time data from the Universal Journal including balance sheet and P&L",
          "Creating regulatory reports for compliance with local GAAP and international standards like IFRS",
          "Setting up automated report generation schedules with email distribution and archival processes"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{reports.length}</div>
            <div className="text-sm text-muted-foreground">Total Reports</div>
            <div className="text-sm text-blue-600">This month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'Published').length}
            </div>
            <div className="text-sm text-muted-foreground">Published</div>
            <div className="text-sm text-green-600">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'Pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-sm text-orange-600">In progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-muted-foreground">Report Templates</div>
            <div className="text-sm text-purple-600">Available</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Financial Reports Management
                <Button onClick={() => toast({ title: 'Generate Report', description: 'Opening report generator' })}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={reports}
                actions={actions}
                searchPlaceholder="Search reports..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Balance Sheet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">ASSETS</span>
                    <span className="font-semibold">$2,450,000</span>
                  </div>
                  <div className="ml-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Current Assets</span>
                      <span>$1,200,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fixed Assets</span>
                      <span>$1,250,000</span>
                    </div>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">LIABILITIES & EQUITY</span>
                      <span className="font-semibold">$2,450,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Income Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Revenue</span>
                    <span className="text-green-600">$565,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost of Goods Sold</span>
                    <span className="text-red-600">($285,000)</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Gross Profit</span>
                    <span>$280,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operating Expenses</span>
                    <span className="text-red-600">($100,000)</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Net Income</span>
                    <span className="text-green-600">$180,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regulatory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'SOX Compliance', status: 'Compliant', dueDate: '2025-03-31' },
                  { name: 'IFRS Reporting', status: 'In Progress', dueDate: '2025-02-28' },
                  { name: 'Tax Returns', status: 'Pending', dueDate: '2025-04-15' }
                ].map((report, index) => (
                  <div key={index} className="p-4 border rounded">
                    <h4 className="font-semibold">{report.name}</h4>
                    <p className="text-sm text-muted-foreground">Due: {report.dueDate}</p>
                    <Badge className={getStatusColor(report.status === 'Compliant' ? 'Published' : report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Ratios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Current Ratio</span>
                    <span className="font-medium">2.35</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debt-to-Equity</span>
                    <span className="font-medium">0.48</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROA</span>
                    <span className="font-medium">7.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROE</span>
                    <span className="font-medium">14.4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Revenue Growth</span>
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +12.3%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Profit Margin</span>
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +2.1%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Expense Ratio</span>
                    <span className="text-red-600">-0.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReporting;
