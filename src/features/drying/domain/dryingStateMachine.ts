// Drying process state machine configuration and validator
// File: src/features/drying/domain/dryingStateMachine.ts

export type DryingState = 'WAITING' | 'LOADING' | 'DRYING' | 'COOLING' | 'QUALITY_CHECK' | 'COMPLETED' | 'CLOSED';

export class DryingStateMachine {
  private static readonly transitions: Record<DryingState, DryingState[]> = {
    WAITING: ['LOADING'],
    LOADING: ['DRYING'],
    DRYING: ['COOLING'],
    COOLING: ['QUALITY_CHECK'],
    QUALITY_CHECK: ['COMPLETED'],
    COMPLETED: ['CLOSED'],
    CLOSED: [] // CLOSED is terminal state
  };

  public static transition(current: DryingState, next: DryingState): DryingState {
    if (current === 'CLOSED') {
      throw new Error("Lò sấy đã đóng mẻ hoàn toàn (CLOSED), không thể chuyển sang trạng thái khác.");
    }

    const allowed = this.transitions[current];
    if (!allowed.includes(next)) {
      throw new Error(`Chuyển trạng thái sai quy trình lò sấy: Không được phép đi từ [${current}] sang [${next}].`);
    }

    return next;
  }
}
export default DryingStateMachine;
