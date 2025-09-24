import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { CheckCircle, Clock, AlertCircle, XCircle, Play, Pause, SkipForward, User, Calendar } from 'lucide-react';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  assignee: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected' | 'skipped';
  dueDate: string;
  completedDate?: string;
  comments: string[];
  requiredFields: string[];
  conditions?: {
    field: string;
    operator: 'equals' | 'greater' | 'less' | 'contains';
    value: unknown;
  }[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  isActive: boolean;
}

export interface WorkflowInstance {
  id: string;
  templateId: string;
  templateName: string;
  entityId: string;
  entityType: string;
  status: 'active' | 'completed' | 'cancelled' | 'on-hold';
  currentStep: number;
  steps: WorkflowStep[];
  startedDate: string;
  completedDate?: string;
  initiatedBy: string;
}

interface WorkflowManagerProps {
  entityType: string;
  entityId: string;
  onWorkflowComplete?: (instanceId: string) => void;
  onWorkflowCancel?: (instanceId: string) => void;
}

const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  entityType,
  entityId,
  onWorkflowComplete,
  onWorkflowCancel
}) => {
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowInstance | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  // Sample workflow templates
  React.useEffect(() => {
    const sampleTemplates: WorkflowTemplate[] = [
      {
        id: 'WF-PO-APPROVAL',
        name: 'Purchase Order Approval',
        description: 'Standard approval workflow for purchase orders',
        category: 'Purchase Orders',
        isActive: true,
        steps: [
          {
            id: 'step-1',
            name: 'Department Review',
            description: 'Review by department manager',
            assignee: 'dept-manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            comments: [],
            requiredFields: ['justification', 'budget_allocation']
          },
          {
            id: 'step-2',
            name: 'Finance Approval',
            description: 'Financial review and approval',
            assignee: 'finance-manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            comments: [],
            requiredFields: ['budget_verification'],
            conditions: [
              { field: 'amount', operator: 'greater', value: 10000 }
            ]
          },
          {
            id: 'step-3',
            name: 'Procurement Execution',
            description: 'Execute the purchase order',
            assignee: 'procurement-team',
            status: 'pending',
            dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            comments: [],
            requiredFields: ['supplier_confirmation']
          }
        ]
      }
    ];
    setTemplates(sampleTemplates);

    // Sample active workflows
    const sampleWorkflows: WorkflowInstance[] = [
      {
        id: 'WF-INST-001',
        templateId: 'WF-PO-APPROVAL',
        templateName: 'Purchase Order Approval',
        entityId: entityId,
        entityType: entityType,
        status: 'active',
        currentStep: 0,
        steps: sampleTemplates[0].steps,
        startedDate: new Date().toISOString(),
        initiatedBy: 'john.doe@company.com'
      }
    ];
    setWorkflows(sampleWorkflows);
  }, [entityId, entityType]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'default',
      'in-progress': 'secondary',
      'rejected': 'destructive',
      'pending': 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  const handleStepAction = async (workflowId: string, stepIndex: number, action: 'approve' | 'reject') => {
    try {
      const workflow = workflows.find(w => w.id === workflowId);
      if (!workflow) return;

      const updatedWorkflow = { ...workflow };
      const currentStep = updatedWorkflow.steps[stepIndex];
      
      if (action === 'approve') {
        currentStep.status = 'completed';
        currentStep.completedDate = new Date().toISOString();
        currentStep.comments.push(`Approved: ${comment || 'No comments'}`);
        
        // Move to next step or complete workflow
        if (stepIndex < updatedWorkflow.steps.length - 1) {
          updatedWorkflow.currentStep = stepIndex + 1;
          updatedWorkflow.steps[stepIndex + 1].status = 'in-progress';
        } else {
          updatedWorkflow.status = 'completed';
          updatedWorkflow.completedDate = new Date().toISOString();
          onWorkflowComplete?.(workflowId);
        }
      } else {
        currentStep.status = 'rejected';
        currentStep.comments.push(`Rejected: ${comment || 'No reason provided'}`);
        updatedWorkflow.status = 'cancelled';
      }

      setWorkflows(prev => prev.map(w => w.id === workflowId ? updatedWorkflow : w));
      
      toast({
        title: `Step ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `Workflow step has been ${action}d successfully.`,
      });
      
      setIsDialogOpen(false);
      setComment('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process workflow action.',
        variant: 'destructive',
      });
    }
  };

  const startWorkflow = async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      const newWorkflow: WorkflowInstance = {
        id: `WF-INST-${Date.now()}`,
        templateId: template.id,
        templateName: template.name,
        entityId,
        entityType,
        status: 'active',
        currentStep: 0,
        steps: template.steps.map(step => ({
          ...step,
          status: 'pending',
          comments: []
        })),
        startedDate: new Date().toISOString(),
        initiatedBy: 'current.user@company.com'
      };

      // Start first step
      newWorkflow.steps[0].status = 'in-progress';

      setWorkflows(prev => [...prev, newWorkflow]);
      
      toast({
        title: 'Workflow Started',
        description: `${template.name} workflow has been initiated.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start workflow.',
        variant: 'destructive',
      });
    }
  };

  const activeWorkflows = workflows.filter(w => w.status === 'active');
  const completedWorkflows = workflows.filter(w => w.status === 'completed');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Workflow Management</span>
            <Button onClick={() => setIsDialogOpen(true)} size="sm">
              Start New Workflow
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Workflows</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activeWorkflows.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active workflows</p>
                </div>
              ) : (
                activeWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{workflow.templateName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Started: {new Date(workflow.startedDate).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(workflow.status)}
                      </div>

                      <div className="space-y-3">
                        {workflow.steps.map((step, index) => (
                          <div
                            key={step.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              index === workflow.currentStep ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(step.status)}
                              <div>
                                <p className="font-medium">{step.name}</p>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <User className="h-3 w-3" />
                                  <span className="text-xs">{step.assignee}</span>
                                  <Calendar className="h-3 w-3 ml-2" />
                                  <span className="text-xs">
                                    Due: {new Date(step.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {index === workflow.currentStep && step.status === 'in-progress' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedWorkflow(workflow);
                                    setActionType('approve');
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedWorkflow(workflow);
                                    setActionType('reject');
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedWorkflows.map((workflow) => (
                <Card key={workflow.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{workflow.templateName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Completed: {workflow.completedDate ? new Date(workflow.completedDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Category: {template.category} • {template.steps.length} steps
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => startWorkflow(template.id)}
                        disabled={!template.isActive}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Workflow
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {template.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center space-x-2 text-sm">
                          <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          <span>{step.name}</span>
                          <span className="text-muted-foreground">→ {step.assignee}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedWorkflow ? `${actionType === 'approve' ? 'Approve' : 'Reject'} Step` : 'Start New Workflow'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedWorkflow ? (
            <div className="space-y-4">
              <div>
                <Label>Current Step</Label>
                <p className="text-sm font-medium">
                  {selectedWorkflow.steps[selectedWorkflow.currentStep]?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedWorkflow.steps[selectedWorkflow.currentStep]?.description}
                </p>
              </div>
              
              <div>
                <Label htmlFor="comment">Comments</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={`Add ${actionType === 'approve' ? 'approval' : 'rejection'} comments...`}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleStepAction(selectedWorkflow.id, selectedWorkflow.currentStep, actionType)}
                  variant={actionType === 'approve' ? 'default' : 'destructive'}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Select Workflow Template</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a workflow template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Start Workflow
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowManager;
