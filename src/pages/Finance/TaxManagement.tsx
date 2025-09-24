import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Calculator, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Edit,
  Download,
  Calendar
} from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

interface TaxReturn {
  id: string;
  returnType: 'Corporate Income Tax' | 'Sales Tax' | 'VAT' | 'Payroll Tax' | 'Property Tax';
  period: string;
  dueDate: string;
  status: 'Draft' | 'Filed' | 'Accepted' | 'Rejected' | 'Overdue';
  taxAmount: number;
  jurisdiction: string;
  filedDate?: string;
}

interface TaxProvision {
  id: string;
  taxType: string;
  period: string;
  estimatedTax: number;
  actualTax: number;
  variance: number;
  status: 'Estimated' | 'Final' | 'Audited';
}

interface TaxCompliance {
  id: string;
  requirement: string;
  jurisdiction: string;
  dueDate: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  responsible: string;
}

const TaxManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('returns');
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([]);
  const [taxProvisions, setTaxProvisions] = useState<TaxProvision[]>([]);
  const [compliance, setCompliance] = useState<TaxCompliance[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Tax Management. Handle tax compliance, returns, provisions, and reporting for comprehensive tax operations.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadTaxData();
  }, []);

  const loadTaxData = () => {
    const sampleReturns: TaxReturn[] = [
      {
        id: 'tr-001',
        returnType: 'Corporate Income Tax',
        period: '2024',
        dueDate: '2025-03-15',
        status: 'Draft',
        taxAmount: 125000,
        jurisdiction: 'Federal',
      },
      {
        id: 'tr-002',
        returnType: 'Sales Tax',
        period: 'Q4 2024',
        dueDate: '2025-01-31',
        status: 'Filed',
        taxAmount: 45000,
        jurisdiction: 'California',
        filedDate: '2025-01-25'
      },
      {
        id: 'tr-003',
        returnType: 'Payroll Tax',
        period: 'December 2024',
        dueDate: '2025-01-15',
        status: 'Overdue',
        taxAmount: 28000,
        jurisdiction: 'Federal',
      }
    ];

    const sampleProvisions: TaxProvision[] = [
      {
        id: 'tp-001',
        taxType: 'Income Tax',
        period: '2024',
        estimatedTax: 125000,
        actualTax: 118500,
        variance: -6500,
        status: 'Final'
      },
      {
        id: 'tp-002',
        taxType: 'State Tax',
        period: '2024',
        estimatedTax: 35000,
        actualTax: 0,
        variance: 0,
        status: 'Estimated'
      }
    ];

    const sampleCompliance: TaxCompliance[] = [
      {
        id: 'tc-001',
        requirement: '1099 Forms Filing',
        jurisdiction: 'Federal',
        dueDate: '2025-01-31',
        status: 'Pending',
        responsible: 'Tax Department'
      },
      {
        id: 'tc-002',
        requirement: 'Annual Franchise Tax',
        jurisdiction: 'Delaware',
        dueDate: '2025-03-01',
        status: 'Completed',
        responsible: 'Legal Department'
      }
    ];

    setTaxReturns(sampleReturns);
    setTaxProvisions(sampleProvisions);
    setCompliance(sampleCompliance);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Filed': 'bg-blue-100 text-blue-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Estimated': 'bg-blue-100 text-blue-800',
      'Final': 'bg-green-100 text-green-800',
      'Audited': 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const returnColumns: EnhancedColumn[] = [
    { key: 'returnType', header: 'Return Type', searchable: true },
    { key: 'period', header: 'Period', sortable: true },
    { key: 'jurisdiction', header: 'Jurisdiction', searchable: true },
    { 
      key: 'taxAmount', 
      header: 'Tax Amount',
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'dueDate', header: 'Due Date', sortable: true },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Draft', value: 'Draft' },
        { label: 'Filed', value: 'Filed' },
        { label: 'Accepted', value: 'Accepted' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'Overdue', value: 'Overdue' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    }
  ];

  const returnActions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: TaxReturn) => {
        toast({
          title: 'View Tax Return',
          description: `Opening ${row.returnType} for ${row.period}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'File Return',
      icon: <FileText className="h-4 w-4" />,
      onClick: (row: TaxReturn) => {
        toast({
          title: 'File Tax Return',
          description: `Filing ${row.returnType} for ${row.period}`,
        });
      },
      variant: 'ghost',
      condition: (row: TaxReturn) => row.status === 'Draft'
    }
  ];

  const provisionColumns: EnhancedColumn[] = [
    { key: 'taxType', header: 'Tax Type', searchable: true },
    { key: 'period', header: 'Period', sortable: true },
    { 
      key: 'estimatedTax', 
      header: 'Estimated',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'actualTax', 
      header: 'Actual',
      render: (value: number) => value > 0 ? `$${value.toLocaleString()}` : 'TBD'
    },
    { 
      key: 'variance', 
      header: 'Variance',
      render: (value: number) => (
        <span className={value > 0 ? 'text-red-600' : value < 0 ? 'text-green-600' : 'text-gray-600'}>
          {value !== 0 ? `$${Math.abs(value).toLocaleString()}` : '$0'}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    }
  ];

  const complianceColumns: EnhancedColumn[] = [
    { key: 'requirement', header: 'Requirement', searchable: true },
    { key: 'jurisdiction', header: 'Jurisdiction', searchable: true },
    { key: 'dueDate', header: 'Due Date', sortable: true },
    { key: 'responsible', header: 'Responsible', searchable: true },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    }
  ];

  const totalTaxLiability = taxReturns.reduce((sum, tr) => sum + tr.taxAmount, 0);
  const overdueReturns = taxReturns.filter(tr => tr.status === 'Overdue').length;
  const pendingCompliance = compliance.filter(c => c.status === 'Pending').length;

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
          title="Tax Management"
          description="Comprehensive tax compliance, returns, and reporting management"
          voiceIntroduction="Welcome to Tax Management for comprehensive tax compliance and reporting."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Tax Management and Compliance"
        examples={[
          "Managing tax provisions and calculations with automated tax determination and compliance reporting",
          "Processing tax returns for multiple jurisdictions with electronic filing and status tracking",
          "Handling tax compliance requirements including deadlines, documentation, and audit preparation"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">${totalTaxLiability.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Tax Liability</div>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{taxReturns.length}</div>
                <div className="text-sm text-muted-foreground">Tax Returns</div>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{overdueReturns}</div>
                <div className="text-sm text-muted-foreground">Overdue Returns</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{pendingCompliance}</div>
                <div className="text-sm text-muted-foreground">Pending Compliance</div>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="returns">Tax Returns</TabsTrigger>
          <TabsTrigger value="provisions">Tax Provisions</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Tax Returns Management
                <Button onClick={() => toast({ title: 'New Tax Return', description: 'Opening tax return preparation form' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Prepare Return
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={returnColumns}
                data={taxReturns}
                actions={returnActions}
                searchPlaceholder="Search tax returns..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="provisions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Tax Provisions
                <Button onClick={() => toast({ title: 'New Provision', description: 'Opening tax provision setup form' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provision
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={provisionColumns}
                data={taxProvisions}
                searchPlaceholder="Search tax provisions..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Tax Compliance Calendar
                <Button onClick={() => toast({ title: 'New Requirement', description: 'Adding compliance requirement' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={complianceColumns}
                data={compliance}
                searchPlaceholder="Search compliance requirements..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Reporting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="provision">Tax Provision Report</SelectItem>
                        <SelectItem value="compliance">Compliance Status</SelectItem>
                        <SelectItem value="liability">Tax Liability Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current Year</SelectItem>
                        <SelectItem value="previous">Previous Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxReturns
                    .filter(tr => tr.status !== 'Filed' && tr.status !== 'Accepted')
                    .slice(0, 5)
                    .map((taxReturn) => (
                      <div key={taxReturn.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{taxReturn.returnType}</div>
                          <div className="text-sm text-muted-foreground">{taxReturn.period}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${taxReturn.status === 'Overdue' ? 'text-red-600' : 'text-blue-600'}`}>
                            {taxReturn.dueDate}
                          </div>
                          <Badge className={getStatusColor(taxReturn.status)}>
                            {taxReturn.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxManagement;
