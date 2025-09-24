
import React from 'react';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';

interface PageHeaderProps {
  title: string;
  description?: string;
  voiceIntroduction?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  voiceIntroduction 
}) => {
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  React.useEffect(() => {
    if (isEnabled && voiceIntroduction) {
      speak(voiceIntroduction);
    }
  }, [isEnabled, voiceIntroduction, speak]);

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
    </div>
  );
};

export default PageHeader;
