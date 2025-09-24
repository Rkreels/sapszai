
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Eye, Edit, Trash2, Plus, Building2, Ban, CheckCircle2 } from 'lucide-react';
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

const STORAGE_KEY = 'suppliers';

const supplierSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, 'Name is required'),
  category: z.string().min(2, 'Category is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone required'),
  contact: z.string().min(2, 'Contact name required'),
  paymentTerms: z.enum(['Immediate', 'Net 15', 'Net 30', 'Net 60']),
  status: z.enum(['Active', 'Blocked']),
  rating: z.coerce.number().min(1).max(5)
});

type Supplier = z.infer<typeof supplierSchema>;

const seedData: Supplier[] = [
  { id: generateId('sup'), name: 'Tech Components Inc.', category: 'Electronics', email: 'sales@techco.com', phone: '+1 222 555 1000', contact: 'Alex Reed', paymentTerms: 'Net 30', status: 'Active', rating: 5 },
  { id: generateId('sup'), name: 'Industrial Parts Co.', category: 'Mechanical', email: 'info@indparts.com', phone: '+1 222 555 2000', contact: 'Maria Cruz', paymentTerms: 'Net 15', status: 'Blocked', rating: 3 },
];

const SupplierManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<Supplier[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);

  useEffect(() => {
    seedIfEmpty<Supplier>(STORAGE_KEY, seedData);
    setData(listEntities<Supplier>(STORAGE_KEY));
  }, []);

  const refresh = () => setData(listEntities<Supplier>(STORAGE_KEY));

  const columns: EnhancedColumn[] = useMemo(() => ([
    { key: 'name', header: 'Supplier', sortable: true, searchable: true },
    { key: 'category', header: 'Category', sortable: true, searchable: true },
    { key: 'contact', header: 'Contact', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phone', header: 'Phone', sortable: true },
    { key: 'paymentTerms', header: 'Terms', filterable: true, filterOptions: ['Immediate', 'Net 15', 'Net 30', 'Net 60'].map((t) => ({ label: t, value: t })) },
    { key: 'rating', header: 'Rating', sortable: true },
    { key: 'status', header: 'Status', filterable: true, filterOptions: ['Active', 'Blocked'].map((s) => ({ label: s, value: s })) },
  ]), []);

  const actions: TableAction[] = [
    { label: 'View', icon: <Eye className="h-4 w-4" />, onClick: (row: Supplier) => toast({ title: 'View Supplier', description: `Viewing ${row.name}` }) },
    { label: 'Edit', icon: <Edit className="h-4 w-4" />, onClick: (row: Supplier) => { setEditing(row); setOpen(true); } },
    { label: 'Activate', icon: <CheckCircle2 className="h-4 w-4" />, condition: (r: Supplier) => r.status === 'Blocked', onClick: (r: Supplier) => { const updated: Supplier = { ...r, status: 'Active' }; upsertEntity(STORAGE_KEY, updated as any); refresh(); toast({ title: 'Activated', description: r.name }); } },
    { label: 'Block', icon: <Ban className="h-4 w-4" />, condition: (r: Supplier) => r.status === 'Active', onClick: (r: Supplier) => { const updated: Supplier = { ...r, status: 'Blocked' }; upsertEntity(STORAGE_KEY, updated as any); refresh(); toast({ title: 'Blocked', description: r.name }); } },
    { label: 'Delete', icon: <Trash2 className="h-4 w-4" />, onClick: (row: Supplier) => { removeEntity(STORAGE_KEY, row.id); refresh(); toast({ title: 'Deleted', description: row.name }); }, variant: 'destructive' }
  ];

  const form = useForm<Supplier>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { id: generateId('sup'), name: '', category: '', email: '', phone: '', contact: '', paymentTerms: 'Net 30', status: 'Active', rating: 5 }
  });

  const openCreate = () => { setEditing(null); form.reset({ id: generateId('sup'), name: '', category: '', email: '', phone: '', contact: '', paymentTerms: 'Net 30', status: 'Active', rating: 5 }); setOpen(true); };
  useEffect(() => { if (editing) form.reset(editing); }, [editing]);

  const onSubmit = (values: Supplier) => { upsertEntity(STORAGE_KEY, values as any); setOpen(false); refresh(); toast({ title: editing ? 'Supplier Updated' : 'Supplier Created', description: values.name }); };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center mb-2">
        <Button variant="outline" size="sm" className="mr-4" onClick={() => navigate('/supply-chain')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Supplier Management"
          description="Manage supplier information, contracts, and performance"
          voiceIntroduction="Welcome to Supplier Management. Here you can manage supplier information and performance."
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" /> Suppliers
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" /> Create Supplier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Supplier' : 'Create Supplier'}</DialogTitle>
                <DialogDescription>Enter supplier master data. All fields are required.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input placeholder="Supplier name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl><Input placeholder="Category" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="contact" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl><Input placeholder="Contact person" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="email@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl><Input placeholder="+1 ..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="paymentTerms" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['Immediate', 'Net 15', 'Net 30', 'Net 60'].map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          {['Active', 'Blocked'].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="rating" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (1-5)</FormLabel>
                      <FormControl><Input type="number" min={1} max={5} {...field} /></FormControl>
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
          <EnhancedDataTable columns={columns} data={data} actions={actions} searchPlaceholder="Search suppliers..." refreshable={true} onRefresh={refresh} exportable={true} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierManagement;
