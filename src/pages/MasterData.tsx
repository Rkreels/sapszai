
import React, { useState, useEffect } from 'react';
import SAPSection from '../components/SAPSection';
import SAPTile from '../components/SAPTile';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useToast } from '../components/ui/use-toast';

const MasterData: React.FC = () => {
  const [isVoiceAssistantEnabled, setIsVoiceAssistantEnabled] = useState(false);
  const { speak } = useVoiceAssistant();
  const { toast } = useToast();
  
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

  const handleTileClick = (title: string, description: string) => {
    if (isVoiceAssistantEnabled) {
      speak(`Opening ${title}`);
    }
    toast({
      title: title,
      description: `${description} interface would open here.`,
    });
  };

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
          onClick={() => handleTileClick('Customer Master', 'Create and maintain customer master records')}
        />
        <SAPTile 
          title="Vendor Master"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Create and maintain vendor master records."
          icon={<span className="text-xl">🤝</span>}
          onClick={() => handleTileClick('Vendor Master', 'Create and maintain vendor master records')}
        />
        <SAPTile 
          title="Business Partner"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Unified business partner management."
          icon={<span className="text-xl">👥</span>}
          onClick={() => handleTileClick('Business Partner', 'Unified business partner management')}
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
          onClick={() => handleTileClick('Material Master', 'Create and maintain material master records')}
        />
        <SAPTile 
          title="Product Hierarchy"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Define product categories and hierarchies."
          icon={<span className="text-xl">🗂️</span>}
          onClick={() => handleTileClick('Product Hierarchy', 'Define product categories and hierarchies')}
        />
        <SAPTile 
          title="Bills of Material"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Manage product structure and composition."
          icon={<span className="text-xl">🔧</span>}
          onClick={() => handleTileClick('Bills of Material', 'Manage product structure and composition')}
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
          onClick={() => handleTileClick('Chart of Accounts', 'Define and maintain chart of accounts structure')}
        />
        <SAPTile 
          title="Cost Centers"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Create and maintain cost center hierarchy."
          icon={<span className="text-xl">🎯</span>}
          onClick={() => handleTileClick('Cost Centers', 'Create and maintain cost center hierarchy')}
        />
        <SAPTile 
          title="Profit Centers"
          isVoiceAssistantEnabled={isVoiceAssistantEnabled}
          description="Define profit center structure and responsibility."
          icon={<span className="text-xl">💰</span>}
          onClick={() => handleTileClick('Profit Centers', 'Define profit center structure and responsibility')}
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
