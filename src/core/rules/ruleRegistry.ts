// Default Enterprise Rules Registry
// File: src/core/rules/ruleRegistry.ts

import { RuleEngine, EnterpriseRule } from "./ruleEngine.ts";

export class RuleRegistry {
  public static initializeDefaultRules(): void {
    const rules: EnterpriseRule[] = [
      {
        id: "RULE_STORAGE_AGING",
        name: "Kiểm tra lúa tồn kho lâu ngày (>60 ngày)",
        category: "inventory",
        priority: 10,
        severity: "critical",
        condition: (ctx: any) => (ctx.storageDays || 0) > 60,
        recommendation: "Lên kế hoạch đảo hạt lúa hoặc ưu tiên xuất kho bán thương mại tránh giảm phẩm cấp.",
        action: "PRIORITIZE_SALE"
      },
      {
        id: "RULE_DRYING_OVERTEMP",
        name: "Cảnh báo quá nhiệt đầu lò sấy (>45°C)",
        category: "drying",
        priority: 9,
        severity: "critical",
        condition: (ctx: any) => (ctx.dryingTemp || 0) > 45,
        recommendation: "Giảm nhiệt độ gia nhiệt gấp, bật hệ thống quạt gió làm mát tránh rạn nứt lúa sấy.",
        action: "REDUCE_HEAT"
      },
      {
        id: "RULE_COST_SURGE",
        name: "Chi phí sấy lò tăng bất thường (>10%)",
        category: "cost",
        priority: 8,
        severity: "warning",
        condition: (ctx: any) => (ctx.dryingCostSurgePercent || 0) > 10,
        recommendation: "Kiểm tra mức tiêu hao trấu sấy lò và bảo dưỡng quạt hút điện lò sấy.",
        action: "AUDIT_FUEL_USAGE"
      },
      {
        id: "RULE_PAYABLE_LIQUIDITY",
        name: "Cảnh báo trần công nợ nông dân (>50 Triệu)",
        category: "payable",
        priority: 7,
        severity: "warning",
        condition: (ctx: any) => (ctx.farmerPayable || 0) > 50000000,
        recommendation: "Cân đối lại dự chi quỹ ngân sách HTX chi trả bớt cho nông dân thu mua.",
        action: "ALLOCATE_PAYMENT"
      },
      {
        id: "RULE_QUALITY_MOISTURE",
        name: "Độ ẩm lúa khô ngoài khoảng chuẩn (13% - 15.5%)",
        category: "quality",
        priority: 6,
        severity: "warning",
        condition: (ctx: any) => ctx.finalMoisture !== undefined && (ctx.finalMoisture < 13.0 || ctx.finalMoisture > 15.5),
        recommendation: "Điều chỉnh thời gian làm nguội mẻ sấy hoặc kiểm định lại ẩm kế lò sấy.",
        action: "CALIBRATE_MOISTURE"
      },
      {
        id: "RULE_VEHICLE_OVERLOAD",
        name: "Xe vận chuyển quá tải trọng cho phép",
        category: "warehouse",
        priority: 9,
        severity: "critical",
        condition: (ctx: any) => (ctx.payloadWeightKg || 0) > (ctx.capacityTons || 99) * 1000,
        recommendation: "Sớt bớt bao lúa sang xe phụ tải khác tránh vi phạm an toàn giao thông và hỏng lốp xe.",
        action: "REDUCE_PAYLOAD"
      },
      {
        id: "RULE_VEHICLE_MAINTENANCE_DUE",
        name: "Xe quá hạn bảo dưỡng định kỳ (>90 ngày)",
        category: "inventory",
        priority: 5,
        severity: "warning",
        condition: (ctx: any) => (ctx.daysSinceMaintenance || 0) > 90,
        recommendation: "Đưa xe vào xưởng bảo dưỡng thay dầu máy và kiểm tra hệ thống phanh.",
        action: "SCHEDULE_MAINTENANCE"
      }
    ];

    rules.forEach(r => RuleEngine.registerRule(r));
  }
}
export default RuleRegistry;
