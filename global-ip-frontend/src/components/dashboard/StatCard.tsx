import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, gradient, delay = 0 }: StatCardProps) {
  return (
    <div
      className="p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-lg shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="text-4xl text-blue-900 mb-2">
        {value}
      </div>
      
      <div className="text-slate-600">
        {title}
      </div>
    </div>
  );
}
