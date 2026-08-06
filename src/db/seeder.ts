// Master Data Initial Seeder for RiceOS
// File: src/db/seeder.ts

import { db, LocalFarmer, LocalOfficer, LocalTruck, LocalVariety, LocalSetting, LocalReceipt } from "./index.ts";

export async function seedDatabaseIfEmpty() {
  // 1. Seed Giống lúa (HG12, HG244, HT1, ĐT100, J02)
  const varietyCount = await db.rice_varieties.count();
  if (varietyCount === 0) {
    const defaultVarieties: LocalVariety[] = [
      { id: "var-hg12", code: "HG12", name: "Lúa giống HG12", unit_price: 7200 },
      { id: "var-hg244", code: "HG244", name: "Lúa giống HG244", unit_price: 7500 },
      { id: "var-ht1", code: "HT1", name: "Lúa giống HT1", unit_price: 7800 },
      { id: "var-dt100", code: "ĐT100", name: "Lúa giống ĐT100", unit_price: 8000 },
      { id: "var-j02", code: "J02", name: "Lúa giống J02 Nhật", unit_price: 8500 }
    ];
    await db.rice_varieties.bulkAdd(defaultVarieties);
  }

  // 2. Seed Cán bộ cân
  const officerCount = await db.officers.count();
  if (officerCount === 0) {
    const defaultOfficers: LocalOfficer[] = [
      { id: "off-admin", full_name: "Phạm Tuân (Quản trị viên)", phone_number: "0905444444", email: "admin@hoatien2.vn", role: "admin", is_active: 1 },
      { id: "off-can1", full_name: "Nguyễn Văn Cân (Cán bộ cân 1)", phone_number: "0905222222", email: "can1@hoatien2.vn", role: "editor", is_active: 1 },
      { id: "off-can2", full_name: "Trần Văn Trạm (Cán bộ cân 2)", phone_number: "0905333333", email: "can2@hoatien2.vn", role: "editor", is_active: 1 }
    ];
    await db.officers.bulkAdd(defaultOfficers);
  }

  // 3. Seed Xe nhận lúa
  const truckCount = await db.trucks.count();
  if (truckCount === 0) {
    const defaultTrucks: LocalTruck[] = [
      { id: "truck-01", driver_name: "Nguyễn Văn Tài", plate_number: "43C-098.12", phone_number: "0914111222", is_active: 1 },
      { id: "truck-02", driver_name: "Lê Văn Lái", plate_number: "43C-112.34", phone_number: "0914333444", is_active: 1 },
      { id: "truck-03", driver_name: "Phạm Văn Vận", plate_number: "43C-556.78", phone_number: "0914555666", is_active: 1 }
    ];
    await db.trucks.bulkAdd(defaultTrucks);
  }

  // 4. Seed Chủ ruộng
  const farmerCount = await db.farmers.count();
  if (farmerCount === 0) {
    const defaultFarmers: LocalFarmer[] = [
      {
        id: "farmer-01",
        full_name: "Nguyễn Văn An",
        phone_number: "0905123456",
        id_card_number: "201847592014",
        id_card_date: "2021-05-15",
        id_card_place: "CA Đà Nẵng",
        id_card_expiry: "2031-05-15",
        field_location: "Xứ đồng Đồng Hát",
        plot_number: "Lô A1",
        area_size: 5.5,
        address: "Thôn An Trạch, Hòa Tiến, Đà Nẵng",
        is_active: 1
      },
      {
        id: "farmer-02",
        full_name: "Trần Thị Bình",
        phone_number: "0905987654",
        id_card_number: "201859382104",
        id_card_date: "2020-08-20",
        id_card_place: "CA Đà Nẵng",
        id_card_expiry: "2030-08-20",
        field_location: "Xứ đồng Bàu Tròn",
        plot_number: "Lô B2",
        area_size: 8.0,
        address: "Thôn An Trạch, Hòa Tiến, Đà Nẵng",
        is_active: 1
      },
      {
        id: "farmer-03",
        full_name: "Lê Văn Cường",
        phone_number: "0905555888",
        id_card_number: "201984729104",
        id_card_date: "2022-01-10",
        id_card_place: "CA Đà Nẵng",
        id_card_expiry: "2032-01-10",
        field_location: "Xứ đồng Cánh Mẫu",
        plot_number: "Lô C1",
        area_size: 12.0,
        address: "Thôn An Trạch, Hòa Tiến, Đà Nẵng",
        is_active: 1
      }
    ];
    await db.farmers.bulkAdd(defaultFarmers);
  }

  // 5. Seed Cài đặt mặc định
  const settingCount = await db.settings.count();
  if (settingCount === 0) {
    const defaultSetting: LocalSetting = {
      id: "global-settings",
      tare_type: "percent",
      default_tare_value: 1.0,
      field_locations: ["Xứ đồng Đồng Hát", "Xứ đồng Bàu Tròn", "Xứ đồng Cánh Mẫu", "Xứ đồng Đồng Tranh"],
      plots: ["Lô A1", "Lô A2", "Lô B1", "Lô B2", "Lô C1", "Lô C2"],
      unit_prices: {
        "HG12": 7200,
        "HG244": 7500,
        "HT1": 7800,
        "ĐT100": 8000,
        "J02": 8500
      }
    };
    await db.settings.add(defaultSetting);
  }

  // 6. Seed Mẫu Phiên Cân Mẫu
  const receiptCount = await db.weighing_receipts.count();
  if (receiptCount === 0) {
    const sampleReceipts: LocalReceipt[] = [
      {
        id: "rec-001",
        receipt_number: "PC-20260806-001",
        farmer_id: "farmer-01",
        farmer_name: "Nguyễn Văn An",
        farmer_phone: "0905123456",
        field_location: "Xứ đồng Đồng Hát",
        plot_number: "Lô A1",
        officer_id: "off-can1",
        officer_name: "Nguyễn Văn Cân",
        truck_id: "truck-01",
        truck_plate: "43C-098.12",
        driver_name: "Nguyễn Văn Tài",
        variety_code: "J02",
        variety_name: "Lúa giống J02 Nhật",
        entries: [
          { bags_count: 3, gross_weight_kg: 155.0 },
          { bags_count: 3, gross_weight_kg: 152.5 },
          { bags_count: 2, gross_weight_kg: 104.0 }
        ],
        total_bags: 8,
        total_fresh_kg: 411.5,
        tare_type: "percent",
        tare_value: 1.0,
        total_dry_kg: 407.39,
        unit_price: 8500,
        total_amount: 3462815,
        start_time: "2026-08-06T08:00:00",
        end_time: "2026-08-06T08:30:00",
        status: "pending_settlement",
        created_at: new Date().toISOString(),
        synced: 1
      },
      {
        id: "rec-002",
        receipt_number: "PC-20260806-002",
        farmer_id: "farmer-02",
        farmer_name: "Trần Thị Bình",
        farmer_phone: "0905987654",
        field_location: "Xứ đồng Bàu Tròn",
        plot_number: "Lô B2",
        officer_id: "off-can2",
        officer_name: "Trần Văn Trạm",
        truck_id: "truck-02",
        truck_plate: "43C-112.34",
        driver_name: "Lê Văn Lái",
        variety_code: "HG12",
        variety_name: "Lúa giống HG12",
        entries: [
          { bags_count: 3, gross_weight_kg: 160.0 },
          { bags_count: 3, gross_weight_kg: 158.0 }
        ],
        total_bags: 6,
        total_fresh_kg: 318.0,
        tare_type: "percent",
        tare_value: 1.0,
        total_dry_kg: 314.82,
        unit_price: 7200,
        total_amount: 2266704,
        start_time: "2026-08-06T09:15:00",
        end_time: "2026-08-06T09:45:00",
        status: "settled",
        created_at: new Date().toISOString(),
        synced: 1
      }
    ];
    await db.weighing_receipts.bulkAdd(sampleReceipts);
  }
}
