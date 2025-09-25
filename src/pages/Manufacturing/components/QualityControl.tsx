
import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import DataTable from '../../../components/data/DataTable';
import { ClipboardCheck, AlertTriangle, TrendingUp, FileText, Plus, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '../../../components/ui/use-toast';

interface DataTableRow {
  id: string;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  render?: (value: string | number, row?: DataTableRow) => React.ReactNode;
}

const QualityControl: React.FC = () => {
  const [activeInspections, setActiveInspections] = useState([
    {
      lotNumber: 'QL-2025-001',
      material: 'Widget A',
      quantity: 500,
      inspector: 'John Doe',
      startDate: '2025-05-20',
      status: 'In Progress',
      criticalChecks: 8,
      passedChecks: 6
    },
    {
      lotNumber: 'QL-2025-002',
      material: 'Widget B',
      quantity: 350,
      inspector: 'Jane Smith',
      startDate: '2025-05-19',
      status: 'Completed',
      criticalChecks: 10,
      passedChecks: 10
    },
    {
      lotNumber: 'QL-2025-003',
      material: 'Assembly C',
      quantity: 200,
      inspector: 'Mike Johnson',
      startDate: '2025-05-21',
      status: 'Failed',
      criticalChecks: 12,
      passedChecks: 9
    }
  ]);

  const qualityIssues = [
    {
      issueId: 'QI-2025-015',
      material: 'Widget A',
      defectType: 'Dimensional',
      severity: 'High',
      quantity: 25,
      reportDate: '2025-05-20',
      status: 'Open',
      assignedTo: 'Engineering Team'
    },
    {
      issueId: 'QI-2025-014',
      material: 'Widget B',
      defectType: 'Surface Finish',
      severity: 'Medium',
      quantity: 12,
      reportDate: '2025-05-19',
      status: 'In Review',
      assignedTo: 'Quality Team'
    }
  ];

  const [isCreateInspectionOpen, setIsCreateInspectionOpen] = useState(false);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);
  const { toast } = useToast();

  const inspectionForm = useForm({
    defaultValues: {
      material: '',
      quantity: '',
      inspector: '',
      criticalChecks: ''
    }
  });

  const issueForm = useForm({
    defaultValues: {
      material: '',
      defectType: '',
      severity: 'Medium',
      quantity: '',
      assignedTo: ''
    }
  });

  const handleCreateInspection = (data: any) => {
    const newInspection = {
      lotNumber: `QL-2025-${String(activeInspections.length + 1).padStart(3, '0')}`,
      material: data.material,
      quantity: parseInt(data.quantity),
      inspector: data.inspector,
      startDate: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      criticalChecks: parseInt(data.criticalChecks),
      passedChecks: 0
    };
    
    setActiveInspections([...activeInspections, newInspection]);
    setIsCreateInspectionOpen(false);
    inspectionForm.reset();
    
    toast({
      title: 'Inspection Created',
      description: `New inspection lot ${newInspection.lotNumber} has been created.`,
    });
  };

  const handleReportIssue = (data: any) => {
    const newIssue = {
      issueId: `QI-2025-${String(qualityIssues.length + 1).padStart(3, '0')}`,
      material: data.material,
      defectType: data.defectType,
      severity: data.severity,
      quantity: parseInt(data.quantity),
      reportDate: new Date().toISOString().split('T')[0],
      status: 'Open',
      assignedTo: data.assignedTo
    };
    
    qualityIssues.push(newIssue);
    setIsReportIssueOpen(false);
    issueForm.reset();
    
    toast({
      title: 'Issue Reported',
      description: `Quality issue ${newIssue.issueId} has been reported.`,
    });
  };

  const handleGenerateReports = () => {
    toast({
      title: 'Generating Reports',
      description: 'Quality reports are being generated and will be available for download.',
    });
  };

  const inspectionColumns = [
    { key: 'lotNumber', header: 'Lot Number' },
    { key: 'material', header: 'Material' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'inspector', header: 'Inspector' },
    { key: 'startDate', header: 'Start Date' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => {
        const colors = {
          'In Progress': 'bg-yellow-100 text-yellow-800',
          'Completed': 'bg-green-100 text-green-800',
          'Failed': 'bg-red-100 text-red-800',
          'Pending': 'bg-blue-100 text-blue-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        );
      }
    },
    { 
      key: 'progress', 
      header: 'Progress',
      render: (_, row: any) => (
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(row.passedChecks / row.criticalChecks) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs">{row.passedChecks}/{row.criticalChecks}</span>
        </div>
      )
    }
  ];

  const issueColumns = [
    { key: 'issueId', header: 'Issue ID' },
    { key: 'material', header: 'Material' },
    { key: 'defectType', header: 'Defect Type' },
    { 
      key: 'severity', 
      header: 'Severity',
      render: (value: string) => {
        const colors = {
          'High': 'bg-red-100 text-red-800',
          'Medium': 'bg-yellow-100 text-yellow-800',
          'Low': 'bg-green-100 text-green-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors]}`}>
            {value}
          </span>
        );
      }
    },
    { key: 'quantity', header: 'Affected Qty' },
    { key: 'reportDate', header: 'Report Date' },
    { key: 'status', header: 'Status' },
    { key: 'assignedTo', header: 'Assigned To' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Quality Control Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleGenerateReports}>
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Dialog open={isCreateInspectionOpen} onOpenChange={setIsCreateInspectionOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Inspection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Inspection</DialogTitle>
              </DialogHeader>
              <Form {...inspectionForm}>
                <form onSubmit={inspectionForm.handleSubmit(handleCreateInspection)} className="space-y-4">
                  <FormField
                    control={inspectionForm.control}
                    name="material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={inspectionForm.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={inspectionForm.control}
                      name="criticalChecks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Critical Checks</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={inspectionForm.control}
                    name="inspector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inspector</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateInspectionOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Inspection</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Active Inspections</div>
              <div className="text-2xl font-bold">161</div>
            </div>
            <ClipboardCheck className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Quality Rate</div>
              <div className="text-2xl font-bold">96.3%</div>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Open Issues</div>
              <div className="text-2xl font-bold">12</div>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Defect Rate</div>
              <div className="text-2xl font-bold">3.7%</div>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="inspections" className="w-full">
        <TabsList>
          <TabsTrigger value="inspections">Active Inspections</TabsTrigger>
          <TabsTrigger value="issues">Quality Issues</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Inspection Lots</h3>
              <Dialog open={isCreateInspectionOpen} onOpenChange={setIsCreateInspectionOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Inspection Lot
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Inspection Lot</DialogTitle>
                  </DialogHeader>
                  <Form {...inspectionForm}>
                    <form onSubmit={inspectionForm.handleSubmit(handleCreateInspection)} className="space-y-4">
                      <FormField
                        control={inspectionForm.control}
                        name="material"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={inspectionForm.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={inspectionForm.control}
                          name="criticalChecks"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Critical Checks</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={inspectionForm.control}
                        name="inspector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inspector</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreateInspectionOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Inspection</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <DataTable columns={inspectionColumns} data={activeInspections} />
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Quality Issues</h3>
              <Dialog open={isReportIssueOpen} onOpenChange={setIsReportIssueOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report Quality Issue</DialogTitle>
                  </DialogHeader>
                  <Form {...issueForm}>
                    <form onSubmit={issueForm.handleSubmit(handleReportIssue)} className="space-y-4">
                      <FormField
                        control={issueForm.control}
                        name="material"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={issueForm.control}
                          name="defectType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Defect Type</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={issueForm.control}
                          name="severity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Severity</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Low">Low</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="High">High</SelectItem>
                                  <SelectItem value="Critical">Critical</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={issueForm.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={issueForm.control}
                          name="assignedTo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assigned To</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsReportIssueOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Report Issue</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <DataTable columns={issueColumns} data={qualityIssues} />
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quality Certificates</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded">
                  <div className="font-medium">ISO 9001:2015</div>
                  <div className="text-sm text-gray-500">Quality Management System</div>
                  <div className="text-sm text-green-600 mt-2">Valid until: Dec 2025</div>
                </div>
                <div className="p-4 border rounded">
                  <div className="font-medium">ISO 14001:2015</div>
                  <div className="text-sm text-gray-500">Environmental Management</div>
                  <div className="text-sm text-green-600 mt-2">Valid until: Mar 2026</div>
                </div>
                <div className="p-4 border rounded">
                  <div className="font-medium">OHSAS 18001</div>
                  <div className="text-sm text-gray-500">Health & Safety Management</div>
                  <div className="text-sm text-yellow-600 mt-2">Expires: Aug 2025</div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quality Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-3">Quality Trend (Last 6 Months)</h4>
                <div className="space-y-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-sm">{month}</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${94 + index}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{94 + index}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-3">Defect Categories</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Dimensional</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Surface Finish</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Material</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Assembly</span>
                    <span className="text-sm font-medium">9%</span>
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

export default QualityControl;
