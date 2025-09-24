
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, MessageSquare, Video, Share2, Users, Bell, Calendar } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const teamCommunications = [
  { 
    id: 'MSG-001', 
    type: 'Message', 
    subject: 'ERP Implementation Update', 
    from: 'John Smith',
    project: 'ERP Implementation',
    timestamp: '2025-05-31 10:30',
    status: 'Read'
  },
  { 
    id: 'MTG-001', 
    type: 'Meeting', 
    subject: 'Weekly Status Review', 
    from: 'Emma Wilson',
    project: 'Website Redesign',
    timestamp: '2025-05-31 14:00',
    status: 'Scheduled'
  },
  { 
    id: 'DOC-001', 
    type: 'Document', 
    subject: 'Technical Specification v2.0', 
    from: 'Mike Johnson',
    project: 'Mobile App',
    timestamp: '2025-05-30 16:45',
    status: 'Shared'
  },
];

const upcomingMeetings = [
  { title: 'Sprint Planning', time: '09:00', project: 'ERP Implementation', attendees: 8 },
  { title: 'Design Review', time: '14:00', project: 'Website Redesign', attendees: 5 },
  { title: 'Risk Assessment', time: '16:30', project: 'Mobile App', attendees: 6 },
];

const Collaboration: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('communications');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Project Collaboration. Here you can communicate with team members, schedule meetings, share documents, and coordinate project activities.');
    }
  }, [isEnabled, speak]);

  const communicationColumns = [
    { 
      key: 'type', 
      header: 'Type',
      render: (value: string) => (
        <Badge variant={
          value === 'Message' ? 'default' : 
          value === 'Meeting' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { key: 'subject', header: 'Subject' },
    { key: 'from', header: 'From' },
    { key: 'project', header: 'Project' },
    { key: 'timestamp', header: 'Time' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Read' ? 'default' : 
          value === 'Scheduled' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => <Button variant="outline" size="sm">View</Button>
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/project-management')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Project Collaboration"
          description="Team communication, meetings, and document sharing"
          voiceIntroduction="Welcome to Project Collaboration."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Unread Messages</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Video className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Meetings Today</p>
              <p className="text-2xl font-bold">4</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Share2 className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Shared Documents</p>
              <p className="text-2xl font-bold">23</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Members</p>
              <p className="text-2xl font-bold">16</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="sharing">Document Sharing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="communications" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Team Communications</h3>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
            <DataTable 
              columns={communicationColumns}
              data={teamCommunications}
              className="border rounded-md"
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Team Chat Channels</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="font-medium"># ERP Implementation</span>
                    <p className="text-sm text-gray-600">12 members</p>
                  </div>
                  <Badge variant="destructive">3 new</Badge>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="font-medium"># Website Redesign</span>
                    <p className="text-sm text-gray-600">8 members</p>
                  </div>
                  <Badge variant="secondary">1 new</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium"># General Discussion</span>
                    <p className="text-sm text-gray-600">24 members</p>
                  </div>
                  <Badge variant="outline">5 new</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="font-medium">John Smith shared a document</p>
                  <p className="text-sm text-gray-600">Project Charter v2.1 • 2 hours ago</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  <p className="font-medium">Emma Wilson scheduled a meeting</p>
                  <p className="text-sm text-gray-600">Design Review • Tomorrow 2 PM</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-3">
                  <p className="font-medium">Mike Johnson posted in #mobile-app</p>
                  <p className="text-sm text-gray-600">API integration update • 1 hour ago</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Meeting Management</h3>
              <Button>
                <Video className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Today's Meetings</h4>
                <div className="space-y-3">
                  {upcomingMeetings.map((meeting, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{meeting.title}</p>
                        <p className="text-sm text-gray-600">{meeting.project}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{meeting.time}</p>
                        <p className="text-sm text-gray-600">{meeting.attendees} attendees</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Meeting Tools</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="h-4 w-4 mr-2" />
                    Start Video Conference
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar Integration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="h-4 w-4 mr-2" />
                    Screen Sharing
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Meeting Chat
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sharing" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Document Sharing Hub</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Recently Shared</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Project Charter v2.1</p>
                      <p className="text-sm text-gray-600">Shared by John Smith</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">UI Mockups</p>
                      <p className="text-sm text-gray-600">Shared by Emma Wilson</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">API Documentation</p>
                      <p className="text-sm text-gray-600">Shared by Mike Johnson</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Collaboration Features</h4>
                <div className="space-y-2 text-sm">
                  <p>• Real-time document editing</p>
                  <p>• Version control and history</p>
                  <p>• Comment and review system</p>
                  <p>• Access permissions management</p>
                  <p>• Integration with project tools</p>
                  <p>• Offline sync capabilities</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Center</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Recent Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-start border-b pb-2">
                    <Bell className="h-4 w-4 text-blue-600 mr-2 mt-1" />
                    <div>
                      <p className="font-medium">Task Assigned</p>
                      <p className="text-sm text-gray-600">System Configuration task assigned to you</p>
                      <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start border-b pb-2">
                    <Bell className="h-4 w-4 text-green-600 mr-2 mt-1" />
                    <div>
                      <p className="font-medium">Meeting Reminder</p>
                      <p className="text-sm text-gray-600">Sprint Planning in 30 minutes</p>
                      <p className="text-xs text-gray-500">25 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Bell className="h-4 w-4 text-orange-600 mr-2 mt-1" />
                    <div>
                      <p className="font-medium">Document Updated</p>
                      <p className="text-sm text-gray-600">Technical Specification v2.0 has been updated</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Notification Settings</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Task Assignments</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Meeting Reminders</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Document Updates</span>
                    <Badge variant="secondary">Email Only</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Project Updates</span>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Collaboration;
