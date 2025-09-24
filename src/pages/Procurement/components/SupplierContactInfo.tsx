
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Mail, Phone, Globe, MapPin, Edit } from 'lucide-react';

interface SupplierContactInfoProps {
  email: string;
  phone: string;
  website: string;
  address: string;
  country: string;
  onEdit?: () => void;
}

const SupplierContactInfo: React.FC<SupplierContactInfoProps> = ({
  email,
  phone,
  website,
  address,
  country,
  onEdit
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Contact Information
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="font-medium">{email}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">Phone</div>
            <div className="font-medium">{phone}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">Website</div>
            <div className="font-medium">{website}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">Address</div>
            <div className="font-medium">{address}</div>
            <div className="text-sm text-muted-foreground">{country}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierContactInfo;
