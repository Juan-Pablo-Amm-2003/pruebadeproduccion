import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { formatNumber } from '../utils/formatter';

interface SummaryCardsProps {
  insertados: number;
  actualizados: number;
  totalTareas: number;
  tareasCompletadas: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  insertados,
  actualizados,
  totalTareas,
  tareasCompletadas,
}) => {
  const cards = [
    {
      title: 'Tareas Insertadas',
      value: insertados,
      icon: TrendingUp,
      bg: 'bg-green-50',
      iconBg: 'bg-green-600',
      text: 'text-green-700',
    },
    {
      title: 'Tareas Actualizadas',
      value: actualizados,
      icon: BarChart3,
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-600',
      text: 'text-blue-700',
    },
    {
      title: 'Total de Tareas',
      value: totalTareas,
      icon: Clock,
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-600',
      text: 'text-purple-700',
    },
    {
      title: 'Tareas Completadas',
      value: tareasCompletadas,
      icon: CheckCircle,
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-600',
      text: 'text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.bg} border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{card.title}</p>
              <p className={`text-3xl font-bold mt-1 ${card.text}`}>{formatNumber(card.value)}</p>
            </div>
            <div className={`${card.iconBg} p-3 rounded-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
