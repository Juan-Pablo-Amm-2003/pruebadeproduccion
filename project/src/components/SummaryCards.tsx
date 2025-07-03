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
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Tareas Actualizadas',
      value: actualizados,
      icon: BarChart3,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Total de Tareas',
      value: totalTareas,
      icon: Clock,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Tareas Completadas',
      value: tareasCompletadas,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.bgColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className={`text-3xl font-bold ${card.textColor}`}>
                {formatNumber(card.value)}
              </p>
            </div>
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};