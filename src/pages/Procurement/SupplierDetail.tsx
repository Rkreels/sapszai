
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Edit, Star, Phone, Mail, MapPin, Award, TrendingUp } from 'lucide-react';
import PageHeader from '../../components/page/PageHeader';
import { useVoiceAssistantContext } from '../../context/VoiceAssistantContext';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { useToast } from '../../hooks/use-toast';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface SupplierDetail {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blocked';
  rating: number;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalValue: number;
  onTimeDelivery: number;
  qualityRating: number;
  paymentTerms: string;
  certifications: string[];
  lastOrderDate: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  establishedDate: string;
  website: string;
  taxId: string;
}

const SupplierDetail: React.FC = () => {
  const navigate = useNavigate();
  const { supplierId } = useParams();
  const { isEnabled } = useVoiceAssistantContext();
  const { speak } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('overview');
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isEnabled) {
      speak('Welcome to Supplier Detail view. Here you can see comprehensive information about the selected supplier.');
    }
  }, [isEnabled, speak]);

  useEffect(() => {
    // Mock supplier data - in real app, fetch based on supplierId
    const mockSupplier: SupplierDetail = {
      id: supplierId || 'sup-001',
      name: 'Dell Technologies',
      category: 'Technology',
      status: 'Active',
      rating: 4.5,
      contactPerson: 'John Anderson',
      email: 'john.anderson@dell.com',
      phone: '+1-555-0123',
      address: '1 Dell Way, Round Rock, TX 78682, USA',
      totalOrders: 45,
      totalValue: 275000,
      onTimeDelivery: 95,
      qualityRating: 4.7,
      paymentTerms: 'Net 30',
      certifications: ['ISO 9001', 'ISO 14001', 'SOC 2'],
      lastOrderDate: '2025-01-23',
      riskLevel: 'Low',
      establishedDate: '1984-05-03',
      website: 'https://www.dell.com',
      taxId: '13-2658044'
    };
    setSupplier(mockSupplier);
  }, [supplierId]);

  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Blocked': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800'
    };
    return colors[risk as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const performanceData = [
    { month: 'Jan', orders: 8, value: 45000, onTime: 94 },
    { month: 'Feb', orders: 6, value: 38000, onTime: 96 },
    { month: 'Mar', orders: 7, value: 42000, onTime: 95 },
    { month: 'Apr', orders: 9, value: 52000, onTime: 97 },
    { month: 'May', orders: 8, value: 48000, onTime: 93 },
    { month: 'Jun', orders: 7, value: 50000, onTime: 98 }
  ];

  if (!supplier) {
    return <div>Loading supplier details...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate('/procurement/supplier-management')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <PageHeader
          title={supplier.name}
          description={`Detailed view of supplier ${supplier.name}`}
          voiceIntroduction={`Welcome to the detailed view of supplier ${supplier.name}.`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              {supplier.rating.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Overall Rating</div>
            <div className="text-sm text-green-600">Excellent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{supplier.totalOrders}</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
            <div className="text-sm text-blue-600">Lifetime</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">${supplier.totalValue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-sm text-purple-600">Spent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{supplier.onTimeDelivery}%</div>
            <div className="text-sm text-muted-foreground">On-Time Delivery</div>
            <div className="text-sm text-green-600">Reliable</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Basic Information
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={getStatusColor(supplier.status)}>
                    {supplier.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{supplier.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <Badge className={getRiskColor(supplier.riskLevel)}>
                    {supplier.riskLevel}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Terms:</span>
                  <span>{supplier.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Established:</span>
                  <span>{new Date(supplier.establishedDate).getFullYear()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax ID:</span>
                  <span>{supplier.taxId}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span>{supplier.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-muted-foreground">Website:</span>
                  <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {supplier.website}
                  </a>
                </div>
                <div>
                  <span className="text-muted-foreground">Primary Contact:</span>
                  <div className="font-medium">{supplier.contactPerson}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Certifications & Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {supplier.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Volume Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                    <Bar dataKey="value" fill="#82ca9d" name="Value ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>On-Time Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="onTime" stroke="#8884d8" name="On-Time %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded">
                  <div className="text-2xl font-bold text-green-600">{supplier.qualityRating.toFixed(1)}/5</div>
                  <div className="text-sm text-muted-foreground">Quality Rating</div>
                </div>
                <div className="p-4 border rounded">
                  <div className="text-2xl font-bold text-blue-600">{supplier.onTimeDelivery}%</div>
                  <div className="text-sm text-muted-foreground">On-Time Delivery</div>
                </div>
                <div className="p-4 border rounded">
                  <div className="text-2xl font-bold text-purple-600">{supplier.rating.toFixed(1)}/5</div>
                  <div className="text-sm text-muted-foreground">Overall Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                  <div key={order} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">PO-2025-00{order}</h4>
                        <p className="text-sm text-muted-foreground">Office Equipment Order</p>
                        <p className="text-sm">Amount: $15,250 | Date: 2025-01-{20 + order}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Business License', 'Tax Certificate', 'Insurance Certificate', 'Quality Certification'].map((doc) => (
                  <div key={doc} className="flex justify-between items-center p-3 border rounded">
                    <span>{doc}</span>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierDetail;
