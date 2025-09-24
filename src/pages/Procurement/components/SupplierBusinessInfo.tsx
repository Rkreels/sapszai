
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { User, Building, CreditCard, Truck, DollarSign, Edit } from 'lucide-react';

interface SupplierBusinessInfoProps {
  contactPerson: string;
  category: string;
  paymentTerms: string;
  deliveryTerm: string;
  currency: string;
  onEdit?: () => void;
}

const SupplierBusinessInfo: React.FC<SupplierBusinessInfoProps> = ({
  contactPerson,
  category,
  paymentTerms,
  deliveryTerm,
  currency,
  onEdit
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Business Information
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">Contact Person</div>
            <div className="font-medium">{contactPerson}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Building className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">Category</div>
            <Badge variant="outline">{category}</Badge>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">Payment Terms</div>
            <div className="font-medium">{paymentTerms}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">Delivery Terms</div>
            <div className="font-medium">{deliveryTerm}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">Currency</div>
            <div className="font-medium">{currency}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierBusinessInfo;
