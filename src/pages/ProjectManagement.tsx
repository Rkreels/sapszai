
import React, { useState, useEffect } from 'react';
import SAPSection from '../components/SAPSection';
import SAPTile from '../components/SAPTile';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

const ProjectManagement: React.FC = () => {
  const [isVoiceAssistantEnabled, setIsVoiceAssistantEnabled] = useState(false);
  const { speak } = useVoiceAssistant();
  
  useEffect(() => {
    const checkVoiceAssistant = () => {
      const enabled = localStorage.getItem('voiceAssistantEnabled') === 'true';
      setIsVoiceAssistantEnabled(enabled);
      
      if (enabled) {
        speak("Welcome to the Project Management module. Here you can plan, execute, and monitor your projects effectively.");
      }
    };
    
    checkVoiceAssistant();
  }, [speak]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Project Management</h1>

      <SAPSection 
        title="Project Overview" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="View and manage your active projects."
      >
        <SAPTile 
          title="Active Projects"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Overview of all active projects and their status."
          icon={<span className="text-xl">📊</span>}
        />
        <SAPTile 
          title="Create Project"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Initialize a new project in the system."
          icon={<span className="text-xl">➕</span>}
        />
      </SAPSection>

      <SAPSection 
        title="Resources" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Manage project resources and assignments."
      >
        <SAPTile 
          title="Resource Planning"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Plan and allocate resources to projects."
          icon={<span className="text-xl">👥</span>}
        />
        <SAPTile 
          title="Time Recording"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Track time spent on project activities."
          icon={<span className="text-xl">⏱️</span>}
        />
      </SAPSection>
    </div>
  );
};

export default ProjectManagement;
