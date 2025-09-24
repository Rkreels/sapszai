
import React from 'react';
import SAPTile from '../../../components/SAPTile';
import { useVoiceAssistantContext } from '../../../context/VoiceAssistantContext';

const ProjectResources: React.FC = () => {
  const { isEnabled } = useVoiceAssistantContext();
  
  return (
    <>
      <SAPTile 
        title="Resource Planning"
        isVoiceAssistantEnabled={isEnabled}
        description="Plan and allocate resources to projects."
        icon={<span className="text-xl">👥</span>}
        examples="Use the Resource Planning tool to assign team members to projects based on skills, availability, and project requirements."
      />
      <SAPTile 
        title="Time Recording"
        isVoiceAssistantEnabled={isEnabled}
        description="Track time spent on project activities."
        icon={<span className="text-xl">⏱️</span>}
        examples="Team members can record the time they spend on project tasks, which helps in tracking actual effort against planned effort."
      />
      <SAPTile 
        title="Capacity Planning"
        isVoiceAssistantEnabled={isEnabled}
        description="Manage team capacity and availability."
        icon={<span className="text-xl">📈</span>}
        examples="The Capacity Planning tool helps you visualize team workload, identify overallocation, and ensure balanced resource distribution."
      />
      <SAPTile 
        title="Team Management"
        isVoiceAssistantEnabled={isEnabled}
        description="Manage project teams and roles."
        icon={<span className="text-xl">🧑‍💼</span>}
        examples="Define team structures, assign roles and responsibilities, and manage team composition for each project."
      />
    </>
  );
};

export default ProjectResources;
