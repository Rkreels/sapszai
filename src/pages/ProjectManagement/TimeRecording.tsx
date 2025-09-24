
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Clock, Play, Pause, Save, Calendar, User } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const timeEntries = [
  { id: 'TIME-001', date: '2025-05-30', project: 'ERP Implementation', task: 'System Configuration', hours: 8, status: 'Approved', employee: 'John Smith' },
  { id: 'TIME-002', date: '2025-05-29', project: 'Website Redesign', task: 'Frontend Development', hours: 6.5, status: 'Pending', employee: 'Emma Wilson' },
  { id: 'TIME-003', date: '2025-05-29', project: 'Mobile App', task: 'API Integration', hours: 7, status: 'Approved', employee: 'Mike Johnson' },
  { id: 'TIME-004', date: '2025-05-28', project: 'ERP Implementation', task: 'Testing', hours: 5, status: 'Rejected', employee: 'Sarah Davis' },
];

const timesheets = [
  { week: 'Week 22 (May 26-31)', employee: 'John Smith', totalHours: 40, status: 'Submitted', billableHours: 35 },
  { week: 'Week 22 (May 26-31)', employee: 'Emma Wilson', totalHours: 38, status: 'Approved', billableHours: 38 },
  { week: 'Week 21 (May 19-25)', employee: 'Mike Johnson', totalHours: 42, status: 'Approved', billableHours: 40 },
];

const TimeRecording: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('recording');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00:00');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Time Recording. Here you can track time spent on project activities, manage timesheets, and generate time reports for billing and analysis.');
    }
  }, [isEnabled, speak]);

  const timeEntryColumns = [
    { key: 'date', header: 'Date' },
    { key: 'project', header: 'Project' },
    { key: 'task', header: 'Task' },
    { key: 'hours', header: 'Hours' },
    { key: 'employee', header: 'Employee' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Approved' ? 'default' : 
          value === 'Pending' ? 'secondary' : 'destructive'
        }>
          {value}
        </Badge>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => <Button variant="outline" size="sm">Edit</Button>
    }
  ];

  const timesheetColumns = [
    { key: 'week', header: 'Week' },
    { key: 'employee', header: 'Employee' },
    { key: 'totalHours', header: 'Total Hours' },
    { key: 'billableHours', header: 'Billable Hours' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Approved' ? 'default' : 
          value === 'Submitted' ? 'secondary' : 'outline'
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

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

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
          title="Time Recording"
          description="Track time, manage timesheets, and generate time reports"
          voiceIntroduction="Welcome to Time Recording management."
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recording">Time Recording</TabsTrigger>
          <TabsTrigger value="entries">Time Entries</TabsTrigger>
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="recording" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Time Tracker</h3>
              <div className="text-center space-y-4">
                <div className="text-4xl font-mono font-bold text-blue-600">
                  {currentTime}
                </div>
                <div className="space-y-2">
                  <select className="w-full p-2 border rounded">
                    <option>ERP Implementation</option>
                    <option>Website Redesign</option>
                    <option>Mobile App</option>
                  </select>
                  <select className="w-full p-2 border rounded">
                    <option>System Configuration</option>
                    <option>Development</option>
                    <option>Testing</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={toggleTimer}
                    className={isTimerRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {isTimerRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </Button>
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Entry
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span>Today's Hours</span>
                  <span className="font-semibold">7.5h</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span>This Week</span>
                  <span className="font-semibold">35h</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span>Billable Hours</span>
                  <span className="font-semibold">32h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Overtime</span>
                  <span className="font-semibold text-orange-600">3h</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Manual Time Entry</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" className="w-full p-2 border rounded" defaultValue="2025-05-31" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <select className="w-full p-2 border rounded">
                  <option>ERP Implementation</option>
                  <option>Website Redesign</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Task</label>
                <select className="w-full p-2 border rounded">
                  <option>Development</option>
                  <option>Testing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hours</label>
                <input type="number" className="w-full p-2 border rounded" placeholder="8.0" step="0.5" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Work description" />
              </div>
              <div className="flex items-end">
                <Button className="w-full">Add Entry</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="entries" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Time Entries</h3>
              <Button>Export Entries</Button>
            </div>
            <DataTable 
              columns={timeEntryColumns}
              data={timeEntries}
              className="border rounded-md"
            />
          </Card>
        </TabsContent>

        <TabsContent value="timesheets" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Timesheets</h3>
              <Button>Create Timesheet</Button>
            </div>
            <DataTable 
              columns={timesheetColumns}
              data={timesheets}
              className="border rounded-md"
            />
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Time Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">Project Time Report</h4>
                <p className="text-sm text-gray-600 mb-3">Time spent per project</p>
                <Button variant="outline" size="sm">Generate</Button>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <User className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">Employee Time Report</h4>
                <p className="text-sm text-gray-600 mb-3">Time logged by employee</p>
                <Button variant="outline" size="sm">Generate</Button>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium mb-2">Billing Report</h4>
                <p className="text-sm text-gray-600 mb-3">Billable hours summary</p>
                <Button variant="outline" size="sm">Generate</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeRecording;
