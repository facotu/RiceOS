// Master Data Service Layer for RiceOS ERP
// File: src/features/master-data/services/masterDataService.ts

import { masterDataRepo, MasterFarmer, MasterVariety, MasterWarehouse } from "../repository/masterDataRepository.ts";

export class MasterDataService {
  // Validate và chèn nông dân mới
  async createFarmer(data: { name: string; phone: string; address?: string; orgId: string }): Promise<string> {
    if (!data.name.trim()) throw new Error("Tên chủ ruộng không được để trống.");
    if (!/^\d{10}$/.test(data.phone)) throw new Error("Số điện thoại nông dân phải chứa đúng 10 chữ số.");

    return masterDataRepo.addFarmer({
      organization_id: data.orgId,
      full_name: data.name,
      phone_number: data.phone,
      address: data.address,
      is_active: 1
    });
  }

  // Lấy danh sách nông dân đã sắp xếp
  async listFarmers(): Promise<MasterFarmer[]> {
    const list = await masterDataRepo.getFarmers();
    return list.sort((a, b) => a.full_name.localeCompare(b.full_name));
  }

  // Validate và chèn giống lúa
  async createVariety(name: string, description?: string): Promise<string> {
    if (!name.trim()) throw new Error("Tên giống lúa không được để trống.");
    return masterDataRepo.addVariety({ name, description });
  }

  async listVarieties(): Promise<MasterVariety[]> {
    return masterDataRepo.getVarieties();
  }

  // Validate và chèn kho silo
  async createWarehouse(name: string, capacityKg: number): Promise<string> {
    if (!name.trim()) throw new Error("Tên kho sấy không được để trống.");
    if (capacityKg <= 0) throw new Error("Sức chứa kho phải lớn hơn 0 kg.");

    return masterDataRepo.addWarehouse({
      name,
      capacity_kg: capacityKg,
      current_stock_kg: 0
    });
  }

  async listWarehouses(): Promise<MasterWarehouse[]> {
    return masterDataRepo.getWarehouses();
  }
}

export const masterDataService = new MasterDataService();
export default masterDataService;
