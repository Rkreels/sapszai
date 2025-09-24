
import React from 'react';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Button } from '../../../components/ui/button';
import { CalendarClock, Users, FileText, MessageSquare } from 'lucide-react';

interface ProjectDetailsProps {
  project: {
    id: string;
    name: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
    budget: string;
    manager: string;
    team: string[];
    description: string;
  }
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{project.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={
              project.status === 'Completed' ? 'default' :
              project.status === 'In Progress' ? 'secondary' :
              project.status === 'On Hold' ? 'outline' : 
              'destructive'
            }>
              {project.status}
            </Badge>
            <span className="text-sm text-gray-500">Project ID: {project.id}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </Button>
          <Button variant="default" size="sm">
            Edit Project
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex items-start">
          <div className="bg-blue-100 p-3 rounded-lg mr-3">
            <CalendarClock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Timeline</div>
            <div className="font-medium">{project.startDate} - {project.endDate}</div>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-green-100 p-3 rounded-lg mr-3">
            <FileText className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Budget</div>
            <div className="font-medium">{project.budget}</div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-purple-100 p-3 rounded-lg mr-3">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Project Manager</div>
            <div className="font-medium">{project.manager}</div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-yellow-100 p-3 rounded-lg mr-3">
            <Users className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Team Size</div>
            <div className="font-medium">{project.team.length} members</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Description</h3>
        <p className="text-gray-700">{project.description}</p>
      </div>
    </Card>
  );
};

export default ProjectDetails;
