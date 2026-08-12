'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, Wifi, WifiOff, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SyncStatusBadge() {
  const { notifications } = useApp();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
    }, 1200);
  };

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-xs">
      <div className="flex items-center gap-2">
        {isOnline ? (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        ) : (
          <span className="h-2.5 w-2.5 rounded-full bg-gold-500"></span>
        )}

        <div className="flex flex-col">
          <span className="font-bold text-slate-200 flex items-center gap-1">
            {isOnline ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-400" /> Supabase Cloud Sync
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-gold-400" /> Ngoại Tuyến (Offline)
              </>
            )}
          </span>
          <span className="text-[10px] text-slate-400">
            {isOnline ? `Đồng bộ lúc ${lastSyncTime}` : 'Đang lưu LocalStorage ngoài ruộng'}
          </span>
        </div>
      </div>

      <button
        onClick={handleManualSync}
        disabled={isSyncing}
        className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 border border-emerald-700/50 transition-all"
        title="Đồng bộ lại"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-gold-400' : ''}`} />
      </button>
    </div>
  );
}
