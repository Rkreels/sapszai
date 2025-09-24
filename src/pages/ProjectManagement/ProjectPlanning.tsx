
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { ArrowLeft, Calendar, Users, Target, FileText, AlertTriangle, Clock, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';
import { listEntities, upsertEntity, removeEntity, generateId } from '../../lib/localCrud';

interface ProjectTemplate {
  id: string;
  name: string;
  type: string;
  duration: string;
  phases: Phase[];
  description: string;
  industry: string;
  complexity: 'Low' | 'Medium' | 'High';
}

interface ProjectPlan {
  id: string;
  planId: string;
  name: string;
  description: string;
  status: 'Draft' | 'In Review' | 'Approved' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  progress: number;
  estimatedCost: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  projectManager: string;
  sponsor: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  phases: Phase[];
  resources: Resource[];
  risks: Risk[];
}

interface Phase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  deliverables: string[];
  dependencies: string[];
}

interface Resource {
  id: string;
  name: string;
  role: string;
  allocation: number;
  cost: number;
  availability: string;
}

interface Risk {
  id: string;
  description: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
  status: 'Open' | 'Mitigated' | 'Closed';
}


const ProjectPlanning: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('plans');
  const [projectPlans, setProjectPlans] = useState<ProjectPlan[]>([]);
  const [projectTemplates, setProjectTemplates] = useState<ProjectTemplate[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ProjectPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Project Planning. Create comprehensive project plans with resource allocation, timeline management, and risk assessment for successful project delivery.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load project plans
    const existingPlans = listEntities<ProjectPlan>('project-plans');
    if (existingPlans.length === 0) {
      const samplePlans: ProjectPlan[] = [
        {
          id: generateId('plan'),
          planId: 'PLAN-001',
          name: 'Digital Transformation Initiative',
          description: 'Comprehensive digital transformation across all business units',
          status: 'Active',
          progress: 35,
          estimatedCost: 450000,
          actualCost: 125000,
          startDate: '2025-01-15',
          endDate: '2025-12-31',
          projectManager: 'Sarah Johnson',
          sponsor: 'CEO Office',
          priority: 'Critical',
          phases: [
            {
              id: generateId('phase'),
              name: 'Analysis & Planning',
              description: 'Current state analysis and future state design',
              startDate: '2025-01-15',
              endDate: '2025-03-15',
              progress: 100,
              status: 'Completed',
              deliverables: ['Current State Assessment', 'Future State Design', 'Implementation Roadmap'],
              dependencies: []
            },
            {
              id: generateId('phase'),
              name: 'System Implementation',
              description: 'Core system deployment and integration',
              startDate: '2025-03-16',
              endDate: '2025-08-15',
              progress: 45,
              status: 'In Progress',
              deliverables: ['System Configuration', 'Data Migration', 'Integration Testing'],
              dependencies: ['Analysis & Planning']
            }
          ],
          resources: [
            {
              id: generateId('resource'),
              name: 'Sarah Johnson',
              role: 'Project Manager',
              allocation: 100,
              cost: 85000,
              availability: 'Full-time'
            }
          ],
          risks: [
            {
              id: generateId('risk'),
              description: 'Resource availability constraints',
              probability: 'Medium',
              impact: 'High',
              mitigation: 'Cross-train team members and maintain backup resources',
              status: 'Open'
            }
          ]
        }
      ];
      
      samplePlans.forEach(plan => upsertEntity('project-plans', plan as any));
      setProjectPlans(samplePlans);
    } else {
      setProjectPlans(existingPlans);
    }

    // Load templates
    const existingTemplates = listEntities<ProjectTemplate>('project-templates');
    if (existingTemplates.length === 0) {
      const sampleTemplates: ProjectTemplate[] = [
        {
          id: generateId('template'),
          name: 'Software Development Project',
          type: 'IT',
          duration: '6 months',
          industry: 'Technology',
          complexity: 'High',
          description: 'Standard software development project template',
          phases: [
            {
              id: generateId('phase'),
              name: 'Requirements Gathering',
              description: 'Collect and document project requirements',
              startDate: '',
              endDate: '',
              progress: 0,
              status: 'Not Started',
              deliverables: ['Requirements Document', 'User Stories'],
              dependencies: []
            }
          ]
        }
      ];
      
      sampleTemplates.forEach(template => upsertEntity('project-templates', template as any));
      setProjectTemplates(sampleTemplates);
    } else {
      setProjectTemplates(existingTemplates);
    }
  };

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: ProjectPlan) => {
    setSelectedPlan(plan);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeletePlan = (planId: string) => {
    removeEntity('project-plans', planId);
    setProjectPlans(prev => prev.filter(p => p.id !== planId));
    toast({
      title: 'Project Plan Deleted',
      description: 'Project plan has been successfully deleted.',
    });
  };

  const handleSavePlan = (planData: Partial<ProjectPlan>) => {
    if (isEditing && selectedPlan) {
      const updatedPlan = { ...selectedPlan, ...planData };
      upsertEntity('project-plans', updatedPlan as any);
      setProjectPlans(prev => prev.map(p => p.id === selectedPlan.id ? updatedPlan : p));
      toast({
        title: 'Project Plan Updated',
        description: 'Project plan has been successfully updated.',
      });
    } else {
      const newPlan: ProjectPlan = {
        id: generateId('plan'),
        planId: `PLAN-${String(projectPlans.length + 1).padStart(3, '0')}`,
        phases: [],
        resources: [],
        risks: [],
        progress: 0,
        actualCost: 0,
        ...planData as ProjectPlan
      };
      upsertEntity('project-plans', newPlan as any);
      setProjectPlans(prev => [...prev, newPlan]);
      toast({
        title: 'Project Plan Created',
        description: 'New project plan has been successfully created.',
      });
    }
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'In Review': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Active': 'bg-emerald-100 text-emerald-800',
      'On Hold': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-purple-100 text-purple-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const templateColumns = [
    { key: 'name', header: 'Template Name' },
    { key: 'type', header: 'Type' },
    { key: 'duration', header: 'Duration' },
    { key: 'phases', header: 'Phases' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            toast({
              title: 'Use Template',
              description: 'Using template to create new project plan',
            });
          }}
        >
          Use Template
        </Button>
      )
    }
  ];

  const planColumns = [
    { key: 'name', header: 'Plan Name' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Approved' ? 'default' : 
          value === 'In Review' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: 'progress', 
      header: 'Progress',
      render: (value: number) => (
        <div className="w-full">
          <Progress value={value} className="h-2" />
          <div className="text-xs text-right mt-1">{value}%</div>
        </div>
      )
    },
    { key: 'estimatedCost', header: 'Estimated Cost' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (_, row) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleEditPlan(row)}
        >
          Edit
        </Button>
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
          onClick={() => navigate('/project-management')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Project Planning"
          description="Create and manage project plans, define objectives, and set timelines"
          voiceIntroduction="Welcome to Project Planning management."
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="objectives">Objectives</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold">Project Plans</h3>
              </div>
              <p className="text-gray-600 mb-4">Create and manage comprehensive project plans</p>
              <Button 
                  className="w-full"
                  onClick={handleCreatePlan}
                >
                  Create New Plan
                </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold">Schedule Planning</h3>
              </div>
              <p className="text-gray-600 mb-4">Define project timelines and milestones</p>
              <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: 'Plan Schedule',
                      description: 'Opening schedule planning interface',
                    });
                  }}
                >
                  Plan Schedule
                </Button>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold">Resource Planning</h3>
              </div>
              <p className="text-gray-600 mb-4">Allocate and plan project resources</p>
              <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: 'Plan Resources',
                      description: 'Opening resource planning interface',
                    });
                  }}
                >
                  Plan Resources
                </Button>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Current Project Plans</h3>
              <EnhancedDataTable 
                columns={planColumns}
                data={projectPlans}
                searchPlaceholder="Search plans..."
              />
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Project Templates</h3>
              <Button 
                onClick={() => {
                  toast({
                    title: 'Create Template',
                    description: 'Opening template creation form',
                  });
                }}
              >
                Create Template
              </Button>
            </div>
              <EnhancedDataTable 
                columns={templateColumns}
                data={projectTemplates}
                searchPlaceholder="Search templates..."
              />
          </Card>
        </TabsContent>

        <TabsContent value="objectives" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Objectives & Goals</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Strategic Objectives</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Increase operational efficiency by 25%</li>
                  <li>• Reduce project delivery time by 30%</li>
                  <li>• Improve customer satisfaction scores</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Key Performance Indicators</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Budget adherence: 95%</li>
                  <li>• Timeline compliance: 90%</li>
                  <li>• Quality metrics: 98%</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Timeline Management</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium">Phase 1: Planning</h4>
                  </div>
                  <Progress value={100} className="mb-2" />
                  <p className="text-sm text-gray-600">Jan 1 - Jan 31, 2025</p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Clock className="h-5 w-5 text-orange-600 mr-2" />
                    <h4 className="font-medium">Phase 2: Execution</h4>
                  </div>
                  <Progress value={65} className="mb-2" />
                  <p className="text-sm text-gray-600">Feb 1 - May 31, 2025</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Project Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Project Plan' : 'Create New Project Plan'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="planName">Plan Name</Label>
                <Input 
                  id="planName" 
                  placeholder="Enter plan name" 
                  defaultValue={selectedPlan?.name || ''}
                />
              </div>
              <div>
                <Label htmlFor="planId">Plan ID</Label>
                <Input 
                  id="planId" 
                  placeholder="Auto-generated" 
                  value={selectedPlan?.planId || `PLAN-${String(projectPlans.length + 1).padStart(3, '0')}`}
                  disabled
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Enter plan description" 
                defaultValue={selectedPlan?.description || ''}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  defaultValue={selectedPlan?.startDate || ''}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate" 
                  type="date" 
                  defaultValue={selectedPlan?.endDate || ''}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimatedCost">Estimated Cost</Label>
                <Input 
                  id="estimatedCost" 
                  type="number" 
                  placeholder="0" 
                  defaultValue={selectedPlan?.estimatedCost || 0}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select defaultValue={selectedPlan?.priority || 'Medium'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectManager">Project Manager</Label>
                <Input 
                  id="projectManager" 
                  placeholder="Enter project manager" 
                  defaultValue={selectedPlan?.projectManager || ''}
                />
              </div>
              <div>
                <Label htmlFor="sponsor">Sponsor</Label>
                <Input 
                  id="sponsor" 
                  placeholder="Enter sponsor" 
                  defaultValue={selectedPlan?.sponsor || ''}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  const formData = {
                    name: (document.getElementById('planName') as HTMLInputElement)?.value || '',
                    description: (document.getElementById('description') as HTMLTextAreaElement)?.value || '',
                    startDate: (document.getElementById('startDate') as HTMLInputElement)?.value || '',
                    endDate: (document.getElementById('endDate') as HTMLInputElement)?.value || '',
                    estimatedCost: parseFloat((document.getElementById('estimatedCost') as HTMLInputElement)?.value || '0'),
                    priority: (document.getElementById('priority') as HTMLSelectElement)?.value || 'Medium',
                    projectManager: (document.getElementById('projectManager') as HTMLInputElement)?.value || '',
                    sponsor: (document.getElementById('sponsor') as HTMLInputElement)?.value || '',
                    status: 'Draft'
                  };
                  handleSavePlan(formData);
                }}
              >
                {isEditing ? 'Update Plan' : 'Create Plan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectPlanning;
