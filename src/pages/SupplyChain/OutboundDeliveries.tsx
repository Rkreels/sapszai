
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Eye, Edit, CheckCircle, Trash2, Plus, Package } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useToast } from '../../hooks/use-toast';
import { generateId, listEntities, removeEntity, seedIfEmpty, upsertEntity } from '../../lib/localCrud';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

const STORAGE_KEY = 'outboundDeliveries';

const deliverySchema = z.object({
  id: z.string().min(1),
  deliveryNumber: z.string().min(3, 'Delivery number is required'),
  customer: z.string().min(2, 'Customer is required'),
  carrier: z.string().min(1, 'Carrier is required'),
  referenceSO: z.string().min(3, 'Reference SO is required'),
  items: z.coerce.number().int().min(1, 'At least one item'),
  shipDate: z.string().min(1, 'Ship Date is required'),
  status: z.enum(['Open', 'Picking', 'Picked', 'Packed', 'Shipped', 'Delivered'])
});

type Delivery = z.infer<typeof deliverySchema>;

const seedData: Delivery[] = [
  { id: generateId('obd'), deliveryNumber: '80000123', customer: 'Acme Retail LLC', carrier: 'DHL', referenceSO: '5000001234', items: 18, shipDate: '2025-08-10', status: 'Picking' },
  { id: generateId('obd'), deliveryNumber: '80000124', customer: 'Globex Corp', carrier: 'FedEx', referenceSO: '5000005678', items: 5, shipDate: '2025-08-09', status: 'Packed' },
];

const OutboundDeliveries: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<Delivery[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Delivery | null>(null);

  useEffect(() => {
    seedIfEmpty<Delivery>(STORAGE_KEY, seedData);
    setData(listEntities<Delivery>(STORAGE_KEY));
  }, []);

  const refresh = () => setData(listEntities<Delivery>(STORAGE_KEY));

  const columns: EnhancedColumn[] = useMemo(() => ([
    { key: 'deliveryNumber', header: 'Delivery', sortable: true, searchable: true },
    { key: 'customer', header: 'Customer', sortable: true, searchable: true },
    { key: 'carrier', header: 'Carrier', sortable: true },
    { key: 'referenceSO', header: 'SO Ref', sortable: true },
    { key: 'items', header: 'Items', sortable: true },
    { key: 'shipDate', header: 'Ship Date', sortable: true },
    {
      key: 'status',
      header: 'Status',
      filterable: true,
      filterOptions: ['Open', 'Picking', 'Picked', 'Packed', 'Shipped', 'Delivered'].map((s) => ({ label: s, value: s })),
    },
  ]), []);

  const actions: TableAction[] = [
    { label: 'View', icon: <Eye className="h-4 w-4" />, onClick: (row: Delivery) => toast({ title: 'View Delivery', description: `Viewing ${row.deliveryNumber}` }) },
    {
      label: 'Edit', icon: <Edit className="h-4 w-4" />, onClick: (row: Delivery) => {
        setEditing(row); setOpen(true);
      }
    },
    {
      label: 'Post GI',
      icon: <CheckCircle className="h-4 w-4" />,
      condition: (row: Delivery) => ['Picked', 'Packed'].includes(row.status),
      onClick: (row: Delivery) => {
        const updated: Delivery = { ...row, status: 'Shipped' };
        upsertEntity(STORAGE_KEY, updated as any);
        refresh();
        toast({ title: 'Goods Issue Posted', description: `GI posted for ${row.deliveryNumber}` });
      },
      variant: 'outline'
    },
    {
      label: 'Delete', icon: <Trash2 className="h-4 w-4" />, onClick: (row: Delivery) => { removeEntity(STORAGE_KEY, row.id); refresh(); toast({ title: 'Deleted', description: `${row.deliveryNumber} removed` }); }, variant: 'destructive'
    }
  ];

  const form = useForm<Delivery>({
    resolver: zodResolver(deliverySchema),
    defaultValues: { id: generateId('obd'), deliveryNumber: '', customer: '', carrier: 'DHL', referenceSO: '', items: 1, shipDate: new Date().toISOString().slice(0,10), status: 'Open' }
  });

  const openCreate = () => { setEditing(null); form.reset({ id: generateId('obd'), deliveryNumber: '', customer: '', carrier: 'DHL', referenceSO: '', items: 1, shipDate: new Date().toISOString().slice(0,10), status: 'Open' }); setOpen(true); };

  useEffect(() => { if (editing) form.reset(editing); }, [editing]);

  const onSubmit = (values: Delivery) => { upsertEntity(STORAGE_KEY, values as any); setOpen(false); refresh(); toast({ title: editing ? 'Delivery Updated' : 'Delivery Created', description: values.deliveryNumber }); };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center mb-2">
        <Button variant="outline" size="sm" className="mr-4" onClick={() => navigate('/supply-chain')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Outbound Deliveries"
          description="Manage outgoing shipments and goods issue"
          voiceIntroduction="Welcome to Outbound Deliveries. Here you can manage outgoing shipments and goods issue."
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" /> Outbound Deliveries
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" /> Create Delivery
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Outbound Delivery' : 'Create Outbound Delivery'}</DialogTitle>
                <DialogDescription>Enter details for the outbound delivery. All fields are required.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="deliveryNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Number</FormLabel>
                      <FormControl><Input placeholder="8000..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="customer" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <FormControl><Input placeholder="Customer name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="carrier" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carrier</FormLabel>
                      <FormControl><Input placeholder="DHL/FedEx" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="referenceSO" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference SO</FormLabel>
                      <FormControl><Input placeholder="5000..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="items" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Items</FormLabel>
                      <FormControl><Input type="number" min={1} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="shipDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ship Date</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['Open', 'Picking', 'Picked', 'Packed', 'Shipped', 'Delivered'].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <DialogFooter className="col-span-full mt-2">
                    <Button type="submit">{editing ? 'Save Changes' : 'Create'}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <EnhancedDataTable
            columns={columns}
            data={data}
            actions={actions}
            searchPlaceholder="Search deliveries, customers..."
            refreshable={true}
            onRefresh={refresh}
            exportable={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OutboundDeliveries;
