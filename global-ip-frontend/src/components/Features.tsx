import { Search, FileText, BarChart3 } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Search,
      title: "Global IP Search",
      description: "Search millions of patents and trademarks across 100+ jurisdictions instantly.",
    },
    {
      icon: FileText,
      title: "Filing Tracker",
      description: "Monitor and track IP filings in real-time with automated alerts and updates.",
    },
    {
      icon: BarChart3,
      title: "Legal Status Dashboard",
      description: "Visualize legal status, prosecution history, and competitive intelligence.",
    }
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="p-8 bg-white hover:bg-blue-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all shadow-md hover:shadow-lg"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
                <Icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-2xl text-blue-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
