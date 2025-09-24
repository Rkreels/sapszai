
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVoiceAssistantContext } from '../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { Menu, Star, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAPSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeSection, setActiveSection] = useState<'pinned' | 'all'>('pinned');

  const pinnedSpaces = [
    { name: 'Trial Center', path: '/trial-center' },
    { name: 'Finance', path: '/finance' },
    { name: 'Manufacturing and Supply Chain', path: '/manufacturing' },
    { name: 'Procurement', path: '/procurement' },
    { name: 'Project Management', path: '/project-management' },
    { name: 'Sales', path: '/sales' },
    { name: 'Other', path: '/other' },
  ];

  const allSpaces = [
    ...pinnedSpaces,
    // Additional spaces could be added here
  ];

  const handleSpaceClick = (name: string) => {
    if (isEnabled) {
      speak(`Navigating to ${name} module.`);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30">
      <div className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-lg overflow-auto animate-slide-in-right">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">All My Apps</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium flex justify-between">
              <span>Pinned Spaces ({pinnedSpaces.length})</span>
              <button className="text-sm text-blue-500 font-normal">Unpin All</button>
            </h3>
            <ul className="mt-2 space-y-1">
              {pinnedSpaces.map((space) => (
                <li key={space.path} className="group">
                  <Link
                    to={space.path}
                    className="flex items-center justify-between py-3 px-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => handleSpaceClick(space.name)}
                  >
                    <span>{space.name}</span>
                    <Star className="h-4 w-4 text-blue-500" fill="#3b82f6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium">All Spaces</h3>
            <ul className="mt-2 space-y-1">
              {allSpaces.map((space) => (
                <li key={space.path} className="group">
                  <Link
                    to={space.path}
                    className="flex items-center justify-between py-3 px-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => handleSpaceClick(space.name)}
                  >
                    <span>{space.name}</span>
                    <Star className="h-4 w-4 text-gray-300 invisible group-hover:visible" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SAPSidebar;
