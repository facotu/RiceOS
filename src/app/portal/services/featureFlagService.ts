// Feature Flag System for RiceOS
// File: src/app/portal/services/featureFlagService.ts

export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private flags: Record<string, boolean> = {
    "feature:ai-ocr": true,       // Bật AI Camera OCR
    "feature:thermal-print": true, // Bật in nhiệt Bluetooth
    "feature:bulk-sync": true,     // Bật đồng bộ hàng loạt offline
    "feature:dashboard-v2": false  // Dashboard phiên bản 2 (đang thử nghiệm)
  };

  private constructor() {
    // Tải cấu hình từ localStorage để cho phép quản trị viên cấu hình nhanh khi thử nghiệm
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("riceos_feature_flags");
      if (saved) {
        try {
          this.flags = { ...this.flags, ...JSON.parse(saved) };
        } catch (e) {
          console.error("Lỗi phân tích Feature Flags:", e);
        }
      }
    }
  }

  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  // Kiểm tra tính năng có được kích hoạt hay không
  public isEnabled(flag: string): boolean {
    return !!this.flags[flag];
  }

  // Đặt cấu hình cờ tính năng thủ công
  public setFlag(flag: string, value: boolean) {
    this.flags[flag] = value;
    if (typeof window !== "undefined") {
      localStorage.setItem("riceos_feature_flags", JSON.stringify(this.flags));
    }
  }

  // Lấy toàn bộ cờ tính năng hiện tại
  public getAllFlags(): Record<string, boolean> {
    return { ...this.flags };
  }
}

export const featureFlags = FeatureFlagService.getInstance();
export default featureFlags;
