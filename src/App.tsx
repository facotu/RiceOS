// RiceOS Main Application Entry Point
// File: src/App.tsx

import React, { useState, useEffect, useCallback } from "react";
import { db, seedDatabaseIfEmpty, LocalFarmer, LocalOfficer, LocalTruck, LocalVariety, LocalReceipt, LocalSetting } from "./db/index.ts";
import HeaderNavigation from "./app/portal/components/HeaderNavigation.tsx";
import DashboardModule from "./features/modules/DashboardModule.tsx";
import WeighingSessionModule from "./features/modules/WeighingSessionModule.tsx";
import SettlementModule from "./features/modules/SettlementModule.tsx";
import TrucksModule from "./features/modules/TrucksModule.tsx";
import HistoryModule from "./features/modules/HistoryModule.tsx";
import ReportsModule from "./features/modules/ReportsModule.tsx";
import MasterDataModule from "./features/modules/MasterDataModule.tsx";
import AICameraModule from "./features/modules/AICameraModule.tsx";
import SettingsModule from "./features/modules/SettingsModule.tsx";
import AuthModule from "./features/modules/AuthModule.tsx";

export default function App() {
  // 1. STATE QUẢN LÝ ĐĂNG NHẬP
  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    const saved = localStorage.getItem("riceos_user_session");
    return saved ? JSON.parse(saved) : {
      id: "off-admin",
      full_name: "Phạm Tuân (Quản trị viên)",
      phone_number: "0905444444",
      role: "admin"
    };
  });

  // 2. STATE ĐIỀU HƯỚNG MÀN HÌNH TẠI MENU NGANG TOP BAR
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // 3. DỮ LIỆU TỪ INDEXEDDB
  const [farmers, setFarmers] = useState<LocalFarmer[]>([]);
  const [officers, setOfficers] = useState<LocalOfficer[]>([]);
  const [trucks, setTrucks] = useState<LocalTruck[]>([]);
  const [varieties, setVarieties] = useState<LocalVariety[]>([]);
  const [receipts, setReceipts] = useState<LocalReceipt[]>([]);
  
  // Cài đặt trừ bì
  const [tareType, setTareType] = useState<'kg' | 'percent'>('percent');
  const [defaultTareValue, setDefaultTareValue] = useState<number>(1.0);

  // NẠP DỮ LIỆU TỪ DB
  const loadData = useCallback(async () => {
    await seedDatabaseIfEmpty();
    
    const fList = await db.farmers.toArray();
    const oList = await db.officers.toArray();
    const tList = await db.trucks.toArray();
    const vList = await db.rice_varieties.toArray();
    const rList = await db.weighing_receipts.orderBy("created_at").reverse().toArray();

    setFarmers(fList);
    setOfficers(oList);
    setTrucks(tList);
    setVarieties(vList);
    setReceipts(rList);

    // Cài đặt
    const setting = await db.settings.get("global-settings");
    if (setting) {
      setTareType(setting.tare_type || 'percent');
      setDefaultTareValue(setting.default_tare_value || 1.0);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // HÀNH ĐỘNG ĐĂNG NHẬP SANG TÀI KHOẢN MỚI
  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem("riceos_user_session", JSON.stringify(user));
  };

  // ĐĂNG XUẤT
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("riceos_user_session");
  };

  // LƯU PHIẾU CÂN MỚI
  const handleSaveReceipt = async (newReceipt: LocalReceipt) => {
    await db.weighing_receipts.add(newReceipt);
    await loadData();
  };

  // CHỐT QUYẾT TOÁN HỘ DÂN
  const handleSettleFarmer = async (farmerId: string) => {
    const list = receipts.filter(r => r.farmer_id === farmerId);
    for (const r of list) {
      await db.weighing_receipts.update(r.id, { status: "settled" });
    }
    await loadData();
  };

  // RENDER NẾU CHƯA ĐĂNG NHẬP
  if (!currentUser) {
    return <AuthModule onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* 1. TOP MENU NGANG HIỂN THỊ THÔNG TIN ĐĂNG NHẬP & CHUYỂN TAB */}
      <HeaderNavigation 
        user={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* 2. NỘI DUNG HIỂN THỊ THEO TAB ĐƯỢC CHỌN */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === "dashboard" && (
          <DashboardModule 
            receipts={receipts}
            varieties={varieties}
            officers={officers}
            trucks={trucks}
            currentUser={currentUser}
          />
        )}

        {activeTab === "weighing" && (
          <WeighingSessionModule 
            farmers={farmers}
            officers={officers}
            trucks={trucks}
            varieties={varieties}
            currentUser={currentUser}
            onSaveReceipt={handleSaveReceipt}
            tareType={tareType}
            defaultTareValue={defaultTareValue}
          />
        )}

        {activeTab === "settlement" && (
          <SettlementModule 
            farmers={farmers}
            receipts={receipts}
            onSettleFarmer={handleSettleFarmer}
          />
        )}

        {activeTab === "trucks" && (
          <TrucksModule 
            trucks={trucks}
            receipts={receipts}
          />
        )}

        {activeTab === "history" && (
          <HistoryModule 
            receipts={receipts}
            farmers={farmers}
          />
        )}

        {activeTab === "reports" && (
          <ReportsModule 
            receipts={receipts}
            farmers={farmers}
            officers={officers}
            trucks={trucks}
          />
        )}

        {activeTab === "master" && (
          <MasterDataModule 
            farmers={farmers}
            officers={officers}
            trucks={trucks}
            varieties={varieties}
            refreshData={loadData}
          />
        )}

        {activeTab === "aicamera" && (
          <AICameraModule />
        )}

        {activeTab === "settings" && (
          <SettingsModule 
            tareType={tareType}
            setTareType={setTareType}
            defaultTareValue={defaultTareValue}
            setDefaultTareValue={setDefaultTareValue}
            varieties={varieties}
            refreshData={loadData}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 text-center py-4 text-xs text-slate-500">
        <p>RiceOS ERP System © 2026 Phạm Tuân. HTX Nông Nghiệp Hòa Tiến 2 - Đà Nẵng.</p>
      </footer>
    </div>
  );
}
