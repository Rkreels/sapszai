
import React from 'react';
import SAPTile from '../../../components/SAPTile';
import { useVoiceAssistantContext } from '../../../context/VoiceAssistantContext';

const SupplierManagement: React.FC = () => {
  const { isEnabled } = useVoiceAssistantContext();
  
  return (
    <>
      <SAPTile 
        title="Supplier Directory"
        isVoiceAssistantEnabled={isEnabled}
        description="Access your supplier database and information."
        icon={<span className="text-xl">👥</span>}
        examples="The supplier directory contains all registered suppliers with their contact information, payment terms, and performance history."
      />
      <SAPTile 
        title="Contracts"
        isVoiceAssistantEnabled={isEnabled}
        description="Manage supplier contracts and agreements."
        icon={<span className="text-xl">📄</span>}
        examples="Create and maintain contracts with your suppliers, including pricing agreements, service level agreements, and delivery terms."
      />
      <SAPTile 
        title="Supplier Evaluation"
        isVoiceAssistantEnabled={isEnabled}
        description="Evaluate and rate supplier performance."
        icon={<span className="text-xl">⭐</span>}
        examples="Track supplier performance metrics like on-time delivery, quality, and responsiveness to identify your best suppliers."
      />
      <SAPTile 
        title="Supplier Onboarding"
        isVoiceAssistantEnabled={isEnabled}
        description="Add new suppliers to your system."
        icon={<span className="text-xl">➕</span>}
        examples="The onboarding process guides you through collecting all necessary information about a new supplier, including tax details and banking information."
      />
    </>
  );
};

export default SupplierManagement;
