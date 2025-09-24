
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import SAPSection from '../../components/SAPSection';
import ProjectOverview from './components/ProjectOverview';
import ProjectResources from './components/ProjectResources';
import ProjectAnalytics from './components/ProjectAnalytics';
import { Calendar, ClipboardList, Users, BarChart3, Clock, Briefcase, CheckSquare, Settings } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import DataTable from '../../components/data/DataTable';
import { useToast } from '../../hooks/use-toast';

// Sample data for projects
const activeProjects = [
  { 
    id: "PRJ-2023-001", 
    name: "ERP Implementation", 
    manager: "Maria Rodriguez", 
    status: "In Progress", 
    progress: 65, 
    startDate: "2025-01-15", 
    endDate: "2025-06-30",
    budget: "€350,000",
    spent: "€218,500"
  },
  { 
    id: "PRJ-2023-008", 
    name: "Warehouse Expansion", 
    manager: "Thomas Schmidt", 
    status: "In Progress", 
    progress: 42, 
    startDate: "2025-03-01", 
    endDate: "2025-09-15",
    budget: "€2,800,000",
    spent: "€1,155,000"
  },
  { 
    id: "PRJ-2023-012", 
    name: "Quality System Upgrade", 
    manager: "Elena Martinez", 
    status: "At Risk", 
    progress: 28, 
    startDate: "2025-02-15", 
    endDate: "2025-05-30",
    budget: "€180,000",
    spent: "€85,400"
  },
  { 
    id: "PRJ-2023-015", 
    name: "New Product Development", 
    manager: "James Wilson", 
    status: "On Hold", 
    progress: 18, 
    startDate: "2025-04-01", 
    endDate: "2025-12-15",
    budget: "€650,000",
    spent: "€124,000"
  },
  { 
    id: "PRJ-2023-022", 
    name: "Digital Marketing Campaign", 
    manager: "Sophie Mueller", 
    status: "In Progress", 
    progress: 78, 
    startDate: "2025-03-15", 
    endDate: "2025-06-01",
    budget: "€120,000",
    spent: "€94,500"
  }
];

// Sample tasks data
const recentTasks = [
  {
    id: "TASK-1235",
    name: "System Configuration",
    project: "PRJ-2023-001",
    assignee: "Emma Wilson",
    dueDate: "2025-05-28",
    priority: "High",
    status: "In Progress"
  },
  {
    id: "TASK-1236",
    name: "Data Migration",
    project: "PRJ-2023-001",
    assignee: "Michael Brown",
    dueDate: "2025-06-10",
    priority: "Medium",
    status: "Not Started"
  },
  {
    id: "TASK-1240",
    name: "Concrete Foundation",
    project: "PRJ-2023-008",
    assignee: "Frank Miller",
    dueDate: "2025-05-25",
    priority: "High",
    status: "In Progress"
  },
  {
    id: "TASK-1245",
    name: "Quality Manual Update",
    project: "PRJ-2023-012",
    assignee: "Sarah Davis",
    dueDate: "2025-05-22",
    priority: "Critical",
    status: "Overdue"
  },
  {
    id: "TASK-1252",
    name: "Social Media Strategy",
    project: "PRJ-2023-022",
    assignee: "Paul Johnson",
    dueDate: "2025-05-24",
    priority: "Medium",
    status: "Completed"
  }
];

// Sample team availability data
const teamAvailability = [
  { id: "EMP-1001", name: "John Smith", role: "Project Manager", availability: 30, assignedProjects: 3 },
  { id: "EMP-1028", name: "Emma Wilson", role: "System Architect", availability: 0, assignedProjects: 2 },
  { id: "EMP-1045", name: "Michael Brown", role: "Data Engineer", availability: 15, assignedProjects: 2 },
  { id: "EMP-1062", name: "Sarah Davis", role: "Quality Specialist", availability: 60, assignedProjects: 1 },
  { id: "EMP-1078", name: "Robert Chen", role: "Technical Lead", availability: 25, assignedProjects: 2 },
  { id: "EMP-1084", name: "Frank Miller", role: "Construction Engineer", availability: 0, assignedProjects: 1 }
];

