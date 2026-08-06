// Timeline display for recent activity logs
// File: src/features/dashboard/components/RecentActivity.tsx

import React from "react";
import { ActivityLog } from "../repository/dashboardRepository.ts";
import { Clock } from "lucide-react";

interface RecentActivityProps {
  activities: ActivityLog[];
  isLoading?: boolean;
}

export default function RecentActivity({ activities, isLoading = false }: RecentActivityProps) {
  if (isLoading) {
    return (
      <div className="space-y-3.5 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center py-2.5">
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-gray-400 font-semibold">
        Không có hoạt động nào được ghi nhận gần đây.
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {activities.map((act) => (
        <div key={act.id} className="flex justify-between items-start text-xs border-b border-gray-50 pb-2.5 last:border-b-0 last:pb-0">
          <div className="space-y-1 pr-4">
            <div className="font-bold text-gray-700 leading-relaxed">{act.message}</div>
            <div className="text-gray-400 flex items-center space-x-1 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{act.time}</span>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-extrabold rounded-md flex-shrink-0">
            {act.status}
          </span>
        </div>
      ))}
    </div>
  );
}
