
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, TrendingUp, Calendar } from 'lucide-react';

interface ViewCountWidgetProps {
  productId: string;
  viewData: {
    total: number;
    last7Days: number;
    last30Days: number;
  };
}

const ViewCountWidget: React.FC<ViewCountWidgetProps> = ({ viewData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{viewData.total}</div>
          <p className="text-xs text-muted-foreground">All time views</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{viewData.last7Days}</div>
          <p className="text-xs text-muted-foreground">Recent activity</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{viewData.last30Days}</div>
          <p className="text-xs text-muted-foreground">Monthly views</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewCountWidget;
