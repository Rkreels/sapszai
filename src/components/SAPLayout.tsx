
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SAPHeader from './SAPHeader';
import SAPNavigationBar from './SAPNavigationBar';
import SAPSidebar from './SAPSidebar';
import ModuleNavigation from './ModuleNavigation';
import VoiceAssistant from './VoiceAssistant';
import { VoiceAssistantProvider } from '../context/VoiceAssistantContext';

const SAPLayout: React.FC = () => {
  const [isVoiceAssistantEnabled, setIsVoiceAssistantEnabled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Initialize the voice assistant state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('voiceAssistantEnabled') === 'true';
    setIsVoiceAssistantEnabled(savedState);
  }, []);
  
  // Store the voice assistant state in localStorage to ensure consistency
  useEffect(() => {
    localStorage.setItem('voiceAssistantEnabled', isVoiceAssistantEnabled.toString());
  }, [isVoiceAssistantEnabled]);
  
  const toggleVoiceAssistant = () => {
    setIsVoiceAssistantEnabled(prevState => !prevState);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  // Determine current module based on path
  const getCurrentModule = () => {
    const path = location.pathname;
    if (path.startsWith('/finance')) return 'finance';
    if (path.startsWith('/sales')) return 'sales';
    if (path.startsWith('/procurement')) return 'procurement';
    if (path.startsWith('/manufacturing')) return 'manufacturing';
    if (path.startsWith('/supply-chain')) return 'supply-chain';
    if (path.startsWith('/project-management')) return 'project-management';
    if (path.startsWith('/human-resources')) return 'human-resources';
    if (path.startsWith('/master-data')) return 'master-data';
    if (path.startsWith('/business-intelligence')) return 'business-intelligence';
    return '';
  };

  const currentModule = getCurrentModule();
  
  return (
    <VoiceAssistantProvider value={{ isEnabled: isVoiceAssistantEnabled, toggle: toggleVoiceAssistant }}>
      <div className="flex flex-col min-h-screen">
        <SAPHeader onMenuClick={toggleSidebar} />
        <SAPNavigationBar />
        {currentModule && <ModuleNavigation module={currentModule} />}
        
        <main className="flex-1 p-4 bg-gray-100">
          <Outlet />
        </main>
        
        <SAPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <VoiceAssistant />
      </div>
    </VoiceAssistantProvider>
  );
};

export default SAPLayout;
