// Reusable KPI Card Component with loading skeletons and trends
// File: src/features/dashboard/components/KPICard.tsx

import React from "react";
import * as Icons from "lucide-react";

interface KPICardProps {
  title: string;
  value?: string;
  change?: string;
  icon: string;
  iconColorClass?: string;
  isLoading?: boolean;
}

export default function KPICard({
  title,
  value,
  change,
  icon,
  iconColorClass = "text-primary bg-primary/10",
  isLoading = false
}: KPICardProps) {
  const IconComponent = (Icons as any)[icon] || Icons.HelpCircle;

  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-premium border border-gray-100 animate-pulse flex justify-between items-center">
        <div className="space-y-2.5 flex-1">
          <div className="h-3.5 bg-gray-200 rounded w-24"></div>
          <div className="h-7 bg-gray-200 rounded w-36"></div>
          <div className="h-3 bg-gray-200 rounded w-28"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-premium border border-gray-100 flex items-center justify-between transition hover:shadow-lg">
      <div className="space-y-1">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">{title}</span>
        <span className="text-2xl font-black text-gray-900 block leading-tight">{value}</span>
        {change && (
          <span className="text-xs text-emerald-600 font-bold block mt-1">{change}</span>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorClass}`}>
        <IconComponent className="w-6 h-6" />
      </div>
    </div>
  );
}
