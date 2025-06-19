
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Link, 
  Copy, 
  Edit, 
  BarChart3,
  Settings,
  Share,
  Eye,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface LinkManagementProps {
  onBack: () => void;
}

const LinkManagement = ({ onBack }: LinkManagementProps) => {
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [utmParams, setUtmParams] = useState({
    source: '',
    medium: '',
    campaign: '',
    content: ''
  });

  // Mock link data
  const links = [
    {
      id: 1,
      type: 'Single Product',
      name: 'Wireless Bluetooth Headphones',
      baseUrl: 'quickvendor.com/p/vendor123/wireless-headphones',
      fullUrl: 'quickvendor.com/p/vendor123/wireless-headphones?utm_source=instagram&utm_medium=social&utm_campaign=summer_sale',
      views: 1250,
      clicks: 89,
      ctr: '7.1%',
      status: 'active'
    },
    {
      id: 2,
      type: 'Collection',
      name: 'Electronics Collection',
      baseUrl: 'quickvendor.com/c/vendor123/electronics-collection',
      fullUrl: 'quickvendor.com/c/vendor123/electronics-collection',
      views: 2140,
      clicks: 156,
      ctr: '7.3%',
      status: 'active'
    },
    {
      id: 3,
      type: 'Single Product',
      name: 'Smart Fitness Watch',
      baseUrl: 'quickvendor.com/p/vendor123/smart-fitness-watch',
      fullUrl: 'quickvendor.com/p/vendor123/smart-fitness-watch?utm_source=facebook&utm_medium=social',
      views: 890,
      clicks: 45,
      ctr: '5.1%',
      status: 'active'
    },
    {
      id: 4,
      type: 'Collection',
      name: 'Beauty Collection',
      baseUrl: 'quickvendor.com/c/vendor123/beauty-collection',
      fullUrl: 'quickvendor.com/c/vendor123/beauty-collection',
      views: 723,
      clicks: 34,
      ctr: '4.7%',
      status: 'active'
    }
  ];

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(`https://${url}`);
    toast.success('Link copied to clipboard!');
  };

  const generateUtmUrl = (baseUrl: string) => {
    const params = new URLSearchParams();
    if (utmParams.source) params.append('utm_source', utmParams.source);
    if (utmParams.medium) params.append('utm_medium', utmParams.medium);
    if (utmParams.campaign) params.append('utm_campaign', utmParams.campaign);
    if (utmParams.content) params.append('utm_content', utmParams.content);
    
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  const socialPlatforms = [
    { name: 'Instagram', source: 'instagram', medium: 'social' },
    { name: 'Facebook', source: 'facebook', medium: 'social' },
    { name: 'TikTok', source: 'tiktok', medium: 'social' },
    { name: 'Twitter', source: 'twitter', medium: 'social' },
    { name: 'LinkedIn', source: 'linkedin', medium: 'social' },
    { name: 'Email', source: 'email', medium: 'email' }
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
            <h1 className="text-3xl font-bold text-gray-900">Link Management</h1>
            <p className="text-gray-600 mt-1">Manage and track your shareable URLs</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Links List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Link className="w-5 h-5" />
                <span>All Links</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => setSelectedLink(link)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={link.type === 'Collection' ? 'default' : 'secondary'}
                          className={link.type === 'Collection' ? 'bg-purple-100 text-purple-800' : ''}
                        >
                          {link.type}
                        </Badge>
                        <h3 className="font-semibold">{link.name}</h3>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {link.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      {link.fullUrl}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{link.views} views</span>
                        </span>
                        <span>CTR: {link.ctr}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyLink(link.fullUrl);
                          }}
                          className="flex items-center space-x-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <Share className="w-3 h-3" />
                          <span>Share</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <BarChart3 className="w-3 h-3" />
                          <span>Analytics</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* UTM Builder & Link Customization */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>UTM Campaign Builder</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={utmParams.source}
                  onChange={(e) => setUtmParams(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="e.g., instagram"
                />
              </div>
              
              <div>
                <Label htmlFor="medium">Medium</Label>
                <Input
                  id="medium"
                  value={utmParams.medium}
                  onChange={(e) => setUtmParams(prev => ({ ...prev, medium: e.target.value }))}
                  placeholder="e.g., social"
                />
              </div>
              
              <div>
                <Label htmlFor="campaign">Campaign</Label>
                <Input
                  id="campaign"
                  value={utmParams.campaign}
                  onChange={(e) => setUtmParams(prev => ({ ...prev, campaign: e.target.value }))}
                  placeholder="e.g., summer_sale"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Input
                  id="content"
                  value={utmParams.content}
                  onChange={(e) => setUtmParams(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="e.g., story_post"
                />
              </div>

              {selectedLink && (
                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <Label className="text-sm font-medium">Generated URL:</Label>
                  <div className="mt-2 p-2 bg-white border rounded text-xs break-all">
                    {generateUtmUrl(selectedLink.baseUrl)}
                  </div>
                  <Button
                    onClick={() => copyLink(generateUtmUrl(selectedLink.baseUrl))}
                    className="w-full mt-2"
                    size="sm"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy UTM Link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Social Sharing */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share className="w-5 h-5" />
                <span>Quick Social Share</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLink ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Generate optimized links for {selectedLink.name}
                  </p>
                  {socialPlatforms.map((platform) => (
                    <Button
                      key={platform.name}
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => {
                        const url = generateUtmUrl(selectedLink.baseUrl + `?utm_source=${platform.source}&utm_medium=${platform.medium}`);
                        copyLink(url);
                      }}
                    >
                      <span>{platform.name}</span>
                      <Copy className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  Select a link to generate social sharing URLs
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LinkManagement;
