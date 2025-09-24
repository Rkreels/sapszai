
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, HelpCircle, Volume2, VolumeX, Clock, User, Settings, Info, FileText, LogOut, Menu } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { useVoiceAssistantContext } from '../context/VoiceAssistantContext';
import { Star, Edit } from '../components/ui/icons';

interface SAPHeaderProps {
  onMenuClick: () => void;
}

const SAPHeader: React.FC<SAPHeaderProps> = ({ onMenuClick }) => {
  const { isEnabled, toggle } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  
  const handleLogoHover = () => {
    if (isEnabled) {
      speak("This is the SAP logo. Clicking it will take you to the home page.");
    }
  };

  const handleSearchHover = () => {
    if (isEnabled) {
      speak("This is the search function. You can search for applications, reports, and other items throughout the system.");
    }
  };

  const handleHelpHover = () => {
    if (isEnabled) {
      speak("This is the help button. Click it to access help resources and documentation.");
    }
  };

  const handleNotificationsHover = () => {
    if (isEnabled) {
      speak("This is the notifications center. Here you can view system alerts and messages.");
    }
  };

  const handleUserHover = () => {
    if (isEnabled) {
      speak("This is your user profile. Click it to access your account settings and preferences.");
    }
  };

  const handleVoiceAssistantToggle = () => {
    toggle();
    if (!isEnabled) {
      speak("Voice assistant is now active. I'll guide you through the SAP S/4HANA interface.");
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showAppsMenu) setShowAppsMenu(false);
  };

  const toggleAppsMenu = () => {
    setShowAppsMenu(!showAppsMenu);
    if (showUserMenu) setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm w-full">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center">
          <button 
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 relative" 
            onClick={toggleAppsMenu}
          >
            <Menu size={20} />
            <span className="text-xs ml-1">All My Apps</span>
          </button>
          
          {showAppsMenu && (
            <div className="absolute top-16 left-0 w-80 bg-white border rounded-md shadow-lg z-50 mt-1">
              <div className="p-3 border-b">
                <h2 className="text-lg font-semibold">All My Apps</h2>
              </div>
              <div className="p-3">
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2 flex justify-between">
                    <span>Pinned Spaces (7)</span>
                    <button className="text-xs text-blue-500">Unpin All</button>
                  </h3>
                  <ul className="space-y-1">
                    <li className="group">
                      <Link to="/" className="flex items-center justify-between py-2 px-2 text-gray-700 hover:bg-gray-100 rounded">
                        <span>Trial Center</span>
                        <Star className="h-4 w-4 text-blue-500" fill="#3b82f6" />
                      </Link>
                    </li>
                    <li className="group">
                      <Link to="/finance" className="flex items-center justify-between py-2 px-2 text-gray-700 hover:bg-gray-100 rounded">
                        <span>Finance</span>
                        <Star className="h-4 w-4 text-blue-500" fill="#3b82f6" />
                      </Link>
                    </li>
                    <li className="group">
                      <Link to="/manufacturing" className="flex items-center justify-between py-2 px-2 text-gray-700 hover:bg-gray-100 rounded">
                        <span>Manufacturing and Supply Chain</span>
                        <Star className="h-4 w-4 text-blue-500" fill="#3b82f6" />
                      </Link>
                    </li>
                    <li className="group">
                      <Link to="/procurement" className="flex items-center justify-between py-2 px-2 text-gray-700 hover:bg-gray-100 rounded">
                        <span>Procurement</span>
                        <Star className="h-4 w-4 text-blue-500" fill="#3b82f6" />
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">All Spaces</h3>
                  <ul className="space-y-1">
                    <li className="group">
                      <Link to="/" className="flex items-center justify-between py-2 px-2 text-gray-700 hover:bg-gray-100 rounded">
                        <span>Trial Center</span>
                        <Star className="h-4 w-4 text-gray-300 invisible group-hover:visible" />
                      </Link>
                    </li>
                    <li className="group">
                      <Link to="/finance" className="flex items-center justify-between py-2 px-2 text-gray-700 hover:bg-gray-100 rounded">
                        <span>Finance</span>
                        <Star className="h-4 w-4 text-gray-300 invisible group-hover:visible" />
                      </Link>
                    </li>
                    <li className="group">
                      <Link to="/manufacturing" className="flex items-center justify-between py-2 px-2 text-gray-700 hover:bg-gray-100 rounded">
                        <span>Manufacturing and Supply Chain</span>
                        <Star className="h-4 w-4 text-gray-300 invisible group-hover:visible" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <Link to="/" className="flex items-center" onMouseEnter={handleLogoHover}>
            <div className="h-8 w-14 bg-sap-blue flex items-center justify-center text-white font-bold">
              SAP
            </div>
            <div className="ml-3 flex items-center">
              <span className="font-semibold text-gray-800">Home</span>
              <span className="ml-1 text-xs">▼</span>
            </div>
          </Link>
          
          <a 
            href="https://skillsim.vercel.app/dashboard" 
            target="_self"
            className="ml-4 px-4 py-2 bg-sap-blue text-white rounded hover:bg-blue-700 transition-colors font-medium"
          >
            Master Dashboard
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 rounded-full hover:bg-gray-100" 
            onMouseEnter={handleSearchHover}
            onClick={() => {
              if (isEnabled) {
                speak("The search function allows you to quickly find what you need across the entire SAP system. You can search for transactions, reports, or any other information.");
              }
            }}
          >
            <Search className="h-5 w-5 text-gray-600" />
          </button>
          
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onMouseEnter={handleHelpHover}
            onClick={() => {
              if (isEnabled) {
                speak("The help center provides detailed information about how to use the SAP system, including tutorials, documentation, and troubleshooting guides.");
              }
            }}
          >
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </button>
          
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onMouseEnter={handleNotificationsHover}
            onClick={() => {
              if (isEnabled) {
                speak("The notification center shows you important alerts, messages, and updates that require your attention.");
              }
            }}
          >
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={handleVoiceAssistantToggle}
            title={isEnabled ? "Disable Voice Assistant" : "Enable Voice Assistant"}
          >
            {isEnabled ? (
              <Volume2 className="h-5 w-5 text-sap-blue" />
            ) : (
              <VolumeX className="h-5 w-5 text-gray-600" />
            )}
          </button>
          
          <div className="relative">
            <button 
              className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium"
              onMouseEnter={handleUserHover}
              onClick={toggleUserMenu}
            >
              UT
            </button>
            
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-white border rounded-md shadow-lg z-20">
                <div className="p-3 border-b">
                  <p className="font-medium">USER15506 Trial</p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 flex items-center text-sm hover:bg-gray-100">
                    <Clock className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Recent Activities</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 flex items-center text-sm hover:bg-gray-100">
                    <Star className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Frequently Used</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 flex items-center text-sm hover:bg-gray-100">
                    <Search className="h-4 w-4 mr-3 text-gray-500" />
                    <span>App Finder</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 flex items-center text-sm hover:bg-gray-100">
                    <Settings className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 flex items-center text-sm hover:bg-gray-100">
                    <Edit className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Edit Current Page</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 flex items-center text-sm hover:bg-gray-100">
                    <Info className="h-4 w-4 mr-3 text-gray-500" />
                    <span>About</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 flex items-center text-sm hover:bg-gray-100">
                    <FileText className="h-4 w-4 mr-3 text-gray-500" />
                    <span>My User Sessions</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 flex items-center text-sm hover:bg-gray-100">
                    <LogOut className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SAPHeader;
