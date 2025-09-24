import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { 
  ArrowLeft, 
  Plus, 
  UserPlus, 
  Search, 
  FileText, 
  Users, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Copy
} from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import { useToast } from '../../hooks/use-toast';

interface JobOpening {
  id: string;
  jobId: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Manager';
  applications: number;
  interviewed: number;
  offered: number;
  hired: number;
  status: 'Active' | 'Filled' | 'Closed' | 'On Hold' | 'Draft';
  deadline: string;
  postedDate: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  description: string;
  hiringManager: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Hired' | 'Rejected';
  experience: number;
  location: string;
  appliedDate: string;
  resumeUrl?: string;
  skills: string[];
  rating: number;
  notes: string;
}

const RecruitmentEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Enhanced Recruitment Management. Manage job postings, candidates, interviews, and the complete hiring process with advanced analytics.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    const sampleJobs: JobOpening[] = [
      {
        id: 'job-001',
        jobId: 'JOB-2025-001',
        title: 'Senior Software Engineer',
        department: 'Engineering',
        location: 'New York, NY',
        type: 'Full-time',
        level: 'Senior',
        applications: 45,
        interviewed: 8,
        offered: 2,
        hired: 0,
        status: 'Active',
        deadline: '2025-02-15',
        postedDate: '2025-01-01',
        salary: { min: 120000, max: 160000, currency: 'USD' },
        requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
        description: 'We are seeking a senior software engineer to join our dynamic team...',
        hiringManager: 'Sarah Johnson'
      },
      {
        id: 'job-002',
        jobId: 'JOB-2025-002',
        title: 'Marketing Manager',
        department: 'Marketing',
        location: 'Chicago, IL',
        type: 'Full-time',
        level: 'Manager',
        applications: 67,
        interviewed: 12,
        offered: 1,
        hired: 1,
        status: 'Filled',
        deadline: '2025-01-31',
        postedDate: '2024-12-15',
        salary: { min: 90000, max: 120000, currency: 'USD' },
        requirements: ['Digital Marketing', 'Campaign Management', '3+ years experience'],
        description: 'Lead our marketing initiatives and drive brand growth...',
        hiringManager: 'Mike Wilson'
      }
    ];

    const sampleCandidates: Candidate[] = [
      {
        id: 'cand-001',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        position: 'Senior Software Engineer',
        status: 'Interview',
        experience: 6,
        location: 'New York, NY',
        appliedDate: '2025-01-10',
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        rating: 4.5,
        notes: 'Strong technical background, good communication skills'
      },
      {
        id: 'cand-002',
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1-555-0124',
        position: 'Marketing Manager',
        status: 'Offered',
        experience: 4,
        location: 'Chicago, IL',
        appliedDate: '2025-01-05',
        skills: ['Digital Marketing', 'Analytics', 'Campaign Management'],
        rating: 4.8,
        notes: 'Excellent portfolio, proven track record'
      }
    ];

    setJobOpenings(sampleJobs);
    setCandidates(sampleCandidates);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Filled': 'bg-blue-100 text-blue-800',
      'Closed': 'bg-gray-100 text-gray-800',
      'On Hold': 'bg-yellow-100 text-yellow-800',
      'Draft': 'bg-purple-100 text-purple-800',
      'Applied': 'bg-blue-100 text-blue-800',
      'Screening': 'bg-yellow-100 text-yellow-800',
      'Interview': 'bg-orange-100 text-orange-800',
      'Offered': 'bg-green-100 text-green-800',
      'Hired': 'bg-emerald-100 text-emerald-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const jobColumns: EnhancedColumn[] = [
    { key: 'jobId', header: 'Job ID', searchable: true },
    { key: 'title', header: 'Position', searchable: true },
    { key: 'department', header: 'Department', searchable: true, filterable: true, filterOptions: [
      { label: 'Engineering', value: 'Engineering' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Sales', value: 'Sales' },
      { label: 'HR', value: 'HR' }
    ]},
    { key: 'location', header: 'Location', searchable: true },
    { key: 'applications', header: 'Applications', sortable: true },
    { key: 'interviewed', header: 'Interviewed', sortable: true },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'deadline', header: 'Deadline', sortable: true }
  ];

  const jobActions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: JobOpening) => {
        toast({
          title: 'View Job Details',
          description: `Opening details for ${row.title}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: JobOpening) => {
        setSelectedJob(row);
        setIsEditing(true);
        setIsJobDialogOpen(true);
      },
      variant: 'ghost'
    },
    {
      label: 'Clone',
      icon: <Copy className="h-4 w-4" />,
      onClick: (row: JobOpening) => {
        const newJob = { ...row, id: `job-${Date.now()}`, jobId: `JOB-2025-${String(jobOpenings.length + 1).padStart(3, '0')}`, status: 'Draft' as const };
        setJobOpenings(prev => [...prev, newJob]);
        toast({
          title: 'Job Cloned',
          description: `Created copy of ${row.title}`,
        });
      },
      variant: 'ghost'
    }
  ];

  const candidateColumns: EnhancedColumn[] = [
    { key: 'name', header: 'Name', searchable: true },
    { key: 'position', header: 'Position', searchable: true },
    { key: 'experience', header: 'Years Exp.', sortable: true },
    { key: 'location', header: 'Location', searchable: true },
    { 
      key: 'rating', 
      header: 'Rating',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          {value}
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'appliedDate', header: 'Applied', sortable: true }
  ];

  const candidateActions: TableAction[] = [
    {
      label: 'View Profile',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: Candidate) => {
        toast({
          title: 'View Candidate',
          description: `Opening profile for ${row.name}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Schedule Interview',
      icon: <Calendar className="h-4 w-4" />,
      onClick: (row: Candidate) => {
        toast({
          title: 'Schedule Interview',
          description: `Scheduling interview for ${row.name}`,
        });
      },
      variant: 'ghost'
    },
    {
      label: 'Send Message',
      icon: <MessageSquare className="h-4 w-4" />,
      onClick: (row: Candidate) => {
        toast({
          title: 'Send Message',
          description: `Opening message composer for ${row.name}`,
        });
      },
      variant: 'ghost'
    }
  ];

  const handleCreateJob = () => {
    setSelectedJob(null);
    setIsEditing(false);
    setIsJobDialogOpen(true);
  };

  const totalApplications = jobOpenings.reduce((sum, job) => sum + job.applications, 0);
  const totalInterviewed = jobOpenings.reduce((sum, job) => sum + job.interviewed, 0);
  const interviewRate = totalApplications > 0 ? ((totalInterviewed / totalApplications) * 100).toFixed(1) : '0';

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
          title="Recruitment Management"
          description="Comprehensive recruitment and hiring process management"
          voiceIntroduction="Welcome to enhanced Recruitment Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{jobOpenings.filter(j => j.status === 'Active').length}</div>
            <div className="text-sm text-muted-foreground">Open Positions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{totalApplications}</div>
            <div className="text-sm text-muted-foreground">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{interviewRate}%</div>
            <div className="text-sm text-muted-foreground">Interview Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{jobOpenings.reduce((sum, job) => sum + job.hired, 0)}</div>
            <div className="text-sm text-muted-foreground">Hired This Month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">28</div>
            <div className="text-sm text-muted-foreground">Days to Hire</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">Job Openings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="pipeline">Interview Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Job Openings Management
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv,.xlsx';
                    input.onchange = () => toast({ title: 'Import Jobs', description: 'Job import functionality' });
                    input.click();
                  }}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Jobs
                  </Button>
                  <Button onClick={handleCreateJob}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job Opening
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={jobColumns}
                data={jobOpenings}
                actions={jobActions}
                searchPlaceholder="Search job openings..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Candidate Management
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Candidates
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Candidate
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={candidateColumns}
                data={candidates}
                actions={candidateActions}
                searchPlaceholder="Search candidates..."
                exportable={true}
                refreshable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interview Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Applied', 'Screening', 'Interview', 'Offered'].map((stage) => (
                  <Card key={stage} className="p-4">
                    <h3 className="font-semibold text-center mb-4">{stage}</h3>
                    <div className="space-y-2">
                      {candidates.filter(c => c.status === stage).map((candidate) => (
                        <div key={candidate.id} className="p-2 bg-gray-50 rounded text-sm">
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-gray-600">{candidate.position}</div>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            {candidate.rating}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Time to Fill (Average)</span>
                    <span className="font-medium">28 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost per Hire</span>
                    <span className="font-medium">$4,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Offer Acceptance Rate</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality of Hire Score</span>
                    <span className="font-medium">4.2/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>LinkedIn</span>
                    <span className="font-medium">35% (142 hires)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company Website</span>
                    <span className="font-medium">28% (89 hires)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employee Referrals</span>
                    <span className="font-medium">22% (67 hires)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Job Boards</span>
                    <span className="font-medium">15% (45 hires)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Job Opening' : 'Create New Job Opening'}</DialogTitle>
          </DialogHeader>
          <JobForm 
            job={selectedJob}
            onSave={(jobData) => {
              if (isEditing && selectedJob) {
                setJobOpenings(prev => prev.map(j => j.id === selectedJob.id ? { ...j, ...jobData } : j));
                toast({ title: 'Job Updated', description: 'Job opening updated successfully' });
              } else {
                const newJob: JobOpening = {
                  id: `job-${Date.now()}`,
                  jobId: `JOB-2025-${String(jobOpenings.length + 1).padStart(3, '0')}`,
                  applications: 0,
                  interviewed: 0,
                  offered: 0,
                  hired: 0,
                  postedDate: new Date().toISOString().split('T')[0],
                  ...jobData as JobOpening
                };
                setJobOpenings(prev => [...prev, newJob]);
                toast({ title: 'Job Created', description: 'New job opening created successfully' });
              }
              setIsJobDialogOpen(false);
            }}
            onCancel={() => setIsJobDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const JobForm: React.FC<{
  job: JobOpening | null;
  onSave: (data: Partial<JobOpening>) => void;
  onCancel: () => void;
}> = ({ job, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    department: job?.department || '',
    location: job?.location || '',
    type: job?.type || 'Full-time',
    level: job?.level || 'Mid',
    status: job?.status || 'Draft',
    deadline: job?.deadline || '',
    description: job?.description || '',
    hiringManager: job?.hiringManager || '',
    salaryMin: job?.salary?.min || 0,
    salaryMax: job?.salary?.max || 0,
    requirements: job?.requirements?.join(', ') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      salary: {
        min: formData.salaryMin,
        max: formData.salaryMax,
        currency: 'USD'
      },
      requirements: formData.requirements.split(',').map(r => r.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="HR">Human Resources</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Employment Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as JobOpening['type'] }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="salaryMin">Salary Min</Label>
          <Input
            id="salaryMin"
            type="number"
            value={formData.salaryMin}
            onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: Number(e.target.value) }))}
          />
        </div>
        <div>
          <Label htmlFor="salaryMax">Salary Max</Label>
          <Input
            id="salaryMax"
            type="number"
            value={formData.salaryMax}
            onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: Number(e.target.value) }))}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="requirements">Requirements (comma-separated)</Label>
        <Textarea
          id="requirements"
          value={formData.requirements}
          onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Job Opening
        </Button>
      </div>
    </form>
  );
};

export default RecruitmentEnhanced;