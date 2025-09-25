import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SAPSection from '../components/SAPSection';
import SAPTile from '../components/SAPTile';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { Calendar, ChevronDown, Clock, ListChecks } from 'lucide-react';

const Index: React.FC = () => {
  const [isVoiceAssistantEnabled, setIsVoiceAssistantEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('Recommended');
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const { speak } = useVoiceAssistant();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkVoiceAssistant = () => {
      const enabled = localStorage.getItem('voiceAssistantEnabled') === 'true';
      setIsVoiceAssistantEnabled(enabled);
      
      if (enabled) {
        speak(`Welcome to the SAP S/4HANA dashboard. This is your main workspace where you can access all modules and functions 
        of the system. The layout is organized into sections like News, Pages, Apps, Insights, and To-Dos. 
        For example, in the Pages section, you'll find quick access to modules like Finance, Manufacturing, 
        Procurement, and Sales. The Apps section shows recommended applications based on your usage patterns 
        and role. You can navigate through different modules using the tabs in the navigation bar above.`);
      }
    };
    
    checkVoiceAssistant();
  }, [speak]);

  const toggleVoiceAssistant = () => {
    setIsVoiceAssistantEnabled(!isVoiceAssistantEnabled);
  };

  return (
    <div>
      <SAPSection 
        title="News" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled} 
        description="This section displays important news and updates about the SAP system."
      >
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <SAPTile 
            title="R&D / Engineering"
            subtitle="Discover the new features and changes in this release"
            isVoiceAssistantEnabled={isVoiceAssistantEnabled}
            description="This tile shows research and development updates and engineering changes from the latest SAP release."
          >
            <div>
              <div className="h-32 bg-gradient-to-r from-blue-300 to-blue-500 rounded flex items-center justify-center mb-4">
                <div className="text-white text-opacity-50">
                  <span className="text-4xl">→</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">SAP S/4HANA Cloud 2408</p>
            </div>
          </SAPTile>
        </div>
      </SAPSection>

      <SAPSection 
        title="Pages" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="This section provides quick access to the main modules of the system."
      >
        <SAPTile 
          title="Overview" 
          subtitle="Trial Center" 
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="This tile gives you access to the overview dashboard of the Trial Center module."
          onClick={() => navigate('/trial-center')}
        >
          <div className="flex items-center justify-center h-16 w-full bg-overview text-white rounded cursor-pointer hover:opacity-80">
            <span className="text-2xl">↗</span>
          </div>
        </SAPTile>
        <SAPTile 
          title="Finance" 
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Access the Finance module for accounting, financial reporting, and treasury management."
          onClick={() => navigate('/finance')}
        >
          <div className="flex items-center justify-center h-16 w-full bg-finance text-white rounded cursor-pointer hover:opacity-80">
            <span className="text-2xl">📈</span>
          </div>
        </SAPTile>
        <SAPTile 
          title="Manufacturing and Supply Chain" 
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Access manufacturing operations, supply chain planning, and inventory management."
          onClick={() => navigate('/manufacturing')}
        >
          <div className="flex items-center justify-center h-16 w-full bg-manufacturing text-white rounded cursor-pointer hover:opacity-80">
            <span className="text-2xl">🏭</span>
          </div>
        </SAPTile>
        <SAPTile 
          title="Procurement" 
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Access procurement functions like vendor management, purchase orders, and contract management."
          onClick={() => navigate('/procurement')}
        >
          <div className="flex items-center justify-center h-16 w-full bg-procurement text-white rounded cursor-pointer hover:opacity-80">
            <span className="text-2xl">🛒</span>
          </div>
        </SAPTile>
        <SAPTile 
          title="Project Management" 
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Access project planning, execution, and monitoring tools."
          onClick={() => navigate('/project-management')}
        >
          <div className="flex items-center justify-center h-16 w-full bg-project text-white rounded cursor-pointer hover:opacity-80">
            <span className="text-2xl">📋</span>
          </div>
        </SAPTile>
        <SAPTile 
          title="Sales" 
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Access sales order management, billing, and customer relationship management functions."
          onClick={() => navigate('/sales')}
        >
          <div className="flex items-center justify-center h-16 w-full bg-sales text-white rounded cursor-pointer hover:opacity-80">
            <span className="text-2xl">💼</span>
          </div>
        </SAPTile>
        <SAPTile 
          title="Other" 
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Access additional modules and functions not categorized in the main sections."
          onClick={() => navigate('/master-data')}
        >
          <div className="flex items-center justify-center h-16 w-full bg-other text-white rounded cursor-pointer hover:opacity-80">
            <span className="text-2xl">⚙️</span>
          </div>
        </SAPTile>
      </SAPSection>

      <SAPSection 
        title="Apps" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="This section shows your applications categorized by usage frequency and recommendations."
      >
        <div className="col-span-full mb-2">
          <div className="flex items-center border-b">
            <button 
              className={`px-4 py-2 font-medium text-sm hover:bg-gray-50 ${activeTab === 'Favorites' ? 'text-sap-blue border-b-2 border-sap-blue' : ''}`}
              onClick={() => setActiveTab('Favorites')}
            >
              Favorites
            </button>
            <button 
              className={`px-4 py-2 font-medium text-sm hover:bg-gray-50 ${activeTab === 'Most Used' ? 'text-sap-blue border-b-2 border-sap-blue' : ''}`}
              onClick={() => setActiveTab('Most Used')}
            >
              Most Used
            </button>
            <button 
              className={`px-4 py-2 font-medium text-sm hover:bg-gray-50 ${activeTab === 'Recently Used' ? 'text-sap-blue border-b-2 border-sap-blue' : ''}`}
              onClick={() => setActiveTab('Recently Used')}
            >
              Recently Used
            </button>
            <button 
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'Recommended' ? 'text-sap-blue border-b-2 border-sap-blue' : ''}`}
              onClick={() => setActiveTab('Recommended')}
            >
              Recommended
            </button>
          </div>
        </div>

        <div className="col-span-full">
        {showInfoBanner && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-center text-sm">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white rounded-full mr-2 text-xs">i</span>
            <p>Here, you can see applications that are recommended to you by SAP Business AI. You can choose to disable this tab using the <span className="text-blue-500">settings</span>.</p>
            <button 
              className="ml-auto"
              onClick={() => setShowInfoBanner(false)}
            >
              <span className="sr-only">Close</span>
              <span className="text-gray-400 hover:text-gray-600">×</span>
            </button>
          </div>
        )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Create Supplier Invoice", icon: "📄", color: "bg-purple-600", path: '/procurement/invoice-verification' },
              { title: "Create Customer Projects", icon: "📋", color: "bg-blue-600", path: '/project-management' },
              { title: "Plan Customer Projects", icon: "📅", color: "bg-red-600", path: '/project-management/planning' },
              { title: "Display Line Items in General Ledger", icon: "📊", color: "bg-purple-600", path: '/finance/general-ledger' },
              { title: "Manage Supplier Line Items", icon: "📝", color: "bg-blue-600", path: '/finance/accounts-payable' },
              { title: "Supplier Invoices List", icon: "📃", color: "bg-purple-600", path: '/procurement/invoice-verification' },
              { title: "Manage Customer Line Items", icon: "👥", color: "bg-purple-600", path: '/finance/accounts-receivable' },
              { title: "Manage Billing Documents", icon: "📑", color: "bg-blue-600", path: '/sales/billing' },
              { title: "Manage My Timesheet", icon: "⏱️", color: "bg-red-600", path: '/human-resources/time-management' },
            ].map((app, index) => (
              <div 
                key={index} 
                className="flex items-center p-3 border rounded bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate(app.path)}
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${app.color}`}>
                  <span>{app.icon}</span>
                </div>
                <span className="ml-3 text-sm">{app.title}</span>
              </div>
            ))}
            
            <div 
              className="flex items-center p-3 border rounded bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/human-resources')}
            >
              <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center text-white">
                <span>📬</span>
              </div>
              <div className="ml-3">
                <span className="text-sm">My Inbox</span>
                <p className="text-xs text-gray-500">All Items</p>
              </div>
            </div>
          </div>
        </div>
      </SAPSection>

      <SAPSection 
        title="Insights (2)" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="This section provides key business insights and analytics."
      >
        <div className="col-span-full flex justify-end mb-2">
          <button 
            className="text-sm text-blue-500 hover:text-blue-700"
            onClick={() => {
              if (isVoiceAssistantEnabled) {
                speak('Opening tile configuration panel');
              }
              // Placeholder for add tiles functionality
              alert('Add Tiles functionality would open a configuration panel');
            }}
          >
            Add Tiles
          </button>
        </div>
        
        <SAPTile 
          title="No items available" 
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="This tile indicates that there are no insights available at the moment."
        >
          <div className="h-40 flex items-center justify-center">
            <p className="text-gray-500">No items available</p>
          </div>
        </SAPTile>
        
        <SAPTile 
          title="No items available" 
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="This tile indicates that there are no insights available at the moment."
        >
          <div className="h-40 flex items-center justify-center">
            <p className="text-gray-500">No items available</p>
          </div>
        </SAPTile>
      </SAPSection>

      <SAPSection 
        title="To-Dos (0)" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="This section shows your tasks and to-do items."
      >
        <div className="col-span-full flex justify-end mb-2">
          <button className="text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" /> now
          </button>
        </div>
        
        <div className="col-span-full">
          <div className="border rounded bg-white p-6 flex flex-col items-center justify-center">
            <div className="mb-4 bg-blue-50 h-24 w-24 rounded-full flex items-center justify-center">
              <Calendar className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="font-medium mb-2">You have completed your to-do list.</h3>
            <p className="text-sm text-gray-500">New tasks will show up here.</p>
          </div>
        </div>
      </SAPSection>
    </div>
  );
};

export default Index;
