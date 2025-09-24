
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Calendar, Filter, Download, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/card';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';
import { Column } from '../../components/data/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const Requisitions: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('all');

  React.useEffect(() => {
    if (isEnabled) {
      speak('Welcome to the Purchase Requisitions page. Here you can create and manage requisition requests for goods and services.');
    }
  }, [isEnabled, speak]);

  // Sample data for purchase requisitions
  const requisitionsData = [
    { 
      id: 'PR-10045', 
      title: 'Office Supplies', 
      requestor: 'John Smith',
      department: 'Finance',
      date: '2025-05-15',
      value: '1,250.00',
      currency: 'USD',
      status: 'Pending Approval',
      items: 12
    },
    { 
      id: 'PR-10046', 
      title: 'IT Equipment', 
      requestor: 'Maria Garcia',
      department: 'IT',
      date: '2025-05-14',
      value: '8,745.00',
      currency: 'USD',
      status: 'Approved',
      items: 5
    },
    { 
      id: 'PR-10047', 
      title: 'Marketing Materials', 
      requestor: 'Alex Johnson',
      department: 'Marketing',
      date: '2025-05-12',
      value: '3,500.00',
      currency: 'USD',
      status: 'Pending Approval',
      items: 8
    },
    { 
      id: 'PR-10048', 
      title: 'Manufacturing Supplies', 
      requestor: 'Robert Chen',
      department: 'Production',
      date: '2025-05-10',
      value: '12,800.00',
      currency: 'USD',
      status: 'Rejected',
      items: 15
    },
    { 
      id: 'PR-10049', 
      title: 'Training Services', 
      requestor: 'Emma Wilson',
      department: 'HR',
      date: '2025-05-09',
      value: '5,200.00',
      currency: 'USD',
      status: 'Approved',
      items: 3
    },
  ];

  // Column definitions for the table
  const columns: Column[] = [
    { key: 'id', header: 'PR Number' },
    { key: 'title', header: 'Title' },
    { key: 'requestor', header: 'Requestor' },
    { key: 'department', header: 'Department' },
    { key: 'date', header: 'Create Date' },
    { 
      key: 'value', 
      header: 'Value',
      render: (value, row) => (
        <span>{value} {row.currency}</span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => {
        let bgColor = 'bg-gray-100 text-gray-800';
        let icon = null;
        
        if (value === 'Approved') {
          bgColor = 'bg-green-100 text-green-800';
          icon = <CheckCircle className="h-3 w-3 mr-1" />;
        }
        else if (value === 'Pending Approval') {
          bgColor = 'bg-blue-100 text-blue-800';
          icon = <Clock className="h-3 w-3 mr-1" />;
        }
        else if (value === 'Rejected') {
          bgColor = 'bg-red-100 text-red-800';
          icon = <AlertCircle className="h-3 w-3 mr-1" />;
        }
        
        return (
          <span className={`px-2 py-1 ${bgColor} rounded-full text-xs flex items-center inline-flex`}>
            {icon}
            {value}
          </span>
        );
      }
    },
    { key: 'items', header: 'Items' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">View</Button>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      )
    }
  ];

  // Filter requisitions based on active tab
  const getFilteredRequisitions = () => {
    if (activeTab === 'all') return requisitionsData;
    return requisitionsData.filter(req => {
      if (activeTab === 'pending') return req.status === 'Pending Approval';
      if (activeTab === 'approved') return req.status === 'Approved';
      if (activeTab === 'rejected') return req.status === 'Rejected';
      return true;
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/supply-chain')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Purchase Requisitions"
          description="Create and manage requisition requests for goods and services"
          voiceIntroduction="Welcome to Purchase Requisitions. Here you can create and manage requisition requests."
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Purchase Requisitions</h2>
          <p className="text-sm text-gray-500">May 2025</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Change Period
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Requisition
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList>
            <TabsTrigger value="all">All Requisitions</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        <DataTable columns={columns} data={getFilteredRequisitions()} className="w-full" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Requisition Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Total Requisitions</span>
              <span>35</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Pending Approval</span>
              <span className="font-semibold text-blue-600">12</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Total Value</span>
              <span className="font-semibold">$87,450.00</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Rejected Requisitions</span>
              <span className="text-red-600">5</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Requisition Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Approved</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span>Pending Approval</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span>Rejected</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span>Converted to PO</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Requisitions;
