import { TrendingUp, Calendar, Building2, FileText } from 'lucide-react';
import { FilingSummary } from '../../services/competitorAPI';

interface FilingSummaryCardsProps {
  summary: FilingSummary | null;
  isLoading: boolean;
}

export function FilingSummaryCards({ summary, isLoading }: FilingSummaryCardsProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const cards = [
    {
      icon: FileText,
      label: 'Total Filings',
      value: summary?.totalFilings?.toLocaleString() || '0',
      color: 'blue',
    },
    {
      icon: Building2,
      label: 'Competitors Tracked',
      value: summary?.competitorsTracked?.toString() || '0',
      color: 'purple',
    },
    {
      icon: Calendar,
      label: 'Oldest Filing',
      value: formatDate(summary?.oldestFilingDate),
      color: 'green',
    },
    {
      icon: TrendingUp,
      label: 'Latest Filing',
      value: formatDate(summary?.latestFilingDate),
      color: 'orange',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-lg bg-${card.color}-100`}
            >
              <card.icon className={`w-6 h-6 text-${card.color}-600`} />
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3"></div>
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {card.value}
              </div>
              <div className="text-sm text-slate-600">{card.label}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
