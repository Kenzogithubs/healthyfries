import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-amber-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/lovable-uploads/1d59b177-a3d7-4452-93f5-ca99363790e4.png"
                alt="Healthy Fries"
                className="h-8 w-8"
              />
              <h3 className="text-xl font-bold text-amber-600">Healthy Fries</h3>
            </div>
            <p className="text-sm text-amber-800">
              Your trusted source for honest reviews on supplements, nutrition, and healthy living.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-amber-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-amber-700 hover:text-amber-500 transition-colors">Home</Link></li>
              <li><Link to="/review" className="text-amber-700 hover:text-amber-500 transition-colors">Review</Link></li>
              <li><Link to="/faq" className="text-amber-700 hover:text-amber-500 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-amber-800 mb-4">Newsletter</h4>
            <p className="text-sm text-amber-800 mb-4">
              Subscribe to receive our latest reviews and updates directly in your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-amber-200 mt-8 pt-8 text-sm text-center text-amber-700">
          <p>&copy; {new Date().getFullYear()} Healthy Fries. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
