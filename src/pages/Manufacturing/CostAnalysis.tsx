
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { ArrowLeft, BarChart2, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useToast } from '../../hooks/use-toast';
import { generateId, listEntities, removeEntity, seedIfEmpty, upsertEntity } from '../../lib/localCrud';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const STORAGE_KEY = 'manufacturingCostDrivers';

const driverSchema = z.object({
  id: z.string().min(1),
  costCenter: z.string().min(2, 'Cost center is required'),
  driver: z.string().min(2, 'Cost driver is required'),
  planCost: z.coerce.number().min(0),
  actualCost: z.coerce.number().min(0)
});

type Driver = z.infer<typeof driverSchema>;

const seedData: Driver[] = [
  { id: generateId('drv'), costCenter: 'CC-1001', driver: 'Machine Hours', planCost: 120000, actualCost: 110500 },
  { id: generateId('drv'), costCenter: 'CC-1002', driver: 'Labor Hours', planCost: 90000, actualCost: 96500 },
];

const CostAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const { toast } = useToast();

  const [data, setData] = useState<Driver[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);

  useEffect(() => {
    if (isEnabled) {
      speak('You are now viewing Cost Analysis. This page provides detailed manufacturing cost analysis.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    seedIfEmpty<Driver>(STORAGE_KEY, seedData);
    setData(listEntities<Driver>(STORAGE_KEY));
  }, []);

  const refresh = () => setData(listEntities<Driver>(STORAGE_KEY));

  const columns: EnhancedColumn[] = useMemo(() => ([
    { key: 'costCenter', header: 'Cost Center', sortable: true, searchable: true },
    { key: 'driver', header: 'Cost Driver', sortable: true, searchable: true },
    { key: 'planCost', header: 'Plan Cost', sortable: true, render: (v: number) => v.toLocaleString() },
    { key: 'actualCost', header: 'Actual Cost', sortable: true, render: (v: number) => v.toLocaleString() },
  ]), []);

  const actions: TableAction[] = [
    { label: 'Edit', icon: <Edit className="h-4 w-4" />, onClick: (row: Driver) => { setEditing(row); setOpen(true); } },
    { label: 'Delete', icon: <Trash2 className="h-4 w-4" />, onClick: (row: Driver) => { removeEntity(STORAGE_KEY, row.id); refresh(); toast({ title: 'Deleted', description: `${row.costCenter} - ${row.driver}` }); }, variant: 'destructive' }
  ];

  const form = useForm<Driver>({ resolver: zodResolver(driverSchema), defaultValues: { id: generateId('drv'), costCenter: '', driver: '', planCost: 0, actualCost: 0 } });
  const openCreate = () => { setEditing(null); form.reset({ id: generateId('drv'), costCenter: '', driver: '', planCost: 0, actualCost: 0 }); setOpen(true); };
  useEffect(() => { if (editing) form.reset(editing); }, [editing]);
  const onSubmit = (values: Driver) => { upsertEntity(STORAGE_KEY, values as any); setOpen(false); refresh(); toast({ title: editing ? 'Updated' : 'Created', description: `${values.costCenter} - ${values.driver}` }); };

  const chartData = data.map((d, idx) => ({ name: d.costCenter, Plan: d.planCost, Actual: d.actualCost }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center mb-2">
        <Button variant="outline" size="sm" className="mr-4" onClick={() => navigate('/manufacturing')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Cost Analysis"
          description="Analyze manufacturing costs and cost drivers"
          voiceIntroduction="Welcome to Cost Analysis. Here you can analyze manufacturing costs and cost drivers."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center"><BarChart2 className="h-5 w-5 mr-2" /> Cost Drivers</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Add Driver</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editing ? 'Edit Driver' : 'Add Driver'}</DialogTitle>
                  <DialogDescription>Maintain plan vs actual cost for cost centers.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="costCenter" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Center</FormLabel>
                        <FormControl><Input placeholder="CC-1001" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="driver" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Driver</FormLabel>
                        <FormControl><Input placeholder="Machine Hours" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="planCost" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Cost</FormLabel>
                        <FormControl><Input type="number" min={0} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="actualCost" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Actual Cost</FormLabel>
                        <FormControl><Input type="number" min={0} {...field} /></FormControl>
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
            <EnhancedDataTable columns={columns} data={data} actions={actions} searchPlaceholder="Search cost centers/drivers..." refreshable={true} onRefresh={refresh} exportable={true} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><BarChart2 className="h-5 w-5 mr-2" /> Plan vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
                <Legend />
                <Line type="monotone" dataKey="Plan" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="Actual" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CostAnalysis;
