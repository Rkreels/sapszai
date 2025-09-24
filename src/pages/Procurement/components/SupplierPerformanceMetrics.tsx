
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { TrendingUp, Calendar, DollarSign, Activity } from 'lucide-react';

interface SupplierPerformanceMetricsProps {
  totalSpend: string;
  lastOrder: string;
}

const SupplierPerformanceMetrics: React.FC<SupplierPerformanceMetricsProps> = ({
  totalSpend,
  lastOrder
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 border rounded">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-lg font-bold">4.8</div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </div>
          <div className="text-center p-3 border rounded">
            <Activity className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-lg font-bold">95%</div>
            <div className="text-sm text-muted-foreground">On-Time</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">Total Spend</div>
            <div className="font-medium">{totalSpend}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-muted-foreground">Last Order</div>
            <div className="font-medium">{lastOrder}</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Quality Score</span>
            <span>98%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierPerformanceMetrics;
