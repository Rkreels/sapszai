
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import DataTable from '../../components/data/DataTable';
import { ArrowLeft, Plus, Edit, Trash2, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '../../hooks/use-toast';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

const WorkCenters: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [workCenters, setWorkCenters] = useState([
    {
      id: 'WC-001',
      name: 'Assembly Line 1',
      type: 'Production',
      capacity: 160,
      efficiency: 92,
      status: 'Active',
      costCenter: 'CC-1001',
      responsiblePerson: 'John Smith'
    },
    {
      id: 'WC-002',
      name: 'Quality Control Station',
      type: 'Quality',
      capacity: 80,
      efficiency: 95,
      status: 'Active',
      costCenter: 'CC-1002',
      responsiblePerson: 'Jane Doe'
    },
    {
      id: 'WC-003',
      name: 'Packaging Line',
      type: 'Packaging',
      capacity: 120,
      efficiency: 88,
      status: 'Maintenance',
      costCenter: 'CC-1003',
      responsiblePerson: 'Mike Wilson'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWorkCenter, setEditingWorkCenter] = useState(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      id: '',
      name: '',
      type: 'Production',
      capacity: '',
      efficiency: '',
      status: 'Active',
      costCenter: '',
      responsiblePerson: ''
    }
  });

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now in Work Centers Management. Here you can manage work centers, their capacity, and configuration.');
    }
  }, [isEnabled, speak]);

  const handleCreateWorkCenter = (data: any) => {
    const newWorkCenter = {
      id: data.id || `WC-${String(workCenters.length + 1).padStart(3, '0')}`,
      name: data.name,
      type: data.type,
      capacity: parseInt(data.capacity),
      efficiency: parseInt(data.efficiency),
      status: data.status,
      costCenter: data.costCenter,
      responsiblePerson: data.responsiblePerson
    };
    
    setWorkCenters([...workCenters, newWorkCenter]);
    setIsCreateDialogOpen(false);
    form.reset();
    
    toast({
      title: 'Work Center Created',
      description: `Work center ${newWorkCenter.name} has been created successfully.`,
    });
  };

  const handleEditWorkCenter = (workCenter: any) => {
    setEditingWorkCenter(workCenter);
    form.reset(workCenter);
    setIsCreateDialogOpen(true);
  };

  const handleUpdateWorkCenter = (data: any) => {
    const updatedWorkCenters = workCenters.map(wc => 
      wc.id === editingWorkCenter.id ? { ...data, capacity: parseInt(data.capacity), efficiency: parseInt(data.efficiency) } : wc
    );
    setWorkCenters(updatedWorkCenters);
    setIsCreateDialogOpen(false);
    setEditingWorkCenter(null);
    form.reset();
    
    toast({
      title: 'Work Center Updated',
      description: `Work center ${data.name} has been updated successfully.`,
    });
  };

  const handleDeleteWorkCenter = (id: string) => {
    if (confirm('Are you sure you want to delete this work center?')) {
      setWorkCenters(workCenters.filter(wc => wc.id !== id));
      toast({
        title: 'Work Center Deleted',
        description: 'Work center has been deleted successfully.',
      });
    }
  };

  const handleConfigureWorkCenter = (workCenter: any) => {
    alert(`Opening configuration for work center ${workCenter.name}...`);
  };

  const columns = [
    { key: 'id', header: 'Work Center ID' },
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'capacity', header: 'Capacity (hrs/day)' },
    { 
      key: 'efficiency', 
      header: 'Efficiency %',
      render: (value: number) => (
        <span className={value >= 90 ? 'text-green-600' : value >= 80 ? 'text-yellow-600' : 'text-red-600'}>
          {value}%
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Maintenance': 'bg-yellow-100 text-yellow-800',
          'Inactive': 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        );
      }
    },
    { key: 'responsiblePerson', header: 'Responsible Person' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: any) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditWorkCenter(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleConfigureWorkCenter(row)}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteWorkCenter(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

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
          title="Work Centers"
          description="Manage work centers, their capacity, and configuration"
          voiceIntroduction="Welcome to Work Centers Management."
        />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Work Centers Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Work Center
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingWorkCenter ? 'Edit Work Center' : 'Create Work Center'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(editingWorkCenter ? handleUpdateWorkCenter : handleCreateWorkCenter)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Production">Production</SelectItem>
                            <SelectItem value="Quality">Quality</SelectItem>
                            <SelectItem value="Packaging">Packaging</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity (hrs/day)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="efficiency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Efficiency (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="costCenter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Center</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="responsiblePerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsible Person</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingWorkCenter ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Work Centers</div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm text-green-600">3 recently added</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Active Centers</div>
          <div className="text-2xl font-bold">10</div>
          <div className="text-sm text-blue-600">83% utilization</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Efficiency</div>
          <div className="text-2xl font-bold">91.7%</div>
          <div className="text-sm text-green-600">↑ 2.3%</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Under Maintenance</div>
          <div className="text-2xl font-bold">2</div>
          <div className="text-sm text-yellow-600">Scheduled</div>
        </Card>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={workCenters} />
      </Card>
    </div>
  );
};

export default WorkCenters;
