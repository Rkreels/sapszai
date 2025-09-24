
import React, { useState, useEffect } from 'react';
import SAPSection from '../components/SAPSection';
import SAPTile from '../components/SAPTile';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

const TrialCenter: React.FC = () => {
  const [isVoiceAssistantEnabled, setIsVoiceAssistantEnabled] = useState(false);
  const { speak } = useVoiceAssistant();
  
  useEffect(() => {
    const checkVoiceAssistant = () => {
      const enabled = localStorage.getItem('voiceAssistantEnabled') === 'true';
      setIsVoiceAssistantEnabled(enabled);
      
      if (enabled) {
        speak("Welcome to the Trial Center. This is where you can explore and test SAP S/4HANA features in a safe environment.");
      }
    };
    
    checkVoiceAssistant();
  }, [speak]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Trial Center</h1>

      <SAPSection 
        title="Learning Resources" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Access educational materials and tutorials."
      >
        <SAPTile 
          title="Tutorials"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Step-by-step guides for learning SAP S/4HANA."
          icon={<span className="text-xl">📚</span>}
        />
        <SAPTile 
          title="Documentation"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Access comprehensive system documentation."
          icon={<span className="text-xl">📖</span>}
        />
      </SAPSection>

      <SAPSection 
        title="Trial Features" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Test and explore system features."
      >
        <SAPTile 
          title="Sandbox Environment"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Practice in a safe, isolated environment."
          icon={<span className="text-xl">🎮</span>}
        />
        <SAPTile 
          title="Feature Overview"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Explore available features and functionalities."
          icon={<span className="text-xl">🔍</span>}
        />
      </SAPSection>
    </div>
  );
};

export default TrialCenter;
