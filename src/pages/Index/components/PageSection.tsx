
import React, { useState } from 'react';
import SAPTile from '../../../components/SAPTile';
import { useVoiceAssistantContext } from '../../../context/VoiceAssistantContext';
import { Edit, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageSectionProps {
  title?: string;
  hideTitle?: boolean;
  onManagePages?: () => void;
  onSettings?: () => void;
}

const PageSection: React.FC<PageSectionProps> = ({
  title = "Pages",
  hideTitle = false,
  onManagePages,
  onSettings
}) => {
  const { isEnabled } = useVoiceAssistantContext();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="mb-4">
      {!hideTitle && (
        <div className="flex items-center justify-between mb-4 relative">
          <h2 className="sap-section-title flex items-center">
            {title}
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="ml-2 text-blue-600"
            >
              <span className="text-xs">▼</span>
            </button>
          </h2>
          
          {showDropdown && (
            <div className="absolute top-full left-0 bg-white border shadow-sm rounded-md z-10">
              <div className="py-2">
                <button onClick={onManagePages} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                  <Edit className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Manage Pages</span>
                </button>
                <button onClick={onSettings} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                  <Settings className="h-4 w-4 mr-2 text-gray-400" />
                  <span>My Home Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="col-span-1" onClick={() => navigate('/trial-center')} role="button">
          <div className="flex items-center justify-center h-16 w-full bg-blue-600 text-white rounded">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-medium mt-2">Overview</h3>
          <p className="text-xs text-gray-500">Trial Center</p>
        </div>
        
        <div className="col-span-1" onClick={() => navigate('/finance')} role="button">
          <div className="flex items-center justify-center h-16 w-full bg-pink-600 text-white rounded">
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="font-medium mt-2">Finance</h3>
        </div>
        
        <div className="col-span-1" onClick={() => navigate('/manufacturing')} role="button">
          <div className="flex items-center justify-center h-16 w-full bg-orange-600 text-white rounded">
            <span className="text-2xl">🏭</span>
          </div>
          <h3 className="font-medium mt-2">Manufacturing and Supply Chain</h3>
        </div>
        
        <div className="col-span-1" onClick={() => navigate('/procurement')} role="button">
          <div className="flex items-center justify-center h-16 w-full bg-purple-600 text-white rounded">
            <span className="text-2xl">🛒</span>
          </div>
          <h3 className="font-medium mt-2">Procurement</h3>
        </div>
        
        <div className="col-span-1" onClick={() => navigate('/project-management')} role="button">
          <div className="flex items-center justify-center h-16 w-full bg-red-700 text-white rounded">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="font-medium mt-2">Project Management</h3>
        </div>
        
        <div className="col-span-1" onClick={() => navigate('/sales')} role="button">
          <div className="flex items-center justify-center h-16 w-full bg-teal-600 text-white rounded">
            <span className="text-2xl">💼</span>
          </div>
          <h3 className="font-medium mt-2">Sales</h3>
        </div>
        
        <div className="col-span-1" onClick={() => navigate('/other')} role="button">
          <div className="flex items-center justify-center h-16 w-full bg-fuchsia-600 text-white rounded">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="font-medium mt-2">Other</h3>
        </div>
      </div>
    </div>
  );
};

export default PageSection;
