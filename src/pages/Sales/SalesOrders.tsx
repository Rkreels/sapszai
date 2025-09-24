import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { ArrowLeft, Plus, Edit, Eye, FileText, Truck, CheckCircle, Clock, AlertCircle, Download, Trash2 } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { listEntities, upsertEntity, removeEntity, generateId } from '../../lib/localCrud';

interface SalesOrder {
  id: string;
  orderNumber: string;
  customer: string;
  customerPO: string;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  currency: string;
  status: 'Draft' | 'Confirmed' | 'In Progress' | 'Delivered' | 'Invoiced' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  salesRep: string;
  paymentTerms: string;
  shippingMethod: string;
  lineItems: number;
  customerAddress?: string;
  notes?: string;
}

interface OrderLine {
  id: string;
  orderId: string;
  lineNumber: number;
  product: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: string;
  status: 'Open' | 'Confirmed' | 'Shipped' | 'Delivered';
  discount?: number;
}

const salesOrderSchema = z.object({
  customer: z.string().min(1, 'Customer is required'),
  customerPO: z.string().min(1, 'Customer PO is required'),
  orderDate: z.string().min(1, 'Order date is required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  salesRep: z.string().min(1, 'Sales representative is required'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  shippingMethod: z.string().min(1, 'Shipping method is required'),
  customerAddress: z.string().optional(),
  notes: z.string().optional(),
});

const orderLineSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0.01, 'Unit price must be greater than 0'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  discount: z.number().min(0).max(100).optional(),
});

const STORAGE_KEY = 'sales_orders';
const LINES_STORAGE_KEY = 'order_lines';

