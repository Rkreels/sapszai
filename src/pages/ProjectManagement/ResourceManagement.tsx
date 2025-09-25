
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Users, Calendar, BarChart3, Settings } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '../../hooks/use-toast';

const resourceData = [
  { id: 'RES-001', name: 'John Smith', role: 'Project Manager', availability: 75, utilization: 85, skills: 'Leadership, Planning', cost: '€150/hour' },
  { id: 'RES-002', name: 'Emma Wilson', role: 'System Architect', availability: 50, utilization: 95, skills: 'Architecture, Design', cost: '€180/hour' },
  { id: 'RES-003', name: 'Mike Johnson', role: 'Developer', availability: 90, utilization: 70, skills: 'Java, React, APIs', cost: '€120/hour' },
  { id: 'RES-004', name: 'Sarah Davis', role: 'QA Engineer', availability: 100, utilization: 60, skills: 'Testing, Automation', cost: '€100/hour' },
];

const resourceAllocations = [
  { project: 'ERP Implementation', resource: 'John Smith', allocation: '80%', startDate: '2025-01-15', endDate: '2025-06-30' },
  { project: 'Website Redesign', resource: 'Emma Wilson', allocation: '60%', startDate: '2025-02-01', endDate: '2025-05-15' },
  { project: 'Mobile App', resource: 'Mike Johnson', allocation: '100%', startDate: '2025-03-01', endDate: '2025-08-30' },
];

const ResourceManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('resources');
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [isEditAllocationOpen, setIsEditAllocationOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: '',
      role: '',
      availability: '',
      utilization: '',
      skills: '',
      cost: ''
    }
  });

  const allocationForm = useForm({
    defaultValues: {
      project: '',
      resource: '',
      allocation: '',
      startDate: '',
      endDate: ''
    }
  });

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Resource Management. Here you can manage team members, track availability, plan capacity, and optimize resource allocation across projects.');
    }
  }, [isEnabled, speak]);

  const handleAddResource = (data: any) => {
    const newResource = {
      id: `RES-${String(resourceData.length + 1).padStart(3, '0')}`,
      name: data.name,
      role: data.role,
      availability: parseInt(data.availability),
      utilization: parseInt(data.utilization),
      skills: data.skills,
      cost: data.cost
    };
    
    resourceData.push(newResource);
    setIsAddResourceOpen(false);
    form.reset();
    
    toast({
      title: 'Resource Added',
      description: `${data.name} has been added successfully.`,
    });
  };

  const handleAssignResource = (resource: any) => {
    setSelectedResource(resource);
    alert(`Opening assignment form for ${resource.name}...`);
  };

  const handleEditAllocation = (allocation: any) => {
    alert(`Opening edit form for allocation...`);
  };

  const resourceColumns = [
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    { 
      key: 'availability', 
      header: 'Availability',
      render: (value: number) => (
        <div className="w-full">
          <Progress value={value} className="h-2" />
          <div className="text-xs text-right mt-1">{value}%</div>
        </div>
      )
    },
    { 
      key: 'utilization', 
      header: 'Utilization',
      render: (value: number) => (
        <Badge variant={value > 90 ? 'destructive' : value > 75 ? 'default' : 'secondary'}>
          {value}%
        </Badge>
      )
    },
    { key: 'skills', header: 'Skills' },
    { key: 'cost', header: 'Cost' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: any) => <Button variant="outline" size="sm" onClick={() => handleAssignResource(row)}>Assign</Button>
    }
  ];

  const allocationColumns = [
    { key: 'project', header: 'Project' },
    { key: 'resource', header: 'Resource' },
    { key: 'allocation', header: 'Allocation' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row: any) => <Button variant="outline" size="sm" onClick={() => handleEditAllocation(row)}>Edit</Button>
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/project-management')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Resource Management"
          description="Manage team resources, capacity planning, and allocation"
          voiceIntroduction="Welcome to Resource Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Resources</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Avg Utilization</p>
              <p className="text-2xl font-bold">78%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Available Resources</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Team Resources</h3>
              <Dialog open={isAddResourceOpen} onOpenChange={setIsAddResourceOpen}>
                <DialogTrigger asChild>
                  <Button>Add Resource</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Resource</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddResource)} className="space-y-4">
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
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
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
                          name="availability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability (%)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="utilization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Utilization (%)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cost</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddResourceOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Resource</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <DataTable 
              columns={resourceColumns}
              data={resourceData}
              className="border rounded-md"
            />
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Resource Allocations</h3>
              <Button onClick={() => alert('Opening new allocation form...')}>New Allocation</Button>
            </div>
            <DataTable 
              columns={allocationColumns}
              data={resourceAllocations}
              className="border rounded-md"
            />
          </Card>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Capacity Planning</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Team Capacity Overview</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Current Utilization</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Planned Capacity</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Resource Forecast</h4>
                <div className="space-y-2 text-sm">
                  <p>• Q2 2025: Need 3 additional developers</p>
                  <p>• Q3 2025: Consider hiring 1 PM</p>
                  <p>• Q4 2025: Capacity surplus expected</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Skills Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Technical Skills</h4>
                <div className="space-y-2">
                  <Badge variant="outline">React Development</Badge>
                  <Badge variant="outline">Java Programming</Badge>
                  <Badge variant="outline">Database Design</Badge>
                  <Badge variant="outline">API Development</Badge>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Soft Skills</h4>
                <div className="space-y-2">
                  <Badge variant="outline">Project Management</Badge>
                  <Badge variant="outline">Team Leadership</Badge>
                  <Badge variant="outline">Communication</Badge>
                  <Badge variant="outline">Problem Solving</Badge>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Certifications</h4>
                <div className="space-y-2">
                  <Badge variant="outline">PMP Certified</Badge>
                  <Badge variant="outline">Scrum Master</Badge>
                  <Badge variant="outline">AWS Certified</Badge>
                  <Badge variant="outline">ITIL Foundation</Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceManagement;
