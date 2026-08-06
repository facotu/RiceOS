// Notification Center UI widget
// File: src/features/alerts/components/NotificationCenter.tsx

import React, { useState, useEffect } from "react";
import { SystemNotification, notificationCenter } from "../../../core/notifications/notificationCenter.ts";
import { Bell, Check, EyeOff, Info, AlertTriangle, AlertCircle } from "lucide-react";

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  const loadNotifications = async () => {
    const list = await notificationCenter.getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id: string) => {
    await notificationCenter.markAsRead(id);
    await loadNotifications();
  };

  const handleHide = async (id: string) => {
    await notificationCenter.hideNotification(id);
    await loadNotifications();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-premium space-y-4">
      <div className="flex justify-between items-center border-b border-gray-50 pb-2">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight flex items-center space-x-1.5">
          <Bell className="w-4 h-4 text-primary" />
          <span>Thông báo hệ thống</span>
        </h4>
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded-full">
            {unreadCount} MỚI
          </span>
        )}
      </div>

      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-400 font-semibold">
            Không có thông báo mới nào.
          </div>
        ) : (
          notifications.map((item) => (
            <div 
              key={item.id}
              className={`p-3 rounded-xl border flex justify-between items-start space-x-2 text-xs transition ${
                item.read ? "bg-gray-50/50 border-gray-100 text-gray-500" : "bg-white border-primary/20 text-gray-800 shadow-sm font-bold"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  {item.severity === "CRITICAL" ? (
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  ) : item.severity === "WARNING" ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  ) : (
                    <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                  )}
                  <span className="font-extrabold text-[11px]">{item.title}</span>
                </div>
                <p className="text-[10px] text-gray-600 font-semibold">{item.message}</p>
                <span className="block text-[8px] text-gray-400">
                  {new Date(item.created_at).toLocaleTimeString()}
                </span>
              </div>

              <div className="flex space-x-1 shrink-0">
                {!item.read && (
                  <button
                    onClick={() => handleMarkRead(item.id)}
                    className="p-1 hover:bg-emerald-50 text-emerald-600 rounded transition"
                    title="Đánh dấu đã đọc"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleHide(item.id)}
                  className="p-1 hover:bg-gray-100 text-gray-400 rounded transition"
                  title="Ẩn thông báo"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default NotificationCenter;
