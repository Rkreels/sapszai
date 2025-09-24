
import React from 'react';
import SAPTile from '../../../components/SAPTile';
import { useVoiceAssistantContext } from '../../../context/VoiceAssistantContext';
import DataTable from '../../../components/data/DataTable';

const activeProjects = [
  { id: "PRJ-2023-001", name: "ERP Implementation", status: "In Progress", completion: "65%", dueDate: "2025-06-30" },
  { id: "PRJ-2023-002", name: "Website Redesign", status: "In Progress", completion: "82%", dueDate: "2025-05-15" },
  { id: "PRJ-2023-003", name: "Mobile App Development", status: "Planning", completion: "25%", dueDate: "2025-08-22" },
  { id: "PRJ-2023-004", name: "Data Center Migration", status: "In Progress", completion: "45%", dueDate: "2025-07-10" },
];

const columns = [
  { key: 'id', header: 'Project ID' },
  { key: 'name', header: 'Project Name' },
  { key: 'status', header: 'Status', render: (status: string) => (
    <span className={`px-2 py-1 rounded-full text-xs ${
      status === 'Completed' ? 'bg-green-100 text-green-800' :
      status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
      'bg-yellow-100 text-yellow-800'
    }`}>
      {status}
    </span>
  )},
  { key: 'completion', header: 'Completion' },
  { key: 'dueDate', header: 'Due Date' },
];

const ProjectOverview: React.FC = () => {
  const { isEnabled } = useVoiceAssistantContext();
  
  return (
    <>
      <div className="col-span-full mb-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Active Projects</h3>
          <DataTable
            columns={columns}
            data={activeProjects}
          />
        </div>
      </div>
      
      <SAPTile 
        title="Active Projects"
        isVoiceAssistantEnabled={isEnabled}
        description="Overview of all active projects and their status."
        icon={<span className="text-xl">📊</span>}
        examples="The Active Projects tile shows all ongoing projects with their current status and key metrics. Click on any project to see more details."
      />
      <SAPTile 
        title="Create Project"
        isVoiceAssistantEnabled={isEnabled}
        description="Initialize a new project in the system."
        icon={<span className="text-xl">➕</span>}
        examples="Use the Create Project function to set up a new project with basic information like name, objectives, timeline, and budget."
      />
      <SAPTile 
        title="Project Templates"
        isVoiceAssistantEnabled={isEnabled}
        description="Use templates to quickly create standardized projects."
        icon={<span className="text-xl">📋</span>}
        examples="Project Templates help you create new projects based on predefined structures, saving time and ensuring consistency."
      />
      <SAPTile 
        title="Project Calendar"
        isVoiceAssistantEnabled={isEnabled}
        description="View project milestones and deadlines on a calendar."
        icon={<span className="text-xl">📅</span>}
        examples="The calendar provides a visual timeline of all project activities, milestones, and deadlines across your project portfolio."
      />
    </>
  );
};

export default ProjectOverview;
