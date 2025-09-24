
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { ArrowLeft, Plus, Edit, Eye, User, Phone, Mail, MapPin, Trash2, Download, Building } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import EnhancedDataTable, { EnhancedColumn, TableAction } from '../../components/data/EnhancedDataTable';
import VoiceTrainingComponent from '../../components/procurement/VoiceTrainingComponent';
import { listEntities, upsertEntity, removeEntity, generateId } from '../../lib/localCrud';

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  manager: string;
  startDate: string;
  status: 'Active' | 'On Leave' | 'Inactive' | 'Terminated';
  location: string;
  salary: number;
  employeeType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  workSchedule: string;
  skills: string[];
  certifications: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const EmployeeCentral: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Employee Central. Comprehensive employee lifecycle management with self-service capabilities and organizational structure management.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const existingEmployees = listEntities<Employee>('employees');
    if (existingEmployees.length === 0) {
      const sampleEmployees: Employee[] = [
        {
          id: generateId('emp'),
          employeeId: 'EMP-001',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@company.com',
          phone: '+1-555-0123',
          position: 'Senior Software Engineer',
          department: 'Information Technology',
          manager: 'Jane Doe',
          startDate: '2023-01-15',
          status: 'Active',
          location: 'New York Office',
          salary: 95000,
          employeeType: 'Full-time',
          workSchedule: 'Standard 40hrs/week',
          skills: ['JavaScript', 'React', 'Node.js', 'Python'],
          certifications: ['AWS Certified Developer', 'Scrum Master'],
          emergencyContact: {
            name: 'Jane Smith',
            phone: '+1-555-0124',
            relationship: 'Spouse'
          }
        }
      ];
      
      sampleEmployees.forEach(emp => upsertEntity('employees', emp as any));
      setEmployees(sampleEmployees);
    } else {
      setEmployees(existingEmployees);
    }
  };

  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteEmployee = (empId: string) => {
    removeEntity('employees', empId);
    setEmployees(prev => prev.filter(e => e.id !== empId));
    toast({
      title: 'Employee Deleted',
      description: 'Employee record has been successfully removed.',
    });
  };

  const handleSaveEmployee = (empData: Partial<Employee>) => {
    if (isEditing && selectedEmployee) {
      const updatedEmp = { ...selectedEmployee, ...empData };
      upsertEntity('employees', updatedEmp as any);
      setEmployees(prev => prev.map(e => e.id === selectedEmployee.id ? updatedEmp : e));
      toast({
        title: 'Employee Updated',
        description: 'Employee information has been successfully updated.',
      });
    } else {
      const newEmployee: Employee = {
        id: generateId('emp'),
        employeeId: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
        skills: [],
        certifications: [],
        emergencyContact: { name: '', phone: '', relationship: '' },
        ...empData as Employee
      };
      upsertEntity('employees', newEmployee as any);
      setEmployees(prev => [...prev, newEmployee]);
      toast({
        title: 'Employee Created',
        description: 'New employee has been successfully added.',
      });
    }
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'On Leave': 'bg-yellow-100 text-yellow-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Terminated': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns: EnhancedColumn[] = [
    { key: 'employeeId', header: 'Employee ID', sortable: true, searchable: true },
    { 
      key: 'name', 
      header: 'Name',
      searchable: true,
      render: (_, row: Employee) => `${row.firstName} ${row.lastName}`
    },
    { key: 'email', header: 'Email', searchable: true },
    { key: 'position', header: 'Position', searchable: true },
    { key: 'department', header: 'Department', filterable: true, filterOptions: [
      { label: 'IT', value: 'Information Technology' },
      { label: 'HR', value: 'Human Resources' },
      { label: 'Sales', value: 'Sales' },
      { label: 'Marketing', value: 'Marketing' },
      { label: 'Finance', value: 'Finance' }
    ]},
    { key: 'manager', header: 'Manager', searchable: true },
    { key: 'startDate', header: 'Start Date', sortable: true },
    { 
      key: 'status', 
      header: 'Status',
      filterable: true,
      filterOptions: [
        { label: 'Active', value: 'Active' },
        { label: 'On Leave', value: 'On Leave' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Terminated', value: 'Terminated' }
      ],
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    },
    { key: 'location', header: 'Location', searchable: true }
  ];

  const actions: TableAction[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: Employee) => {
        setSelectedEmployee(row);
        setActiveTab('profile');
      },
      variant: 'ghost'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: Employee) => handleEditEmployee(row),
      variant: 'ghost'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: Employee) => handleDeleteEmployee(row.id),
      variant: 'ghost'
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
          title="Employee Central"
          description="Comprehensive employee lifecycle management with self-service capabilities"
          voiceIntroduction="Welcome to Employee Central with comprehensive workforce management."
        />
      </div>

      <VoiceTrainingComponent 
        module="hr"
        topic="Employee Central Management"
        examples={[
          "Managing employee master data with organizational assignments, personal information, and employment history tracking",
          "Processing employee lifecycle events including onboarding, transfers, promotions, and termination workflows",
          "Enabling employee self-service functionality for time recording, leave requests, and personal data maintenance"
        ]}
        detailLevel="advanced"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{employees.length}</div>
            <div className="text-sm text-muted-foreground">Total Employees</div>
            <div className="text-sm text-blue-600">Active workforce</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {employees.filter(e => e.status === 'Active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Employees</div>
            <div className="text-sm text-green-600">Currently working</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {employees.filter(e => e.status === 'On Leave').length}
            </div>
            <div className="text-sm text-muted-foreground">On Leave</div>
            <div className="text-sm text-yellow-600">Temporarily away</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {new Set(employees.map(e => e.department)).size}
            </div>
            <div className="text-sm text-muted-foreground">Departments</div>
            <div className="text-sm text-purple-600">Organizational units</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="profile">Employee Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Employee Directory
                <Button onClick={handleCreateEmployee}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedDataTable 
                columns={columns}
                data={employees}
                actions={actions}
                searchPlaceholder="Search employees..."
                exportable={true}
                refreshable={true}
                onRefresh={loadEmployees}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          {selectedEmployee ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Employee ID</Label>
                      <div className="font-medium">{selectedEmployee.employeeId}</div>
                    </div>
                    <div>
                      <Label>Position</Label>
                      <div>{selectedEmployee.position}</div>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <div>{selectedEmployee.department}</div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={getStatusColor(selectedEmployee.status)}>
                        {selectedEmployee.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Email</Label>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {selectedEmployee.email}
                      </div>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {selectedEmployee.phone}
                      </div>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {selectedEmployee.location}
                      </div>
                    </div>
                  </div>
                  
                  {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                    <div>
                      <Label>Skills</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedEmployee.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Select an employee to view profile</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(new Set(employees.map(e => e.department))).map((dept) => {
                  const deptEmployees = employees.filter(e => e.department === dept);
                  return (
                    <div key={dept} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Building className="h-5 w-5 mr-2" />
                          <h4 className="font-semibold">{dept}</h4>
                        </div>
                        <Badge variant="outline">{deptEmployees.length} employees</Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {deptEmployees.slice(0, 4).map((emp) => (
                          <div key={emp.id} className="text-sm text-muted-foreground">
                            • {emp.firstName} {emp.lastName} - {emp.position}
                          </div>
                        ))}
                        {deptEmployees.length > 4 && (
                          <div className="text-sm text-muted-foreground">
                            ... and {deptEmployees.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(employees.map(e => e.department))).map((dept) => {
                    const count = employees.filter(e => e.department === dept).length;
                    return (
                      <div key={dept} className="flex justify-between">
                        <span>{dept}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employment Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Full-time', 'Part-time', 'Contract', 'Intern'].map((type) => {
                    const count = employees.filter(e => e.employeeType === type).length;
                    return (
                      <div key={type} className="flex justify-between">
                        <span>{type}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          </DialogHeader>
          <EmployeeForm 
            employee={selectedEmployee}
            onSave={handleSaveEmployee}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EmployeeForm: React.FC<{
  employee: Employee | null;
  onSave: (data: Partial<Employee>) => void;
  onCancel: () => void;
}> = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    position: employee?.position || '',
    department: employee?.department || '',
    manager: employee?.manager || '',
    location: employee?.location || '',
    status: employee?.status || 'Active',
    employeeType: employee?.employeeType || 'Full-time',
    startDate: employee?.startDate || new Date().toISOString().split('T')[0],
    salary: employee?.salary || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
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
              <SelectItem value="Information Technology">Information Technology</SelectItem>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {employee ? 'Update' : 'Create'} Employee
        </Button>
      </div>
    </form>
  );
};

export default EmployeeCentral;
