
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Plus, Package, CheckCircle, AlertCircle, Clock, Truck } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';

interface GoodsReceiptItem {
  id: string;
  receiptNumber: string;
  poNumber: string;
  supplier: string;
  materialCode: string;
  materialDescription: string;
  orderedQty: number;
  receivedQty: number;
  uom: string;
  status: 'Pending' | 'Partial' | 'Complete' | 'Over-received' | 'Damaged';
  receivedDate: string;
  receiver: string;
  storageLocation: string;
  qualityStatus: 'Passed' | 'Failed' | 'Pending' | 'Not Required';
}

const GoodsReceipt: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('receipts');
  const [receipts, setReceipts] = useState<GoodsReceiptItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Goods Receipt. Record and verify receipt of goods from purchase orders and update inventory.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    const sampleReceipts: GoodsReceiptItem[] = [
      {
        id: 'gr-001',
        receiptNumber: 'GR-2025-001',
        poNumber: 'PO-2025-123',
        supplier: 'Dell Technologies',
        materialCode: 'LAP-DEL-001',
        materialDescription: 'Dell Latitude 7420 Laptop',
        orderedQty: 10,
        receivedQty: 10,
        uom: 'Each',
        status: 'Complete',
        receivedDate: '2025-01-25',
        receiver: 'John Smith',
        storageLocation: 'WH-A-001',
        qualityStatus: 'Passed'
      },
      {
        id: 'gr-002',
        receiptNumber: 'GR-2025-002',
        poNumber: 'PO-2025-124',
        supplier: 'Office Depot',
        materialCode: 'OFF-PEN-001',
        materialDescription: 'Blue Ballpoint Pens',
        orderedQty: 100,
        receivedQty: 85,
        uom: 'Pcs',
        status: 'Partial',
        receivedDate: '2025-01-24',
        receiver: 'Sarah Wilson',
        storageLocation: 'WH-B-005',
        qualityStatus: 'Not Required'
      }
    ];
    setReceipts(sampleReceipts);
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Partial': 'bg-orange-100 text-orange-800',
      'Complete': 'bg-green-100 text-green-800',
      'Over-received': 'bg-blue-100 text-blue-800',
      'Damaged': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getQualityColor = (quality: string) => {
    const colors = {
      'Passed': 'bg-green-100 text-green-800',
      'Failed': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Not Required': 'bg-gray-100 text-gray-800'
    };
    return colors[quality as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'receiptNumber', header: 'Receipt #', sortable: true, searchable: true },
    { key: 'poNumber', header: 'PO Number', sortable: true, searchable: true },
    { key: 'supplier', header: 'Supplier', searchable: true },
    { key: 'materialDescription', header: 'Material', searchable: true },
    { 
      key: 'receivedQty', 
      header: 'Qty Received',
      render: (value: number, row: GoodsReceiptItem) => `${value}/${row.orderedQty} ${row.uom}`
    },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Partial', value: 'Partial' },
        { label: 'Complete', value: 'Complete' },
        { label: 'Over-received', value: 'Over-received' },
        { label: 'Damaged', value: 'Damaged' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'qualityStatus', 
      header: 'Quality',
      filterable: true,
      filterOptions: [
        { label: 'Passed', value: 'Passed' },
        { label: 'Failed', value: 'Failed' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Not Required', value: 'Not Required' }
      ],
      render: (value: string) => (
        <Badge className={getQualityColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'receivedDate', header: 'Received Date', sortable: true },
    { key: 'receiver', header: 'Receiver', searchable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'Process Receipt',
      icon: <Package className="h-4 w-4" />,
      onClick: (row: GoodsReceiptItem) => {
        toast({
          title: 'Process Receipt',
          description: `Processing ${row.receiptNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Quality Check',
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (row: GoodsReceiptItem) => {
        toast({
          title: 'Quality Check',
          description: `Starting quality inspection for ${row.receiptNumber}`,
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
          title="Goods Receipt"
          description="Record and verify receipt of goods from purchase orders"
          voiceIntroduction="Welcome to Goods Receipt for processing incoming deliveries."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{receipts.length}</div>
            <div className="text-sm text-muted-foreground">Total Receipts</div>
            <div className="text-sm text-blue-600">This month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {receipts.filter(r => r.status === 'Pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Processing</div>
            <div className="text-sm text-orange-600">Needs attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {receipts.filter(r => r.status === 'Complete').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-sm text-green-600">Processed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {receipts.filter(r => r.qualityStatus === 'Pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Quality Pending</div>
            <div className="text-sm text-yellow-600">Awaiting inspection</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="receipts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Goods Receipt Records
                <Button onClick={() => toast({ title: 'Create Receipt', description: 'Opening new goods receipt form' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Receipt
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={receipts}
                actions={actions}
                searchPlaceholder="Search receipts, PO numbers, or materials..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Goods Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receipts.filter(r => r.status === 'Pending' || r.status === 'Partial').map((receipt) => (
                  <div key={receipt.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold flex items-center">
                          <Truck className="h-4 w-4 mr-2" />
                          {receipt.receiptNumber}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          PO: {receipt.poNumber} | Supplier: {receipt.supplier}
                        </p>
                        <p className="text-sm">
                          {receipt.materialDescription} | 
                          Qty: {receipt.receivedQty}/{receipt.orderedQty} {receipt.uom}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Package className="h-4 w-4 mr-2" />
                          Process
                        </Button>
                        <Badge className={getStatusColor(receipt.status)}>
                          {receipt.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receipts.filter(r => r.qualityStatus === 'Pending').map((receipt) => (
                  <div key={receipt.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {receipt.materialDescription}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Receipt: {receipt.receiptNumber} | Location: {receipt.storageLocation}
                        </p>
                        <p className="text-sm">Received: {receipt.receivedDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Pass
                        </Button>
                        <Button size="sm" variant="outline">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Fail
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
                <CardTitle>Receipt Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Pending', 'Partial', 'Complete', 'Over-received', 'Damaged'].map((status) => {
                    const count = receipts.filter(r => r.status === status).length;
                    const percentage = receipts.length > 0 ? Math.round((count / receipts.length) * 100) : 0;
                    return (
                      <div key={status} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{status}</span>
                          <span>{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Passed', 'Failed', 'Pending', 'Not Required'].map((quality) => {
                    const count = receipts.filter(r => r.qualityStatus === quality).length;
                    return (
                      <div key={quality} className="flex justify-between">
                        <span>{quality}</span>
                        <span className="font-medium">{count}</span>
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

export default GoodsReceipt;
