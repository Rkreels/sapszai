
import React from 'react';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import PageHeader from '../../components/page/PageHeader';
import SAPSection from '../../components/SAPSection';
import LearningResources from './components/LearningResources';
import TrialFeatures from './components/TrialFeatures';
import GettingStarted from './components/GettingStarted';

const TrialCenter: React.FC = () => {
  const { isEnabled } = useVoiceAssistantContext();
  
  return (
    <div>
      <PageHeader 
        title="Trial Center" 
        voiceIntroduction="Welcome to the Trial Center. This is where you can explore and test SAP S/4HANA features in a safe environment. You'll find learning resources, sandbox environments, and guided tutorials to help you get familiar with the system."
      />

      <SAPSection 
        title="Getting Started" 
        isVoiceAssistantEnabled={isEnabled}
        description="Begin your SAP S/4HANA journey with these introductory resources."
        examples="The Getting Started section provides quick access to orientation materials and first-time user guides to help you navigate the system."
      >
        <GettingStarted />
      </SAPSection>

      <SAPSection 
        title="Learning Resources" 
        isVoiceAssistantEnabled={isEnabled}
        description="Access educational materials and tutorials."
        examples="This section contains tutorials, documentation, and other learning materials to help you understand SAP S/4HANA features and functionality."
      >
        <LearningResources />
      </SAPSection>

      <SAPSection 
        title="Trial Features" 
        isVoiceAssistantEnabled={isEnabled}
        description="Test and explore system features."
        examples="In the Trial Features section, you can access sandbox environments and feature previews to experience SAP S/4HANA capabilities firsthand."
      >
        <TrialFeatures />
      </SAPSection>
    </div>
  );
};

export default TrialCenter;