const ProjectManagement: React.FC = () => {
  const { isEnabled } = useVoiceAssistantContext();
  const { speak, stop } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (isEnabled) {
      // Make sure we stop any current speech before starting a new one
      stop();
      speak(`Welcome to the Project Management module. Here you can plan, execute, and monitor your projects effectively. 
      This module provides tools for resource planning, task management, and project tracking. You can see your active 
      projects, manage resources, and analyze project performance metrics all in one place.`);
    }
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isEnabled, speak, stop]);
  
  const handleNavigateToProject = (projectId: string) => {
    navigate(`/project-management/project/${projectId}`);
  };
  
  const handleCreateProject = () => {
    toast({
      title: "Create Project",
      description: "Project creation form has been opened.",
    });
    // In a real application, this would open a form or modal
  };
  
  // Project columns configuration for DataTable
  const projectColumns = [
    { 
      key: "name", 
      header: "Project Name",
      render: (value: string, row: any) => (
        <span 
          className="text-blue-600 underline cursor-pointer"
          onClick={() => handleNavigateToProject(row.id)}
        >
          {value}
        </span>
      )
    },
    { key: "manager", header: "Project Manager" },
    { 
      key: "status", 
      header: "Status",
      render: (value: string) => (
        <Badge variant={
          value === 'In Progress' ? 'outline' : 
          value === 'At Risk' ? 'destructive' :
          value === 'On Hold' ? 'secondary' : 'default'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: "progress", 
      header: "Progress",
      render: (value: number) => (
        <div className="w-full">
          <Progress value={value} className="h-2" />
          <div className="text-xs text-right mt-1">{value}%</div>
        </div>
      )
    },
    { key: "endDate", header: "Due Date" },
    { 
      key: "actions", 
      header: "Actions",
      render: (_, row: any) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleNavigateToProject(row.id)}
        >
          View
        </Button>
      )
    }
  ];
  
  // Task columns configuration for DataTable
  const taskColumns = [
    { key: "id", header: "Task ID" },
    { key: "name", header: "Task Name" },
    { key: "project", header: "Project" },
    { key: "assignee", header: "Assignee" },
    { 
      key: "priority", 
      header: "Priority",
      render: (value: string) => (
        <Badge variant={
          value === 'Critical' ? 'destructive' : 
          value === 'High' ? 'default' :
          value === 'Medium' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: "status", 
      header: "Status",
      render: (value: string) => (
        <Badge variant={
          value === 'Completed' ? 'default' : 
          value === 'Overdue' ? 'destructive' :
          value === 'In Progress' ? 'outline' : 'secondary'
        }>
          {value}
        </Badge>
      )
    },
    { key: "dueDate", header: "Due Date" }
  ];
  
  // Resources columns configuration for DataTable
  const resourceColumns = [
    { key: "name", header: "Name" },
    { key: "role", header: "Role" },
    { 
      key: "availability", 
      header: "Availability",
      render: (value: number) => (
        <div className="w-full">
          <Progress value={value} className="h-2" />
          <div className="text-xs text-right mt-1">{value}%</div>
        </div>
      )
    },
    { key: "assignedProjects", header: "Assigned Projects" },
    { 
      key: "actions", 
      header: "Actions",
      render: () => (
        <Button variant="ghost" size="sm">Assign</Button>
      )
    }
  ];
  
  return (
    <div>
      <PageHeader 
        title="Project Management" 
        voiceIntroduction="Welcome to the Project Management module. Here you can plan, execute, and monitor your projects effectively."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Active Projects</span>
                </div>
                <div className="text-2xl font-bold mt-2">24</div>
                <div className="text-xs text-muted-foreground mt-1">3 projects at risk</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  <span>Open Tasks</span>
                </div>
                <div className="text-2xl font-bold mt-2">156</div>
                <div className="text-xs text-muted-foreground mt-1">18 due today</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Team Utilization</span>
                </div>
                <div className="text-2xl font-bold mt-2">87%</div>
                <div className="text-xs text-amber-600 mt-1">Near capacity</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Avg. Project Duration</span>
                </div>
                <div className="text-2xl font-bold mt-2">142 days</div>
                <div className="text-xs text-green-600 mt-1">↓ 8% vs last year</div>
              </div>
            </Card>
          </div>
          
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Active Projects</h3>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </div>
            
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <DataTable 
                columns={projectColumns}
                data={activeProjects}
                className="border rounded-md"
              />
            )}
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
              
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable 
                  columns={taskColumns}
                  data={recentTasks}
                  className="border rounded-md"
                />
              )}
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Project Analytics</h3>
              <ProjectAnalytics />
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="projects">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Project Overview</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center"
                        onClick={handleCreateProject}>
                  <span className="w-6 h-6 mr-2 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-xs">+</span>
                  Create Project
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Active Projects
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Project Templates
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Archive
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <CheckSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold">Tasks</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium flex items-center">
                  <span className="w-6 h-6 mr-2 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full text-xs">+</span>
                  Create Task
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Task Management
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Task Types
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Task Templates
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Project Settings</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Project Types
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Status Definitions
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Priority Settings
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Approval Workflows
                </button>
              </div>
            </div>
          </div>
          
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">All Projects</h3>
              <div className="flex gap-2">
                <Button variant="outline">Export</Button>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <DataTable 
                columns={projectColumns}
                data={activeProjects}
                className="border rounded-md"
              />
            )}
          </Card>
          
          <SAPSection title="Project Portfolio" isVoiceAssistantEnabled={isEnabled}>
            <div className="col-span-full">
              <ProjectOverview />
            </div>
          </SAPSection>
        </TabsContent>
        
        <TabsContent value="resources">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Team Availability</h3>
              
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <DataTable 
                  columns={resourceColumns}
                  data={teamAvailability}
                  className="border rounded-md"
                />
              )}
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Resource Allocation</h3>
              <ProjectResources />
              
              <div className="mt-6 grid grid-cols-1 gap-4">
                <Button variant="outline" className="w-full">View Resource Calendar</Button>
                <Button variant="outline" className="w-full">Resource Management</Button>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Resource Planning</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Plan and allocate resources to your projects efficiently.
              </p>
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Team Management
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Resource Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Capacity Planning
                </Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Time Recording</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Track time spent on project activities.
              </p>
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Time Sheets
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Activity Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Time Recording Settings
                </Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Resource Analytics</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Analyze resource utilization and performance.
              </p>
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Utilization Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Skills Management
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Availability Forecast
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold">Schedule</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Project Timeline
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Milestones
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Task Management
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded text-sm font-medium">
                  Gantt Chart
                </button>
              </div>
            </div>
            
            <Card className="p-6 col-span-2 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Important Milestones</h3>
              
              <div className="flex-grow space-y-4">
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <div className="flex justify-between">
                    <p className="font-medium">ERP Implementation - System Design Approved</p>
                    <Badge>Completed</Badge>
                  </div>
                  <p className="text-sm text-gray-600">April 15, 2025</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <div className="flex justify-between">
                    <p className="font-medium">Warehouse Expansion - Foundation Complete</p>
                    <Badge>Completed</Badge>
                  </div>
                  <p className="text-sm text-gray-600">May 10, 2025</p>
                </div>
                
                <div className="border-l-4 border-amber-500 pl-4 py-1">
                  <div className="flex justify-between">
                    <p className="font-medium">ERP Implementation - Data Migration</p>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  <p className="text-sm text-gray-600">May 30, 2025</p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4 py-1">
                  <div className="flex justify-between">
                    <p className="font-medium">Quality System Upgrade - Testing Phase</p>
                    <Badge variant="destructive">Delayed</Badge>
                  </div>
                  <p className="text-sm text-gray-600">May 25, 2025</p>
                </div>
                
                <div className="border-l-4 border-gray-300 pl-4 py-1">
                  <div className="flex justify-between">
                    <p className="font-medium">Digital Marketing Campaign - Launch</p>
                    <Badge variant="secondary">Planned</Badge>
                  </div>
                  <p className="text-sm text-gray-600">June 1, 2025</p>
                </div>
              </div>
              
              <Button variant="outline" className="mt-4">View All Milestones</Button>
            </Card>
          </div>
          
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Project Timeline</h3>
              <div className="flex gap-2">
                <Button variant="outline">Today</Button>
                <Button variant="outline">Week</Button>
                <Button variant="outline">Month</Button>
                <Button variant="outline">Quarter</Button>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="text-center text-gray-500">
                <p>Gantt chart visualization would appear here in a real application</p>
                <p className="text-sm mt-2">Timeline view with project phases, tasks, and dependencies</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectManagement;
