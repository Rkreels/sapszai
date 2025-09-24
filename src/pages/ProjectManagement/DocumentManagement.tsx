
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, FileText, Folder, Upload, Download, Share2, Lock } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import DataTable from '../../components/data/DataTable';

const projectDocuments = [
  { 
    id: 'DOC-001', 
    name: 'Project Charter', 
    type: 'PDF', 
    size: '2.1 MB', 
    project: 'ERP Implementation',
    lastModified: '2025-05-25',
    version: '2.1',
    status: 'Approved'
  },
  { 
    id: 'DOC-002', 
    name: 'Technical Specification', 
    type: 'DOCX', 
    size: '5.8 MB', 
    project: 'Website Redesign',
    lastModified: '2025-05-30',
    version: '1.3',
    status: 'Draft'
  },
  { 
    id: 'DOC-003', 
    name: 'Test Plan', 
    type: 'XLSX', 
    size: '1.2 MB', 
    project: 'Mobile App',
    lastModified: '2025-05-28',
    version: '1.0',
    status: 'Review'
  },
];

const documentFolders = [
  { name: 'Project Plans', documents: 12, size: '25.6 MB', lastAccess: '2025-05-30' },
  { name: 'Technical Docs', documents: 18, size: '45.2 MB', lastAccess: '2025-05-29' },
  { name: 'Legal Documents', documents: 8, size: '12.3 MB', lastAccess: '2025-05-25' },
  { name: 'Meeting Minutes', documents: 24, size: '8.9 MB', lastAccess: '2025-05-31' },
];

const DocumentManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('documents');

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Document Management. Here you can organize, version control, share, and manage all project documents in a centralized repository.');
    }
  }, [isEnabled, speak]);

  const documentColumns = [
    { 
      key: 'name', 
      header: 'Document Name',
      render: (value: string, row: any) => (
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-blue-600" />
          <span className="text-blue-600 underline cursor-pointer">{value}</span>
        </div>
      )
    },
    { key: 'type', header: 'Type' },
    { key: 'size', header: 'Size' },
    { key: 'project', header: 'Project' },
    { key: 'version', header: 'Version' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value: string) => (
        <Badge variant={
          value === 'Approved' ? 'default' : 
          value === 'Review' ? 'secondary' : 'outline'
        }>
          {value}
        </Badge>
      )
    },
    { key: 'lastModified', header: 'Last Modified' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm"><Download className="h-3 w-3" /></Button>
          <Button variant="ghost" size="sm"><Share2 className="h-3 w-3" /></Button>
        </div>
      )
    }
  ];

  const folderColumns = [
    { 
      key: 'name', 
      header: 'Folder Name',
      render: (value: string) => (
        <div className="flex items-center">
          <Folder className="h-4 w-4 mr-2 text-yellow-600" />
          <span className="text-blue-600 underline cursor-pointer">{value}</span>
        </div>
      )
    },
    { key: 'documents', header: 'Documents' },
    { key: 'size', header: 'Total Size' },
    { key: 'lastAccess', header: 'Last Access' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => <Button variant="outline" size="sm">Open</Button>
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
          title="Document Management"
          description="Organize, version control, and manage project documents"
          voiceIntroduction="Welcome to Document Management."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold">247</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Folder className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Folders</p>
              <p className="text-2xl font-bold">18</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Upload className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Recent Uploads</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Lock className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Restricted Access</p>
              <p className="text-2xl font-bold">34</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="versions">Version Control</TabsTrigger>
          <TabsTrigger value="sharing">Sharing & Access</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Project Documents</h3>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button>Create Document</Button>
              </div>
            </div>
            <DataTable 
              columns={documentColumns}
              data={projectDocuments}
              className="border rounded-md"
            />
          </Card>
        </TabsContent>

        <TabsContent value="folders" className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Document Folders</h3>
              <Button>
                <Folder className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </div>
            <DataTable 
              columns={folderColumns}
              data={documentFolders}
              className="border rounded-md"
            />
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Version Control</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Project Charter - Version History</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <span className="font-medium">Version 2.1</span>
                      <span className="text-sm text-gray-600 ml-2">(Current)</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>John Smith • 2025-05-25</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <span className="font-medium">Version 2.0</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>Emma Wilson • 2025-05-20</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Version 1.0</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>John Smith • 2025-01-15</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Version Control Features</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Automatic version tracking</li>
                    <li>• Compare document versions</li>
                    <li>• Rollback to previous versions</li>
                    <li>• Change history tracking</li>
                    <li>• Comment and approval workflow</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Recent Changes</h4>
                  <div className="text-sm space-y-2">
                    <p>• Project scope updated in charter</p>
                    <p>• Technical requirements revised</p>
                    <p>• Budget allocation modified</p>
                    <p>• Timeline milestones adjusted</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sharing" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Document Sharing & Access Control</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Access Permissions</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Project Managers</span>
                    <Badge>Full Access</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Team Members</span>
                    <Badge variant="secondary">Read/Write</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stakeholders</span>
                    <Badge variant="outline">Read Only</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>External Consultants</span>
                    <Badge variant="outline">Limited Access</Badge>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Shared Documents</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Project Charter</span>
                    <div className="flex items-center">
                      <Share2 className="h-3 w-3 mr-1" />
                      <span className="text-xs text-gray-600">8 users</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Technical Spec</span>
                    <div className="flex items-center">
                      <Share2 className="h-3 w-3 mr-1" />
                      <span className="text-xs text-gray-600">5 users</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Meeting Minutes</span>
                    <div className="flex items-center">
                      <Share2 className="h-3 w-3 mr-1" />
                      <span className="text-xs text-gray-600">12 users</span>
                    </div>
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

export default DocumentManagement;
