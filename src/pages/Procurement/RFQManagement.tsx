
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, Edit, Eye, Send, Clock, Users, Award } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';

interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  description: string;
  category: string;
  status: 'Draft' | 'Published' | 'Response Period' | 'Evaluation' | 'Awarded' | 'Cancelled';
  publishDate: string;
  responseDeadline: string;
  totalValue: number;
  currency: string;
  suppliersInvited: number;
  responsesReceived: number;
  creator: string;
}

const RFQManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('rfqs');
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to RFQ Management. Request quotes from suppliers and manage competitive bidding processes.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleRFQs: RFQ[] = [
      {
        id: 'rfq-001',
        rfqNumber: 'RFQ-2025-001',
        title: 'IT Equipment Supply',
        description: 'Request for quotes for laptops and desktop computers',
        category: 'Technology',
        status: 'Response Period',
        publishDate: '2025-01-15',
        responseDeadline: '2025-02-01',
        totalValue: 150000,
        currency: 'USD',
        suppliersInvited: 8,
        responsesReceived: 5,
        creator: 'John Smith'
      },
      {
        id: 'rfq-002',
        rfqNumber: 'RFQ-2025-002',
        title: 'Office Furniture',
        description: 'Ergonomic chairs and desks for new office space',
        category: 'Furniture',
        status: 'Evaluation',
        publishDate: '2025-01-10',
        responseDeadline: '2025-01-25',
        totalValue: 85000,
        currency: 'USD',
        suppliersInvited: 6,
        responsesReceived: 6,
        creator: 'Sarah Wilson'
      }
    ];
    setRfqs(sampleRFQs);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Published': 'bg-blue-100 text-blue-800',
      'Response Period': 'bg-yellow-100 text-yellow-800',
      'Evaluation': 'bg-orange-100 text-orange-800',
      'Awarded': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'rfqNumber', header: 'RFQ Number', sortable: true, searchable: true },
    { key: 'title', header: 'Title', searchable: true },
    { key: 'category', header: 'Category', filterable: true, filterOptions: [
      { label: 'Technology', value: 'Technology' },
      { label: 'Furniture', value: 'Furniture' },
      { label: 'Services', value: 'Services' },
      { label: 'Manufacturing', value: 'Manufacturing' }
    ]},
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Draft', value: 'Draft' },
        { label: 'Published', value: 'Published' },
        { label: 'Response Period', value: 'Response Period' },
        { label: 'Evaluation', value: 'Evaluation' },
        { label: 'Awarded', value: 'Awarded' },
        { label: 'Cancelled', value: 'Cancelled' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'totalValue', 
      header: 'Est. Value',
      sortable: true,
      render: (value: number, row: RFQ) => `${row.currency} ${value.toLocaleString()}`
    },
    { 
      key: 'responsesReceived', 
      header: 'Responses',
      render: (value: number, row: RFQ) => `${value}/${row.suppliersInvited}`
    },
    { key: 'responseDeadline', header: 'Deadline', sortable: true },
    { key: 'creator', header: 'Creator', searchable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: RFQ) => {
        toast({
          title: 'View RFQ',
          description: `Opening ${row.rfqNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: RFQ) => {
        toast({
          title: 'Edit RFQ',
          description: `Editing ${row.rfqNumber}`,
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
          title="RFQ Management"
          description="Request quotes from suppliers and manage competitive bidding processes"
          voiceIntroduction="Welcome to RFQ Management for competitive sourcing."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{rfqs.length}</div>
            <div className="text-sm text-muted-foreground">Active RFQs</div>
            <div className="text-sm text-blue-600">In progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {rfqs.filter(r => r.status === 'Response Period').length}
            </div>
            <div className="text-sm text-muted-foreground">Awaiting Responses</div>
            <div className="text-sm text-yellow-600">Open for bids</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {rfqs.reduce((sum, r) => sum + r.responsesReceived, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Responses</div>
            <div className="text-sm text-green-600">Received</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${rfqs.reduce((sum, r) => sum + r.totalValue, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-sm text-purple-600">Estimated</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rfqs">RFQs</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="rfqs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Request for Quotes
                <Button onClick={() => toast({ title: 'Create RFQ', description: 'Opening new RFQ form' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create RFQ
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={rfqs}
                actions={actions}
                searchPlaceholder="Search RFQs..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rfqs.filter(r => r.responsesReceived > 0).map((rfq) => (
                  <div key={rfq.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{rfq.title}</h4>
                        <p className="text-sm text-muted-foreground">{rfq.rfqNumber}</p>
                        <p className="text-sm">Responses: {rfq.responsesReceived}/{rfq.suppliersInvited}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          toast({
                            title: 'View Responses',
                            description: `Opening responses for ${rfq.rfqNumber}`,
                          });
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Responses
                        </Button>
                        <Button size="sm" onClick={() => {
                          toast({
                            title: 'Evaluate RFQ',
                            description: `Opening evaluation for ${rfq.rfqNumber}`,
                          });
                        }}>
                          <Award className="h-4 w-4 mr-2" />
                          Evaluate
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
                <CardTitle>RFQ Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Draft', 'Published', 'Response Period', 'Evaluation', 'Awarded', 'Cancelled'].map((status) => {
                    const count = rfqs.filter(r => r.status === status).length;
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
                <CardTitle>Response Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rfqs.map((rfq) => {
                    const responseRate = rfq.suppliersInvited > 0 ? 
                      Math.round((rfq.responsesReceived / rfq.suppliersInvited) * 100) : 0;
                    return (
                      <div key={rfq.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{rfq.rfqNumber}</span>
                          <span>{responseRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${responseRate}%` }}
                          ></div>
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

export default RFQManagement;
