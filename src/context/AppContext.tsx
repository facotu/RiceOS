'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Profile,
  Farmer,
  StaffMember,
  Truck,
  RiceVariety,
  GrowingArea,
  WeighingSession,
  WeighingItem,
  Settlement,
  AppNotification,
  UserRole
} from '@/types/database.types';

import {
  INITIAL_PROFILES,
  INITIAL_FARMERS,
  INITIAL_STAFF,
  INITIAL_TRUCKS,
  INITIAL_VARIETIES,
  INITIAL_GROWING_AREAS,
  INITIAL_SESSIONS,
  INITIAL_SETTLEMENTS
} from '@/lib/mockData';

interface AppContextType {
  currentUser: Profile | null;
  setCurrentUser: (user: Profile | null) => void;
  switchRole: (role: UserRole) => void;

  profiles: Profile[];
  farmers: Farmer[];
  staffMembers: StaffMember[];
  trucks: Truck[];
  varieties: RiceVariety[];
  growingAreas: GrowingArea[];
  sessions: WeighingSession[];
  settlements: Settlement[];
  notifications: AppNotification[];

  // Admin User Approval & Role Management
  approveUser: (id: string) => void;
  updateUserRole: (id: string, role: UserRole) => void;
  sendActivationEmail: (id: string) => void;
  registerNewUser: (fullName: string, email: string, phone: string) => void;
  addUser: (userData: Omit<Profile, 'id' | 'created_at'>) => void;
  updateUser: (id: string, userData: Partial<Profile>) => void;
  deleteUser: (id: string) => void;

  // Master Data CRUD Actions
  addFarmer: (farmer: Omit<Farmer, 'id' | 'created_at'>) => void;
  updateFarmer: (id: string, farmer: Partial<Farmer>) => void;
  deleteFarmer: (id: string) => void;

