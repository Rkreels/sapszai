
import React, { useState, useEffect } from 'react';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import NewsFeed from './components/NewsFeed';
import PageSection from './components/PageSection';
import AppsSection from './components/AppsSection';
import InsightSection from './components/InsightSection';
import TodoSection from './components/TodoSection';
import { Edit, Settings } from 'lucide-react';

const Index: React.FC = () => {
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [showNewsDropdown, setShowNewsDropdown] = useState(false);
  const [showPagesDropdown, setShowPagesDropdown] = useState(false);
  
  useEffect(() => {
    if (isEnabled) {
      speak(`Welcome to the SAP S/4HANA dashboard. This is your main workspace where you can access all modules and functions 
      of the system. The layout is organized into sections like News, Pages, Apps, Insights, and To-Dos. 
      For example, in the Pages section, you'll find quick access to modules like Finance, Manufacturing, 
      Procurement, and Sales. The Apps section shows recommended applications based on your usage patterns 
      and role. You can navigate through different modules using the tabs in the navigation bar above.`);
    }
  }, [isEnabled, speak]);

  const handleManageNews = () => {
    console.log('Manage news clicked');
  };

  const handleHomeSettings = () => {
    console.log('Home settings clicked');
  };

  const handleManagePages = () => {
    console.log('Manage pages clicked');
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* News section (takes 1/3 of width on large screens) */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4 relative">
            <h2 className="sap-section-title flex items-center">
              News
              <button 
                onClick={() => setShowNewsDropdown(!showNewsDropdown)}
                className="ml-2 text-blue-600"
              >
                <span className="text-xs">▼</span>
              </button>
            </h2>
            
            {showNewsDropdown && (
              <div className="absolute top-full left-0 bg-white border shadow-sm rounded-md z-10">
                <div className="py-2">
                  <button onClick={handleManageNews} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                    <Edit className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Manage News</span>
                  </button>
                  <button onClick={handleHomeSettings} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                    <Settings className="h-4 w-4 mr-2 text-gray-400" />
                    <span>My Home Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="col-span-1">
            <div className="h-40 bg-gradient-to-r from-blue-300 to-blue-500 rounded flex items-center justify-center mb-4">
              <div className="text-white text-opacity-50">
                <span className="text-4xl">→</span>
              </div>
            </div>
            <h3 className="font-medium mb-1">R&D / Engineering</h3>
            <p className="text-sm text-gray-600 mb-1">Discover the new features and changes in this release</p>
            <p className="text-xs text-gray-500">SAP S/4HANA Cloud 2408</p>
          </div>
        </div>
        
        {/* Pages section (takes 2/3 of width on large screens) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4 relative">
            <h2 className="sap-section-title flex items-center">
              Pages
              <button 
                onClick={() => setShowPagesDropdown(!showPagesDropdown)}
                className="ml-2 text-blue-600"
              >
                <span className="text-xs">▼</span>
              </button>
            </h2>
            
            {showPagesDropdown && (
              <div className="absolute top-full left-0 bg-white border shadow-sm rounded-md z-10">
                <div className="py-2">
                  <button onClick={handleManagePages} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                    <Edit className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Manage Pages</span>
                  </button>
                  <button onClick={handleHomeSettings} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                    <Settings className="h-4 w-4 mr-2 text-gray-400" />
                    <span>My Home Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <PageSection
            hideTitle={true}
            onManagePages={handleManagePages} 
            onSettings={handleHomeSettings} 
          />
        </div>
      </div>
      
      <AppsSection title="Apps" />
      
      <InsightSection title="Insights" count={2} />
      
      <TodoSection title="To-Dos" count={0} />
    </div>
  );
};

export default Index;
