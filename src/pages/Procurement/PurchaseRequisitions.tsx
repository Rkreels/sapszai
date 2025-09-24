
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, Edit, Eye, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';

interface PurchaseRequisition {
  id: string;
  requisitionNumber: string;
  description: string;
  requestor: string;
  department: string;
  totalAmount: number;
  currency: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Converted';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  requestDate: string;
  requiredDate: string;
  approver: string;
  items: number;
}

const PurchaseRequisitions: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('requisitions');
  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Purchase Requisitions. Manage internal purchase requests and approval workflows.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleRequisitions: PurchaseRequisition[] = [
      {
        id: 'pr-001',
        requisitionNumber: 'PR-2025-001',
        description: 'Office Equipment Request',
        requestor: 'John Smith',
        department: 'IT Department',
        totalAmount: 2500.00,
        currency: 'USD',
        status: 'Pending',
        priority: 'Medium',
        requestDate: '2025-01-20',
        requiredDate: '2025-02-15',
        approver: 'Sarah Wilson',
        items: 3
      },
      {
        id: 'pr-002',
        requisitionNumber: 'PR-2025-002',
        description: 'Marketing Materials',
        requestor: 'Lisa Chen',
        department: 'Marketing',
        totalAmount: 850.00,
        currency: 'USD',
        status: 'Approved',
        priority: 'Low',
        requestDate: '2025-01-18',
        requiredDate: '2025-02-01',
        approver: 'Mike Brown',
        items: 5
      }
    ];
    setRequisitions(sampleRequisitions);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Converted': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'requisitionNumber', header: 'Requisition #', sortable: true, searchable: true },
    { key: 'description', header: 'Description', searchable: true },
    { key: 'requestor', header: 'Requestor', searchable: true },
    { key: 'department', header: 'Department', filterable: true, filterOptions: [
      { label: 'IT Department', value: 'IT Department' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Finance', value: 'Finance' },
      { label: 'Operations', value: 'Operations' }
    ]},
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Draft', value: 'Draft' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'Converted', value: 'Converted' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'priority', 
      header: 'Priority',
      filterable: true,
      filterOptions: [
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' },
        { label: 'Urgent', value: 'Urgent' }
      ],
      render: (value: string) => (
        <Badge className={getPriorityColor(value)}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'totalAmount', 
      header: 'Amount',
      sortable: true,
      render: (value: number, row: PurchaseRequisition) => `${row.currency} ${value.toLocaleString()}`
    },
    { key: 'requiredDate', header: 'Required Date', sortable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: PurchaseRequisition) => {
        toast({
          title: 'View Requisition',
          description: `Opening ${row.requisitionNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: PurchaseRequisition) => {
        toast({
          title: 'Edit Requisition',
          description: `Editing ${row.requisitionNumber}`,
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
          onClick={() => navigate('/procurement')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Purchase Requisitions"
          description="Manage internal purchase requests and approval workflows"
          voiceIntroduction="Welcome to Purchase Requisitions for managing internal requests."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{requisitions.length}</div>
            <div className="text-sm text-muted-foreground">Total Requisitions</div>
            <div className="text-sm text-blue-600">This month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {requisitions.filter(r => r.status === 'Pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Approval</div>
            <div className="text-sm text-orange-600">Needs attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {requisitions.filter(r => r.status === 'Approved').length}
            </div>
            <div className="text-sm text-muted-foreground">Approved</div>
            <div className="text-sm text-green-600">Ready to convert</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${requisitions.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-sm text-purple-600">Requested</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
          <TabsTrigger value="approval">Approval Queue</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="requisitions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Purchase Requisitions
                <Button onClick={() => toast({ title: 'Create Requisition', description: 'Opening new requisition form' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Requisition
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={requisitions}
                actions={actions}
                searchPlaceholder="Search requisitions..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requisitions.filter(r => r.status === 'Pending').map((requisition) => (
                  <div key={requisition.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{requisition.requisitionNumber}</h4>
                        <p className="text-sm text-muted-foreground">{requisition.description}</p>
                        <p className="text-sm">Requestor: {requisition.requestor} | Amount: ${requisition.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
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
                <CardTitle>Requisition Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Draft', 'Pending', 'Approved', 'Rejected', 'Converted'].map((status) => {
                    const count = requisitions.filter(r => r.status === status).length;
                    return (
                      <div key={status} className="flex justify-between">
                        <span>{status}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['IT Department', 'Marketing', 'Finance', 'Operations'].map((dept) => {
                    const count = requisitions.filter(r => r.department === dept).length;
                    const total = requisitions.filter(r => r.department === dept).reduce((sum, r) => sum + r.totalAmount, 0);
                    return (
                      <div key={dept} className="space-y-1">
                        <div className="flex justify-between">
                          <span>{dept}</span>
                          <span className="font-medium">{count} req | ${total.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseRequisitions;
