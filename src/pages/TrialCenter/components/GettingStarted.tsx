
import React from 'react';
import { ChevronRight } from 'lucide-react';

const GettingStarted: React.FC = () => {
  return (
    <div className="col-span-full">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
        <h3 className="text-xl font-medium mb-4">Welcome to SAP S/4HANA Trial</h3>
        <p className="mb-6 text-gray-700">
          This trial environment provides a hands-on experience with SAP S/4HANA. Follow these steps to get started quickly:
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                1
              </div>
            </div>
            <h4 className="text-center font-medium mb-2">Orientation</h4>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Explore the system interface and navigation to get familiar with the basic structure.
            </p>
            <div className="text-center">
              <button className="text-blue-600 text-sm flex items-center mx-auto">
                Start Tour <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                2
              </div>
            </div>
            <h4 className="text-center font-medium mb-2">Basic Tutorials</h4>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Complete the basic tutorials to learn essential functions and workflows.
            </p>
            <div className="text-center">
              <button className="text-blue-600 text-sm flex items-center mx-auto">
                View Tutorials <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                3
              </div>
            </div>
            <h4 className="text-center font-medium mb-2">Try Features</h4>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Test different modules and features in the sandbox environment.
            </p>
            <div className="text-center">
              <button className="text-blue-600 text-sm flex items-center mx-auto">
                Open Sandbox <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