const SalesOrders: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('orders');
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLineDialogOpen, setIsLineDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof salesOrderSchema>>({
    resolver: zodResolver(salesOrderSchema),
    defaultValues: {
      priority: 'Medium',
      paymentTerms: 'Net 30',
      shippingMethod: 'Standard Shipping',
    },
  });

  const lineForm = useForm<z.infer<typeof orderLineSchema>>({
    resolver: zodResolver(orderLineSchema),
    defaultValues: {
      quantity: 1,
      unitPrice: 0,
      discount: 0,
    },
  });

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Sales Orders Management. Create, track, and manage sales orders from quotation to delivery with comprehensive order fulfillment tracking.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const orders = listEntities<SalesOrder>(STORAGE_KEY);
    const lines = listEntities<OrderLine>(LINES_STORAGE_KEY);
    
    if (orders.length === 0) {
      // Seed with sample data
      const sampleOrders: SalesOrder[] = [
        {
          id: generateId('so'),
          orderNumber: 'SO-2025-001',
          customer: 'Acme Corporation',
          customerPO: 'PO-ACM-2025-001',
          orderDate: '2025-01-25',
          deliveryDate: '2025-02-15',
          totalAmount: 125000.00,
          currency: 'USD',
          status: 'Confirmed',
          priority: 'High',
          salesRep: 'John Smith',
          paymentTerms: 'Net 30',
          shippingMethod: 'Standard Shipping',
          lineItems: 5,
          customerAddress: '123 Business Ave, New York, NY 10001',
          notes: 'Rush order for Q1 project launch'
        },
        {
          id: generateId('so'),
          orderNumber: 'SO-2025-002',
          customer: 'TechSolutions Inc',
          customerPO: 'PO-TS-2025-002',
          orderDate: '2025-01-28',
          deliveryDate: '2025-02-20',
          totalAmount: 85000.00,
          currency: 'USD',
          status: 'In Progress',
          priority: 'Medium',
          salesRep: 'Sarah Johnson',
          paymentTerms: 'Net 15',
          shippingMethod: 'Express Shipping',
          lineItems: 3,
          customerAddress: '456 Tech Blvd, San Francisco, CA 94107'
        }
      ];
      
      sampleOrders.forEach(order => upsertEntity(STORAGE_KEY, order as any));
      setSalesOrders(sampleOrders);
    } else {
      setSalesOrders(orders);
    }

    setOrderLines(lines);
  };

  const onSubmit = (data: z.infer<typeof salesOrderSchema>) => {
    try {
      const orderNumber = `SO-2025-${String(salesOrders.length + 1).padStart(3, '0')}`;
      const newOrder: SalesOrder = {
        id: generateId('so'),
        orderNumber,
        customer: data.customer,
        customerPO: data.customerPO,
        orderDate: data.orderDate,
        deliveryDate: data.deliveryDate,
        priority: data.priority,
        salesRep: data.salesRep,
        paymentTerms: data.paymentTerms,
        shippingMethod: data.shippingMethod,
        customerAddress: data.customerAddress,
        notes: data.notes,
        totalAmount: 0,
        currency: 'USD',
        status: 'Draft',
        lineItems: 0,
      };

      upsertEntity(STORAGE_KEY, newOrder as any);
      setSalesOrders(prev => [...prev, newOrder]);
      
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

  const onEdit = (data: z.infer<typeof salesOrderSchema>) => {
    if (!editingOrder) return;
    
    try {
      const updatedOrder = { ...editingOrder, ...data };
      upsertEntity(STORAGE_KEY, updatedOrder as any);
      setSalesOrders(prev => prev.map(order => 
        order.id === editingOrder.id ? updatedOrder : order
      ));
      
      toast({
        title: 'Sales Order Updated',
        description: `Order ${updatedOrder.orderNumber} has been updated.`,
      });
      
      setIsEditDialogOpen(false);
      setEditingOrder(null);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update sales order.',
        variant: 'destructive',
      });
    }
  };

  const onAddLine = (data: z.infer<typeof orderLineSchema>) => {
    if (!selectedOrder) return;

    try {
      const totalPrice = data.quantity * data.unitPrice * (1 - (data.discount || 0) / 100);
      const newLine: OrderLine = {
        id: generateId('line'),
        orderId: selectedOrder.id,
        lineNumber: orderLines.filter(l => l.orderId === selectedOrder.id).length + 1,
        product: data.product,
        description: data.description,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        deliveryDate: data.deliveryDate,
        discount: data.discount,
        totalPrice,
        status: 'Open',
      };

      upsertEntity(LINES_STORAGE_KEY, newLine as any);
      setOrderLines(prev => [...prev, newLine]);
      
      // Update order total
      const orderTotal = [...orderLines.filter(l => l.orderId === selectedOrder.id), newLine]
        .reduce((sum, line) => sum + line.totalPrice, 0);
      
      const updatedOrder = { 
        ...selectedOrder, 
        totalAmount: orderTotal,
        lineItems: orderLines.filter(l => l.orderId === selectedOrder.id).length + 1
      };
      
      upsertEntity(STORAGE_KEY, updatedOrder as any);
      setSalesOrders(prev => prev.map(order => 
        order.id === selectedOrder.id ? updatedOrder : order
      ));
      setSelectedOrder(updatedOrder);
      
      toast({
        title: 'Line Item Added',
        description: `Added ${data.product} to order ${selectedOrder.orderNumber}.`,
      });
      
      setIsLineDialogOpen(false);
      lineForm.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add line item.',
        variant: 'destructive',
      });
    }
  };

  const deleteOrder = (order: SalesOrder) => {
    try {
      removeEntity(STORAGE_KEY, order.id);
      setSalesOrders(prev => prev.filter(o => o.id !== order.id));
      
      // Remove associated lines
      const linesToRemove = orderLines.filter(l => l.orderId === order.id);
      linesToRemove.forEach(line => removeEntity(LINES_STORAGE_KEY, line.id));
      setOrderLines(prev => prev.filter(l => l.orderId !== order.id));
      
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
  };

  const updateOrderStatus = (order: SalesOrder, newStatus: SalesOrder['status']) => {
    try {
      const updatedOrder = { ...order, status: newStatus };
      upsertEntity(STORAGE_KEY, updatedOrder as any);
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

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Invoiced': 'bg-purple-100 text-purple-800',
      'Completed': 'bg-emerald-100 text-emerald-800',
      'Cancelled': 'bg-red-100 text-red-800'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return <FileText className="h-4 w-4" />;
      case 'Confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'In Progress': return <Clock className="h-4 w-4" />;
      case 'Delivered': return <Truck className="h-4 w-4" />;
      case 'Urgent': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const columns: EnhancedColumn[] = [
    { key: 'orderNumber', header: 'Order Number', sortable: true, searchable: true },
    { key: 'customer', header: 'Customer', searchable: true },
    { key: 'customerPO', header: 'Customer PO', searchable: true },
    { 
      key: 'totalAmount', 
      header: 'Total Amount',
      sortable: true,
      render: (value: number, row: SalesOrder) => `${row.currency} ${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Draft', value: 'Draft' },
        { label: 'Confirmed', value: 'Confirmed' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Invoiced', value: 'Invoiced' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {getStatusIcon(value)}
          <span className="ml-1">{value}</span>
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
    { key: 'orderDate', header: 'Order Date', sortable: true },
    { key: 'deliveryDate', header: 'Delivery Date', sortable: true },
    { key: 'salesRep', header: 'Sales Rep', searchable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: SalesOrder) => {
        setSelectedOrder(row);
        setActiveTab('details');
        toast({
          title: 'View Sales Order',
          description: `Opening ${row.orderNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: SalesOrder) => {
        setEditingOrder(row);
        form.reset({
          customer: row.customer,
          customerPO: row.customerPO,
          orderDate: row.orderDate,
          deliveryDate: row.deliveryDate,
          priority: row.priority,
          salesRep: row.salesRep,
          paymentTerms: row.paymentTerms,
          shippingMethod: row.shippingMethod,
          customerAddress: row.customerAddress || '',
          notes: row.notes || '',
        });
        setIsEditDialogOpen(true);
      },
      variant: 'ghost',
      condition: (row: SalesOrder) => ['Draft', 'Confirmed'].includes(row.status)
    },
    {
      label: 'Ship',
      icon: <Truck className="h-4 w-4" />,
      onClick: (row: SalesOrder) => {
        updateOrderStatus(row, 'In Progress');
      },
      variant: 'ghost',
      condition: (row: SalesOrder) => row.status === 'Confirmed'
    },
    {
      label: 'Confirm',
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (row: SalesOrder) => {
        updateOrderStatus(row, 'Confirmed');
      },
      variant: 'ghost',
      condition: (row: SalesOrder) => row.status === 'Draft'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: SalesOrder) => {
        if (confirm(`Are you sure you want to delete order ${row.orderNumber}?`)) {
          deleteOrder(row);
        }
      },
      variant: 'ghost',
      condition: (row: SalesOrder) => row.status === 'Draft'
    }
  ];

  const lineColumns: EnhancedColumn[] = [
    { key: 'lineNumber', header: 'Line', sortable: true },
    { key: 'product', header: 'Product', searchable: true },
    { key: 'description', header: 'Description', searchable: true },
    { key: 'quantity', header: 'Quantity', sortable: true },
    { 
      key: 'unitPrice', 
      header: 'Unit Price',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'discount',
      header: 'Discount (%)',
      render: (value: number) => `${value || 0}%`
    },
    { 
      key: 'totalPrice', 
      header: 'Total Price',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'deliveryDate', header: 'Delivery Date', sortable: true },
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

  const selectedOrderLines = orderLines.filter(line => line.orderId === selectedOrder?.id);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/sales')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Sales Orders"
          description="Create, track, and manage sales orders from quotation to delivery"
          voiceIntroduction="Welcome to Sales Orders Management for comprehensive order fulfillment tracking."
        />
      </div>

      <VoiceTrainingComponent 
        module="sales"
        topic="Sales Order Management"
        examples={[
          "Creating sales orders from approved quotations with customer master data integration and pricing determination",
          "Managing order fulfillment process with inventory allocation, shipping coordination, and delivery tracking",
          "Processing order changes and amendments with proper approval workflows and customer communication"
        ]}
        detailLevel="advanced"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('orders')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{salesOrders.length}</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
            <div className="text-sm text-blue-600">This month</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('analytics')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {salesOrders.filter(so => so.status === 'Confirmed').length}
            </div>
            <div className="text-sm text-muted-foreground">Confirmed Orders</div>
            <div className="text-sm text-green-600">Ready to ship</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('analytics')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {salesOrders.filter(so => so.priority === 'Urgent').length}
            </div>
            <div className="text-sm text-muted-foreground">Urgent Orders</div>
            <div className="text-sm text-red-600">High priority</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('analytics')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${salesOrders.reduce((sum, so) => sum + so.totalAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-sm text-purple-600">Outstanding</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Sales Orders</TabsTrigger>
          <TabsTrigger value="create">Create Order</TabsTrigger>
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Sales Orders
                <div className="flex space-x-2">
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Sales Order</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="customer"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Customer</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select customer" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
                                      <SelectItem value="TechSolutions Inc">TechSolutions Inc</SelectItem>
                                      <SelectItem value="Global Manufacturing">Global Manufacturing</SelectItem>
                                      <SelectItem value="Innovation Labs">Innovation Labs</SelectItem>
                                      <SelectItem value="Digital Dynamics">Digital Dynamics</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="customerPO"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Customer PO</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter customer PO number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="orderDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Order Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="deliveryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Delivery Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="priority"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Priority</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Low">Low</SelectItem>
                                      <SelectItem value="Medium">Medium</SelectItem>
                                      <SelectItem value="High">High</SelectItem>
                                      <SelectItem value="Urgent">Urgent</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="salesRep"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sales Representative</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select sales rep" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="John Smith">John Smith</SelectItem>
                                      <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                                      <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                                      <SelectItem value="Emily Brown">Emily Brown</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="paymentTerms"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Payment Terms</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select payment terms" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Immediate">Immediate</SelectItem>
                                      <SelectItem value="Net 15">Net 15</SelectItem>
                                      <SelectItem value="Net 30">Net 30</SelectItem>
                                      <SelectItem value="Net 45">Net 45</SelectItem>
                                      <SelectItem value="Net 60">Net 60</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="shippingMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Shipping Method</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select shipping method" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Standard Shipping">Standard Shipping</SelectItem>
                                    <SelectItem value="Express Shipping">Express Shipping</SelectItem>
                                    <SelectItem value="Overnight">Overnight</SelectItem>
                                    <SelectItem value="Freight">Freight</SelectItem>
                                    <SelectItem value="Customer Pickup">Customer Pickup</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="customerAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Customer Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter customer address" {...field} />
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
                                  <Input placeholder="Order notes (optional)" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Create Order</Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={salesOrders}
                actions={actions}
                searchPlaceholder="Search sales orders..."
                exportable={true}
                refreshable={true}
                onRefresh={loadData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Sales Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Quick Order Creation</h3>
                <p className="text-muted-foreground mb-4">
                  Use the Create Order button in the Sales Orders tab for full order creation.
                </p>
                <Button onClick={() => setActiveTab('orders')}>
                  Go to Sales Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedOrder ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Order Details - {selectedOrder.orderNumber}</span>
                    <div className="flex space-x-2">
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1">{selectedOrder.status}</span>
                      </Badge>
                      <Badge className={getPriorityColor(selectedOrder.priority)}>
                        {selectedOrder.priority}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Order Information</h4>
                      <div className="space-y-2">
                        <div><span className="font-medium">Customer:</span> {selectedOrder.customer}</div>
                        <div><span className="font-medium">Customer PO:</span> {selectedOrder.customerPO}</div>
                        <div><span className="font-medium">Order Date:</span> {selectedOrder.orderDate}</div>
                        <div><span className="font-medium">Delivery Date:</span> {selectedOrder.deliveryDate}</div>
                        <div><span className="font-medium">Sales Rep:</span> {selectedOrder.salesRep}</div>
                        <div><span className="font-medium">Payment Terms:</span> {selectedOrder.paymentTerms}</div>
                        <div><span className="font-medium">Shipping Method:</span> {selectedOrder.shippingMethod}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Financial Information</h4>
                      <div className="space-y-2">
                        <div><span className="font-medium">Total Amount:</span> {selectedOrder.currency} {selectedOrder.totalAmount.toLocaleString()}</div>
                        <div><span className="font-medium">Currency:</span> {selectedOrder.currency}</div>
                        <div><span className="font-medium">Line Items:</span> {selectedOrder.lineItems}</div>
                      </div>
                      {selectedOrder.customerAddress && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Delivery Address</h4>
                          <p>{selectedOrder.customerAddress}</p>
                        </div>
                      )}
                      {selectedOrder.notes && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Notes</h4>
                          <p>{selectedOrder.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Order Lines</span>
                    <Dialog open={isLineDialogOpen} onOpenChange={setIsLineDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Line Item
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Line Item</DialogTitle>
                        </DialogHeader>
                        <Form {...lineForm}>
                          <form onSubmit={lineForm.handleSubmit(onAddLine)} className="space-y-4">
                            <FormField
                              control={lineForm.control}
                              name="product"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Product</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter product code" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={lineForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter product description" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={lineForm.control}
                                name="quantity"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                      <Input type="number" min="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={lineForm.control}
                                name="unitPrice"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Unit Price</FormLabel>
                                    <FormControl>
                                      <Input type="number" min="0" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={lineForm.control}
                                name="discount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Discount (%)</FormLabel>
                                    <FormControl>
                                      <Input type="number" min="0" max="100" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={lineForm.control}
                                name="deliveryDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Delivery Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button type="button" variant="outline" onClick={() => setIsLineDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">Add Line Item</Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedDataTable 
                    columns={lineColumns}
                    data={selectedOrderLines}
                    searchPlaceholder="Search line items..."
                    exportable={true}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Order Selected</h3>
                <p className="text-muted-foreground">
                  Select an order from the Sales Orders tab to view details.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Draft', 'Confirmed', 'In Progress', 'Delivered', 'Invoiced', 'Completed', 'Cancelled'].map((status) => {
                    const count = salesOrders.filter(so => so.status === status).length;
                    const percentage = salesOrders.length > 0 ? ((count / salesOrders.length) * 100).toFixed(1) : '0';
                    return (
                      <div key={status} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(status)}>{status}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{count}</div>
                          <div className="text-sm text-muted-foreground">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Low', 'Medium', 'High', 'Urgent'].map((priority) => {
                    const count = salesOrders.filter(so => so.priority === priority).length;
                    const percentage = salesOrders.length > 0 ? ((count / salesOrders.length) * 100).toFixed(1) : '0';
                    return (
                      <div key={priority} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(priority)}>{priority}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{count}</div>
                          <div className="text-sm text-muted-foreground">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Order Value</span>
                    <span className="font-medium">${salesOrders.reduce((sum, so) => sum + so.totalAmount, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Order Value</span>
                    <span className="font-medium">
                      ${salesOrders.length > 0 ? (salesOrders.reduce((sum, so) => sum + so.totalAmount, 0) / salesOrders.length).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate</span>
                    <span className="font-medium">
                      {salesOrders.length > 0 ? ((salesOrders.filter(so => so.status !== 'Cancelled').length / salesOrders.length) * 100).toFixed(1) : '0'}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Representative Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Brown'].map((rep) => {
                    const repOrders = salesOrders.filter(so => so.salesRep === rep);
                    const totalValue = repOrders.reduce((sum, so) => sum + so.totalAmount, 0);
                    return (
                      <div key={rep} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{rep}</div>
                          <div className="text-sm text-muted-foreground">{repOrders.length} orders</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${totalValue.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            ${repOrders.length > 0 ? (totalValue / repOrders.length).toLocaleString() : '0'} avg
                          </div>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Sales Order - {editingOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEdit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
                          <SelectItem value="TechSolutions Inc">TechSolutions Inc</SelectItem>
                          <SelectItem value="Global Manufacturing">Global Manufacturing</SelectItem>
                          <SelectItem value="Innovation Labs">Innovation Labs</SelectItem>
                          <SelectItem value="Digital Dynamics">Digital Dynamics</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerPO"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer PO</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer PO number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="orderDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salesRep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Representative</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sales rep" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="John Smith">John Smith</SelectItem>
                          <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                          <SelectItem value="Mike Davis">Mike Davis</SelectItem>
                          <SelectItem value="Emily Brown">Emily Brown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Immediate">Immediate</SelectItem>
                          <SelectItem value="Net 15">Net 15</SelectItem>
                          <SelectItem value="Net 30">Net 30</SelectItem>
                          <SelectItem value="Net 45">Net 45</SelectItem>
                          <SelectItem value="Net 60">Net 60</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="shippingMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Standard Shipping">Standard Shipping</SelectItem>
                        <SelectItem value="Express Shipping">Express Shipping</SelectItem>
                        <SelectItem value="Overnight">Overnight</SelectItem>
                        <SelectItem value="Freight">Freight</SelectItem>
                        <SelectItem value="Customer Pickup">Customer Pickup</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer address" {...field} />
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
                      <Input placeholder="Order notes (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Order</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesOrders;