import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { ArrowLeft, Plus, Edit, Eye, Play, Pause, Square, CheckCircle, Clock, AlertTriangle, Download } from 'lucide-react';
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
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

interface ProductionOrder {
  id: string;
  orderNumber: string;
  material: string;
  materialDescription: string;
  plannedQuantity: number;
  confirmedQuantity: number;
  unit: string;
  status: 'Created' | 'Released' | 'In Production' | 'Partially Confirmed' | 'Confirmed' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Very High';
  plant: string;
  workCenter: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  supervisor: string;
  efficiency: number;
  costCenter: string;
  bom: string;
  routing: string;
  scrapQuantity: number;
  notes?: string;
}

interface ProductionOperation {
  id: string;
  productionOrderId: string;
  operationNumber: string;
  workCenter: string;
  description: string;
  plannedDuration: number;
  actualDuration: number;
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  startDate: string;
  endDate: string;
  operator: string;
  machineHours: number;
  laborHours: number;
}

const productionOrderSchema = z.object({
  material: z.string().min(1, 'Material is required'),
  materialDescription: z.string().min(1, 'Material description is required'),
  plannedQuantity: z.number().min(1, 'Planned quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Very High']),
  plant: z.string().min(1, 'Plant is required'),
  workCenter: z.string().min(1, 'Work center is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  supervisor: z.string().min(1, 'Supervisor is required'),
  costCenter: z.string().min(1, 'Cost center is required'),
  bom: z.string().min(1, 'BOM is required'),
  routing: z.string().min(1, 'Routing is required'),
  notes: z.string().optional(),
});

const STORAGE_KEY = 'production_orders';
const OPERATIONS_STORAGE_KEY = 'production_operations';

