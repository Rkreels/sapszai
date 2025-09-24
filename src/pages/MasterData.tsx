
import React, { useState, useEffect } from 'react';
import SAPSection from '../components/SAPSection';
import SAPTile from '../components/SAPTile';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';

const MasterData: React.FC = () => {
  const [isVoiceAssistantEnabled, setIsVoiceAssistantEnabled] = useState(false);
  const { speak } = useVoiceAssistant();
  
  useEffect(() => {
    const checkVoiceAssistant = () => {
      const enabled = localStorage.getItem('voiceAssistantEnabled') === 'true';
      setIsVoiceAssistantEnabled(enabled);
      
      if (enabled) {
        speak("Welcome to the Master Data module. Here you can manage all master data objects including materials, customers, vendors, and organizational data.");
      }
    };
    
    checkVoiceAssistant();
  }, [speak]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Master Data Management</h1>

      <SAPSection 
        title="Business Partner Data" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Manage customer and vendor master data."
      >
        <SAPTile 
          title="Customer Master"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Create and maintain customer master records."
          icon={<span className="text-xl">🏢</span>}
        />
        <SAPTile 
          title="Vendor Master"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Create and maintain vendor master records."
          icon={<span className="text-xl">🤝</span>}
        />
        <SAPTile 
          title="Business Partner"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Unified business partner management."
          icon={<span className="text-xl">👥</span>}
        />
      </SAPSection>

      <SAPSection 
        title="Product & Material Data" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Manage product and material master data."
      >
        <SAPTile 
          title="Material Master"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Create and maintain material master records."
          icon={<span className="text-xl">📦</span>}
        />
        <SAPTile 
          title="Product Hierarchy"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Define product categories and hierarchies."
          icon={<span className="text-xl">🗂️</span>}
        />
        <SAPTile 
          title="Bills of Material"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Manage product structure and composition."
          icon={<span className="text-xl">🔧</span>}
        />
      </SAPSection>

      <SAPSection 
        title="Financial Master Data" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Manage financial and accounting master data."
      >
        <SAPTile 
          title="Chart of Accounts"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Define and maintain chart of accounts structure."
          icon={<span className="text-xl">📊</span>}
        />
        <SAPTile 
          title="Cost Centers"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Create and maintain cost center hierarchy."
          icon={<span className="text-xl">🎯</span>}
        />
        <SAPTile 
          title="Profit Centers"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Define profit center structure and responsibility."
          icon={<span className="text-xl">💰</span>}
        />
      </SAPSection>

      <SAPSection 
        title="Organizational Data" 
        isVoiceAssistantEnabled={isVoiceAssistantEnabled}
        description="Manage organizational structures and hierarchies."
      >
        <SAPTile 
          title="Company Codes"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Define legal entities and company structure."
          icon={<span className="text-xl">🏛️</span>}
        />
        <SAPTile 
          title="Plants"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Create and maintain plant master data."
          icon={<span className="text-xl">🏭</span>}
        />
        <SAPTile 
          title="Storage Locations"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Define warehouse and storage locations."
          icon={<span className="text-xl">📍</span>}
        />
      </SAPSection>
    </div>
  );
};

export default MasterData;
