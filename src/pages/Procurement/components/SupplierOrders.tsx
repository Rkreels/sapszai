
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../../components/data/EnhancedDataTable';
import { Plus, Eye, FileText, ShoppingCart } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';

interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  deliveryDate: string;
  status: 'Pending' | 'Delivered' | 'Cancelled' | 'In Transit';
  totalAmount: number;
  currency: string;
  items: number;
}

const SupplierOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-001',
      orderNumber: 'PO-2025-001',
      orderDate: '2025-01-15',
      deliveryDate: '2025-01-22',
      status: 'Delivered',
      totalAmount: 15600,
      currency: 'USD',
      items: 12
    },
    {
      id: 'ord-002',
      orderNumber: 'PO-2025-002',
      orderDate: '2025-01-20',
      deliveryDate: '2025-01-27',
      status: 'In Transit',
      totalAmount: 8900,
      currency: 'USD',
      items: 8
    }
  ]);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'In Transit': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'orderNumber', header: 'Order Number', sortable: true, searchable: true },
    { key: 'orderDate', header: 'Order Date', sortable: true },
    { key: 'deliveryDate', header: 'Delivery Date', sortable: true },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Cancelled', value: 'Cancelled' },
        { label: 'In Transit', value: 'In Transit' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'totalAmount', 
      header: 'Total Amount',
      sortable: true,
      render: (value: number, row: Order) => `${row.currency} ${value.toLocaleString()}`
    },
    { key: 'items', header: 'Items', sortable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: Order) => {
        toast({
          title: 'View Order',
          description: `Opening order details for ${row.orderNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Invoice',
      icon: <FileText className="h-4 w-4" />,
      onClick: (row: Order) => {
        toast({
          title: 'Generate Invoice',
          description: `Creating invoice for ${row.orderNumber}`,
        });
      },
      variant: 'outline',
      condition: (row: Order) => row.status === 'Delivered'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Order History
          </span>
          <Button onClick={() => toast({ title: 'Create Order', description: 'Opening purchase order creation form' })}>
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EnhancedDataTable 
          columns={columns}
          data={orders}
          actions={actions}
          searchPlaceholder="Search orders by number or status..."
          exportable={true}
          refreshable={true}
        />
      </CardContent>
    </Card>
  );
};

export default SupplierOrders;
