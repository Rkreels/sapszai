
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

interface SAPSectionProps {
  title: string;
  children: React.ReactNode;
  description?: string;
  isVoiceAssistantEnabled: boolean;
  collapsible?: boolean;
  examples?: string;
}

const SAPSection: React.FC<SAPSectionProps> = ({
  title,
  children,
  description = "",
  isVoiceAssistantEnabled,
  collapsible = true,
  examples = ""
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { speak } = useVoiceAssistant();
  
  const handleSectionHover = () => {
    if (isVoiceAssistantEnabled) {
      speak(`This is the ${title} section. ${description}`);
    }
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    
    if (isVoiceAssistantEnabled) {
      speak(`You ${isCollapsed ? 'expanded' : 'collapsed'} the ${title} section.`);
    }
  };
  
  const handleInfoClick = () => {
    setShowInfo(!showInfo);
    
    if (isVoiceAssistantEnabled && !showInfo) {
      const exampleText = examples ? `For example: ${examples}` : "";
      speak(`Additional information about the ${title} section. ${description} ${exampleText}`);
    }
  };

  return (
    <section className="mb-8" onMouseEnter={handleSectionHover}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="sap-section-title flex items-center">
          {title}
          {title.includes('(') && title.includes(')') && (
            <span className="ml-2 text-sm bg-gray-100 px-2 py-0.5 rounded-full">
              {title.substring(title.indexOf('(') + 1, title.indexOf(')'))}
            </span>
          )}
          
          {description && (
            <button 
              onClick={handleInfoClick}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title="Show more information"
            >
              <Info size={14} />
            </button>
          )}
        </h2>
        
        {collapsible && (
          <button 
            onClick={handleToggleCollapse}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        )}
      </div>
      
      {showInfo && description && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <p className="text-sm text-blue-800">{description}</p>
          {examples && <p className="text-xs text-blue-600 mt-1"><strong>Example:</strong> {examples}</p>}
        </div>
      )}
      
      {!isCollapsed && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {children}
      </div>}
    </section>
  );
};

export default SAPSection;
