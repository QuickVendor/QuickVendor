
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  TrendingUp, 
  Eye, 
  Link, 
  Layers,
  BarChart3,
  Download
} from 'lucide-react';

interface CollectionAnalyticsProps {
  onBack: () => void;
}

const CollectionAnalytics = ({ onBack }: CollectionAnalyticsProps) => {
  // Mock analytics data
  const overviewStats = [
    {
      title: 'Single Product Links',
      value: '18',
      performance: '3.2% CTR',
      icon: Link,
      color: 'text-blue-600'
    },
    {
      title: 'Collection Links',
      value: '6',
      performance: '4.8% CTR',
      icon: Layers,
      color: 'text-purple-600'
    },
    {
      title: 'Total Link Views',
      value: '8,450',
      performance: '+12.5%',
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'Average Conversion',
      value: '3.8%',
      performance: '+0.6%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const linkPerformance = [
    {
      type: 'Single Product',
      name: 'Wireless Headphones',
      url: 'quickvendor.com/p/vendor123/wireless-headphones',
      views: 1250,
      clicks: 89,
      conversions: 12,
      ctr: '7.1%',
      conversionRate: '13.5%'
    },
    {
      type: 'Collection',
      name: 'Electronics Collection',
      url: 'quickvendor.com/c/vendor123/electronics-collection',
      views: 2140,
      clicks: 156,
      conversions: 28,
      ctr: '7.3%',
      conversionRate: '17.9%'
    },
    {
      type: 'Single Product',
      name: 'Smart Watch',
      url: 'quickvendor.com/p/vendor123/smart-watch',
      views: 890,
      clicks: 45,
      conversions: 8,
      ctr: '5.1%',
      conversionRate: '17.8%'
    },
    {
      type: 'Collection',
      name: 'Beauty Collection',
      url: 'quickvendor.com/c/vendor123/beauty-collection',
      views: 723,
      clicks: 34,
      conversions: 6,
      ctr: '4.7%',
      conversionRate: '17.6%'
    }
  ];

  const socialTraffic = [
    { platform: 'Instagram', singleProduct: 45, collections: 62, total: 107 },
    { platform: 'Facebook', singleProduct: 32, collections: 48, total: 80 },
    { platform: 'TikTok', singleProduct: 28, collections: 15, total: 43 },
    { platform: 'Twitter', singleProduct: 15, collections: 8, total: 23 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Collection Analytics</h1>
            <p className="text-gray-600 mt-1">Performance metrics for products and collections</p>
          </div>
        </div>
        
        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm font-medium mt-1 ${stat.color}`}>
                    {stat.performance}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Link Performance Comparison */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Link Performance Comparison</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Views</th>
                  <th className="text-left py-3 px-4">Clicks</th>
                  <th className="text-left py-3 px-4">CTR</th>
                  <th className="text-left py-3 px-4">Conversions</th>
                  <th className="text-left py-3 px-4">Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {linkPerformance.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Badge 
                        variant={item.type === 'Collection' ? 'default' : 'secondary'}
                        className={item.type === 'Collection' ? 'bg-purple-100 text-purple-800' : ''}
                      >
                        {item.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4">{item.views.toLocaleString()}</td>
                    <td className="py-3 px-4">{item.clicks}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{item.ctr}</td>
                    <td className="py-3 px-4">{item.conversions}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">{item.conversionRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Traffic Breakdown */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Social Media Traffic by Link Type</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {socialTraffic.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{source.platform}</h4>
                  <span className="text-sm text-gray-600">{source.total} total visits</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Single Products</span>
                    </div>
                    <span className="font-semibold">{source.singleProduct}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium">Collections</span>
                    </div>
                    <span className="font-semibold">{source.collections}</span>
                  </div>
                </div>
                
                <div className="flex bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 rounded-l-full h-2" 
                    style={{ width: `${(source.singleProduct / source.total) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-purple-500 rounded-r-full h-2" 
                    style={{ width: `${(source.collections / source.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">✓ What's Working</h4>
              <ul className="space-y-2 text-sm">
                <li>• Collection links have 50% higher CTR than single products</li>
                <li>• Instagram drives most traffic to collections (62 visits)</li>
                <li>• Electronics Collection has the highest conversion rate (17.9%)</li>
                <li>• Collection links perform better on visual platforms</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">→ Opportunities</h4>
              <ul className="space-y-2 text-sm">
                <li>• Create more collections for better performance</li>
                <li>• Focus collection sharing on Instagram and Facebook</li>
                <li>• Optimize single product pages for conversion</li>
                <li>• Experiment with TikTok collection content</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionAnalytics;
