
import { Card, CardContent } from "@/components/ui/card";

interface Vendor {
  name: string;
  description: string;
  logo: string;
}

interface VendorHeaderProps {
  vendor: Vendor;
}

const VendorHeader = ({ vendor }: VendorHeaderProps) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img 
              src={vendor.logo} 
              alt={vendor.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
            <p className="text-gray-600">{vendor.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorHeader;
