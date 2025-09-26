
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Eye, FileText, Plus, Edit, Trash2 } from 'lucide-react';
import FilterBar from '../../../components/filters/FilterBar';
import { Skeleton } from '../../../components/ui/skeleton';
import DataTable from '../../../components/data/DataTable';
import { useToast } from '../../../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { listEntities, upsertEntity, removeEntity, generateId } from '../../../lib/localCrud';

interface SalesOrder {
  id: string;
  orderNumber: string;
  customer: string;
  value: string;
  status: "Processing" | "Delivered" | "Awaiting Payment" | "Cancelled";
  date: string;
  customerContact: string;
  deliveryAddress: string;
  items: SalesOrderItem[];
  notes?: string;
}

interface SalesOrderItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const salesOrderSchema = z.object({
  customer: z.string().min(1, 'Customer is required'),
  customerContact: z.string().min(1, 'Customer contact is required'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  notes: z.string().optional(),
});

const STORAGE_KEY = 'sales_orders';

// Sample data - now this will be loaded from localStorage
const sampleSalesOrders: SalesOrder[] = [
  { 
    id: "SO-10293", 
    orderNumber: "SO-10293", 
    customer: "Acme Corp", 
    value: "€24,500", 
    status: "Processing", 
    date: "2025-04-22",
    customerContact: "John Doe",
    deliveryAddress: "123 Main St, City, State",
    items: [
      { id: "1", product: "Product A", quantity: 10, unitPrice: 2450, totalPrice: 24500 }
    ]
  },
  { 
    id: "SO-10292", 
    orderNumber: "SO-10292", 
    customer: "XYZ Industries", 
    value: "€18,750", 
    status: "Delivered", 
    date: "2025-04-21",
    customerContact: "Jane Smith",
    deliveryAddress: "456 Oak Ave, City, State",
    items: [
      { id: "2", product: "Product B", quantity: 5, unitPrice: 3750, totalPrice: 18750 }
    ]
  },
  { 
    id: "SO-10291", 
    orderNumber: "SO-10291", 
    customer: "Global Tech", 
    value: "€32,100", 
    status: "Processing", 
    date: "2025-04-20",
    customerContact: "Bob Johnson",
    deliveryAddress: "789 Pine Rd, City, State",
    items: [
      { id: "3", product: "Product C", quantity: 15, unitPrice: 2140, totalPrice: 32100 }
    ]
  },
  { 
    id: "SO-10290", 
    orderNumber: "SO-10290", 
    customer: "Mega Enterprises", 
    value: "€15,800", 
    status: "Awaiting Payment", 
    date: "2025-04-19",
    customerContact: "Alice Brown",
    deliveryAddress: "321 Elm St, City, State",
    items: [
      { id: "4", product: "Product D", quantity: 8, unitPrice: 1975, totalPrice: 15800 }
    ]
  },
  { 
    id: "SO-10289", 
    orderNumber: "SO-10289", 
    customer: "Bright Solutions", 
    value: "€28,300", 
    status: "Delivered", 
    date: "2025-04-18",
    customerContact: "Charlie Wilson",
    deliveryAddress: "654 Maple Dr, City, State",
    items: [
      { id: "5", product: "Product E", quantity: 12, unitPrice: 2358.33, totalPrice: 28300 }
    ]
  },
  { 
    id: "SO-10288", 
    orderNumber: "SO-10288", 
    customer: "TechForward", 
    value: "€42,700", 
    status: "Processing", 
    date: "2025-04-17",
    customerContact: "Diana Davis",
    deliveryAddress: "987 Cedar Ln, City, State",
    items: [
      { id: "6", product: "Product F", quantity: 20, unitPrice: 2135, totalPrice: 42700 }
    ]
  },
  { 
    id: "SO-10287", 
    orderNumber: "SO-10287", 
    customer: "Elite Corp", 
    value: "€19,250", 
    status: "Delivered", 
    date: "2025-04-16",
    customerContact: "Eva Martinez",
    deliveryAddress: "147 Birch Way, City, State",
    items: [
      { id: "7", product: "Product G", quantity: 7, unitPrice: 2750, totalPrice: 19250 }
    ]
  },
];

interface SalesOrdersTableProps {
  isLoading: boolean;
  salesFilter: string;
  setSalesFilter: (filter: string) => void;
}

const SalesOrdersTable: React.FC<SalesOrdersTableProps> = ({ isLoading, salesFilter, setSalesFilter }) => {
  const { toast } = useToast();
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  
  const form = useForm<z.infer<typeof salesOrderSchema>>({
    resolver: zodResolver(salesOrderSchema),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const orders = listEntities<SalesOrder>(STORAGE_KEY);
    if (orders.length === 0) {
      // Seed with sample data
      sampleSalesOrders.forEach(order => upsertEntity(STORAGE_KEY, order));
      setSalesOrders(sampleSalesOrders);
    } else {
      setSalesOrders(orders);
    }
  };

  const onSubmit = (data: z.infer<typeof salesOrderSchema>) => {
    try {
      const orderNumber = `SO-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      const newOrder: SalesOrder = {
        id: generateId('so'),
        orderNumber,
        customer: data.customer,
        value: "€0", // Will be calculated when items are added
        status: "Processing",
        date: new Date().toISOString().split('T')[0],
        customerContact: data.customerContact,
        deliveryAddress: data.deliveryAddress,
        items: [], // Items would be added in a more complex form
        notes: data.notes,
      };

      upsertEntity(STORAGE_KEY, newOrder);
      setSalesOrders(prev => [newOrder, ...prev]);
      
      toast({
        title: 'Sales Order Created',
        description: `Order ${orderNumber} has been created successfully.`,
      });
      
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create sales order.',
        variant: 'destructive',
      });
    }
  };

  const deleteOrder = (order: SalesOrder) => {
    if (confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
      try {
        removeEntity(STORAGE_KEY, order.id);
        setSalesOrders(prev => prev.filter(o => o.id !== order.id));
        
        toast({
          title: 'Order Deleted',
          description: `Order ${order.orderNumber} has been deleted.`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete order.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDownloadOrder = (orderId: string) => {
    const order = salesOrders.find(o => o.id === orderId);
    if (order) {
      toast({
        title: 'Order Downloaded',
        description: `Order ${order.orderNumber} has been downloaded successfully.`,
      });
    }
  };

  const updateOrderStatus = (order: SalesOrder, newStatus: SalesOrder['status']) => {
    try {
      const updatedOrder = { ...order, status: newStatus };
      upsertEntity(STORAGE_KEY, updatedOrder);
      setSalesOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
      
      toast({
        title: 'Status Updated',
        description: `Order ${order.orderNumber} status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status.',
        variant: 'destructive',
      });
    }
  };

  // Handle creating a new sales order
  const handleCreateSalesOrder = () => {
    setIsCreateDialogOpen(true);
  };
  
  // Handle viewing order details
  const handleViewOrderDetails = (orderId: string) => {
    const order = salesOrders.find(o => o.id === orderId);
    if (order) {
      toast({
        title: "Order Details",
        description: `Viewing details for order ${order.orderNumber}`,
      });
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (filter: string) => {
    setSalesFilter(filter);
    toast({
      description: `Filter applied: ${filter}`,
    });
  };
  
  // Handle search
  const handleSearch = (value: string) => {
    if (value.trim()) {
      toast({
        description: `Searching for: ${value}`,
      });
    }
  };
  
  // Order columns configuration for DataTable
  const orderColumns = [
    { key: "id", header: "Order ID" },
    { 
      key: "customer", 
      header: "Customer",
      render: (value: string) => (
        <span className="text-blue-600 underline cursor-pointer">{value}</span>
      )
    },
    { key: "value", header: "Value" },
    { 
      key: "status", 
      header: "Status",
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'Delivered' ? 'bg-green-100 text-green-800' :
          value === 'Processing' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: "date", header: "Date" },
    { 
      key: "actions", 
      header: "Actions",
      render: (_, row: Record<string, unknown>) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleViewOrderDetails(row.id as string)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleDownloadOrder(row.id as string)}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={() => deleteOrder(row as SalesOrder)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <FilterBar 
          filters={['All', 'Processing', 'Delivered', 'Awaiting Payment']}
          activeFilter={salesFilter}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          showSort={true}
        />
        <Button 
          onClick={handleCreateSalesOrder}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Sales Order
        </Button>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable 
          columns={orderColumns}
          data={salesOrders.filter(order => salesFilter === 'All' || order.status === salesFilter)}
          className="border rounded-md"
        />
      )}
      
      <div className="mt-4 text-xs text-gray-500 flex justify-between items-center">
        <span>Showing {salesOrders.filter(order => salesFilter === 'All' || order.status === salesFilter).length} orders</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-6 text-xs">Previous</Button>
          <Button variant="outline" size="sm" className="h-6 text-xs bg-blue-50 text-blue-700">1</Button>
          <Button variant="outline" size="sm" className="h-6 text-xs">2</Button>
          <Button variant="outline" size="sm" className="h-6 text-xs">Next</Button>
        </div>
      </div>

      {/* Create Sales Order Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Sales Order</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact person" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter delivery address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Additional notes (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Order
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesOrdersTable;
