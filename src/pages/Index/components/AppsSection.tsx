
import React, { useState } from 'react';
import { useVoiceAssistantContext } from '../../../context/VoiceAssistantContext';
import { X } from 'lucide-react';

interface AppsSectionProps {
  title: string;
}

const AppsSection: React.FC<AppsSectionProps> = ({ title }) => {
  const { isEnabled } = useVoiceAssistantContext();
  const [activeTab, setActiveTab] = useState('recommended');
  const [showInfo, setShowInfo] = useState(true);

  const tabs = [
    { id: 'favorites', label: 'Favorites' },
    { id: 'most-used', label: 'Most Used' },
    { id: 'recent', label: 'Recently Used' },
    { id: 'recommended', label: 'Recommended' },
  ];

  const apps = [
    { title: "Create Supplier Invoice", icon: "📄", color: "bg-purple-600" },
    { title: "Create Customer Projects", icon: "📋", color: "bg-blue-600" },
    { title: "Plan Customer Projects", icon: "📅", color: "bg-red-600" },
    { title: "Display Line Items in General Ledger", icon: "📊", color: "bg-purple-600" },
    { title: "Manage Supplier Line Items", icon: "📝", color: "bg-blue-600" },
    { title: "Supplier Invoices List", icon: "📃", color: "bg-purple-600" },
    { title: "Manage Customer Line Items", icon: "👥", color: "bg-purple-600" },
    { title: "Manage Billing Documents", icon: "📑", color: "bg-blue-600" },
    { title: "Manage My Timesheet", icon: "⏱️", color: "bg-red-600" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="sap-section-title flex items-center">
          {title}
          <button 
            onClick={() => {}}
            className="ml-2 text-blue-600"
          >
            <span className="text-xs">▼</span>
          </button>
        </h2>
      </div>

      <div className="col-span-full mb-2">
        <div className="flex items-center border-b">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`px-4 py-2 font-medium text-sm hover:bg-gray-50 ${
                activeTab === tab.id ? 'text-sap-blue border-b-2 border-sap-blue' : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-full">
        {showInfo && activeTab === 'recommended' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md flex items-center text-sm">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white rounded-full mr-2 text-xs">i</span>
            <p>Here, you can see applications that are recommended to you by SAP Business AI. You can choose to disable this tab using the <span className="text-blue-500">settings</span>.</p>
            <button className="ml-auto" onClick={() => setShowInfo(false)}>
              <span className="sr-only">Close</span>
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {apps.map((app, index) => (
            <div key={index} className="flex items-center p-3 border rounded bg-white hover:bg-gray-50 cursor-pointer">
              <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${app.color}`}>
                <span>{app.icon}</span>
              </div>
              <span className="ml-3 text-sm">{app.title}</span>
            </div>
          ))}
          
          <div className="flex items-center p-3 border rounded bg-white hover:bg-gray-50 cursor-pointer">
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
    </div>
  );
};

export default AppsSection;