  addStaff: (staff: Omit<StaffMember, 'id' | 'created_at'>) => void;
  updateStaff: (id: string, staff: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

  addTruck: (truck: Omit<Truck, 'id' | 'created_at'>) => void;
  updateTruck: (id: string, truck: Partial<Truck>) => void;
  deleteTruck: (id: string) => void;

  addVariety: (variety: Omit<RiceVariety, 'id' | 'created_at'>) => void;
  updateVariety: (id: string, variety: Partial<RiceVariety>) => void;
  deleteVariety: (id: string) => void;

  addArea: (area: Omit<GrowingArea, 'id' | 'created_at'>) => void;
  updateArea: (id: string, area: Partial<GrowingArea>) => void;
  deleteArea: (id: string) => void;

  // Session CRUD Actions
  createSession: (sessionData: Omit<WeighingSession, 'id' | 'session_code' | 'total_fresh_weight' | 'total_tare_weight' | 'total_dry_weight' | 'total_bags' | 'total_amount' | 'status' | 'started_at' | 'items'>) => WeighingSession;
  updateSession: (id: string, sessionData: Partial<WeighingSession>) => void;
  deleteSession: (id: string) => void;
  addWeighingItem: (sessionId: string, bagCount: number, grossWeight: number, tareWeight: number) => void;
  deleteWeighingItem: (sessionId: string, itemId: string) => void;
  completeSession: (sessionId: string) => void;

  // Settlement CRUD Actions
  createSettlement: (farmerId: string, paidAmount: number, notes?: string) => Settlement;
  updateSettlement: (id: string, settlementData: Partial<Settlement>) => void;
  deleteSettlement: (id: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;

  // Role permissions helpers
  isAdmin: boolean;
  isEditor: boolean;
  isStaff: boolean;
  isViewer: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [currentUser, setCurrentUser] = useState<Profile | null>(INITIAL_PROFILES[0]); // Default Admin
  const [farmers, setFarmers] = useState<Farmer[]>(INITIAL_FARMERS);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF);
  const [trucks, setTrucks] = useState<Truck[]>(INITIAL_TRUCKS);
  const [varieties, setVarieties] = useState<RiceVariety[]>(INITIAL_VARIETIES);
  const [growingAreas, setGrowingAreas] = useState<GrowingArea[]>(INITIAL_GROWING_AREAS);
  const [sessions, setSessions] = useState<WeighingSession[]>(INITIAL_SESSIONS);
  const [settlements, setSettlements] = useState<Settlement[]>(INITIAL_SETTLEMENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Yêu cầu duyệt tài khoản mới',
      message: 'Thành viên Lê Văn Mới vừa đăng ký tài khoản. Admin vui lòng duyệt và cấp quyền.',
      type: 'warning',
      read: false,
      created_at: new Date().toISOString()
    }
  ]);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem('riceos_profiles');
      if (savedProfiles) setProfiles(JSON.parse(savedProfiles));

      const savedFarmers = localStorage.getItem('riceos_farmers');
      if (savedFarmers) setFarmers(JSON.parse(savedFarmers));

      const savedStaff = localStorage.getItem('riceos_staff');
      if (savedStaff) setStaffMembers(JSON.parse(savedStaff));

      const savedTrucks = localStorage.getItem('riceos_trucks');
      if (savedTrucks) setTrucks(JSON.parse(savedTrucks));

      const savedVarieties = localStorage.getItem('riceos_varieties');
      if (savedVarieties) setVarieties(JSON.parse(savedVarieties));

      const savedAreas = localStorage.getItem('riceos_areas');
      if (savedAreas) setGrowingAreas(JSON.parse(savedAreas));

      const savedSessions = localStorage.getItem('riceos_sessions');
      if (savedSessions) setSessions(JSON.parse(savedSessions));

      const savedSettlements = localStorage.getItem('riceos_settlements');
      if (savedSettlements) setSettlements(JSON.parse(savedSettlements));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  const saveStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const switchRole = (role: UserRole) => {
    const targetUser = profiles.find(p => p.role === role) || {
      id: `usr-${role}-custom`,
      full_name: `Người dùng ${role.toUpperCase()}`,
      phone: '0900000000',
      role,
      is_active: true,
      status: 'active',
      email: `${role}@riceos.vn`,
      created_at: new Date().toISOString()
    };
    setCurrentUser(targetUser);
  };

  // User Registration & Admin Approval
  const registerNewUser = (fullName: string, email: string, phone: string) => {
    const newProf: Profile = {
      id: `usr-${Date.now()}`,
      full_name: fullName,
      email,
      phone,
      role: 'staff',
      is_active: false,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const updated = [newProf, ...profiles];
    setProfiles(updated);
    saveStorage('riceos_profiles', updated);

    // Push Notification to Admin
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Đăng ký thành viên mới',
        message: `${fullName} (${email}) vừa đăng ký. Cần Admin duyệt kích hoạt tài khoản.`,
        type: 'warning',
        read: false,
        created_at: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const addUser = (userData: Omit<Profile, 'id' | 'created_at'>) => {
    const newUser: Profile = {
      ...userData,
      id: `usr-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = [newUser, ...profiles];
    setProfiles(updated);
    saveStorage('riceos_profiles', updated);
    if (newUser.role === 'staff' || newUser.is_active) {
      addStaff({
        user_id: newUser.id,
        full_name: newUser.full_name,
        phone: newUser.phone || '0900000000'
      });
    }
  };

  const updateUser = (id: string, userData: Partial<Profile>) => {
    const updated = profiles.map(p => p.id === id ? { ...p, ...userData } : p);
    setProfiles(updated);
    saveStorage('riceos_profiles', updated);
  };

  const deleteUser = (id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    saveStorage('riceos_profiles', updated);
  };

  const approveUser = (id: string) => {
    const updated = profiles.map(p => {
      if (p.id === id) {
        return { ...p, is_active: true, status: 'active' as const };
      }
      return p;
    });
    setProfiles(updated);
    saveStorage('riceos_profiles', updated);

    // Also add to staff members list
    const targetProf = updated.find(p => p.id === id);
    if (targetProf) {
      addStaff({
        user_id: targetProf.id,
        full_name: targetProf.full_name,
        phone: targetProf.phone || '0900000000'
      });
      sendActivationEmail(id);
    }
  };

  const updateUserRole = (id: string, role: UserRole) => {
    const updated = profiles.map(p => p.id === id ? { ...p, role } : p);
    setProfiles(updated);
    saveStorage('riceos_profiles', updated);
  };

  const sendActivationEmail = (id: string) => {
    const target = profiles.find(p => p.id === id);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Đã gửi Mail kích hoạt',
        message: `Hệ thống đã gửi Mail xác nhận kích hoạt tài khoản tới ${target?.email || 'thành viên'}.`,
        type: 'success',
        read: false,
        created_at: new Date().toISOString()
      },
      ...prev
    ]);
  };

  // Farmer CRUD
  const addFarmer = (farmerData: Omit<Farmer, 'id' | 'created_at'>) => {
    const newFarmer: Farmer = {
      ...farmerData,
      id: `fm-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = [newFarmer, ...farmers];
    setFarmers(updated);
    saveStorage('riceos_farmers', updated);
  };

  const updateFarmer = (id: string, data: Partial<Farmer>) => {
    const updated = farmers.map(f => f.id === id ? { ...f, ...data } : f);
    setFarmers(updated);
    saveStorage('riceos_farmers', updated);
  };

  const deleteFarmer = (id: string) => {
    const updated = farmers.filter(f => f.id !== id);
    setFarmers(updated);
    saveStorage('riceos_farmers', updated);
  };

  // Staff CRUD
  const addStaff = (staffData: Omit<StaffMember, 'id' | 'created_at'>) => {
    const newStaff: StaffMember = {
      ...staffData,
      id: `stf-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = [newStaff, ...staffMembers];
    setStaffMembers(updated);
    saveStorage('riceos_staff', updated);
  };

  const updateStaff = (id: string, data: Partial<StaffMember>) => {
    const updated = staffMembers.map(s => s.id === id ? { ...s, ...data } : s);
    setStaffMembers(updated);
    saveStorage('riceos_staff', updated);
  };

  const deleteStaff = (id: string) => {
    const updated = staffMembers.filter(s => s.id !== id);
    setStaffMembers(updated);
    saveStorage('riceos_staff', updated);
  };

  // Truck CRUD
  const addTruck = (truckData: Omit<Truck, 'id' | 'created_at'>) => {
    const newTruck: Truck = {
      ...truckData,
      id: `trk-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = [newTruck, ...trucks];
    setTrucks(updated);
    saveStorage('riceos_trucks', updated);
  };

  const updateTruck = (id: string, data: Partial<Truck>) => {
    const updated = trucks.map(t => t.id === id ? { ...t, ...data } : t);
    setTrucks(updated);
    saveStorage('riceos_trucks', updated);
  };

  const deleteTruck = (id: string) => {
    const updated = trucks.filter(t => t.id !== id);
    setTrucks(updated);
    saveStorage('riceos_trucks', updated);
  };

  // Variety CRUD
  const addVariety = (varietyData: Omit<RiceVariety, 'id' | 'created_at'>) => {
    const newVar: RiceVariety = {
      ...varietyData,
      id: `var-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = [newVar, ...varieties];
    setVarieties(updated);
    saveStorage('riceos_varieties', updated);
  };

  const updateVariety = (id: string, data: Partial<RiceVariety>) => {
    const updated = varieties.map(v => v.id === id ? { ...v, ...data } : v);
    setVarieties(updated);
    saveStorage('riceos_varieties', updated);
  };

  const deleteVariety = (id: string) => {
    const updated = varieties.filter(v => v.id !== id);
    setVarieties(updated);
    saveStorage('riceos_varieties', updated);
  };

  // Area CRUD
  const addArea = (areaData: Omit<GrowingArea, 'id' | 'created_at'>) => {
    const newArea: GrowingArea = {
      ...areaData,
      id: `area-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = [newArea, ...growingAreas];
    setGrowingAreas(updated);
    saveStorage('riceos_areas', updated);
  };

  const updateArea = (id: string, data: Partial<GrowingArea>) => {
    const updated = growingAreas.map(a => a.id === id ? { ...a, ...data } : a);
    setGrowingAreas(updated);
    saveStorage('riceos_areas', updated);
  };

  const deleteArea = (id: string) => {
    const updated = growingAreas.filter(a => a.id !== id);
    setGrowingAreas(updated);
    saveStorage('riceos_areas', updated);
  };

  // Session Management (Strictly isolated by created_by for members)
  const createSession = (sessionData: Omit<WeighingSession, 'id' | 'session_code' | 'total_fresh_weight' | 'total_tare_weight' | 'total_dry_weight' | 'total_bags' | 'total_amount' | 'status' | 'started_at' | 'items'>) => {
    const farmer = farmers.find(f => f.id === sessionData.farmer_id);
    const staff = staffMembers.find(s => s.id === sessionData.staff_id);
    const truck = trucks.find(t => t.id === sessionData.truck_id);
    const variety = varieties.find(v => v.id === sessionData.variety_id);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const code = `PC-${dateStr}-${Math.floor(100 + Math.random() * 900)}`;

    const newSession: WeighingSession = {
      ...sessionData,
      id: `ses-${Date.now()}`,
      session_code: code,
      total_fresh_weight: 0,
      total_tare_weight: 0,
      total_dry_weight: 0,
      total_bags: 0,
      total_amount: 0,
      status: 'in_progress',
      started_at: now.toISOString(),
      items: [],
      farmer,
      staff,
      truck,
      variety,
      created_by: currentUser?.id
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveStorage('riceos_sessions', updated);

    return newSession;
  };

  const updateSession = (id: string, data: Partial<WeighingSession>) => {
    const updated = sessions.map(s => {
      if (s.id === id) {
        const farmer = data.farmer_id ? farmers.find(f => f.id === data.farmer_id) : s.farmer;
        const staff = data.staff_id ? staffMembers.find(st => st.id === data.staff_id) : s.staff;
        const truck = data.truck_id ? trucks.find(t => t.id === data.truck_id) : s.truck;
        const variety = data.variety_id ? varieties.find(v => v.id === data.variety_id) : s.variety;
        const unitPrice = data.unit_price !== undefined ? data.unit_price : s.unit_price;
        const totalDry = data.total_dry_weight !== undefined ? data.total_dry_weight : s.total_dry_weight;
        const totalAmount = totalDry * unitPrice;

        return {
          ...s,
          ...data,
          unit_price: unitPrice,
          total_amount: totalAmount,
          farmer,
          staff,
          truck,
          variety
        };
      }
      return s;
    });
    setSessions(updated);
    saveStorage('riceos_sessions', updated);
  };

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveStorage('riceos_sessions', updated);
  };

  const addWeighingItem = (sessionId: string, bagCount: number, grossWeight: number, tareWeight: number) => {
    const netWeight = Math.max(0, grossWeight - tareWeight);
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const currentItems = session.items || [];
    const newItem: WeighingItem = {
      id: `itm-${Date.now()}`,
      session_id: sessionId,
      sequence: currentItems.length + 1,
      bag_count: bagCount,
      gross_weight: grossWeight,
      tare_weight: tareWeight,
      net_weight: netWeight,
      weighed_at: new Date().toISOString()
    };

    const updatedItems = [...currentItems, newItem];
    const totalBags = updatedItems.reduce((sum, item) => sum + item.bag_count, 0);
    const totalFresh = updatedItems.reduce((sum, item) => sum + item.gross_weight, 0);
    const totalTare = updatedItems.reduce((sum, item) => sum + item.tare_weight, 0);
    const totalDry = Math.max(0, totalFresh - totalTare);
    const totalAmount = totalDry * session.unit_price;

    const updatedSessions = sessions.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          items: updatedItems,
          total_bags: totalBags,
          total_fresh_weight: totalFresh,
          total_tare_weight: totalTare,
          total_dry_weight: totalDry,
          total_amount: totalAmount
        };
      }
      return s;
    });

    setSessions(updatedSessions);
    saveStorage('riceos_sessions', updatedSessions);
  };

  const deleteWeighingItem = (sessionId: string, itemId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const updatedItems = (session.items || []).filter(item => item.id !== itemId).map((item, idx) => ({ ...item, sequence: idx + 1 }));
    const totalBags = updatedItems.reduce((sum, item) => sum + item.bag_count, 0);
    const totalFresh = updatedItems.reduce((sum, item) => sum + item.gross_weight, 0);
    const totalTare = updatedItems.reduce((sum, item) => sum + item.tare_weight, 0);
    const totalDry = Math.max(0, totalFresh - totalTare);
    const totalAmount = totalDry * session.unit_price;

    const updatedSessions = sessions.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          items: updatedItems,
          total_bags: totalBags,
          total_fresh_weight: totalFresh,
          total_tare_weight: totalTare,
          total_dry_weight: totalDry,
          total_amount: totalAmount
        };
      }
      return s;
    });

    setSessions(updatedSessions);
    saveStorage('riceos_sessions', updatedSessions);
  };

  const completeSession = (sessionId: string) => {
    const updatedSessions = sessions.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: 'completed' as const,
          completed_at: new Date().toISOString()
        };
      }
      return s;
    });
    setSessions(updatedSessions);
    saveStorage('riceos_sessions', updatedSessions);
  };

  // Settlement CRUD
  const createSettlement = (farmerId: string, paidAmount: number, notes?: string) => {
    const farmer = farmers.find(f => f.id === farmerId);
    const farmerSessions = sessions.filter(s => s.farmer_id === farmerId);
    const totalDryWeight = farmerSessions.reduce((sum, s) => sum + s.total_dry_weight, 0);
    const totalAmount = farmerSessions.reduce((sum, s) => sum + s.total_amount, 0);

    const now = new Date();
    const code = `QT-${now.toISOString().slice(0, 10).replace(/-/g, '')}-FM${farmerId.slice(-3)}`;

    const newSettlement: Settlement = {
      id: `set-${Date.now()}`,
      settlement_code: code,
      farmer_id: farmerId,
      total_dry_weight: totalDryWeight,
      total_amount: totalAmount,
      paid_amount: paidAmount,
      status: paidAmount >= totalAmount ? 'completed' : 'pending',
      settled_at: now.toISOString(),
      notes,
      created_by: currentUser?.id,
      farmer
    };

    const updated = [newSettlement, ...settlements];
    setSettlements(updated);
    saveStorage('riceos_settlements', updated);

    return newSettlement;
  };

  const updateSettlement = (id: string, data: Partial<Settlement>) => {
    const updated = settlements.map(st => st.id === id ? { ...st, ...data } : st);
    setSettlements(updated);
    saveStorage('riceos_settlements', updated);
  };

  const deleteSettlement = (id: string) => {
    const updated = settlements.filter(st => st.id !== id);
    setSettlements(updated);
    saveStorage('riceos_settlements', updated);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const role = currentUser?.role || 'staff';
  const isAdmin = role === 'admin';
  const isEditor = role === 'editor' || role === 'admin';
  const isStaff = role === 'staff';
  const isViewer = role === 'viewer';

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        profiles,
        farmers,
        staffMembers,
        trucks,
        varieties,
        growingAreas,
        sessions,
        settlements,
        notifications,
        approveUser,
        updateUserRole,
        sendActivationEmail,
        registerNewUser,
        addUser,
        updateUser,
        deleteUser,
        addFarmer,
        updateFarmer,
        deleteFarmer,
        addStaff,
        updateStaff,
        deleteStaff,
        addTruck,
        updateTruck,
        deleteTruck,
        addVariety,
        updateVariety,
        deleteVariety,
        addArea,
        updateArea,
        deleteArea,
        createSession,
        updateSession,
        deleteSession,
        addWeighingItem,
        deleteWeighingItem,
        completeSession,
        createSettlement,
        updateSettlement,
        deleteSettlement,
        markNotificationRead,
        isAdmin,
        isEditor,
        isStaff,
        isViewer
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
