
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Plus, Clock, Calendar, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const TimeManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Time Management. Track employee working hours, attendance, and leave requests.');
    }
  }, [isEnabled, speak]);

  const timeRecords = [
    {
      employeeId: 'EMP-001',
      employeeName: 'John Smith',
      date: '2025-01-20',
      clockIn: '09:00',
      clockOut: '17:30',
      totalHours: 8.5,
      breakTime: 0.5,
      overtime: 0,
      status: 'Complete'
    },
    {
      employeeId: 'EMP-002',
      employeeName: 'Sarah Johnson',
      date: '2025-01-20',
      clockIn: '08:30',
      clockOut: '18:00',
      totalHours: 9.5,
      breakTime: 1,
      overtime: 1,
      status: 'Complete'
    },
    {
      employeeId: 'EMP-003',
      employeeName: 'Michael Brown',
      date: '2025-01-20',
      clockIn: '09:15',
      clockOut: '-',
      totalHours: 0,
      breakTime: 0,
      overtime: 0,
      status: 'In Progress'
    }
  ];

  const columns = [
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'employeeName', header: 'Employee Name' },
    { key: 'date', header: 'Date' },
    { key: 'clockIn', header: 'Clock In' },
    { key: 'clockOut', header: 'Clock Out' },
    { key: 'totalHours', header: 'Total Hours' },
    { key: 'breakTime', header: 'Break Time' },
    { key: 'overtime', header: 'Overtime' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Complete': 'bg-green-100 text-green-800',
          'In Progress': 'bg-blue-100 text-blue-800',
          'Absent': 'bg-red-100 text-red-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/human-resources')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title="Time Management"
          description="Track employee working hours, attendance, and leave requests"
          voiceIntroduction="Welcome to Time Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Present Today</div>
          <div className="text-2xl font-bold">1,156</div>
          <div className="text-sm text-green-600">92.7% attendance</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">On Leave</div>
          <div className="text-2xl font-bold">45</div>
          <div className="text-sm text-yellow-600">Approved absences</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Overtime Hours</div>
          <div className="text-2xl font-bold">324</div>
          <div className="text-sm text-orange-600">This week</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Avg Work Hours</div>
          <div className="text-2xl font-bold">8.2</div>
          <div className="text-sm text-purple-600">Per day</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Time Records</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Time Entry
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={timeRecords} />
      </Card>
    </div>
  );
};

export default TimeManagement;
