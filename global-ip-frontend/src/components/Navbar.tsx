import { Globe } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="w-full px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="text-blue-900 text-xl">
            IPIntel
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-700 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <a href="#features" className="text-slate-700 hover:text-blue-600 transition-colors">
            Features
          </a>
          <Link to="/login" className="text-slate-700 hover:text-blue-600 transition-colors">
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
