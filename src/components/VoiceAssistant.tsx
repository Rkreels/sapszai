
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Info, Settings, X } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useVoiceAssistantContext } from '../context/VoiceAssistantContext';

const VoiceAssistant: React.FC = () => {
  const { isEnabled, toggle } = useVoiceAssistantContext();
  const { speak, isSpeaking, stop } = useVoiceAssistant();
  const [showTeachingMode, setShowTeachingMode] = useState(false);
  const [showAssistantPanel, setShowAssistantPanel] = useState(true);
  const [lastMessage, setLastMessage] = useState<string>("");

  const handleToggle = () => {
    // Stop any current speech before toggling
    stop();
    
    const newState = !isEnabled;
    toggle();
    
    if (newState) {
      speak("Voice assistant is now active. I'll guide you through the SAP S/4HANA interface. Hover over elements to learn about them. Click the info button for detailed teaching mode with examples.");
    }
  };

  const handleTeachingModeToggle = () => {
    // Stop any current speech before toggling teaching mode
    stop();
    
    setShowTeachingMode(!showTeachingMode);
    
    if (!showTeachingMode && isEnabled) {
      speak("Teaching mode activated. In this mode, I'll provide more detailed explanations and examples to help you understand the SAP S/4HANA system. For example, in the Finance module, the General Ledger section lets you record and view all financial transactions in real-time.");
    }
  };

  useEffect(() => {
    // Auto-collapse the panel after 8 seconds if no interaction
    if (isEnabled && showAssistantPanel) {
      const timer = setTimeout(() => {
        setShowAssistantPanel(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [isEnabled, showAssistantPanel]);

  // Store the last message that was spoken
  useEffect(() => {
    if (isSpeaking) {
      setLastMessage("Currently speaking...");
    }
  }, [isSpeaking]);

  if (!isEnabled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleToggle}
          className="flex items-center justify-center p-3 rounded-full shadow-lg transition-colors bg-white text-gray-500 hover:bg-gray-50"
          title="Enable Voice Assistant"
        >
          <VolumeX size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex gap-2">
        <button
          onClick={handleTeachingModeToggle}
          className={`flex items-center justify-center p-3 rounded-full shadow-lg transition-colors ${
            showTeachingMode ? 'bg-purple-600 text-white' : 'bg-white text-gray-500'
          }`}
          title={showTeachingMode ? "Disable Teaching Mode" : "Enable Teaching Mode"}
        >
          <Info size={20} />
        </button>
        
        <button
          onClick={handleToggle}
          className={`flex items-center justify-center p-3 rounded-full shadow-lg transition-colors bg-sap-blue text-white ${isSpeaking ? 'animate-pulse' : ''}`}
          title="Disable Voice Assistant"
        >
          <Volume2 size={20} />
        </button>
      </div>
      
      {showAssistantPanel && (
        <div className="absolute bottom-16 right-0 bg-white p-4 rounded shadow-lg w-72 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Voice Assistant Active</p>
            {showTeachingMode && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Teaching Mode</span>}
            <button 
              onClick={() => setShowAssistantPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          
          <p className="text-xs text-gray-600 mb-3">
            {showTeachingMode 
              ? "Teaching mode provides detailed explanations and practical examples to help you understand each feature."
              : "Hover over elements to hear explanations about them. Click on elements to learn more."}
          </p>
          
          {showTeachingMode && (
            <div className="border-t pt-2 mt-2">
              <p className="text-xs font-medium text-gray-700 mb-1">Example:</p>
              <p className="text-xs text-gray-600">
                In the Sales module, the "Create Sales Order" function allows you to enter new customer orders. You'll need to select a customer, add products, set quantities and prices, and choose delivery terms.
              </p>
            </div>
          )}
          
          {isSpeaking && (
            <div className="mt-3 p-2 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-600">Speaking...</p>
              <button 
                onClick={stop}
                className="text-xs text-blue-700 underline mt-1"
              >
                Stop narration
              </button>
            </div>
          )}
          
          <div className="mt-3 text-xs text-gray-500 flex items-center">
            <Settings className="h-3 w-3 mr-1" />
            <span>Customize in settings</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
