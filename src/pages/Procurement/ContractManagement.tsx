
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, Edit, Eye, FileText, Calendar, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';

interface Contract {
  id: string;
  contractNumber: string;
  supplier: string;
  title: string;
  type: 'Service' | 'Supply' | 'Framework' | 'Maintenance';
  status: 'Active' | 'Expired' | 'Pending' | 'Draft';
  startDate: string;
  endDate: string;
  value: number;
  currency: string;
  renewalOption: boolean;
  owner: string;
}

const ContractManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('contracts');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Contract Management. Manage supplier contracts, agreements, and renewal schedules.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleContracts: Contract[] = [
      {
        id: 'ct-001',
        contractNumber: 'CT-2025-001',
        supplier: 'Dell Technologies',
        title: 'IT Equipment Supply Agreement',
        type: 'Supply',
        status: 'Active',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        value: 500000,
        currency: 'USD',
        renewalOption: true,
        owner: 'John Smith'
      },
      {
        id: 'ct-002',
        contractNumber: 'CT-2024-089',
        supplier: 'Office Depot Inc.',
        title: 'Office Supplies Framework',
        type: 'Framework',
        status: 'Active',
        startDate: '2024-06-01',
        endDate: '2025-05-31',
        value: 75000,
        currency: 'USD',
        renewalOption: true,
        owner: 'Sarah Wilson'
      }
    ];
    setContracts(sampleContracts);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Expired': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Draft': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'contractNumber', header: 'Contract #', sortable: true, searchable: true },
    { key: 'supplier', header: 'Supplier', sortable: true, searchable: true },
    { key: 'title', header: 'Title', searchable: true },
    { key: 'type', header: 'Type', filterable: true, filterOptions: [
      { label: 'Service', value: 'Service' },
      { label: 'Supply', value: 'Supply' },
      { label: 'Framework', value: 'Framework' },
      { label: 'Maintenance', value: 'Maintenance' }
    ]},
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Active', value: 'Active' },
        { label: 'Expired', value: 'Expired' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Draft', value: 'Draft' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'endDate', header: 'End Date', sortable: true },
    { 
      key: 'value', 
      header: 'Value',
      sortable: true,
      render: (value: number, row: Contract) => `${row.currency} ${value.toLocaleString()}`
    },
    { key: 'owner', header: 'Owner', searchable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: Contract) => {
        // In a real implementation, this would open a contract detail view
        toast({
          title: 'View Contract',
          description: `Opening contract ${row.contractNumber}`,
        });
        console.log('View contract:', row);
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: Contract) => {
        // In a real implementation, this would open an edit form
        toast({
          title: 'Edit Contract',
          description: `Editing contract ${row.contractNumber}`,
        });
        console.log('Edit contract:', row);
      },
      variant: 'ghost'
    }
  ];

  const handleCreateContract = () => {
    // In a real implementation, this would open a contract creation form
    toast({
      title: 'Create Contract',
      description: 'Opening contract creation form',
    });
    console.log('Create new contract');
  };

  const handleScheduleRenewal = (contract: Contract) => {
    // In a real implementation, this would open a renewal scheduling form
    toast({
      title: 'Schedule Renewal',
      description: `Scheduling renewal for ${contract.title}`,
    });
    console.log('Schedule renewal for:', contract);
  };

  const handleRenewContract = (contract: Contract) => {
    // In a real implementation, this would process the contract renewal
    const renewedContract = {
      ...contract,
      endDate: new Date(new Date(contract.endDate).setFullYear(new Date(contract.endDate).getFullYear() + 1)).toISOString().split('T')[0]
    };
    
    const updatedContracts = contracts.map(c => 
      c.id === contract.id ? renewedContract : c
    );
    setContracts(updatedContracts);
    
    toast({
      title: 'Contract Renewed',
      description: `Contract ${contract.contractNumber} has been renewed until ${renewedContract.endDate}`,
    });
    console.log('Renewed contract:', contract);
  };

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
          title="Contract Management"
          description="Manage supplier contracts, agreements, and renewal schedules"
          voiceIntroduction="Welcome to Contract Management for comprehensive contract lifecycle management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{contracts.length}</div>
            <div className="text-sm text-muted-foreground">Total Contracts</div>
            <div className="text-sm text-blue-600">+3 this month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {contracts.filter(c => c.status === 'Active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Contracts</div>
            <div className="text-sm text-green-600">Well managed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">Expiring Soon</div>
            <div className="text-sm text-orange-600">Needs attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${contracts.reduce((sum, c) => sum + c.value, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-sm text-green-600">Portfolio value</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="renewals">Renewals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Contract Portfolio
                <Button 
                  onClick={handleCreateContract}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Contract
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={contracts}
                actions={actions}
                searchPlaceholder="Search contracts by number, supplier, or title..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="renewals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Renewals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.filter(c => c.renewalOption).map((contract) => (
                  <div key={contract.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{contract.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {contract.supplier} • {contract.contractNumber}
                        </p>
                        <p className="text-sm">Expires: {contract.endDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleScheduleRenewal(contract)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Renewal
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleRenewContract(contract)}
                        >
                          Renew Now
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
          <Card>
            <CardHeader>
              <CardTitle>Contract Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded">
                  <h4 className="font-semibold mb-2">Contract Types</h4>
                  <div className="space-y-2">
                    {['Service', 'Supply', 'Framework', 'Maintenance'].map((type) => {
                      const count = contracts.filter(c => c.type === type).length;
                      return (
                        <div key={type} className="flex justify-between">
                          <span>{type}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 border rounded">
                  <h4 className="font-semibold mb-2">Status Overview</h4>
                  <div className="space-y-2">
                    {['Active', 'Expired', 'Pending', 'Draft'].map((status) => {
                      const count = contracts.filter(c => c.status === status).length;
                      return (
                        <div key={status} className="flex justify-between">
                          <span>{status}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
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

export default ContractManagement;
