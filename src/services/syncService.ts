import { db } from "../db/index.ts";
import { useAuthStore } from "../store/authStore.ts";

const API_BASE_URL = "/api/v1";

// Hàm gọi đồng bộ cưỡng bức hoặc tự động chạy khi phát hiện có mạng trở lại
export const syncOfflineData = async (): Promise<{ successCount: number; failedCount: number }> => {
  const token = useAuthStore.getState().token;
  if (!token) return { successCount: 0, failedCount: 0 };

  // Lấy danh sách hàng đợi đồng bộ xếp theo thời gian
  const queue = await db.sync_queue.orderBy("id").toArray();
  if (queue.length === 0) return { successCount: 0, failedCount: 0 };

  let successCount = 0;
  let failedCount = 0;

  for (const item of queue) {
    // Nếu vượt quá 5 lần thử lại thất bại, đánh dấu lỗi và tạm dừng để tránh kẹt nghẽn
    if (item.retry_count >= 5) {
      failedCount++;
      continue;
    }

    try {
      if (item.action === "insert_receipt") {
        const response = await fetch(`${API_BASE_URL}/weighing/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ receipts: [item.payload] })
        });

        const result = await response.json();

        if (response.ok && result.synced_count > 0) {
          // Đồng bộ thành công, cập nhật trạng thái phiếu cân local và xóa khỏi hàng đợi
          await db.weighing_receipts.update(item.payload.id, { synced: 1 });
          await db.sync_queue.delete(item.id!);
          successCount++;
        } else {
          // Lỗi nghiệp vụ hoặc xung đột dữ liệu (Ví dụ: trùng mã đã quyết toán)
          console.error("Lỗi đồng bộ bản ghi:", result.error || result.errors);
          // Cơ chế Giải quyết xung đột (Conflict Resolution):
          // Nếu trùng mã đã chốt trên Server, ta xóa luôn bản ghi nháp local này khỏi hàng đợi để tránh lặp lại lỗi
          if (result.errors?.[0]?.error?.includes("đã được thanh quyết toán")) {
            await db.sync_queue.delete(item.id!);
          } else {
            // Các lỗi mạng/tạm thời khác: Tăng số lần thử lại
            await db.sync_queue.update(item.id!, { retry_count: item.retry_count + 1 });
          }
          failedCount++;
        }
      }
    } catch (err) {
      console.error("Lỗi kết nối mạng khi đồng bộ:", err);
      await db.sync_queue.update(item.id!, { retry_count: item.retry_count + 1 });
      failedCount++;
    }
  }

  return { successCount, failedCount };
};

// Đăng ký lắng nghe mạng phục vụ PWA tự động đồng bộ khi có kết nối trở lại
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    console.log("Mạng hoạt động trở lại! Bắt đầu đồng bộ tự động...");
    syncOfflineData();
  });
}