const ProductionPage: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('orders');
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
  const [operations, setOperations] = useState<ProductionOperation[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof productionOrderSchema>>({
    resolver: zodResolver(productionOrderSchema),
    defaultValues: {
      priority: 'Medium',
      plant: 'Plant 1000',
      unit: 'Each',
      plannedQuantity: 1,
    },
  });

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Production Management. Monitor and manage production orders, materials, and operations with real-time production tracking.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const orders = listEntities<ProductionOrder>(STORAGE_KEY);
    const ops = listEntities<ProductionOperation>(OPERATIONS_STORAGE_KEY);
    
    if (orders.length === 0) {
      // Seed with sample data
      const sampleOrders: ProductionOrder[] = [
        {
          id: generateId('po'),
          orderNumber: 'PO-1000001',
          material: 'FG-001',
          materialDescription: 'Finished Product A - Standard Configuration',
          plannedQuantity: 100,
          confirmedQuantity: 85,
          unit: 'Each',
          status: 'In Production',
          priority: 'High',
          plant: 'Plant 1000',
          workCenter: 'WC-100',
          startDate: '2025-01-20',
          endDate: '2025-01-30',
          actualStartDate: '2025-01-20',
          supervisor: 'John Manufacturing',
          efficiency: 85.5,
          costCenter: 'CC-1000',
          bom: 'BOM-FG-001-V1',
          routing: 'RT-FG-001-STD',
          scrapQuantity: 5,
          notes: 'High priority order for customer delivery'
        },
        {
          id: generateId('po'),
          orderNumber: 'PO-1000002',
          material: 'FG-002',
          materialDescription: 'Finished Product B - Premium Configuration',
          plannedQuantity: 50,
          confirmedQuantity: 0,
          unit: 'Each',
          status: 'Released',
          priority: 'Medium',
          plant: 'Plant 1000',
          workCenter: 'WC-200',
          startDate: '2025-01-25',
          endDate: '2025-02-05',
          supervisor: 'Sarah Production',
          efficiency: 0,
          costCenter: 'CC-1000',
          bom: 'BOM-FG-002-V1',
          routing: 'RT-FG-002-PREM',
          scrapQuantity: 0
        },
        {
          id: generateId('po'),
          orderNumber: 'PO-1000003',
          material: 'SF-001',
          materialDescription: 'Semi-Finished Component X',
          plannedQuantity: 200,
          confirmedQuantity: 200,
          unit: 'Each',
          status: 'Completed',
          priority: 'Low',
          plant: 'Plant 2000',
          workCenter: 'WC-300',
          startDate: '2025-01-15',
          endDate: '2025-01-22',
          actualStartDate: '2025-01-15',
          actualEndDate: '2025-01-21',
          supervisor: 'Mike Assembly',
          efficiency: 105.2,
          costCenter: 'CC-2000',
          bom: 'BOM-SF-001-V1',
          routing: 'RT-SF-001-STD',
          scrapQuantity: 8
        }
      ];
      
      sampleOrders.forEach(order => upsertEntity(STORAGE_KEY, order as any));
      setProductionOrders(sampleOrders);

      // Sample operations
      const sampleOperations: ProductionOperation[] = [
        {
          id: generateId('op'),
          productionOrderId: sampleOrders[0].id,
          operationNumber: '0010',
          workCenter: 'WC-100',
          description: 'Setup and Material Preparation',
          plannedDuration: 120,
          actualDuration: 135,
          status: 'Completed',
          startDate: '2025-01-20',
          endDate: '2025-01-20',
          operator: 'Operator A',
          machineHours: 0,
          laborHours: 2.25
        },
        {
          id: generateId('op'),
          productionOrderId: sampleOrders[0].id,
          operationNumber: '0020',
          workCenter: 'WC-100',
          description: 'Main Assembly Process',
          plannedDuration: 480,
          actualDuration: 420,
          status: 'In Progress',
          startDate: '2025-01-21',
          endDate: '2025-01-28',
          operator: 'Operator B',
          machineHours: 6.5,
          laborHours: 7.0
        }
      ];
      
      sampleOperations.forEach(operation => upsertEntity(OPERATIONS_STORAGE_KEY, operation as any));
      setOperations(sampleOperations);
    } else {
      setProductionOrders(orders);
      setOperations(ops);
    }
  };

  const onSubmit = (data: z.infer<typeof productionOrderSchema>) => {
    try {
      const orderNumber = `PO-${String(1000001 + productionOrders.length)}`;
      const newOrder: ProductionOrder = {
        id: generateId('po'),
        orderNumber,
        material: data.material || '',
        materialDescription: data.materialDescription || '',
        plannedQuantity: data.plannedQuantity || 0,
        unit: data.unit || 'EA',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        costCenter: data.costCenter || '',
        workCenter: data.workCenter || '',
        plant: data.plant || '',
        supervisor: data.supervisor || '',
        bom: data.bom || '',
        routing: data.routing || '',
        priority: data.priority || 'Medium',
        notes: data.notes,
        confirmedQuantity: 0,
        status: 'Created' as const,
        efficiency: 0,
        scrapQuantity: 0,
      };

      upsertEntity(STORAGE_KEY, newOrder as any);
      setProductionOrders(prev => [...prev, newOrder]);
      
      toast({
        title: 'Production Order Created',
        description: `Order ${orderNumber} has been created successfully.`,
      });
      
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create production order.',
        variant: 'destructive',
      });
    }
  };

  const updateOrderStatus = (order: ProductionOrder, newStatus: ProductionOrder['status']) => {
    try {
      const updatedOrder = { ...order, status: newStatus };
      if (newStatus === 'In Production' && !order.actualStartDate) {
        updatedOrder.actualStartDate = new Date().toISOString().split('T')[0];
      }
      if (newStatus === 'Completed' && !order.actualEndDate) {
        updatedOrder.actualEndDate = new Date().toISOString().split('T')[0];
      }
      
      upsertEntity(STORAGE_KEY, updatedOrder as any);
      setProductionOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
      
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

  const confirmProduction = (order: ProductionOrder, quantity: number) => {
    try {
      const updatedOrder: ProductionOrder = {
        ...order, 
        confirmedQuantity: order.confirmedQuantity + quantity,
        status: (order.confirmedQuantity + quantity >= order.plannedQuantity ? 'Confirmed' : 'Partially Confirmed') as ProductionOrder['status']
      };
      
      upsertEntity(STORAGE_KEY, updatedOrder as any);
      setProductionOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
      
      toast({
        title: 'Production Confirmed',
        description: `Confirmed ${quantity} units for order ${order.orderNumber}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to confirm production.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Created': 'bg-gray-100 text-gray-800',
      'Released': 'bg-blue-100 text-blue-800',
      'In Production': 'bg-yellow-100 text-yellow-800',
      'Partially Confirmed': 'bg-orange-100 text-orange-800',
      'Confirmed': 'bg-green-100 text-green-800',
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
      'Very High': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Created': return <Plus className="h-4 w-4" />;
      case 'Released': return <CheckCircle className="h-4 w-4" />;
      case 'In Production': return <Play className="h-4 w-4" />;
      case 'Completed': return <Square className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const columns: EnhancedColumn[] = [
    { key: 'orderNumber', header: 'Order Number', sortable: true, searchable: true },
    { key: 'material', header: 'Material', searchable: true },
    { key: 'materialDescription', header: 'Description', searchable: true },
    { 
      key: 'plannedQuantity', 
      header: 'Planned Qty',
      sortable: true,
      render: (value: number, row: ProductionOrder) => `${value} ${row.unit}`
    },
    { 
      key: 'confirmedQuantity', 
      header: 'Confirmed Qty',
      sortable: true,
      render: (value: number, row: ProductionOrder) => `${value} ${row.unit}`
    },
    { 
      key: 'efficiency', 
      header: 'Efficiency',
      sortable: true,
      render: (value: number) => `${value.toFixed(1)}%`
    },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Created', value: 'Created' },
        { label: 'Released', value: 'Released' },
        { label: 'In Production', value: 'In Production' },
        { label: 'Partially Confirmed', value: 'Partially Confirmed' },
        { label: 'Confirmed', value: 'Confirmed' },
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
        { label: 'Very High', value: 'Very High' }
      ],
      render: (value: string) => (
        <Badge className={getPriorityColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'workCenter', header: 'Work Center', searchable: true },
    { key: 'startDate', header: 'Start Date', sortable: true },
    { key: 'endDate', header: 'End Date', sortable: true },
    { key: 'supervisor', header: 'Supervisor', searchable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: ProductionOrder) => {
        setSelectedOrder(row);
        setActiveTab('details');
        toast({
          title: 'View Production Order',
          description: `Opening ${row.orderNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Release',
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (row: ProductionOrder) => {
        updateOrderStatus(row, 'Released');
      },
      variant: 'ghost',
      condition: (row: ProductionOrder) => row.status === 'Created'
    },
    {
      label: 'Start Production',
      icon: <Play className="h-4 w-4" />,
      onClick: (row: ProductionOrder) => {
        updateOrderStatus(row, 'In Production');
      },
      variant: 'ghost',
      condition: (row: ProductionOrder) => row.status === 'Released'
    },
    {
      label: 'Confirm',
      icon: <Square className="h-4 w-4" />,
      onClick: (row: ProductionOrder) => {
        const remaining = row.plannedQuantity - row.confirmedQuantity;
        if (remaining > 0) {
          confirmProduction(row, remaining);
        }
      },
      variant: 'ghost',
      condition: (row: ProductionOrder) => ['In Production', 'Partially Confirmed'].includes(row.status)
    },
    {
      label: 'Complete',
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (row: ProductionOrder) => {
        updateOrderStatus(row, 'Completed');
      },
      variant: 'ghost',
      condition: (row: ProductionOrder) => row.status === 'Confirmed'
    }
  ];

  const operationColumns: EnhancedColumn[] = [
    { key: 'operationNumber', header: 'Operation', sortable: true },
    { key: 'workCenter', header: 'Work Center', searchable: true },
    { key: 'description', header: 'Description', searchable: true },
    { 
      key: 'plannedDuration', 
      header: 'Planned (min)',
      render: (value: number) => `${value} min`
    },
    { 
      key: 'actualDuration', 
      header: 'Actual (min)',
      render: (value: number) => `${value} min`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'operator', header: 'Operator', searchable: true },
    { 
      key: 'machineHours', 
      header: 'Machine Hours',
      render: (value: number) => `${value.toFixed(1)}h`
    },
    { 
      key: 'laborHours', 
      header: 'Labor Hours',
      render: (value: number) => `${value.toFixed(1)}h`
    }
  ];

  // Production analytics data
  const statusData = ['Created', 'Released', 'In Production', 'Partially Confirmed', 'Confirmed', 'Completed', 'Cancelled'].map(status => ({
    name: status,
    count: productionOrders.filter(order => order.status === status).length
  }));

  const efficiencyData = productionOrders
    .filter(order => order.efficiency > 0)
    .slice(0, 10)
    .map(order => ({
      order: order.orderNumber,
      efficiency: order.efficiency
    }));

  const plantData = ['Plant 1000', 'Plant 2000', 'Plant 3000'].map(plant => ({
    name: plant,
    orders: productionOrders.filter(order => order.plant === plant).length,
    efficiency: productionOrders
      .filter(order => order.plant === plant && order.efficiency > 0)
      .reduce((sum, order, _, arr) => sum + order.efficiency / arr.length, 0) || 0
  }));

  const selectedOrderOperations = operations.filter(op => op.productionOrderId === selectedOrder?.id);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/manufacturing')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Production Management"
          description="Monitor and manage production orders, materials, and operations"
          voiceIntroduction="Welcome to Production Management. Here you can monitor and manage all your production activities."
        />
      </div>

      <VoiceTrainingComponent 
        module="manufacturing"
        topic="Production Order Management"
        examples={[
          "Creating production orders with material requirements, BOM specifications, and routing definitions",
          "Managing production workflow from order release through completion with real-time status tracking",
          "Monitoring production efficiency, capacity utilization, and quality metrics across work centers"
        ]}
        detailLevel="advanced"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('orders')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{productionOrders.length}</div>
            <div className="text-sm text-muted-foreground">Production Orders</div>
            <div className="text-sm text-blue-600">Total active</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('analytics')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {productionOrders.filter(order => order.status === 'In Production').length}
            </div>
            <div className="text-sm text-muted-foreground">In Production</div>
            <div className="text-sm text-yellow-600">Currently running</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('analytics')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {productionOrders.filter(order => order.status === 'Completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-sm text-green-600">This month</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('analytics')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {productionOrders.filter(order => order.efficiency > 0).length > 0 
                ? (productionOrders.filter(order => order.efficiency > 0).reduce((sum, order) => sum + order.efficiency, 0) / 
                   productionOrders.filter(order => order.efficiency > 0).length).toFixed(1)
                : '0'}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Efficiency</div>
            <div className="text-sm text-purple-600">Overall performance</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Production Orders</TabsTrigger>
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Production Orders
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
                        <DialogTitle>Create Production Order</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="material"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Material</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select material" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="FG-001">FG-001 - Finished Product A</SelectItem>
                                      <SelectItem value="FG-002">FG-002 - Finished Product B</SelectItem>
                                      <SelectItem value="SF-001">SF-001 - Semi-Finished Component X</SelectItem>
                                      <SelectItem value="SF-002">SF-002 - Semi-Finished Component Y</SelectItem>
                                      <SelectItem value="RM-001">RM-001 - Raw Material Base</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="materialDescription"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Material Description</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter material description" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="plannedQuantity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Planned Quantity</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="unit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Unit</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Each">Each</SelectItem>
                                      <SelectItem value="Kg">Kg</SelectItem>
                                      <SelectItem value="Liter">Liter</SelectItem>
                                      <SelectItem value="Meter">Meter</SelectItem>
                                      <SelectItem value="Set">Set</SelectItem>
                                    </SelectContent>
                                  </Select>
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
                                      <SelectItem value="Very High">Very High</SelectItem>
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
                              name="plant"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Plant</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select plant" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Plant 1000">Plant 1000 - Main Manufacturing</SelectItem>
                                      <SelectItem value="Plant 2000">Plant 2000 - Assembly Line</SelectItem>
                                      <SelectItem value="Plant 3000">Plant 3000 - Packaging</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="workCenter"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Work Center</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select work center" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="WC-100">WC-100 - Main Assembly</SelectItem>
                                      <SelectItem value="WC-200">WC-200 - Premium Line</SelectItem>
                                      <SelectItem value="WC-300">WC-300 - Component Assembly</SelectItem>
                                      <SelectItem value="WC-400">WC-400 - Quality Control</SelectItem>
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
                              name="startDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="endDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="supervisor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Supervisor</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select supervisor" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="John Manufacturing">John Manufacturing</SelectItem>
                                      <SelectItem value="Sarah Production">Sarah Production</SelectItem>
                                      <SelectItem value="Mike Assembly">Mike Assembly</SelectItem>
                                      <SelectItem value="Lisa Quality">Lisa Quality</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="costCenter"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cost Center</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select cost center" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="CC-1000">CC-1000 - Production</SelectItem>
                                      <SelectItem value="CC-2000">CC-2000 - Assembly</SelectItem>
                                      <SelectItem value="CC-3000">CC-3000 - Quality</SelectItem>
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
                              name="bom"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>BOM</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select BOM" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="BOM-FG-001-V1">BOM-FG-001-V1</SelectItem>
                                      <SelectItem value="BOM-FG-002-V1">BOM-FG-002-V1</SelectItem>
                                      <SelectItem value="BOM-SF-001-V1">BOM-SF-001-V1</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="routing"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Routing</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select routing" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="RT-FG-001-STD">RT-FG-001-STD</SelectItem>
                                      <SelectItem value="RT-FG-002-PREM">RT-FG-002-PREM</SelectItem>
                                      <SelectItem value="RT-SF-001-STD">RT-SF-001-STD</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                  <Input placeholder="Production notes (optional)" {...field} />
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
                data={productionOrders}
                actions={actions}
                searchPlaceholder="Search production orders..."
                exportable={true}
                refreshable={true}
                onRefresh={loadData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedOrder ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Production Order - {selectedOrder.orderNumber}</span>
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
                        <div><span className="font-medium">Material:</span> {selectedOrder.material}</div>
                        <div><span className="font-medium">Description:</span> {selectedOrder.materialDescription}</div>
                        <div><span className="font-medium">Planned Quantity:</span> {selectedOrder.plannedQuantity} {selectedOrder.unit}</div>
                        <div><span className="font-medium">Confirmed Quantity:</span> {selectedOrder.confirmedQuantity} {selectedOrder.unit}</div>
                        <div><span className="font-medium">Scrap Quantity:</span> {selectedOrder.scrapQuantity} {selectedOrder.unit}</div>
                        <div><span className="font-medium">Plant:</span> {selectedOrder.plant}</div>
                        <div><span className="font-medium">Work Center:</span> {selectedOrder.workCenter}</div>
                        <div><span className="font-medium">Supervisor:</span> {selectedOrder.supervisor}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Planning & Control</h4>
                      <div className="space-y-2">
                        <div><span className="font-medium">Start Date:</span> {selectedOrder.startDate}</div>
                        <div><span className="font-medium">End Date:</span> {selectedOrder.endDate}</div>
                        {selectedOrder.actualStartDate && (
                          <div><span className="font-medium">Actual Start:</span> {selectedOrder.actualStartDate}</div>
                        )}
                        {selectedOrder.actualEndDate && (
                          <div><span className="font-medium">Actual End:</span> {selectedOrder.actualEndDate}</div>
                        )}
                        <div><span className="font-medium">Efficiency:</span> {selectedOrder.efficiency.toFixed(1)}%</div>
                        <div><span className="font-medium">Cost Center:</span> {selectedOrder.costCenter}</div>
                        <div><span className="font-medium">BOM:</span> {selectedOrder.bom}</div>
                        <div><span className="font-medium">Routing:</span> {selectedOrder.routing}</div>
                      </div>
                      {selectedOrder.notes && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Notes</h4>
                          <p>{selectedOrder.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Production Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {selectedOrder.confirmedQuantity} / {selectedOrder.plannedQuantity} {selectedOrder.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((selectedOrder.confirmedQuantity / selectedOrder.plannedQuantity) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {((selectedOrder.confirmedQuantity / selectedOrder.plannedQuantity) * 100).toFixed(1)}% Complete
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <EnhancedDataTable 
                    columns={operationColumns}
                    data={selectedOrderOperations}
                    searchPlaceholder="Search operations..."
                    exportable={true}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Order Selected</h3>
                <p className="text-muted-foreground">
                  Select a production order from the Production Orders tab to view details.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={operationColumns}
                data={operations}
                searchPlaceholder="Search operations..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, count }) => `${name}: ${count}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={efficiencyData}>
                    <XAxis dataKey="order" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Efficiency']} />
                    <Bar dataKey="efficiency" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plant Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plantData.map((plant) => (
                    <div key={plant.name} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{plant.name}</div>
                        <div className="text-sm text-muted-foreground">{plant.orders} orders</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{plant.efficiency.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Avg efficiency</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Orders</span>
                    <span className="font-medium">{productionOrders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Orders</span>
                    <span className="font-medium text-yellow-600">
                      {productionOrders.filter(order => ['Released', 'In Production', 'Partially Confirmed'].includes(order.status)).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed Orders</span>
                    <span className="font-medium text-green-600">
                      {productionOrders.filter(order => order.status === 'Completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Priority Orders</span>
                    <span className="font-medium text-red-600">
                      {productionOrders.filter(order => ['High', 'Very High'].includes(order.priority)).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Planned Qty</span>
                    <span className="font-medium">
                      {productionOrders.reduce((sum, order) => sum + order.plannedQuantity, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Confirmed Qty</span>
                    <span className="font-medium">
                      {productionOrders.reduce((sum, order) => sum + order.confirmedQuantity, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionPage;