
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { ArrowLeft, Plus, UserPlus, Search, FileText } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';
import { useToast } from '../../hooks/use-toast';
import { listEntities, upsertEntity, generateId } from '../../lib/localCrud';

interface JobOpening {
  id: string;
  jobId: string;
  title: string;
  department: string;
  location: string;
  applications: number;
  interviewed: number;
  offered: number;
  hired: number;
  status: 'Active' | 'Filled' | 'Closed' | 'On Hold';
  deadline: string;
}

const Recruitment: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const { toast } = useToast();
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newJobOpening, setNewJobOpening] = useState<Partial<JobOpening>>({
    title: '',
    department: '',
    location: '',
    status: 'Active',
    deadline: ''
  });

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Recruitment. Manage job postings, candidates, and hiring processes.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadJobOpenings();
  }, []);

  const loadJobOpenings = () => {
    const existingJobs = listEntities<JobOpening>('jobOpenings');
    if (existingJobs.length === 0) {
      const sampleJobs: JobOpening[] = [
        {
          id: generateId('job'),
          jobId: 'JOB-001',
          title: 'Senior Software Engineer',
          department: 'IT',
          location: 'New York',
          applications: 45,
          interviewed: 8,
          offered: 2,
          hired: 0,
          status: 'Active',
          deadline: '2025-02-15'
        },
        {
          id: generateId('job'),
          jobId: 'JOB-002',
          title: 'Marketing Manager',
          department: 'Marketing',
          location: 'Chicago',
          applications: 67,
          interviewed: 12,
          offered: 1,
          hired: 1,
          status: 'Filled',
          deadline: '2025-01-31'
        },
        {
          id: generateId('job'),
          jobId: 'JOB-003',
          title: 'Data Analyst',
          department: 'Analytics',
          location: 'Remote',
          applications: 123,
          interviewed: 15,
          offered: 3,
          hired: 0,
          status: 'Active',
          deadline: '2025-02-28'
        }
      ];
      
      sampleJobs.forEach(job => upsertEntity('jobOpenings', job as any));
      setJobOpenings(sampleJobs);
    } else {
      setJobOpenings(existingJobs);
    }
  };

  const handleCreateJobPosting = () => {
    setIsDialogOpen(true);
  };

  const handleSaveJobPosting = () => {
    if (newJobOpening.title && newJobOpening.department && newJobOpening.location && newJobOpening.deadline) {
      const jobOpening: JobOpening = {
        id: generateId('job'),
        jobId: `JOB-${String(jobOpenings.length + 1).padStart(3, '0')}`,
        title: newJobOpening.title || '',
        department: newJobOpening.department || '',
        location: newJobOpening.location || '',
        applications: 0,
        interviewed: 0,
        offered: 0,
        hired: 0,
        status: newJobOpening.status as 'Active' | 'Filled' | 'Closed' | 'On Hold' || 'Active',
        deadline: newJobOpening.deadline || ''
      };

      upsertEntity('jobOpenings', jobOpening as any);
      setJobOpenings(prev => [...prev, jobOpening]);
      
      toast({
        title: 'Job Posting Created',
        description: 'New job opening has been successfully created.',
      });

      setIsDialogOpen(false);
      setNewJobOpening({
        title: '',
        department: '',
        location: '',
        status: 'Active',
        deadline: ''
      });
    }
  };

  const columns = [
    { key: 'jobId', header: 'Job ID' },
    { key: 'title', header: 'Job Title' },
    { key: 'department', header: 'Department' },
    { key: 'location', header: 'Location' },
    { key: 'applications', header: 'Applications' },
    { key: 'interviewed', header: 'Interviewed' },
    { key: 'offered', header: 'Offered' },
    { key: 'hired', header: 'Hired' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'Active': 'bg-green-100 text-green-800',
          'Filled': 'bg-blue-100 text-blue-800',
          'Closed': 'bg-gray-100 text-gray-800',
          'On Hold': 'bg-yellow-100 text-yellow-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    },
    { key: 'deadline', header: 'Deadline' }
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
          title="Recruitment"
          description="Manage job postings, candidates, and hiring processes"
          voiceIntroduction="Welcome to Recruitment."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Open Positions</div>
          <div className="text-2xl font-bold">18</div>
          <div className="text-sm text-blue-600">Currently hiring</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Applications</div>
          <div className="text-2xl font-bold">1,247</div>
          <div className="text-sm text-green-600">This month</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Interview Rate</div>
          <div className="text-2xl font-bold">24%</div>
          <div className="text-sm text-purple-600">Conversion rate</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Time to Hire</div>
          <div className="text-2xl font-bold">28</div>
          <div className="text-sm text-orange-600">Days average</div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Job Openings</h2>
        <Button onClick={handleCreateJobPosting}>
          <Plus className="h-4 w-4 mr-2" />
          Create Job Posting
        </Button>
      </div>

      <Card className="p-6">
        <DataTable columns={columns} data={jobOpenings} />
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Job Posting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={newJobOpening.title || ''}
                onChange={(e) => setNewJobOpening(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter job title"
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={newJobOpening.department || ''}
                onChange={(e) => setNewJobOpening(prev => ({ ...prev, department: e.target.value }))}
                placeholder="Enter department"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newJobOpening.location || ''}
                onChange={(e) => setNewJobOpening(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
            <div>
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newJobOpening.deadline || ''}
                onChange={(e) => setNewJobOpening(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={newJobOpening.status}
                onValueChange={(value) => setNewJobOpening(prev => ({ ...prev, status: value as 'Active' | 'Filled' | 'Closed' | 'On Hold' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Filled">Filled</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveJobPosting}>
                Create Job Posting
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recruitment;
