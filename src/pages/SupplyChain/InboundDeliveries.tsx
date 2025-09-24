
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Eye, Edit, CheckCircle, Trash2, Plus, Truck } from 'lucide-react';
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

const STORAGE_KEY = 'inboundDeliveries';

const deliverySchema = z.object({
  id: z.string().min(1),
  deliveryNumber: z.string().min(3, 'Delivery number is required'),
  supplier: z.string().min(2, 'Supplier is required'),
  warehouse: z.string().min(1, 'Warehouse is required'),
  referencePO: z.string().min(3, 'Reference PO is required'),
  materialCount: z.coerce.number().int().min(1, 'At least one item'),
  etaDate: z.string().min(1, 'ETA is required'),
  status: z.enum(['Planned', 'In Transit', 'Arrived', 'GR Posted'])
});

type Delivery = z.infer<typeof deliverySchema>;

const seedData: Delivery[] = [
  { id: generateId('ibd'), deliveryNumber: '180000123', supplier: 'Tech Components Inc.', warehouse: 'WH-01', referencePO: '4500009876', materialCount: 24, etaDate: '2025-08-10', status: 'In Transit' },
  { id: generateId('ibd'), deliveryNumber: '180000124', supplier: 'Industrial Parts Co.', warehouse: 'WH-02', referencePO: '4500009911', materialCount: 12, etaDate: '2025-08-09', status: 'Arrived' },
];

const InboundDeliveries: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<Delivery[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Delivery | null>(null);

  // seed once
  useEffect(() => {
    seedIfEmpty<Delivery>(STORAGE_KEY, seedData);
    setData(listEntities<Delivery>(STORAGE_KEY));
  }, []);

  const refresh = () => setData(listEntities<Delivery>(STORAGE_KEY));

  const columns: EnhancedColumn[] = useMemo(() => ([
    { key: 'deliveryNumber', header: 'Delivery', sortable: true, searchable: true },
    { key: 'supplier', header: 'Supplier', sortable: true, searchable: true },
    { key: 'warehouse', header: 'Warehouse', sortable: true, searchable: true },
    { key: 'referencePO', header: 'PO Ref', sortable: true },
    { key: 'materialCount', header: 'Items', sortable: true },
    { key: 'etaDate', header: 'ETA', sortable: true },
    {
      key: 'status',
      header: 'Status',
      filterable: true,
      filterOptions: ['Planned', 'In Transit', 'Arrived', 'GR Posted'].map((s) => ({ label: s, value: s })),
    },
  ]), []);

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: Delivery) => toast({ title: 'View Delivery', description: `Viewing ${row.deliveryNumber}` })
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: Delivery) => {
        setEditing(row);
        setOpen(true);
      }
    },
    {
      label: 'Post GR',
      icon: <CheckCircle className="h-4 w-4" />,
      condition: (row: Delivery) => row.status === 'Arrived' || row.status === 'In Transit',
      onClick: (row: Delivery) => {
        const updated: Delivery = { ...row, status: 'GR Posted' };
        upsertEntity(STORAGE_KEY, updated as any);
        refresh();
        toast({ title: 'Goods Receipt Posted', description: `GR posted for ${row.deliveryNumber}` });
      },
      variant: 'outline'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: Delivery) => {
        removeEntity(STORAGE_KEY, row.id);
        refresh();
        toast({ title: 'Deleted', description: `${row.deliveryNumber} removed` });
      },
      variant: 'destructive'
    },
  ];

  const form = useForm<Delivery>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      id: generateId('ibd'),
      deliveryNumber: '',
      supplier: '',
      warehouse: 'WH-01',
      referencePO: '',
      materialCount: 1,
      etaDate: new Date().toISOString().slice(0, 10),
      status: 'Planned'
    }
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({ id: generateId('ibd'), deliveryNumber: '', supplier: '', warehouse: 'WH-01', referencePO: '', materialCount: 1, etaDate: new Date().toISOString().slice(0,10), status: 'Planned' });
    setOpen(true);
  };

  useEffect(() => {
    if (editing) {
      form.reset(editing);
    }
  }, [editing]);

  const onSubmit = (values: Delivery) => {
    upsertEntity(STORAGE_KEY, values as any);
    setOpen(false);
    refresh();
    toast({ title: editing ? 'Delivery Updated' : 'Delivery Created', description: values.deliveryNumber });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center mb-2">
        <Button variant="outline" size="sm" className="mr-4" onClick={() => navigate('/supply-chain')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Inbound Deliveries"
          description="Manage incoming shipments and goods receipt"
          voiceIntroduction="Welcome to Inbound Deliveries. Here you can manage incoming shipments and goods receipt."
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" /> Inbound Deliveries
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" /> Create Delivery
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Inbound Delivery' : 'Create Inbound Delivery'}</DialogTitle>
                <DialogDescription>Enter details for the inbound delivery. All fields are required.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="deliveryNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 180000125" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="supplier" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <FormControl>
                        <Input placeholder="Supplier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="warehouse" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warehouse</FormLabel>
                      <FormControl>
                        <Input placeholder="WH-01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="referencePO" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference PO</FormLabel>
                      <FormControl>
                        <Input placeholder="4500..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="materialCount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Items</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="etaDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>ETA</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
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
                          {['Planned', 'In Transit', 'Arrived', 'GR Posted'].map((s) => (
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
            searchPlaceholder="Search deliveries, suppliers..."
            refreshable={true}
            onRefresh={refresh}
            exportable={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InboundDeliveries;
