import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 text-center">
      <div className="space-y-8">
        <div>
          <h1 className="text-6xl md:text-7xl text-blue-900 max-w-4xl mx-auto leading-tight">
            Global IP Intelligence Platform
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
          Search. Track. Visualize global patents & trademarks.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            to="/register"
            className="group px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/login"
            className="px-10 py-4 bg-white hover:bg-slate-50 text-blue-600 rounded-lg border border-slate-300 transition-all shadow-md hover:shadow-lg"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
