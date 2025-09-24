
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import PageHeader from '../../components/page/PageHeader';
import { ArrowLeft, Calendar, Clock, Package, Plus } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const ProductionScheduling: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  React.useEffect(() => {
    if (isEnabled) {
      speak('You are now viewing Production Scheduling. This page allows you to schedule and manage production operations.');
    }
  }, [isEnabled, speak]);

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
          title="Production Scheduling"
          description="Schedule and manage production operations efficiently"
          voiceIntroduction="Welcome to Production Scheduling. Here you can plan and schedule production operations."
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Production Schedule</h2>
          <p className="text-sm text-gray-500">May 2025 - Week 19</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" /> View Calendar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Production Order
          </Button>
        </div>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="capacity">Capacity View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily">
          <Card className="p-0 overflow-hidden">
            <div className="grid grid-cols-8 bg-gray-50 border-b">
              <div className="p-4 border-r font-medium">Time</div>
              <div className="p-4 border-r font-medium">Line 1</div>
              <div className="p-4 border-r font-medium">Line 2</div>
              <div className="p-4 border-r font-medium">Line 3</div>
              <div className="p-4 border-r font-medium">Line 4</div>
              <div className="p-4 border-r font-medium">Line 5</div>
              <div className="p-4 border-r font-medium">Line 6</div>
              <div className="p-4 font-medium">Line 7</div>
            </div>
            
            {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b hover:bg-gray-50">
                <div className="p-4 border-r text-gray-500">
                  {`${hour}:00`}
                </div>
                <div className={`p-4 border-r ${hour >= 9 && hour <= 14 ? 'bg-blue-100 border border-blue-300' : ''}`}>
                  {hour >= 9 && hour <= 14 && (
                    <>
                      <div className="text-sm font-medium">PO-1234</div>
                      <div className="text-xs text-gray-500">Widget A</div>
                    </>
                  )}
                </div>
                <div className={`p-4 border-r ${hour >= 11 && hour <= 15 ? 'bg-green-100 border border-green-300' : ''}`}>
                  {hour >= 11 && hour <= 15 && (
                    <>
                      <div className="text-sm font-medium">PO-1235</div>
                      <div className="text-xs text-gray-500">Widget B</div>
                    </>
                  )}
                </div>
                <div className="p-4 border-r"></div>
                <div className={`p-4 border-r ${hour >= 8 && hour <= 12 ? 'bg-purple-100 border border-purple-300' : ''}`}>
                  {hour >= 8 && hour <= 12 && (
                    <>
                      <div className="text-sm font-medium">PO-1236</div>
                      <div className="text-xs text-gray-500">Widget C</div>
                    </>
                  )}
                </div>
                <div className="p-4 border-r"></div>
                <div className="p-4 border-r"></div>
                <div className={`p-4 ${hour >= 13 && hour <= 17 ? 'bg-amber-100 border border-amber-300' : ''}`}>
                  {hour >= 13 && hour <= 17 && (
                    <>
                      <div className="text-sm font-medium">PO-1237</div>
                      <div className="text-xs text-gray-500">Widget D</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly">
          <Card className="p-6">
            <div className="text-center py-12 border-dashed border-2 border-gray-300 rounded-md">
              <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Weekly production schedule view</p>
              <p className="text-sm text-gray-400 mt-2">Switch to this view to see the full weekly production plan</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card className="p-6">
            <div className="text-center py-12 border-dashed border-2 border-gray-300 rounded-md">
              <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Monthly production schedule view</p>
              <p className="text-sm text-gray-400 mt-2">Switch to this view to see the full monthly production plan</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="capacity">
          <Card className="p-6">
            <div className="text-center py-12 border-dashed border-2 border-gray-300 rounded-md">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Production capacity utilization view</p>
              <p className="text-sm text-gray-400 mt-2">View capacity utilization across production lines and resources</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionScheduling;
