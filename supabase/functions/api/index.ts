// Supabase Edge Function: api
// File: supabase/functions/api/index.ts
// Framework: Hono (Deno/Supabase Edge Functions standard)

import { Hono } from "https://esm.sh/hono@3.11.7";
import { cors } from "https://esm.sh/hono@3.11.7/middleware";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Khởi tạo ứng dụng Hono Router
const app = new Hono().basePath("/api/v1");

// Kích hoạt CORS phục vụ các thiết bị PWA truy cập trực tiếp
app.use("*", cors());

// Helper: Khởi tạo Supabase Client với JWT của người dùng (tự động áp dụng RLS)
const getSupabaseUserClient = (c: any) => {
  const authHeader = c.req.header("Authorization");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  
  if (!authHeader) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });
};

// Helper: Khởi tạo Supabase Service Role Client (bỏ qua RLS để thực hiện các tác vụ hệ thống/logs)
const getSupabaseServiceClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  return createClient(supabaseUrl, serviceKey);
};

// =============================================================================
-- MIDDLEWARE: XÁC THỰC VÀ KIỂM TRA QUYỀN TRUY CẬP (RBAC MIDDLEWARE)
// =============================================================================
const checkRole = (allowedRoles: string[]) => {
  return async (c: any, next: any) => {
    const supabase = getSupabaseUserClient(c);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return c.json({ error: "Yêu cầu đăng nhập để truy cập." }, 401);
    }

    // Lấy thông tin role người dùng từ DB public.users
    const serviceClient = getSupabaseServiceClient();
    const { data: userData, error: dbError } = await serviceClient
      .from("users")
      .select("role, organization_id, is_active")
      .eq("id", user.id)
      .single();

    if (dbError || !userData || !userData.is_active) {
      return c.json({ error: "Tài khoản không hoạt động hoặc không tồn tại." }, 403);
    }

    if (!allowedRoles.includes(userData.role)) {
      return c.json({ error: "Bạn không có quyền thực hiện hành động này." }, 403);
    }

    // Gắn thông tin tổ chức và role vào context của Hono để sử dụng phía sau
    c.set("userId", user.id);
    c.set("userRole", userData.role);
    c.set("orgId", userData.organization_id);

    await next();
  };
};

// =============================================================================
-- 1. AUTH API WRAPPER / PROXY
// =============================================================================
app.post("/auth/login", async (c) => {
  try {
    const { phone_number, password } = await c.req.json();
    if (!phone_number || !password) {
      return c.json({ error: "Vui lòng nhập số điện thoại và mật khẩu." }, 400);
    }

    const serviceClient = getSupabaseServiceClient();
    // 1. Tìm email của người dùng từ số điện thoại (Supabase Auth mặc định dùng email)
    const { data: userData, error: dbError } = await serviceClient
      .from("users")
      .select("email, is_active")
      .eq("phone_number", phone_number)
      .single();

    if (dbError || !userData || !userData.is_active) {
      return c.json({ error: "Tài khoản không chính xác hoặc bị khóa." }, 401);
    }

    // 2. Gọi Supabase Auth đăng nhập bằng Email và Password
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: password,
    });

    if (authError) {
      return c.json({ error: "Mật khẩu không hợp lệ." }, 401);
    }

    return c.json({
      access_token: data.session?.access_token,
      expires_in: data.session?.expires_in,
      refresh_token: data.session?.refresh_token
    });
  } catch (err) {
    return c.json({ error: "Lỗi hệ thống: " + err.message }, 500);
  }
});

// =============================================================================
-- 2. USER API
// =============================================================================
app.get("/users/me", checkRole(["admin", "weighing_officer", "warehouse_keeper", "accountant", "director", "viewer"]), async (c) => {
  const userId = c.get("userId");
  const serviceClient = getSupabaseServiceClient();
  const { data, error } = await serviceClient
    .from("users")
    .select("*, user_profiles(*)")
    .eq("id", userId)
    .single();

  if (error) return c.json({ error: "Không tìm thấy hồ sơ người dùng." }, 404);
  return c.json(data);
});

