
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import ProjectDetails from './components/ProjectDetails';
import TaskList from './components/TaskList';

// Sample project data
const projectData = {
  id: 'PRJ-2023-001',
  name: 'ERP Implementation',
  status: 'In Progress',
  progress: 65,
  startDate: '2025-01-15',
  endDate: '2025-06-30',
  budget: '€350,000',
  manager: 'Maria Rodriguez',
  team: ['John Smith', 'Emma Wilson', 'Michael Brown', 'Sarah Davis', 'Robert Chen'],
  description: 'Implementation of the SAP S/4HANA ERP system across all business units. The project includes system setup, data migration, integration with existing systems, user training, and go-live support.',
};

// Sample tasks data
const taskData = [
  {
    id: 'TASK-001',
    name: 'Requirements Analysis',
    dueDate: '2025-02-15',
    assignee: 'John Smith',
    status: 'Completed',
    priority: 'High',
    completed: true
  },
  {
    id: 'TASK-002',
    name: 'System Configuration',
    dueDate: '2025-03-30',
    assignee: 'Emma Wilson',
    status: 'In Progress',
    priority: 'High',
    completed: false
  },
  {
    id: 'TASK-003',
    name: 'Data Migration',
    dueDate: '2025-04-15',
    assignee: 'Michael Brown',
    status: 'In Progress',
    priority: 'Medium',
    completed: false
  },
  {
    id: 'TASK-004',
    name: 'Integration Testing',
    dueDate: '2025-05-01',
    assignee: 'Sarah Davis',
    status: 'Not Started',
    priority: 'Medium',
    completed: false
  },
  {
    id: 'TASK-005',
    name: 'User Training',
    dueDate: '2025-05-15',
    assignee: 'Robert Chen',
    status: 'Not Started',
    priority: 'Low',
    completed: false
  }
];

const ProjectDetail: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [tasks, setTasks] = useState(taskData);

  useEffect(() => {
    if (isEnabled) {
      speak(`You are viewing the details for project ${projectData.name}. This project is ${projectData.status} with ${projectData.progress}% completion.`);
    }
  }, [isEnabled, speak]);

  const handleTaskStatusChange = (taskId: string, completed: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              completed, 
              status: completed ? 'Completed' : task.status === 'Completed' ? 'In Progress' : task.status 
            } 
          : task
      )
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/project-management')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
        </Button>
        <PageHeader
          title={projectData.name}
          description={`Project ID: ${projectData.id}`}
          voiceIntroduction={`You are viewing the details for project ${projectData.name}. This project is ${projectData.status} with ${projectData.progress}% completion.`}
        />
      </div>

      <div className="space-y-8">
        <ProjectDetails project={projectData} />
        <TaskList tasks={tasks} onTaskStatusChange={handleTaskStatusChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <ul className="space-y-4">
              <li className="border-l-2 border-blue-500 pl-4 py-1">
                <p className="font-medium">System Configuration Updated</p>
                <p className="text-sm text-gray-600">By Emma Wilson, 2 days ago</p>
              </li>
              <li className="border-l-2 border-green-500 pl-4 py-1">
                <p className="font-medium">Requirements Analysis Completed</p>
                <p className="text-sm text-gray-600">By John Smith, 1 week ago</p>
              </li>
              <li className="border-l-2 border-orange-500 pl-4 py-1">
                <p className="font-medium">Data Migration Started</p>
                <p className="text-sm text-gray-600">By Michael Brown, 1 week ago</p>
              </li>
              <li className="border-l-2 border-purple-500 pl-4 py-1">
                <p className="font-medium">Project Plan Updated</p>
                <p className="text-sm text-gray-600">By Maria Rodriguez, 2 weeks ago</p>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Project Risks</h2>
            <ul className="space-y-4">
              <li className="bg-red-50 p-3 rounded-lg">
                <p className="font-medium text-red-800">Data Migration Complexity</p>
                <p className="text-sm text-red-700">High risk of data inconsistency due to legacy system structure</p>
              </li>
              <li className="bg-yellow-50 p-3 rounded-lg">
                <p className="font-medium text-yellow-800">Resource Availability</p>
                <p className="text-sm text-yellow-700">Key team members have overlapping commitments</p>
              </li>
              <li className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-800">Integration Challenges</p>
                <p className="text-sm text-blue-700">Potential compatibility issues with CRM system</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
