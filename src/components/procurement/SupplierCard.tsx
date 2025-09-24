
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Star, Edit, Eye, TrendingUp, Award } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Blocked';
  rating: number;
  contactPerson: string;
  totalValue: number;
  onTimeDelivery: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  certifications: string[];
}

interface SupplierCardProps {
  supplier: Supplier;
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onPerformance: (supplier: Supplier) => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onView, onEdit, onPerformance }) => {
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{supplier.name}</span>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{supplier.rating.toFixed(1)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge className={getStatusColor(supplier.status)}>
            {supplier.status}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Category:</span>
          <span className="text-sm">{supplier.category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Total Value:</span>
          <span className="text-sm font-medium">${supplier.totalValue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">On-Time:</span>
          <span className="text-sm">{supplier.onTimeDelivery}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Risk Level:</span>
          <Badge className={getRiskColor(supplier.riskLevel)}>
            {supplier.riskLevel}
          </Badge>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Certifications:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {supplier.certifications.slice(0, 2).map((cert, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Award className="h-3 w-3 mr-1" />
                {cert}
              </Badge>
            ))}
            {supplier.certifications.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{supplier.certifications.length - 2} more
              </Badge>
            )}
          </div>
        </div>
        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => onView(supplier)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(supplier)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => onPerformance(supplier)}>
            <TrendingUp className="h-4 w-4 mr-1" />
            Performance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierCard;
