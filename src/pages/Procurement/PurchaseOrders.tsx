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
import { ArrowLeft, Plus, Edit, Eye, FileText, Truck, CheckCircle, Download, Trash2, Clock, AlertTriangle } from 'lucide-react';
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

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  supplierContact: string;
  description: string;
  totalAmount: number;
  currency: string;
  status: 'Draft' | 'Approved' | 'Sent' | 'Partially Received' | 'Delivered' | 'Invoiced' | 'Paid' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  orderDate: string;
  deliveryDate: string;
  requestedBy: string;
  approvedBy?: string;
  items: number;
  department: string;
  paymentTerms: string;
  deliveryAddress: string;
  notes?: string;
}

interface POLine {
  id: string;
  poId: string;
  lineNumber: number;
  material: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: string;
  status: 'Open' | 'Confirmed' | 'Delivered' | 'Invoiced';
  receivedQuantity: number;
  unit: string;
}

const purchaseOrderSchema = z.object({
  supplier: z.string().min(1, 'Supplier is required'),
  supplierContact: z.string().min(1, 'Supplier contact is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  orderDate: z.string().min(1, 'Order date is required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  requestedBy: z.string().min(1, 'Requested by is required'),
  department: z.string().min(1, 'Department is required'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  notes: z.string().optional(),
});

const poLineSchema = z.object({
  material: z.string().min(1, 'Material is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0.01, 'Unit price must be greater than 0'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  unit: z.string().min(1, 'Unit is required'),
});

const PO_STORAGE_KEY = 'purchase_orders';
const PO_LINES_STORAGE_KEY = 'po_lines';

const PurchaseOrders: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('orders');
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [poLines, setPoLines] = useState<POLine[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLineDialogOpen, setIsLineDialogOpen] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof purchaseOrderSchema>>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      priority: 'Medium',
      paymentTerms: 'Net 30',
      orderDate: new Date().toISOString().split('T')[0],
    },
  });

  const lineForm = useForm<z.infer<typeof poLineSchema>>({
    resolver: zodResolver(poLineSchema),
    defaultValues: {
      quantity: 1,
      unitPrice: 0,
      unit: 'Each',
    },
  });

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Purchase Orders Management. Create, track, and manage purchase orders throughout their lifecycle from creation to payment.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const orders = listEntities<PurchaseOrder>(PO_STORAGE_KEY);
    const lines = listEntities<POLine>(PO_LINES_STORAGE_KEY);
    
    if (orders.length === 0) {
      // Seed with sample data
      const sampleOrders: PurchaseOrder[] = [
        {
          id: generateId('po'),
          poNumber: 'PO-2025-001',
          supplier: 'Dell Technologies',
          supplierContact: 'sales@dell.com',
          description: 'Laptop computers for IT department',
          totalAmount: 15000.00,
          currency: 'USD',
          status: 'Approved',
          priority: 'High',
          orderDate: '2025-01-20',
          deliveryDate: '2025-02-15',
          requestedBy: 'IT Manager',
          approvedBy: 'John Smith',
          items: 10,
          department: 'IT',
          paymentTerms: 'Net 30',
          deliveryAddress: '123 Business St, Tech City, TC 12345',
          notes: 'Urgent requirement for new hires'
        },
        {
          id: generateId('po'),
          poNumber: 'PO-2025-002',
          supplier: 'Office Depot',
          supplierContact: 'business@officedepot.com',
          description: 'Office supplies and stationery',
          totalAmount: 850.00,
          currency: 'USD',
          status: 'Delivered',
          priority: 'Low',
          orderDate: '2025-01-15',
          deliveryDate: '2025-01-25',
          requestedBy: 'Admin Manager',
          approvedBy: 'Sarah Johnson',
          items: 25,
          department: 'Administration',
          paymentTerms: 'Net 15',
          deliveryAddress: '123 Business St, Tech City, TC 12345'
        },
        {
          id: generateId('po'),
          poNumber: 'PO-2025-003',
          supplier: 'Manufacturing Equipment Inc',
          supplierContact: 'sales@mfgequip.com',
          description: 'Production machinery maintenance parts',
          totalAmount: 5200.00,
          currency: 'USD',
          status: 'Sent',
          priority: 'High',
          orderDate: '2025-01-22',
          deliveryDate: '2025-02-05',
          requestedBy: 'Production Manager',
          items: 15,
          department: 'Manufacturing',
          paymentTerms: 'Net 45',
          deliveryAddress: 'Plant 1, 456 Industrial Ave, Manufacturing City, MC 67890'
        }
      ];
      
      sampleOrders.forEach(order => upsertEntity<PurchaseOrder>(PO_STORAGE_KEY, order));
      setPurchaseOrders(sampleOrders);

      // Sample PO lines
      const sampleLines: POLine[] = [
        {
          id: generateId('line'),
          poId: sampleOrders[0].id,
          lineNumber: 10,
          material: 'LAPTOP-001',
          description: 'Dell Latitude 7420 Laptop',
          quantity: 10,
          unitPrice: 1200.00,
          totalPrice: 12000.00,
          deliveryDate: '2025-02-15',
          status: 'Confirmed',
          receivedQuantity: 0,
          unit: 'Each'
        },
        {
          id: generateId('line'),
          poId: sampleOrders[0].id,
          lineNumber: 20,
          material: 'ACC-001',
          description: 'Laptop Carrying Case',
          quantity: 10,
          unitPrice: 50.00,
          totalPrice: 500.00,
          deliveryDate: '2025-02-15',
          status: 'Confirmed',
          receivedQuantity: 0,
          unit: 'Each'
        }
      ];
      
      sampleLines.forEach(line => upsertEntity<POLine>(PO_LINES_STORAGE_KEY, line));
      setPoLines(sampleLines);
    } else {
      setPurchaseOrders(orders);
      setPoLines(lines);
    }
  };

  const onSubmit = (data: z.infer<typeof purchaseOrderSchema>) => {
    try {
      const poNumber = `PO-2025-${String(purchaseOrders.length + 1).padStart(3, '0')}`;
      const newPO: PurchaseOrder = {
        id: generateId('po'),
        poNumber,
        supplier: data.supplier || '',
        supplierContact: data.supplierContact || '',
        orderDate: data.orderDate || new Date().toISOString().split('T')[0],
        deliveryDate: data.deliveryDate || '',
        requestedBy: data.requestedBy || '',
        department: data.department || '',
        paymentTerms: data.paymentTerms || 'Net 30',
        deliveryAddress: data.deliveryAddress || '',
        priority: data.priority || 'Medium',
        description: data.description,
        notes: data.notes,
        totalAmount: 0,
        currency: 'USD',
        status: 'Draft' as const,
        items: 0,
      };

      upsertEntity<PurchaseOrder>(PO_STORAGE_KEY, newPO);
      setPurchaseOrders(prev => [...prev, newPO]);
      
      toast({
        title: 'Purchase Order Created',
        description: `PO ${poNumber} has been created successfully.`,
      });
      
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create purchase order.',
        variant: 'destructive',
      });
    }
  };

  const onEdit = (data: z.infer<typeof purchaseOrderSchema>) => {
    if (!editingPO) return;
    
    try {
      const updatedPO = { ...editingPO, ...data };
      upsertEntity<PurchaseOrder>(PO_STORAGE_KEY, updatedPO);
      setPurchaseOrders(prev => prev.map(po => 
        po.id === editingPO.id ? updatedPO : po
      ));
      
      toast({
        title: 'Purchase Order Updated',
        description: `PO ${updatedPO.poNumber} has been updated.`,
      });
      
      setIsEditDialogOpen(false);
      setEditingPO(null);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update purchase order.',
        variant: 'destructive',
      });
    }
  };

  const onAddLine = (data: z.infer<typeof poLineSchema>) => {
    if (!selectedPO) return;

    try {
      const totalPrice = data.quantity * data.unitPrice;
      const newLine: POLine = {
        id: generateId('line'),
        poId: selectedPO.id,
        lineNumber: (poLines.filter(l => l.poId === selectedPO.id).length + 1) * 10,
        material: data.material || '',
        description: data.description || '',
        quantity: data.quantity || 0,
        unit: data.unit || 'EA',
        unitPrice: data.unitPrice || 0,
        deliveryDate: data.deliveryDate || '',
        totalPrice,
        status: 'Open' as const,
        receivedQuantity: 0,
      };

      upsertEntity<POLine>(PO_LINES_STORAGE_KEY, newLine);
      setPoLines(prev => [...prev, newLine]);
      
      // Update PO total
      const poTotal = [...poLines.filter(l => l.poId === selectedPO.id), newLine]
        .reduce((sum, line) => sum + line.totalPrice, 0);
      
      const updatedPO = { 
        ...selectedPO, 
        totalAmount: poTotal,
        items: poLines.filter(l => l.poId === selectedPO.id).length + 1
      };
      
      upsertEntity<PurchaseOrder>(PO_STORAGE_KEY, updatedPO);
      setPurchaseOrders(prev => prev.map(po => 
        po.id === selectedPO.id ? updatedPO : po
      ));
      setSelectedPO(updatedPO);
      
      toast({
        title: 'Line Item Added',
        description: `Added ${data.material} to PO ${selectedPO.poNumber}.`,
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

  const deletePO = (po: PurchaseOrder) => {
    try {
      removeEntity(PO_STORAGE_KEY, po.id);
      setPurchaseOrders(prev => prev.filter(p => p.id !== po.id));
      
      // Remove associated lines
      const linesToRemove = poLines.filter(l => l.poId === po.id);
      linesToRemove.forEach(line => removeEntity(PO_LINES_STORAGE_KEY, line.id));
      setPoLines(prev => prev.filter(l => l.poId !== po.id));
      
      toast({
        title: 'PO Deleted',
        description: `Purchase Order ${po.poNumber} has been deleted.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete purchase order.',
        variant: 'destructive',
      });
    }
  };

  const updatePOStatus = (po: PurchaseOrder, newStatus: PurchaseOrder['status']) => {
    try {
      const updatedPO = { ...po, status: newStatus };
      if (newStatus === 'Approved') {
        updatedPO.approvedBy = 'Current User';
      }
      
      upsertEntity<PurchaseOrder>(PO_STORAGE_KEY, updatedPO);
      setPurchaseOrders(prev => prev.map(p => p.id === po.id ? updatedPO : p));
      
      toast({
        title: 'Status Updated',
        description: `PO ${po.poNumber} status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update PO status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Approved': 'bg-blue-100 text-blue-800',
      'Sent': 'bg-yellow-100 text-yellow-800',
      'Partially Received': 'bg-orange-100 text-orange-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Invoiced': 'bg-purple-100 text-purple-800',
      'Paid': 'bg-emerald-100 text-emerald-800',
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
      case 'Approved': return <CheckCircle className="h-4 w-4" />;
      case 'Sent': return <Clock className="h-4 w-4" />;
      case 'Delivered': return <Truck className="h-4 w-4" />;
      case 'Urgent': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const columns: EnhancedColumn<PurchaseOrder>[] = [
    { key: 'poNumber', header: 'PO Number', sortable: true, searchable: true },
    { key: 'supplier', header: 'Supplier', searchable: true },
    { key: 'description', header: 'Description', searchable: true },
    { 
      key: 'totalAmount', 
      header: 'Amount',
      sortable: true,
      render: (value: unknown, row: PurchaseOrder) => `${row.currency} ${(value as number).toLocaleString()}`
    },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Draft', value: 'Draft' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Sent', value: 'Sent' },
        { label: 'Partially Received', value: 'Partially Received' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Invoiced', value: 'Invoiced' },
        { label: 'Paid', value: 'Paid' },
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
    { key: 'department', header: 'Department', searchable: true }
  ];

  const actions: TableAction<PurchaseOrder>[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: PurchaseOrder) => {
        setSelectedPO(row);
        setActiveTab('details');
        toast({
          title: 'View Purchase Order',
          description: `Opening ${row.poNumber}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: PurchaseOrder) => {
        setEditingPO(row);
        form.reset({
          supplier: row.supplier,
          supplierContact: row.supplierContact,
          description: row.description,
          priority: row.priority,
          orderDate: row.orderDate,
          deliveryDate: row.deliveryDate,
          requestedBy: row.requestedBy,
          department: row.department,
          paymentTerms: row.paymentTerms,
          deliveryAddress: row.deliveryAddress,
          notes: row.notes || '',
        });
        setIsEditDialogOpen(true);
      },
      variant: 'ghost',
      condition: (row: PurchaseOrder) => ['Draft', 'Approved'].includes(row.status)
    },
    {
      label: 'Approve',
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (row: PurchaseOrder) => {
        updatePOStatus(row, 'Approved');
      },
      variant: 'ghost',
      condition: (row: PurchaseOrder) => row.status === 'Draft'
    },
    {
      label: 'Send',
      icon: <FileText className="h-4 w-4" />,
      onClick: (row: PurchaseOrder) => {
        updatePOStatus(row, 'Sent');
      },
      variant: 'ghost',
      condition: (row: PurchaseOrder) => row.status === 'Approved'
    },
    {
      label: 'Receive',
      icon: <Truck className="h-4 w-4" />,
      onClick: (row: PurchaseOrder) => {
        updatePOStatus(row, 'Delivered');
      },
      variant: 'ghost',
      condition: (row: PurchaseOrder) => row.status === 'Sent'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: PurchaseOrder) => {
        if (confirm(`Are you sure you want to delete PO ${row.poNumber}?`)) {
          deletePO(row);
        }
      },
      variant: 'ghost',
      condition: (row: PurchaseOrder) => row.status === 'Draft'
    }
  ];

  const lineColumns: EnhancedColumn[] = [
    { key: 'lineNumber', header: 'Line', sortable: true },
    { key: 'material', header: 'Material', searchable: true },
    { key: 'description', header: 'Description', searchable: true },
    { key: 'quantity', header: 'Quantity', sortable: true },
    { key: 'unit', header: 'Unit' },
    { 
      key: 'unitPrice', 
      header: 'Unit Price',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'totalPrice', 
      header: 'Total Price',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'deliveryDate', header: 'Delivery Date', sortable: true },
    { 
      key: 'receivedQuantity',
      header: 'Received',
      render: (value: number, row: POLine) => `${value} / ${row.quantity}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: unknown) => (
        <Badge className={getStatusColor(value as string)}>
          {value as string}
        </Badge>
      )
    }
  ];

  const selectedPOLines = poLines.filter(line => line.poId === selectedPO?.id);

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
          title="Purchase Orders"
          description="Create, track, and manage purchase orders throughout their lifecycle"
          voiceIntroduction="Welcome to Purchase Orders Management for comprehensive order lifecycle management."
        />
      </div>

      <VoiceTrainingComponent 
        module="Purchase Orders"
        topic="Purchase Order Management"
        examples={[
          "Creating purchase orders from approved requisitions with supplier selection and delivery scheduling",
          "Tracking order status from creation through delivery with automated notifications and approvals",
          "Managing three-way matching between purchase orders, goods receipts, and invoices for accurate payments"
        ]}
        detailLevel="advanced"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('orders')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{purchaseOrders.length}</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
            <div className="text-sm text-blue-600">This month</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('tracking')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {purchaseOrders.filter(po => ['Approved', 'Sent'].includes(po.status)).length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Delivery</div>
            <div className="text-sm text-orange-600">In progress</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('analytics')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {purchaseOrders.filter(po => po.status === 'Delivered').length}
            </div>
            <div className="text-sm text-muted-foreground">Delivered</div>
            <div className="text-sm text-green-600">Ready for invoicing</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('analytics')}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-sm text-purple-600">Outstanding</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="tracking">Order Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Purchase Orders
                <div className="flex space-x-2">
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create PO
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Purchase Order</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="supplier"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Supplier</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select supplier" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Dell Technologies">Dell Technologies</SelectItem>
                                      <SelectItem value="Office Depot">Office Depot</SelectItem>
                                      <SelectItem value="Manufacturing Equipment Inc">Manufacturing Equipment Inc</SelectItem>
                                      <SelectItem value="Industrial Supplies Co">Industrial Supplies Co</SelectItem>
                                      <SelectItem value="Tech Components Ltd">Tech Components Ltd</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="supplierContact"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Supplier Contact</FormLabel>
                                  <FormControl>
                                    <Input placeholder="supplier@company.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter order description" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
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
                              name="requestedBy"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Requested By</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select requester" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="IT Manager">IT Manager</SelectItem>
                                      <SelectItem value="Admin Manager">Admin Manager</SelectItem>
                                      <SelectItem value="Production Manager">Production Manager</SelectItem>
                                      <SelectItem value="Finance Manager">Finance Manager</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="department"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Department</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="IT">IT</SelectItem>
                                      <SelectItem value="Administration">Administration</SelectItem>
                                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                      <SelectItem value="Finance">Finance</SelectItem>
                                      <SelectItem value="Sales">Sales</SelectItem>
                                      <SelectItem value="Marketing">Marketing</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

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
                            <Button type="submit">Create PO</Button>
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
                data={purchaseOrders}
                actions={actions}
                searchPlaceholder="Search purchase orders..."
                exportable={true}
                refreshable={true}
                onRefresh={loadData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedPO ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>PO Details - {selectedPO.poNumber}</span>
                    <div className="flex space-x-2">
                      <Badge className={getStatusColor(selectedPO.status)}>
                        {getStatusIcon(selectedPO.status)}
                        <span className="ml-1">{selectedPO.status}</span>
                      </Badge>
                      <Badge className={getPriorityColor(selectedPO.priority)}>
                        {selectedPO.priority}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Order Information</h4>
                      <div className="space-y-2">
                        <div><span className="font-medium">Supplier:</span> {selectedPO.supplier}</div>
                        <div><span className="font-medium">Contact:</span> {selectedPO.supplierContact}</div>
                        <div><span className="font-medium">Description:</span> {selectedPO.description}</div>
                        <div><span className="font-medium">Order Date:</span> {selectedPO.orderDate}</div>
                        <div><span className="font-medium">Delivery Date:</span> {selectedPO.deliveryDate}</div>
                        <div><span className="font-medium">Requested By:</span> {selectedPO.requestedBy}</div>
                        {selectedPO.approvedBy && (
                          <div><span className="font-medium">Approved By:</span> {selectedPO.approvedBy}</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Financial & Delivery</h4>
                      <div className="space-y-2">
                        <div><span className="font-medium">Total Amount:</span> {selectedPO.currency} {selectedPO.totalAmount.toLocaleString()}</div>
                        <div><span className="font-medium">Department:</span> {selectedPO.department}</div>
                        <div><span className="font-medium">Payment Terms:</span> {selectedPO.paymentTerms}</div>
                        <div><span className="font-medium">Line Items:</span> {selectedPO.items}</div>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Delivery Address</h4>
                        <p>{selectedPO.deliveryAddress}</p>
                      </div>
                      {selectedPO.notes && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Notes</h4>
                          <p>{selectedPO.notes}</p>
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
                              name="material"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Material Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter material code" {...field} />
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
                                    <Input placeholder="Enter material description" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-3 gap-4">
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
                                name="unit"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Unit</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Unit" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Each">Each</SelectItem>
                                        <SelectItem value="Kg">Kg</SelectItem>
                                        <SelectItem value="Liter">Liter</SelectItem>
                                        <SelectItem value="Meter">Meter</SelectItem>
                                        <SelectItem value="Box">Box</SelectItem>
                                        <SelectItem value="Pack">Pack</SelectItem>
                                      </SelectContent>
                                    </Select>
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
                    data={selectedPOLines}
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
                <h3 className="text-lg font-medium mb-2">No PO Selected</h3>
                <p className="text-muted-foreground">
                  Select a purchase order from the Purchase Orders tab to view details.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseOrders.filter(po => ['Approved', 'Sent', 'Partially Received'].includes(po.status)).map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{order.poNumber}</h4>
                        <p className="text-sm text-muted-foreground">{order.supplier}</p>
                        <p className="text-sm">Expected: {order.deliveryDate}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </Badge>
                          <Badge className={getPriorityColor(order.priority)}>
                            {order.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedPO(order);
                            setActiveTab('details');
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {order.status === 'Sent' && (
                          <Button 
                            size="sm"
                            onClick={() => updatePOStatus(order, 'Delivered')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {purchaseOrders.filter(po => ['Approved', 'Sent', 'Partially Received'].includes(po.status)).length === 0 && (
                  <div className="text-center py-8">
                    <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Orders to Track</h3>
                    <p className="text-muted-foreground">
                      All purchase orders are either in draft, delivered, or completed state.
                    </p>
                  </div>
                )}
              </div>
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
                <div className="space-y-4">
                  {['Draft', 'Approved', 'Sent', 'Partially Received', 'Delivered', 'Invoiced', 'Paid', 'Cancelled'].map((status) => {
                    const count = purchaseOrders.filter(po => po.status === status).length;
                    const percentage = purchaseOrders.length > 0 ? ((count / purchaseOrders.length) * 100).toFixed(1) : '0';
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
                <CardTitle>Department Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['IT', 'Administration', 'Manufacturing', 'Finance', 'Sales', 'Marketing'].map((dept) => {
                    const deptOrders = purchaseOrders.filter(po => po.department === dept);
                    const total = deptOrders.reduce((sum, po) => sum + po.totalAmount, 0);
                    return (
                      <div key={dept} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{dept}</div>
                          <div className="text-sm text-muted-foreground">{deptOrders.length} orders</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${total.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            ${deptOrders.length > 0 ? (total / deptOrders.length).toLocaleString() : '0'} avg
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Dell Technologies', 'Office Depot', 'Manufacturing Equipment Inc', 'Industrial Supplies Co'].map((supplier) => {
                    const supplierOrders = purchaseOrders.filter(po => po.supplier === supplier);
                    const totalValue = supplierOrders.reduce((sum, po) => sum + po.totalAmount, 0);
                    const deliveredOrders = supplierOrders.filter(po => ['Delivered', 'Invoiced', 'Paid'].includes(po.status)).length;
                    const performanceRate = supplierOrders.length > 0 ? ((deliveredOrders / supplierOrders.length) * 100).toFixed(1) : '0';
                    
                    return (
                      <div key={supplier} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{supplier}</div>
                          <div className="text-sm text-muted-foreground">{supplierOrders.length} orders</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${totalValue.toLocaleString()}</div>
                          <div className="text-sm text-green-600">{performanceRate}% delivered</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Order Value</span>
                    <span className="font-medium">${purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Order Value</span>
                    <span className="font-medium">
                      ${purchaseOrders.length > 0 ? (purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0) / purchaseOrders.length).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Urgent Orders</span>
                    <span className="font-medium text-red-600">
                      {purchaseOrders.filter(po => po.priority === 'Urgent').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>On-Time Delivery Rate</span>
                    <span className="font-medium text-green-600">
                      {purchaseOrders.length > 0 ? ((purchaseOrders.filter(po => ['Delivered', 'Invoiced', 'Paid'].includes(po.status)).length / purchaseOrders.length) * 100).toFixed(1) : '0'}%
                    </span>
                  </div>
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
            <DialogTitle>Edit Purchase Order - {editingPO?.poNumber}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEdit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Dell Technologies">Dell Technologies</SelectItem>
                          <SelectItem value="Office Depot">Office Depot</SelectItem>
                          <SelectItem value="Manufacturing Equipment Inc">Manufacturing Equipment Inc</SelectItem>
                          <SelectItem value="Industrial Supplies Co">Industrial Supplies Co</SelectItem>
                          <SelectItem value="Tech Components Ltd">Tech Components Ltd</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supplierContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="supplier@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter order description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                  name="requestedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requested By</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select requester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IT Manager">IT Manager</SelectItem>
                          <SelectItem value="Admin Manager">Admin Manager</SelectItem>
                          <SelectItem value="Production Manager">Production Manager</SelectItem>
                          <SelectItem value="Finance Manager">Finance Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update PO</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrders;