
import React from 'react';
import SAPTile from '../../../components/SAPTile';
import { useVoiceAssistantContext } from '../../../context/VoiceAssistantContext';
import { Edit, Settings } from 'lucide-react';

interface NewsFeedProps {
  title: string;
  onManageNews?: () => void;
  onSettings?: () => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ 
  title, 
  onManageNews, 
  onSettings 
}) => {
  const { isEnabled } = useVoiceAssistantContext();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 relative group">
        <h2 className="sap-section-title flex items-center">
          {title}
          <button 
            onClick={() => {}}
            className="ml-2 text-blue-600"
          >
            <span className="text-xs">▼</span>
          </button>
        </h2>
        
        <div className="hidden group-hover:flex bg-white border shadow-sm rounded-md absolute top-0 left-0 z-10">
          <div className="py-2">
            <button onClick={onManageNews} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
              <Edit className="h-4 w-4 mr-2 text-gray-400" />
              <span>Manage News</span>
            </button>
            <button onClick={onSettings} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
              <Settings className="h-4 w-4 mr-2 text-gray-400" />
              <span>My Home Settings</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <SAPTile 
            title="R&D / Engineering"
            subtitle="Discover the new features and changes in this release"
            isVoiceAssistantEnabled={isEnabled}
            description="This tile shows research and development updates and engineering changes from the latest SAP release."
          >
            <div>
              <div className="h-40 bg-gradient-to-r from-blue-300 to-blue-500 rounded flex items-center justify-center mb-4">
                <div className="text-white text-opacity-50">
                  <span className="text-4xl">→</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">SAP S/4HANA Cloud 2408</p>
            </div>
          </SAPTile>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
