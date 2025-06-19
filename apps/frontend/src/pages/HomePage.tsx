
import { Link } from "react-router-dom";
import { Package, Users, CreditCard, BarChart3, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <header className="w-full border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-7 w-7 text-navy-600" />
            <h1 className="text-xl font-semibold tracking-tight text-navy-900">Quick Vendor</h1>
          </div>
          <Link to="/login">
            <Button variant="outline" className="border-navy-200 text-navy-700 hover:bg-navy-50">
              <LogIn className="mr-2 h-4 w-4" />
              Vendor Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-navy-900 mb-6">
            Sell Smarter with Quick Vendor
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Easily list, share, and manage your products with one link.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-navy-600 hover:bg-navy-700 text-white px-8 py-3 text-lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Core Benefits Section */}
      <section className="w-full py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Package className="h-12 w-12 text-navy-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Product Listing</h3>
              <p className="text-gray-600 text-sm">Create and organize your product catalog with ease</p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-navy-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Inventory Dashboard</h3>
              <p className="text-gray-600 text-sm">Track your products and manage inventory efficiently</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-navy-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-navy-900 mb-2">WhatsApp Checkout</h3>
              <p className="text-gray-600 text-sm">Connect with customers directly via WhatsApp</p>
            </div>
            <div className="text-center">
              <CreditCard className="h-12 w-12 text-navy-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Bank Transfer Integration</h3>
              <p className="text-gray-600 text-sm">Secure payment processing for your business</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="w-full py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-semibold tracking-tight text-navy-900 mb-8">
            Everything you need to run your business
          </h3>
          <div className="bg-gray-100 rounded-lg p-12 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-navy-900">Dashboard Preview</h4>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-navy-50 p-4 rounded">
                  <div className="text-sm text-gray-500">Total Products</div>
                  <div className="text-2xl font-semibold text-navy-900">24</div>
                </div>
                <div className="bg-navy-50 p-4 rounded">
                  <div className="text-sm text-gray-500">Orders Today</div>
                  <div className="text-2xl font-semibold text-navy-900">8</div>
                </div>
                <div className="bg-navy-50 p-4 rounded">
                  <div className="text-sm text-gray-500">Revenue</div>
                  <div className="text-2xl font-semibold text-navy-900">₦45k</div>
                </div>
              </div>
              <div className="text-center text-gray-500 text-sm">
                Manage everything from one simple dashboard
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="w-full py-16 px-6 bg-navy-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-semibold tracking-tight text-white mb-4">
            Create your vendor account now
          </h3>
          <p className="text-navy-200 mb-8 max-w-2xl mx-auto">
            It's fast, free, and designed just for small business vendors.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white text-navy-900 hover:bg-gray-100 px-8 py-3 text-lg">
              Start Selling Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-center space-x-8 text-sm text-gray-500">
          <Link to="#" className="hover:text-gray-700">Terms</Link>
          <Link to="#" className="hover:text-gray-700">Privacy</Link>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
