
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, Edit, Eye, FileText } from 'lucide-react';

interface Contract {
  id: string;
  contractNumber: string;
  supplier: string;
  title: string;
  type: 'Service' | 'Supply' | 'Framework' | 'Maintenance';
  status: 'Active' | 'Expired' | 'Pending' | 'Draft';
  endDate: string;
  value: number;
  currency: string;
  renewalOption: boolean;
}

interface ContractSummaryProps {
  contract: Contract;
  onView: (contract: Contract) => void;
  onEdit: (contract: Contract) => void;
  onRenew?: (contract: Contract) => void;
}

const ContractSummary: React.FC<ContractSummaryProps> = ({ contract, onView, onEdit, onRenew }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Expired': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Draft': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const isExpiringSoon = () => {
    const endDate = new Date(contract.endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isExpiringSoon() ? 'border-orange-200 bg-orange-50' : ''}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            <span className="text-lg">{contract.title}</span>
            <p className="text-sm text-muted-foreground font-normal">
              {contract.contractNumber} | {contract.supplier}
            </p>
          </div>
          <Badge className={getStatusColor(contract.status)}>
            {contract.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Type:</span>
            <div className="font-medium">{contract.type}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Value:</span>
            <div className="font-medium">{contract.currency} {contract.value.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-muted-foreground">End Date:</span>
            <div className={`font-medium ${isExpiringSoon() ? 'text-orange-600' : ''}`}>
              {contract.endDate}
              {isExpiringSoon() && <span className="text-xs text-orange-600 ml-1">(Expiring Soon)</span>}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Renewal Option:</span>
            <div className="font-medium">{contract.renewalOption ? 'Yes' : 'No'}</div>
          </div>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => onView(contract)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(contract)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          {contract.renewalOption && onRenew && (
            <Button size="sm" variant="outline" onClick={() => onRenew(contract)}>
              <Calendar className="h-4 w-4 mr-1" />
              Renew
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractSummary;
