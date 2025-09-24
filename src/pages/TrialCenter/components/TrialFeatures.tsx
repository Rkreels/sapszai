
import React from 'react';
import SAPTile from '../../../components/SAPTile';
import { useVoiceAssistantContext } from '../../../context/VoiceAssistantContext';

const TrialFeatures: React.FC = () => {
  const { isEnabled } = useVoiceAssistantContext();
  
  return (
    <>
      <SAPTile 
        title="Sandbox Environment"
        isVoiceAssistantEnabled={isEnabled}
        description="Practice in a safe, isolated environment."
        icon={<span className="text-xl">🎮</span>}
        examples="The sandbox environment is pre-loaded with sample data so you can practice all system functions without affecting real business data. It resets periodically to ensure a clean testing environment."
      />
      <SAPTile 
        title="Feature Overview"
        isVoiceAssistantEnabled={isEnabled}
        description="Explore available features and functionalities."
        icon={<span className="text-xl">🔍</span>}
        examples="This comprehensive catalog lists all available features with descriptions and access points. You can filter by module, role, or business process to find relevant features."
      />
      <SAPTile 
        title="Guided Tours"
        isVoiceAssistantEnabled={isEnabled}
        description="Take interactive tours of key system processes."
        icon={<span className="text-xl">🧭</span>}
        examples="Guided tours provide step-by-step walkthroughs of key processes with interactive elements. For example, the 'Order to Cash' tour guides you through the complete process from sales order to payment receipt."
      />
      <SAPTile 
        title="Sample Data"
        isVoiceAssistantEnabled={isEnabled}
        description="Access sample business data for testing."
        icon={<span className="text-xl">📊</span>}
        examples="The system includes comprehensive sample data for a fictional company, including customers, products, financial records, and more. This allows you to test system functions with realistic business scenarios."
      />
    </>
  );
};

export default TrialFeatures;
