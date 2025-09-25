
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { ArrowLeft, ClipboardCheck, FileText, HardDrive, Monitor, Wrench } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';

const ServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const { toast } = useToast();

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now in the Service and Asset Management page. Here you can manage maintenance requests, orders, and asset-related activities.');
    }
  }, [isEnabled, speak]);

  const handleCardClick = (action: string) => {
    console.log(`Service - ${action} clicked`);
    // Navigate to appropriate service pages or open dialogs
    switch (action) {
      case 'Create Maintenance Request':
        toast({
          title: "Create Maintenance Request",
          description: "Maintenance request form would open here.",
        });
        break;
      case 'Screen Maintenance Requests':
        toast({
          title: "Maintenance Requests",
          description: "Navigating to maintenance requests list...",
        });
        break;
      case 'Manage Maintenance Notifications':
        toast({
          title: "Maintenance Notifications",
          description: "Opening maintenance notifications management...",
        });
        break;
      case 'Perform Maintenance Jobs':
        toast({
          title: "Maintenance Jobs",
          description: "Opening maintenance jobs interface...",
        });
        break;
      case 'Maintenance Order Costs':
        toast({
          title: "Maintenance Order Costs",
          description: "Opening maintenance cost analysis...",
        });
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/manufacturing')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Service & Asset Management"
          description="Manage maintenance requests, orders, and asset-related activities"
          voiceIntroduction="Welcome to Service and Asset Management. Here you can manage all maintenance and asset-related activities."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Open Maintenance Requests</h3>
          <div className="text-3xl font-semibold mb-2">73</div>
          <div className="flex items-center">
            <span className="text-red-500 text-sm font-medium">↑ 5</span>
            <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Planned Maintenance</h3>
          <div className="text-3xl font-semibold mb-2">28</div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">On schedule</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">Asset Availability</h3>
          <div className="text-3xl font-semibold mb-2">94.8%</div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">↑ 1.2%</span>
            <span className="text-xs text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-2">MTTR</h3>
          <div className="text-3xl font-semibold mb-2">3.2h</div>
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">↓ 0.5h</span>
            <span className="text-xs text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Service Management Functions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow" onClick={() => handleCardClick('Create Maintenance Request')}>
            <div className="mb-2 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="font-medium">Create Maintenance Request</h3>
          </div>
          
          <div className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow" onClick={() => handleCardClick('Screen Maintenance Requests')}>
            <div className="mb-2 text-blue-600">
              <Monitor className="h-6 w-6" />
            </div>
            <h3 className="font-medium">Screen Maintenance Requests</h3>
            <div className="mt-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">73</div>
          </div>
          
          <div className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow" onClick={() => handleCardClick('Manage Maintenance Notifications')}>
            <div className="mb-2 text-blue-600">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <h3 className="font-medium">Manage Maintenance Notifications</h3>
          </div>
          
          <div className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow" onClick={() => handleCardClick('Perform Maintenance Jobs')}>
            <div className="mb-2 text-blue-600">
              <Wrench className="h-6 w-6" />
            </div>
            <h3 className="font-medium">Perform Maintenance Jobs</h3>
          </div>
          
          <div className="bg-white border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow" onClick={() => handleCardClick('Maintenance Order Costs')}>
            <div className="mb-2 text-blue-600">
              <HardDrive className="h-6 w-6" />
            </div>
            <h3 className="font-medium">Maintenance Order Costs</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServicePage;
