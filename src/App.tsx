import React, { useState, useEffect } from "react";
import { useAuthStore } from "./store/authStore.ts";
import { useUIStore } from "./store/uiStore.ts";
import { useOnlineStatus } from "./hooks/useOnlineStatus.ts";
import { db } from "./db/index.ts";
import { syncOfflineData } from "./services/syncService.ts";
import CreateSession from "./features/weighing/CreateSession.tsx";
import PortalLayout from "./app/portal/PortalLayout.tsx";
import { 
  Wifi, 
  WifiOff, 
  Scale, 
  Warehouse, 
  Settings, 
  Plus, 
  Check, 
  LogOut, 
  RefreshCw,
  TrendingUp,
  FileText
} from "lucide-react";

export default function App() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const isLargeFont = useUIStore((state) => state.isLargeFont);
  const isDarkMode = useUIStore((state) => state.isDarkMode);
  const toggleLargeFont = useUIStore((state) => state.toggleLargeFont);
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);

  const isOnline = useOnlineStatus();

  // Các State quản lý điều hướng tab di động
  const [activeTab, setActiveTab] = useState<'dashboard' | 'weigh' | 'sync' | 'settings'>('dashboard');

  // Form đăng nhập
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Phiếu cân mới state
  const [plate, setPlate] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("variety-om18");
  const [farmer, setFarmer] = useState("farmer-nguyena");
  const [gross, setGross] = useState("");
  const [moisture, setMoisture] = useState("14.0");
  const [trash, setTrash] = useState("1.0");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Danh sách phiếu cân local
  const [receipts, setReceipts] = useState<any[]>([]);
  const [syncQueueCount, setSyncQueueCount] = useState(0);

  // Load dữ liệu từ IndexedDB
  const loadLocalData = async () => {
    const list = await db.weighing_receipts.orderBy("created_at").reverse().toArray();
    setReceipts(list);
    const queueCount = await db.sync_queue.count();
    setSyncQueueCount(queueCount);
  };

  useEffect(() => {
    if (token) {
      loadLocalData();
    }
  }, [token, saveSuccess]);

  // Hành động Đăng nhập
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone === "0905222222" && password === "123456") {
      setAuth("dummy-token-jwt-12345", {
        id: "user-weighing-uuid-1111-2222-333333333333",
        full_name: "Nguyễn Văn Cân (Trạm cân)",
        role: "weighing_officer",
        organization_id: "org-hoatien2-uuid-1111-2222-333333333333",
        permissions: ["weighing:create", "weighing:read"],
        is_active: true
      });
      setLoginError("");
    } else if (phone === "0905333333" && password === "123456") {
      setAuth("dummy-token-jwt-12345-acc", {
        id: "user-accountant-uuid-2222-3333-444444444444",
        full_name: "Lê Minh Hương (Kế toán)",
        role: "accountant",
        organization_id: "org-hoatien2-uuid-1111-2222-333333333333",
        permissions: ["weighing:read", "settlement:create", "settlement:read", "warehouse:read", "reports:read"],
        is_active: true
      });
      setLoginError("");
    } else if (phone === "0905444444" && password === "123456") {
      setAuth("dummy-token-jwt-12345-dir", {
        id: "user-director-uuid-3333-4444-555555555555",
        full_name: "Phạm Tuân (Giám đốc HTX)",
        role: "director",
        organization_id: "org-hoatien2-uuid-1111-2222-333333333333",
        permissions: ["weighing:read", "settlement:read", "warehouse:read", "reports:read"],
        is_active: true
      });
      setLoginError("");
    } else {
      setLoginError("Số điện thoại hoặc mật khẩu không chính xác.");
    }
  };

  // Tạo phiếu cân mới
  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate || !gross) return;

    const receiptId = crypto.randomUUID();
    const receiptNumber = `PC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReceipt = {
      id: receiptId,
      receipt_number: receiptNumber,
      crop_season_id: "season-dx2026-uuid-1111-2222-333333333333",
      farmer_id: farmer,
      rice_variety_id: selectedVariety,
      weighing_officer_id: user?.id || "",
      truck_plate: plate,
      gross_weight: parseFloat(gross),
      moisture_percent: parseFloat(moisture),
      trash_percent: parseFloat(trash),
      status: "pending_warehouse" as const,
      created_at: new Date().toISOString(),
      synced: 0
    };

    // 1. Lưu vào IndexedDB local
    await db.weighing_receipts.add(newReceipt);

    // 2. Đưa vào Hàng đợi đồng bộ
    await db.sync_queue.add({
      action: "insert_receipt",
      payload: newReceipt,
      timestamp: new Date().toISOString(),
      retry_count: 0
    });

    // 3. Reset form và thử đồng bộ nếu có mạng
    setPlate("");
    setGross("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);

    if (isOnline) {
      syncOfflineData();
    }
    loadLocalData();
  };

  // Nút kích hoạt đồng bộ thủ công
  const [isSyncing, setIsSyncing] = useState(false);
  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncOfflineData();
    await loadLocalData();
    setIsSyncing(false);
  };

  // Render màn hình đăng nhập nếu chưa login
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark to-primary flex flex-col justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-premium p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary font-sans">RiceOS</h1>
            <p className="text-sm text-gray-500 mt-1">Hệ thống Quản lý Thu mua Lúa gạo Thông minh</p>
            <div className="mt-2 text-xs bg-accent-light/30 text-accent-dark px-3 py-1 rounded-full inline-block font-medium">
              HTX Hòa Tiến 2 - Trực thuộc Đà Nẵng
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại trạm cân</label>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0905222222"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu bảo mật</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                required
              />
            </div>

            {loginError && (
              <p className="text-sm text-red-600 font-medium">{loginError}</p>
            )}

            <button 
              type="submit" 
              className="w-full h-14 bg-primary hover:bg-primary-light text-white font-bold rounded-xl transition shadow-lg text-lg flex items-center justify-center"
            >
              ĐĂNG NHẬP VẬN HÀNH
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400 space-y-1">
            <p>Copyright © 2026 Phạm Tuân. All Rights Reserved.</p>
            <p className="font-bold text-gray-500">Tài khoản test (Mật khẩu chung: 123456):</p>
            <p>• Trạm cân di động: 0905222222</p>
            <p>• Kế toán (Portal): 0905333333</p>
            <p>• Giám đốc (Portal): 0905444444</p>
          </div>
        </div>
      </div>
    );
  }

  // Nếu người dùng thuộc bộ phận văn phòng (Kế toán, Giám đốc, Admin...), kết xuất giao diện Desktop Portal
  if (user && user.role !== "weighing_officer") {
    return <PortalLayout user={user as any} onLogout={logout} />;
  }

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col font-sans ${isLargeFont ? "font-size-large" : ""} ${isDarkMode ? "dark bg-gray-900 text-white" : ""}`}>
      
      {/* 1. THANH TRẠNG THÁI MẠNG (OFFLINE BADGE - TOP) */}
      <div className={`h-10 text-white flex items-center justify-between px-4 transition ${isOnline ? "bg-emerald-700" : "bg-amber-600 animate-pulse"}`}>
        <div className="flex items-center space-x-2 text-sm font-medium">
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span>{isOnline ? "Đang trực tuyến - Đã đồng bộ" : "Ngoại tuyến - Lưu trữ tạm"}</span>
        </div>
        {syncQueueCount > 0 && (
          <button 
            onClick={handleManualSync}
            disabled={isSyncing}
            className="h-7 px-3 bg-white/20 hover:bg-white/30 text-xs font-bold rounded-lg flex items-center space-x-1 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Đồng bộ ({syncQueueCount})</span>
          </button>
        )}
      </div>

      {/* HEADER ỨNG DỤNG */}
      <header className="bg-primary text-white py-4 px-4 shadow-md flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">RiceOS Trạm Cân</h2>
          <p className="text-xs text-accent-light font-medium">{user?.full_name}</p>
        </div>
        <button 
          onClick={logout}
          className="h-10 w-10 text-white/80 hover:text-white bg-white/10 rounded-full flex items-center justify-center"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* NỘI DUNG CHÍNH (THAY ĐỔI THEO TAB ACTIVE) */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            
            {/* THẺ TỔNG QUAN KPIs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-card p-4 flex flex-col justify-between">
                <span className="text-xs text-gray-500 font-medium">Lượt cân hôm nay</span>
                <span className="text-2xl font-bold text-primary mt-2">{receipts.length} xe</span>
              </div>
              <div className="bg-white rounded-2xl shadow-card p-4 flex flex-col justify-between">
                <span className="text-xs text-gray-500 font-medium">Chờ đồng bộ</span>
                <span className="text-2xl font-bold text-amber-600 mt-2">{syncQueueCount} bản ghi</span>
              </div>
            </div>

            {/* SƠ ĐỒ SILO KHO SẤY */}
            <div className="bg-white rounded-2xl shadow-card p-4 space-y-3">
              <h3 className="text-sm font-bold text-gray-700 flex items-center space-x-1.5">
                <Warehouse className="w-4 h-4 text-primary" />
                <span>Trạng thái Kho Silo HTX</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Silo Sấy Lúa A (Lúa OM18)</span>
                    <span className="text-emerald-700">75% (75/100 Tấn)</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Silo Sấy Lúa B (Lúa Đài Thơm 8)</span>
                    <span className="text-amber-600">40% (40/100 Tấn)</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "40%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* DANH SÁCH PHIẾU CÂN GẦN NHẤT */}
            <div className="bg-white rounded-2xl shadow-card p-4 space-y-3">
              <h3 className="text-sm font-bold text-gray-700">Lịch sử phiếu cân trạm</h3>
              
              {receipts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Chưa thực hiện lượt cân nào.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {receipts.map((r) => (
                    <div key={r.id} className="py-3 flex justify-between items-center">
                      <div>
                        <div className="text-sm font-bold text-gray-800">{r.receipt_number}</div>
                        <div className="text-xs text-gray-500">{r.truck_plate} | {r.rice_variety_id === "variety-om18" ? "OM18" : "Đài Thơm 8"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-primary">{r.gross_weight} kg</div>
                        <div className="flex items-center justify-end space-x-1 mt-0.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${r.synced ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                            {r.synced ? "Đã đồng bộ" : "Chờ mạng"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: LẬP PHIẾU CÂN MỚI (TẠO PHIÊN CÂN) */}
        {activeTab === 'weigh' && (
          <CreateSession 
            userId={user?.id || ""} 
            isOnline={isOnline} 
            onSaveSuccess={loadLocalData} 
          />
        )}

        {/* TAB 3: GIÁM SÁT ĐỒNG BỘ */}
        {activeTab === 'sync' && (
          <div className="bg-white rounded-2xl shadow-card p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-700">Trạng thái Hàng đợi Đồng bộ Offline</h3>
              <button 
                onClick={handleManualSync}
                disabled={isSyncing}
                className="h-10 px-3 bg-primary text-white rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>Đồng bộ ngay</span>
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex justify-between items-center text-xs">
              <div>
                <div className="font-semibold text-gray-600">Tổng phiếu chờ đồng bộ:</div>
                <div className="text-lg font-black text-gray-800 mt-0.5">{syncQueueCount} phiếu</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full font-bold ${isOnline ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                {isOnline ? "Mạng có sẵn" : "Mất kết nối"}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase">Hàng đợi đồng bộ (Sync Queue)</h4>
              {syncQueueCount === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Tất cả dữ liệu đã được đẩy lên máy chủ.</p>
              ) : (
                <div className="space-y-2">
                  <div className="border border-gray-100 rounded-xl p-3 bg-white flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-gray-800">Tạo phiếu cân: PC-TEST-0004</div>
                      <span className="text-[10px] text-amber-600 font-semibold flex items-center space-x-1 mt-0.5">
                        <span>Chờ kết nối mạng tự động gửi lại...</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CÀI ĐẶT HỆ THỐNG */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-card p-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-700">Tùy biến Cấu hình Giao diện di động</h3>
            
            <div className="divide-y divide-gray-100">
              <div className="py-3.5 flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold text-gray-800">Cỡ chữ lớn ngoài đồng</div>
                  <div className="text-xs text-gray-400">Tăng độ lớn nhãn và ô nhập để tránh lóa mắt</div>
                </div>
                <button 
                  onClick={toggleLargeFont}
                  className={`h-8 px-4 rounded-full text-xs font-bold transition ${isLargeFont ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  {isLargeFont ? "ĐÃ BẬT" : "TẮT"}
                </button>
              </div>

              <div className="py-3.5 flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold text-gray-800">Độ tương phản cao</div>
                  <div className="text-xs text-gray-400">Giao diện tối giúp tiết kiệm pin và dễ nhìn</div>
                </div>
                <button 
                  onClick={toggleDarkMode}
                  className={`h-8 px-4 rounded-full text-xs font-bold transition ${isDarkMode ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  {isDarkMode ? "ĐÃ BẬT" : "TẮT"}
                </button>
              </div>
            </div>

            <div className="pt-2 text-center text-[10px] text-gray-400 border-t border-gray-100">
              <p>RiceOS Client Version 1.0.0-PWA</p>
              <p>Hợp tác xã Hòa Tiến 2 - Đà Nẵng</p>
            </div>
          </div>
        )}

      </main>

      {/* 2. THANH ĐIỀU HƯỚNG DƯỚI CÙNG (BOTTOM NAV BAR - CHIỀU CAO 64PX CHẠM TO) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'dashboard' ? "text-primary" : "text-gray-400"}`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Trang chủ</span>
        </button>

        <button 
          onClick={() => setActiveTab('weigh')}
          className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'weigh' ? "text-primary" : "text-gray-400"}`}
        >
          <Scale className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Lập Phiếu</span>
        </button>

        <button 
          onClick={() => setActiveTab('sync')}
          className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'sync' ? "text-primary" : "text-gray-400"}`}
        >
          <div className="relative">
            <RefreshCw className="w-5 h-5" />
            {syncQueueCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[8px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                {syncQueueCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1">Đồng bộ</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center flex-1 h-full ${activeTab === 'settings' ? "text-primary" : "text-gray-400"}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Cài đặt</span>
        </button>
      </nav>

    </div>
  );
}
