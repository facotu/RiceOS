// Approval Workflow State Machine for RiceOS settlements
// File: src/features/accounting/domain/stateMachine.ts

import { SettlementState } from "./types.ts";

export class SettlementStateMachine {
  // Bản đồ các bước chuyển trạng thái hợp lệ
  private static transitions: Record<SettlementState, SettlementState[]> = {
    draft: ['pending_approval'],
    pending_approval: ['approved', 'rejected'],
    approved: ['completed'],
    rejected: ['draft'], // Cho phép sửa lại phiếu nháp khi bị bác bỏ
    completed: [] // Trạng thái cuối cùng
  };

  // Xác minh tính hợp lệ của việc chuyển trạng thái
  public static canTransition(current: SettlementState, next: SettlementState): boolean {
    const allowed = this.transitions[current] || [];
    return allowed.includes(next);
  }

  // Đưa ra trạng thái tiếp theo hoặc báo lỗi chuyển trạng thái sai quy trình
  public static transition(current: SettlementState, next: SettlementState): SettlementState {
    if (!this.canTransition(current, next)) {
      throw new Error(`Chuyển trạng thái quy trình sai luật: Từ [${current}] sang [${next}] không được phép.`);
    }
    return next;
  }
}
