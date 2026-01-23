import { FileText, Award } from "lucide-react";

interface Asset {
  id: string;
  title: string;
  number: string;
  type: "patent" | "trademark";
  jurisdiction: string;
  relevance: number;
}

export function RecommendedAssets() {
  const assets: Asset[] = [
    {
      id: "1",
      title: "Machine Learning Algorithm for Data Processing",
      number: "US-2024-012345",
      type: "patent",
      jurisdiction: "US",
      relevance: 95,
    },
    {
      id: "2",
      title: "TechFlow Brand",
      number: "TM-EU-2024-567",
      type: "trademark",
      jurisdiction: "EU",
      relevance: 92,
    },
    {
      id: "3",
      title: "Quantum Computing Architecture",
      number: "CN-2024-987654",
      type: "patent",
      jurisdiction: "CN",
      relevance: 88,
    },
    {
      id: "4",
      title: "InnovateLogo",
      number: "TM-JP-2024-321",
      type: "trademark",
      jurisdiction: "JP",
      relevance: 85,
    },
  ];

  return (
    <div className="p-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
      <div className="mb-6">
        <h3 className="text-2xl text-slate-900 mb-2">Recommended IP Assets</h3>
        <p className="text-slate-600">Based on your interests and activity</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {assets.map((asset, index) => (
          <div
            key={asset.id}
            className="group relative p-5 bg-white/50 backdrop-blur-sm rounded-xl border border-blue-200/40 hover:border-blue-400/60 transition-all hover:transform hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Gradient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-sky-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-sky-500/10 transition-all duration-500"></div>
            
            {/* Neon edge */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  asset.type === "patent" 
                    ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30" 
                    : "bg-gradient-to-r from-blue-500/30 to-sky-500/30"
                }`}>
                  {asset.type === "patent" ? (
                    <FileText className="w-5 h-5 text-cyan-700" />
                  ) : (
                    <Award className="w-5 h-5 text-blue-700" />
                  )}
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs ${
                  asset.type === "patent"
                    ? "bg-cyan-500/30 text-cyan-800 border border-cyan-500/40"
                    : "bg-blue-500/30 text-blue-800 border border-blue-500/40"
                }`}>
                  {asset.type === "patent" ? "Patent" : "Trademark"}
                </div>
              </div>

              {/* Content */}
              <h4 className="text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-900 transition-colors">
                {asset.title}
              </h4>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{asset.number}</span>
                <span className="text-slate-500">{asset.jurisdiction}</span>
              </div>

              {/* Relevance bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500 text-xs">Relevance</span>
                  <span className="text-cyan-700 text-xs">{asset.relevance}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${asset.relevance}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}