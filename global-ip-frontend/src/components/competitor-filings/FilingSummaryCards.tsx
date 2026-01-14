import { FilingSummaryDTO } from './types';
import { FileText, TrendingUp, Calendar, Users } from 'lucide-react';

interface FilingSummaryCardsProps {
  readonly summary: FilingSummaryDTO | null;
  readonly isLoading: boolean;
}

export function FilingSummaryCards({ summary, isLoading }: FilingSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-md border border-slate-200 animate-pulse">
            <div className="h-12 w-12 bg-slate-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-slate-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  if (summary.totalFilings === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-blue-800 font-medium">No filing data available yet</p>
        <p className="text-blue-600 text-sm mt-1">Click "Sync Filings" to fetch patent data for your competitors</p>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Filings',
      value: (summary?.totalFilings ?? 0).toLocaleString(),
      icon: FileText,
      color: 'blue',
    },
    {
      title: 'Competitors Tracked',
      value: (summary?.competitorsTracked ?? 0).toLocaleString(),
      icon: Users,
      color: 'green',
    },
    {
      title: 'Oldest Filing',
      value: summary?.oldestFiling ? new Date(summary.oldestFiling).toLocaleDateString() : 'N/A',
      icon: Calendar,
      color: 'orange',
    },
    {
      title: 'Newest Filing',
      value: summary?.newestFiling ? new Date(summary.newestFiling).toLocaleDateString() : 'N/A',
      icon: TrendingUp,
      color: 'purple',
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow"
        >
          <div className={`w-12 h-12 rounded-lg ${colorClasses[card.color]} flex items-center justify-center mb-4`}>
            <card.icon className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-600 mb-1">{card.title}</p>
          <p className="text-2xl font-bold text-slate-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
