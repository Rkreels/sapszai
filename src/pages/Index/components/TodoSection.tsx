
import React from 'react';
import { Calendar, Clock, RefreshCw } from 'lucide-react';

interface TodoSectionProps {
  title: string;
  count?: number;
}

const TodoSection: React.FC<TodoSectionProps> = ({ title, count = 0 }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="sap-section-title flex items-center">
          {`${title} (${count})`}
          <button 
            onClick={() => {}}
            className="ml-2 text-blue-600"
          >
            <span className="text-xs">▼</span>
          </button>
        </h2>
        
        <div>
          <button className="text-sm text-gray-500 flex items-center">
            <RefreshCw className="h-3 w-3 mr-1" />
            <Clock className="h-4 w-4 mr-1" /> now
          </button>
        </div>
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
    </div>
  );
};

export default TodoSection;
