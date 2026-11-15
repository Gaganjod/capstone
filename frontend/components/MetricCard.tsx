import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
}

export default function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow">
      <h3 className="text-sm font-medium text-gray-400 capitalize mb-1">{title}</h3>
      <p className="text-xl font-semibold text-indigo-300">{value}</p>
    </div>
  );
}
