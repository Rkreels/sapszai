
import React from 'react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

interface SAPTileProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  value?: string | number;
  valueSuffix?: string;
  children?: React.ReactNode;
  color?: string;
  onClick?: () => void;
  description?: string;
  isVoiceAssistantEnabled: boolean;
  examples?: string;
}

const SAPTile: React.FC<SAPTileProps> = ({
  title,
  subtitle,
  icon,
  value,
  valueSuffix,
  children,
  color = "bg-white",
  onClick,
  description = "",
  isVoiceAssistantEnabled,
  examples = ""
}) => {
  const { speak } = useVoiceAssistant();
  
  const handleTileHover = () => {
    if (isVoiceAssistantEnabled) {
      speak(`This is the ${title} tile. ${description || ""}`);
    }
  };

  const handleTileClick = () => {
    if (onClick) onClick();
    
    if (isVoiceAssistantEnabled) {
      const exampleText = examples ? `For example: ${examples}` : "";
      speak(`You clicked on ${title}. ${description ? `This tile is used for ${description}.` : ""} ${exampleText}`);
    }
  };

  return (
    <div 
      className="sap-tile p-4 flex flex-col h-full cursor-pointer"
      onClick={handleTileClick}
      onMouseEnter={handleTileHover}
    >
      <div className="flex flex-col h-full">
        <div className="mb-2">
          <h3 className="font-medium text-sm text-sap-text">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        
        {children || (
          <div className="flex items-center mt-auto">
            {icon && <div className="mr-3 text-gray-500">{icon}</div>}
            {value !== undefined && (
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold">{value}</span>
                {valueSuffix && <span className="ml-1 text-sm text-gray-500">{valueSuffix}</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SAPTile;
