
import React, { useState, useEffect } from 'react';
import SAPSection from '../components/SAPSection';
import SAPTile from '../components/SAPTile';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

const HumanResources: React.FC = () => {
  const [isVoiceAssistantEnabled, setIsVoiceAssistantEnabled] = useState(false);
  const { speak } = useVoiceAssistant();
  
  useEffect(() => {
    const checkVoiceAssistant = () => {
      const enabled = localStorage.getItem('voiceAssistantEnabled') === 'true';
      setIsVoiceAssistantEnabled(enabled);
      
      if (enabled) {
        speak("Welcome to the Human Resources module. Here you can manage employees, payroll, talent management, and organizational development.");
      }
    };
    
    checkVoiceAssistant();
  }, [speak]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Human Resources</h1>

      <SAPSection 
        title="Employee Management" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Manage employee data and organizational structure."
      >
        <SAPTile 
          title="Employee Central"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Central hub for employee information and self-service."
          icon={<span className="text-xl">👥</span>}
        />
        <SAPTile 
          title="Organizational Management"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Define and maintain organizational structures."
          icon={<span className="text-xl">🏢</span>}
        />
        <SAPTile 
          title="Personnel Administration"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Manage employee master data and personal information."
          icon={<span className="text-xl">📋</span>}
        />
      </SAPSection>

      <SAPSection 
        title="Time & Attendance" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Track and manage employee time and attendance."
      >
        <SAPTile 
          title="Time Recording"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Record and track employee working hours."
          icon={<span className="text-xl">⏰</span>}
        />
        <SAPTile 
          title="Leave Management"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Manage employee vacation and leave requests."
          icon={<span className="text-xl">🏖️</span>}
        />
        <SAPTile 
          title="Shift Planning"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Plan and schedule employee shifts and rotations."
          icon={<span className="text-xl">📅</span>}
        />
      </SAPSection>

      <SAPSection 
        title="Talent Management" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Develop and manage employee talent and performance."
      >
        <SAPTile 
          title="Performance Management"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Conduct performance reviews and goal management."
          icon={<span className="text-xl">🎯</span>}
        />
        <SAPTile 
          title="Learning & Development"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Manage training programs and skill development."
          icon={<span className="text-xl">📚</span>}
        />
        <SAPTile 
          title="Succession Planning"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Plan for leadership succession and career development."
          icon={<span className="text-xl">🎖️</span>}
        />
      </SAPSection>

      <SAPSection 
        title="Compensation & Payroll" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Manage employee compensation and payroll processing."
      >
        <SAPTile 
          title="Payroll Processing"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Process employee payroll and salary calculations."
          icon={<span className="text-xl">💰</span>}
        />
        <SAPTile 
          title="Benefits Administration"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Manage employee benefits and insurance programs."
          icon={<span className="text-xl">🏥</span>}
        />
        <SAPTile 
          title="Compensation Management"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Design and manage compensation structures."
          icon={<span className="text-xl">💼</span>}
        />
      </SAPSection>
    </div>
  );
};

export default HumanResources;
