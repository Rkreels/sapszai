
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Plus, Save, Send, Eye, Trash2, Calculator } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';

interface JournalEntry {
  id: string;
  documentNumber: string;
  postingDate: string;
  reference: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: 'Draft' | 'Posted' | 'Cancelled';
  createdBy: string;
  createdDate: string;
}

interface JournalEntryLine {
  id: string;
  lineNumber: number;
  account: string;
  accountName: string;
  debitAmount: number;
  creditAmount: number;
  description: string;
  costCenter?: string;
  profitCenter?: string;
}

const JournalEntry: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('entries');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [entryLines, setEntryLines] = useState<JournalEntryLine[]>([]);
  const [isAddLineDialogOpen, setIsAddLineDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Journal Entry Processing. Create, manage, and post journal entries with comprehensive validation and approval workflows.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleEntries: JournalEntry[] = [
      {
        id: 'je-001',
        documentNumber: 'JE-2025-001',
        postingDate: '2025-01-28',
        reference: 'ACR-001',
        description: 'Accrual for January utilities',
        totalDebit: 5000.00,
        totalCredit: 5000.00,
        status: 'Posted',
        createdBy: 'John Smith',
        createdDate: '2025-01-28'
      },
      {
        id: 'je-002',
        documentNumber: 'JE-2025-002',
        postingDate: '2025-01-29',
        reference: 'DEP-001',
        description: 'Monthly depreciation entry',
        totalDebit: 15000.00,
        totalCredit: 15000.00,
        status: 'Draft',
        createdBy: 'Jane Doe',
        createdDate: '2025-01-29'
      }
    ];
    setJournalEntries(sampleEntries);

    const sampleLines: JournalEntryLine[] = [
      {
        id: 'line-001',
        lineNumber: 1,
        account: '6200',
        accountName: 'Utilities Expense',
        debitAmount: 5000.00,
        creditAmount: 0,
        description: 'January utilities accrual',
        costCenter: 'CC-001',
        profitCenter: 'PC-001'
      },
      {
        id: 'line-002',
        lineNumber: 2,
        account: '2100',
        accountName: 'Accrued Liabilities',
        debitAmount: 0,
        creditAmount: 5000.00,
        description: 'January utilities accrual',
        costCenter: 'CC-001',
        profitCenter: 'PC-001'
      }
    ];
    setEntryLines(sampleLines);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Posted': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'documentNumber', header: 'Document Number', sortable: true, searchable: true },
    { key: 'postingDate', header: 'Posting Date', sortable: true },
    { key: 'reference', header: 'Reference', searchable: true },
    { key: 'description', header: 'Description', searchable: true },
    { 
      key: 'totalDebit', 
      header: 'Total Debit',
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'totalCredit', 
      header: 'Total Credit',
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Draft', value: 'Draft' },
        { label: 'Posted', value: 'Posted' },
        { label: 'Cancelled', value: 'Cancelled' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'createdBy', header: 'Created By', searchable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: JournalEntry) => {
        setSelectedEntry(row);
        setActiveTab('create');
        toast({
          title: 'View Journal Entry',
          description: `Opening ${row.documentNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Post',
      icon: <Send className="h-4 w-4" />,
      onClick: (row: JournalEntry) => {
        toast({
          title: 'Post Journal Entry',
          description: `Posting ${row.documentNumber}`,
        });
      },
      variant: 'ghost',
      condition: (row: JournalEntry) => row.status === 'Draft'
    }
  ];

  const lineColumns: EnhancedColumn[] = [
    { key: 'lineNumber', header: 'Line', sortable: true },
    { key: 'account', header: 'Account', searchable: true },
    { key: 'accountName', header: 'Account Name', searchable: true },
    { 
      key: 'debitAmount', 
      header: 'Debit',
      render: (value: number) => value > 0 ? `$${value.toLocaleString()}` : ''
    },
    { 
      key: 'creditAmount', 
      header: 'Credit',
      render: (value: number) => value > 0 ? `$${value.toLocaleString()}` : ''
    },
    { key: 'description', header: 'Description', searchable: true },
    { key: 'costCenter', header: 'Cost Center' }
  ];

  const lineActions: TableAction[] = [
    {
      label: 'Edit',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: JournalEntryLine) => {
        toast({
          title: 'Edit Line',
          description: `Editing line ${row.lineNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: JournalEntryLine) => {
        toast({
          title: 'Delete Line',
          description: `Deleting line ${row.lineNumber}`,
        });
      },
      variant: 'ghost'
    }
  ];

  const handleAddLine = () => {
    setIsAddLineDialogOpen(true);
  };

  const handleValidate = () => {
    const balance = entryLines.reduce((sum, line) => sum + line.debitAmount - line.creditAmount, 0);
    if (balance === 0) {
      toast({
        title: 'Validation Successful',
        description: 'Journal entry is balanced and ready for posting.',
      });
    } else {
      toast({
        title: 'Validation Failed',
        description: `Journal entry is not balanced. Debits and credits differ by $${Math.abs(balance).toLocaleString()}.`,
        variant: 'destructive',
      });
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: 'Draft Saved',
      description: 'Journal entry draft has been saved successfully.',
    });
  };

  const handlePostEntry = () => {
    const balance = entryLines.reduce((sum, line) => sum + line.debitAmount - line.creditAmount, 0);
    if (balance !== 0) {
      toast({
        title: 'Cannot Post',
        description: 'Journal entry must be balanced before posting.',
        variant: 'destructive',
      });
      return;
    }

    if (entryLines.length === 0) {
      toast({
        title: 'Cannot Post',
        description: 'Journal entry must have at least one line item.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Entry Posted',
      description: 'Journal entry has been posted successfully.',
    });
  };

  const handleUseTemplate = (templateName: string) => {
    toast({
      title: 'Template Applied',
      description: `${templateName} template has been applied to the journal entry.`,
    });
  };

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
          title="Journal Entry Processing"
          description="Create, manage, and post journal entries with comprehensive validation"
          voiceIntroduction="Welcome to Journal Entry Processing for comprehensive transaction recording."
        />
      </div>

      <VoiceTrainingComponent 
        module="finance"
        topic="Journal Entry Management"
        examples={[
          "Creating journal entries with automated validation ensuring debit and credit balance with proper account coding",
          "Processing recurring journal entries with template-based automation and approval workflows",
          "Managing reversing entries and period-end adjustments with comprehensive audit trail and documentation"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{journalEntries.length}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
            <div className="text-sm text-blue-600">This month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {journalEntries.filter(je => je.status === 'Draft').length}
            </div>
            <div className="text-sm text-muted-foreground">Draft Entries</div>
            <div className="text-sm text-orange-600">Pending posting</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {journalEntries.filter(je => je.status === 'Posted').length}
            </div>
            <div className="text-sm text-muted-foreground">Posted Entries</div>
            <div className="text-sm text-green-600">Complete</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${journalEntries.reduce((sum, je) => sum + je.totalDebit, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Amount</div>
            <div className="text-sm text-purple-600">All entries</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="entries">Journal Entries</TabsTrigger>
          <TabsTrigger value="create">Create Entry</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Journal Entries
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Entry
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={journalEntries}
                actions={actions}
                searchPlaceholder="Search journal entries..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Journal Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="documentNumber">Document Number</Label>
                  <Input id="documentNumber" placeholder="Auto-generated" disabled />
                </div>
                <div>
                  <Label htmlFor="postingDate">Posting Date</Label>
                  <Input id="postingDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="reference">Reference</Label>
                  <Input id="reference" placeholder="Enter reference" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter journal entry description" />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Journal Entry Lines</h3>
                  <Button size="sm" onClick={handleAddLine}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Line
                  </Button>
                </div>
                
                <EnhancedDataTable 
                  columns={lineColumns}
                  data={entryLines}
                  actions={lineActions}
                  searchPlaceholder="Search lines..."
                />
                
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Total Debits: </span>
                      <span>${entryLines.reduce((sum, line) => sum + line.debitAmount, 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-medium">Total Credits: </span>
                      <span>${entryLines.reduce((sum, line) => sum + line.creditAmount, 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="font-medium">Balance: </span>
                    <span className={
                      entryLines.reduce((sum, line) => sum + line.debitAmount - line.creditAmount, 0) === 0 
                        ? 'text-green-600' : 'text-red-600'
                    }>
                      ${Math.abs(entryLines.reduce((sum, line) => sum + line.debitAmount - line.creditAmount, 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Calculator className="h-4 w-4 mr-2" />
                  Validate
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Post Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journal Entry Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Monthly Depreciation',
                  'Accrual Entries',
                  'Prepayment Amortization',
                  'Inter-company Transfers',
                  'Bank Reconciliation',
                  'Inventory Adjustments'
                ].map((template, index) => (
                  <div key={index} className="p-4 border rounded">
                    <h4 className="font-semibold">{template}</h4>
                    <p className="text-sm text-muted-foreground">Standard template for {template.toLowerCase()}</p>
                    <Button size="sm" className="mt-2">Use Template</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JournalEntry;
