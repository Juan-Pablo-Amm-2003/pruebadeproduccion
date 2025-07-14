import React from 'react';

interface EmptyChartMessageProps {
  title: string;
  message: string;
}

export const EmptyChartMessage: React.FC<EmptyChartMessageProps> = ({ title, message }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8 text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};
