
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Download, Calendar, TrendingUp, FileText, Filter } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

interface BalanceSheetItem {
  account: string;
  currentYear: number;
  previousYear: number;
  variance: number;
  variancePercent: number;
}

const BalanceSheet: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('assets');
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Balance Sheet reporting. View comprehensive financial position with assets, liabilities, and equity with comparative analysis and drill-down capabilities.');
    }
  }, [isEnabled, speak]);

  const assets: BalanceSheetItem[] = [
    { account: 'Cash and Cash Equivalents', currentYear: 2450000, previousYear: 2100000, variance: 350000, variancePercent: 16.7 },
    { account: 'Accounts Receivable', currentYear: 1850000, previousYear: 1650000, variance: 200000, variancePercent: 12.1 },
    { account: 'Inventory', currentYear: 3200000, previousYear: 2950000, variance: 250000, variancePercent: 8.5 },
    { account: 'Prepaid Expenses', currentYear: 180000, previousYear: 160000, variance: 20000, variancePercent: 12.5 },
    { account: 'Property, Plant & Equipment', currentYear: 8500000, previousYear: 8200000, variance: 300000, variancePercent: 3.7 },
    { account: 'Accumulated Depreciation', currentYear: -2100000, previousYear: -1850000, variance: -250000, variancePercent: 13.5 },
    { account: 'Intangible Assets', currentYear: 950000, previousYear: 1100000, variance: -150000, variancePercent: -13.6 }
  ];

  const liabilities: BalanceSheetItem[] = [
    { account: 'Accounts Payable', currentYear: 1250000, previousYear: 1100000, variance: 150000, variancePercent: 13.6 },
    { account: 'Accrued Liabilities', currentYear: 480000, previousYear: 420000, variance: 60000, variancePercent: 14.3 },
    { account: 'Short-term Debt', currentYear: 750000, previousYear: 650000, variance: 100000, variancePercent: 15.4 },
    { account: 'Long-term Debt', currentYear: 3200000, previousYear: 3500000, variance: -300000, variancePercent: -8.6 },
    { account: 'Deferred Tax Liabilities', currentYear: 320000, previousYear: 295000, variance: 25000, variancePercent: 8.5 }
  ];

  const equity: BalanceSheetItem[] = [
    { account: 'Common Stock', currentYear: 2000000, previousYear: 2000000, variance: 0, variancePercent: 0 },
    { account: 'Retained Earnings', currentYear: 6850000, previousYear: 6120000, variance: 730000, variancePercent: 11.9 },
    { account: 'Additional Paid-in Capital', currentYear: 1200000, previousYear: 1200000, variance: 0, variancePercent: 0 },
    { account: 'Accumulated Other Comprehensive Income', currentYear: 180000, previousYear: 165000, variance: 15000, variancePercent: 9.1 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const calculateTotal = (items: BalanceSheetItem[]) => {
    return items.reduce((sum, item) => sum + item.currentYear, 0);
  };

  const renderBalanceSheetSection = (items: BalanceSheetItem[], title: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 py-2 border-b">
              <div className="font-medium">{item.account}</div>
              <div className="text-right">{formatCurrency(item.currentYear)}</div>
              <div className="text-right">{formatCurrency(item.previousYear)}</div>
              <div className={`text-right ${getVarianceColor(item.variance)}`}>
                {formatCurrency(item.variance)} ({item.variancePercent > 0 ? '+' : ''}{item.variancePercent}%)
              </div>
            </div>
          ))}
          <div className="grid grid-cols-4 gap-4 py-2 border-t-2 font-bold">
            <div>Total {title}</div>
            <div className="text-right">{formatCurrency(calculateTotal(items))}</div>
            <div className="text-right">{formatCurrency(items.reduce((sum, item) => sum + item.previousYear, 0))}</div>
            <div className="text-right">{formatCurrency(items.reduce((sum, item) => sum + item.variance, 0))}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
          title="Balance Sheet"
          description="Comprehensive financial position statement with comparative analysis"
          voiceIntroduction="Welcome to Balance Sheet reporting with comprehensive financial position analysis."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Balance Sheet Analysis"
        examples={[
          "Analyzing financial position with assets, liabilities, and equity structure including liquidity ratios and leverage metrics",
          "Comparing year-over-year changes in balance sheet items with variance analysis and trend identification",
          "Drilling down into account details with supporting schedules and reconciliation reports for audit compliance"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatCurrency(calculateTotal(assets))}</div>
            <div className="text-sm text-muted-foreground">Total Assets</div>
            <div className="text-sm text-blue-600">Current Year</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatCurrency(calculateTotal(liabilities))}</div>
            <div className="text-sm text-muted-foreground">Total Liabilities</div>
            <div className="text-sm text-red-600">Current Year</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatCurrency(calculateTotal(equity))}</div>
            <div className="text-sm text-muted-foreground">Total Equity</div>
            <div className="text-sm text-green-600">Current Year</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {((calculateTotal(liabilities) / calculateTotal(assets)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Debt Ratio</div>
            <div className="text-sm text-purple-600">Key Metric</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
          <TabsTrigger value="equity">Equity</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <div className="grid grid-cols-4 gap-4 py-2 font-semibold border-b">
            <div>Account</div>
            <div className="text-right">Current Year</div>
            <div className="text-right">Previous Year</div>
            <div className="text-right">Variance</div>
          </div>
          {renderBalanceSheetSection(assets, 'Assets')}
        </TabsContent>

        <TabsContent value="liabilities" className="space-y-4">
          <div className="grid grid-cols-4 gap-4 py-2 font-semibold border-b">
            <div>Account</div>
            <div className="text-right">Current Year</div>
            <div className="text-right">Previous Year</div>
            <div className="text-right">Variance</div>
          </div>
          {renderBalanceSheetSection(liabilities, 'Liabilities')}
        </TabsContent>

        <TabsContent value="equity" className="space-y-4">
          <div className="grid grid-cols-4 gap-4 py-2 font-semibold border-b">
            <div>Account</div>
            <div className="text-right">Current Year</div>
            <div className="text-right">Previous Year</div>
            <div className="text-right">Variance</div>
          </div>
          {renderBalanceSheetSection(equity, 'Equity')}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Ratios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Current Ratio</span>
                    <span className="font-medium">3.45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quick Ratio</span>
                    <span className="font-medium">2.18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debt-to-Equity</span>
                    <span className="font-medium">0.62</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Asset Turnover</span>
                    <span className="font-medium">1.24</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded">
                    <span className="text-green-800 font-medium">Cash increased by $350K</span>
                    <p className="text-sm text-green-600">Strong cash position improvement</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <span className="text-blue-800 font-medium">Debt reduced by $300K</span>
                    <p className="text-sm text-blue-600">Improved leverage position</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <span className="text-purple-800 font-medium">Equity grew by $745K</span>
                    <p className="text-sm text-purple-600">Strong retained earnings growth</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => toast({ title: 'Export', description: 'Exporting balance sheet to Excel' })}>
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </Button>
        <Button variant="outline" onClick={() => toast({ title: 'Print', description: 'Preparing balance sheet for printing' })}>
          <FileText className="h-4 w-4 mr-2" />
          Print Report
        </Button>
      </div>
    </div>
  );
};

export default BalanceSheet;
