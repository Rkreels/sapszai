import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { ArrowLeft, Calendar, Filter, Download, Plus, FileText, Edit, Eye } from 'lucide-react';
import { Card } from '../../components/ui/card';
import DataTable from '../../components/data/DataTable';
import { useToast } from '../../hooks/use-toast';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

const PurchaseOrders: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const { toast } = useToast();

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now in the Purchase Orders page. Here you can create and manage purchase orders for goods and services.');
    }
  }, [isEnabled, speak]);

  // Sample data for purchase orders
  const purchaseOrders = [
    { 
      po: '4500012765', 
      supplier: 'Tech Components Inc.', 
      orderDate: '05/15/2025', 
      deliveryDate: '06/01/2025',
      value: '125,000.00',
      currency: 'USD',
      status: 'Open',
      items: '12'
    },
    { 
      po: '4500012766', 
      supplier: 'Industrial Supplies Ltd.', 
      orderDate: '05/17/2025', 
      deliveryDate: '05/30/2025',
      value: '37,850.00',
      currency: 'USD',
      status: 'In Process',
      items: '8'
    },
    { 
      po: '4500012767', 
      supplier: 'Global Electronics', 
      orderDate: '05/18/2025', 
      deliveryDate: '06/10/2025',
      value: '243,725.00',
      currency: 'USD',
      status: 'Approved',
      items: '24'
    },
    { 
      po: '4500012768', 
      supplier: 'Office Solutions', 
      orderDate: '05/20/2025', 
      deliveryDate: '05/25/2025',
      value: '8,450.00',
      currency: 'USD',
      status: 'Pending Approval',
      items: '5'
    },
  ];

  // Column definitions for the table
  const columns = [
    { key: 'po', header: 'PO Number' },
    { key: 'supplier', header: 'Supplier' },
    { key: 'orderDate', header: 'Order Date' },
    { key: 'deliveryDate', header: 'Delivery Date' },
    { 
      key: 'value', 
      header: 'Value',
      render: (value: string, row: any) => (
        <span>{value} {row.currency}</span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        let bgColor = 'bg-gray-100 text-gray-800';
        if (value === 'Open') bgColor = 'bg-blue-100 text-blue-800';
        if (value === 'In Process') bgColor = 'bg-yellow-100 text-yellow-800';
        if (value === 'Approved') bgColor = 'bg-green-100 text-green-800';
        if (value === 'Pending Approval') bgColor = 'bg-orange-100 text-orange-800';
        
        return (
          <span className={`px-2 py-1 ${bgColor} rounded-full text-xs`}>
            {value}
          </span>
        );
      }
    },
    { key: 'items', header: 'Items' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: any) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => {
            toast({
              title: 'View Purchase Order',
              description: `Opening purchase order ${row.po}`,
            });
          }}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            toast({
              title: 'Edit Purchase Order',
              description: `Editing purchase order ${row.po}`,
            });
          }}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

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
          title="Purchase Orders"
          description="Create and manage purchase orders for goods and services"
          voiceIntroduction="Welcome to Purchase Orders. Here you can create and manage your purchase orders."
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Purchase Orders</h2>
          <p className="text-sm text-gray-500">May 2025</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center" onClick={() => {
            toast({
              title: 'Change Period',
              description: 'Opening period selection dialog',
            });
          }}>
            <Calendar className="h-4 w-4 mr-2" />
            Change Period
          </Button>
          <Button variant="outline" size="sm" className="flex items-center" onClick={() => {
            toast({
              title: 'Filter Options',
              description: 'Opening filter panel',
            });
          }}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center" onClick={() => {
            toast({
              title: 'Export Data',
              description: 'Exporting purchase orders to CSV',
            });
          }}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm" className="flex items-center" onClick={() => {
            toast({
              title: 'New Purchase Order',
              description: 'Opening purchase order creation form',
            });
          }}>
            <Plus className="h-4 w-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={purchaseOrders} className="w-full" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Purchase Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Total POs</span>
              <span>42</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Open POs</span>
              <span className="font-semibold text-blue-600">28</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Total Value</span>
              <span className="font-semibold">$1,247,850.00</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">POs Pending Approval</span>
              <span className="text-yellow-600">7</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Purchase Order Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Open</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span>In Process</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span>Approved</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <span>Pending Approval</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseOrders;