// =============================================================================
-- 3. DEVICE API
// =============================================================================
app.post("/devices/register", checkRole(["admin", "weighing_officer", "warehouse_keeper"]), async (c) => {
  try {
    const orgId = c.get("orgId");
    const userId = c.get("userId");
    const { device_identifier, device_name, os_version } = await c.req.json();

    if (!device_identifier) {
      return c.json({ error: "Thiếu mã định danh thiết bị." }, 400);
    }

    const serviceClient = getSupabaseServiceClient();
    const { data, error } = await serviceClient
      .from("device_registrations")
      .upsert({
        organization_id: orgId,
        user_id: userId,
        device_identifier,
        device_name,
        os_version,
        updated_at: new Date().toISOString()
      }, { onConflict: "organization_id,device_identifier" })
      .select()
      .single();

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ message: "Đăng ký thiết bị thành công, đang chờ Admin phê duyệt.", device: data });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// =============================================================================
-- 4. WEIGHING API & BULK OFFLINE SYNC
// =============================================================================
app.post("/weighing/sync", checkRole(["weighing_officer", "admin"]), async (c) => {
  try {
    const orgId = c.get("orgId");
    const userId = c.get("userId");
    const { receipts } = await c.req.json(); // Mảng các phiếu cân tạo offline

    if (!Array.isArray(receipts) || receipts.length === 0) {
      return c.json({ error: "Danh sách phiếu cân gửi lên trống." }, 400);
    }

    const serviceClient = getSupabaseServiceClient();
    const syncedIds: string[] = [];
    const errors: any[] = [];

    for (const receipt of receipts) {
      // 1. Phép giải quyết xung đột (Conflict Resolution Strategy):
      // Kiểm tra xem mã phiếu cân đã tồn tại trên Server chưa
      const { data: existing } = await serviceClient
        .from("weighing_receipts")
        .select("id, status, updated_at")
        .eq("organization_id", orgId)
        .eq("receipt_number", receipt.receipt_number)
        .maybeSingle();

      if (existing) {
        // Nếu phiếu đã quyết toán trên Server, từ chối ghi đè dữ liệu offline cũ hơn
        if (existing.status === "settled") {
          errors.push({
            receipt_number: receipt.receipt_number,
            error: "Trùng mã: Phiếu cân này đã được thanh quyết toán xong trên máy chủ."
          });
          continue;
        }
        // Chiến lược: Server Wins (Nếu dữ liệu Server mới hơn) hoặc Client Wins
        // Ở đây ưu tiên Server Wins để bảo vệ tính nhất quán tài chính
        continue;
      }

      // 2. Chèn phiếu cân mới
      const { error: insertError } = await serviceClient
        .from("weighing_receipts")
        .insert({
          organization_id: orgId,
          receipt_number: receipt.receipt_number,
          crop_season_id: receipt.crop_season_id,
          farmer_id: receipt.farmer_id,
          rice_variety_id: receipt.rice_variety_id,
          weighing_officer_id: userId,
          truck_plate: receipt.truck_plate,
          gross_weight: receipt.gross_weight,
          moisture_percent: receipt.moisture_percent,
          trash_percent: receipt.trash_percent,
          status: "pending_warehouse",
          created_at: receipt.created_at || new Date().toISOString()
        });

      if (insertError) {
        errors.push({ receipt_number: receipt.receipt_number, error: insertError.message });
      } else {
        syncedIds.push(receipt.receipt_number);
      }
    }

    return c.json({ synced_count: syncedIds.length, errors });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// =============================================================================
-- 5. SETTLEMENT API
-- =============================================================================
app.post("/settlement", checkRole(["accountant", "admin"]), async (c) => {
  try {
    const orgId = c.get("orgId");
    const userId = c.get("userId");
    const { weighing_receipt_id, applied_price, payment_method } = await c.req.json();

    if (!weighing_receipt_id || !applied_price || !payment_method) {
      return c.json({ error: "Thiếu thông tin lập phiếu chi thanh toán." }, 400);
    }

    const serviceClient = getSupabaseServiceClient();

    // 1. Đọc phiếu cân gốc để lấy khối lượng và chất lượng
    const { data: receipt, error: rError } = await serviceClient
      .from("weighing_receipts")
      .select("*")
      .eq("id", weighing_receipt_id)
      .eq("organization_id", orgId)
      .single();

    if (rError || !receipt) {
      return c.json({ error: "Không tìm thấy phiếu cân tương ứng." }, 404);
    }

    if (receipt.status !== "pending_settlement") {
      return c.json({ error: "Phiếu cân chưa hoàn tất cân vỏ hoặc đã quyết toán rồi." }, 400);
    }

    // 2. Tính toán khấu trừ ẩm và tạp chất theo cấu hình HTX
    const { data: org } = await serviceClient
      .from("organizations")
      .select("settings")
      .eq("id", orgId)
      .single();

    const settings = org?.settings || {};
    const mStd = settings.moisture_standard || 14.0;
    const mRate = settings.moisture_deduction_rate || 0.015;
    const tStd = settings.trash_standard || 1.0;
    const tRate = settings.trash_deduction_rate || 0.01;

    let moistureDeductionPct = 0;
    if (receipt.moisture_percent > mStd) {
      moistureDeductionPct = (receipt.moisture_percent - mStd) * mRate;
    }

    let trashDeductionPct = 0;
    if (receipt.trash_percent > tStd) {
      trashDeductionPct = (receipt.trash_percent - tStd) * tRate;
    }

    const netWeight = receipt.gross_weight - receipt.tare_weight;
    const settlementWeight = netWeight * (1 - moistureDeductionPct - trashDeductionPct);
    const rawTotal = settlementWeight * applied_price;

    const moistureDeductionAmount = netWeight * moistureDeductionPct * applied_price;
    const trashDeductionAmount = netWeight * trashDeductionPct * applied_price;
    const totalAmount = rawTotal;

    // 3. Quyết định hạn mức tự động duyệt (Ví dụ: dưới 50 triệu tự động approved)
    const limit = settings.auto_approve_limit || 50000000;
    const status = totalAmount < limit ? "approved" : "pending_approval";

    // 4. Tạo chứng từ quyết toán
    const { data: voucher, error: vError } = await serviceClient
      .from("settlement_vouchers")
      .insert({
        organization_id: orgId,
        weighing_receipt_id,
        accountant_id: userId,
        settlement_weight: settlementWeight,
        applied_price,
        moisture_deduction_amount,
        trash_deduction_amount,
        total_amount,
        payment_method,
        status
      })
      .select()
      .single();

    if (vError) return c.json({ error: vError.message }, 400);
    return c.json({ message: "Khởi tạo phiếu quyết toán thành công.", voucher });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// =============================================================================
-- 6. INVENTORY API
// =============================================================================
app.get("/inventory/stocks", checkRole(["warehouse_keeper", "admin", "director"]), async (c) => {
  try {
    const orgId = c.get("orgId");
    const serviceClient = getSupabaseServiceClient();

    const { data, error } = await serviceClient
      .from("warehouses")
      .select("id, name, capacity_kg, current_stock_kg, description")
      .eq("organization_id", orgId);

    if (error) return c.json({ error: error.message }, 400);
    return c.json(data);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// =============================================================================
-- 7. REPORT API
// =============================================================================
app.get("/report/summary", checkRole(["accountant", "director", "admin"]), async (c) => {
  try {
    const orgId = c.get("orgId");
    const serviceClient = getSupabaseServiceClient();

    // 1. Thống kê sản lượng lúa thu mua
    const { data: receipts } = await serviceClient
      .from("weighing_receipts")
      .select("net_weight")
      .eq("organization_id", orgId)
      .eq("status", "settled");

    const totalWeight = receipts?.reduce((sum, r) => sum + (Number(r.net_weight) || 0), 0) || 0;

    // 2. Thống kê số tiền đã chi trả thực tế
    const { data: payments } = await serviceClient
      .from("payment_transactions")
      .select("amount")
      .eq("organization_id", orgId);

    const totalPaid = payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;

    // 3. Số lượng xe đang đợi nhập kho
    const { count: pendingWarehouseCount } = await serviceClient
      .from("weighing_receipts")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("status", "pending_warehouse");

    return c.json({
      total_weight_kg: totalWeight,
      total_paid_vnd: totalPaid,
      pending_warehouse_trucks: pendingWarehouseCount
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Khởi chạy HTTP Server lắng nghe request từ Supabase Edge Function
Deno.serve(app.fetch);
