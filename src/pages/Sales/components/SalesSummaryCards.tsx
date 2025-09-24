
import React from 'react';
import { Skeleton } from '../../../components/ui/skeleton';

interface SalesSummaryCardProps {
  isLoading: boolean;
}

const SalesSummaryCards: React.FC<SalesSummaryCardProps> = ({ isLoading }) => {
  return (
    <>
      <div>
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div>
            <div className="text-3xl font-semibold mb-2">€3.2M</div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-medium text-sm">↑ 12.5%</span>
              <span className="text-xs text-gray-500">vs last quarter</span>
            </div>
            <div className="mt-2 pt-2 border-t text-xs text-blue-600 cursor-pointer">
              View sales report
            </div>
          </div>
        )}
      </div>

      <div>
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div>
            <div className="text-3xl font-semibold mb-2">842</div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-medium text-sm">↑ 5.2%</span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
            <div className="mt-2 pt-2 border-t text-xs text-blue-600 cursor-pointer">
              View customer list
            </div>
          </div>
        )}
      </div>

      <div>
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div>
            <div className="text-3xl font-semibold mb-2">€12,450</div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-medium text-sm">↓ 2.3%</span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
            <div className="mt-2 pt-2 border-t text-xs text-blue-600 cursor-pointer">
              View order analytics
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SalesSummaryCards;
