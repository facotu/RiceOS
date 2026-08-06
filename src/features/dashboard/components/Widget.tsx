// Reusable Widget container abstraction
// File: src/features/dashboard/components/Widget.tsx

import React from "react";

interface WidgetProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Widget({ title, action, children, className = "" }: WidgetProps) {
  return (
    <div className={`bg-white p-5 rounded-2xl shadow-premium border border-gray-100 flex flex-col space-y-4 ${className}`}>
      {/* HEADER WIDGET */}
      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
        <h3 className="text-base font-bold text-gray-800 tracking-tight">{title}</h3>
        {action && <div>{action}</div>}
      </div>

      {/* CONTENT */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
