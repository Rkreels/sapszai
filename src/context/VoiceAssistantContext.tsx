
import React, { createContext, useContext, ReactNode } from 'react';

interface VoiceAssistantContextType {
  isEnabled: boolean;
  toggle: () => void;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined);

export const VoiceAssistantProvider: React.FC<{ 
  children: ReactNode; 
  value: VoiceAssistantContextType 
}> = ({ children, value }) => {
  return (
    <VoiceAssistantContext.Provider value={value}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistantContext = (): VoiceAssistantContextType => {
  const context = useContext(VoiceAssistantContext);
  
  if (context === undefined) {
    throw new Error('useVoiceAssistantContext must be used within a VoiceAssistantProvider');
  }
  
  return context;
};
