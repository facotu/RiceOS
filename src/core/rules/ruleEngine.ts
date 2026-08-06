// Configurable Enterprise Rule Engine
// File: src/core/rules/ruleEngine.ts

export type RuleCategory = 'warehouse' | 'drying' | 'inventory' | 'payable' | 'cashflow' | 'kpi' | 'cost' | 'profit' | 'quality';
export type RuleSeverity = 'info' | 'warning' | 'critical';

export interface EnterpriseRule {
  id: string;
  name: string;
  category: RuleCategory;
  priority: number;
  severity: RuleSeverity;
  condition: (context: any) => boolean;
  recommendation: string;
  action: string;
}

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  category: RuleCategory;
  severity: RuleSeverity;
  triggered: boolean;
  recommendation: string;
  action: string;
}

export class RuleEngine {
  private static rules: EnterpriseRule[] = [];

  public static registerRule(rule: EnterpriseRule): void {
    const idx = this.rules.findIndex(r => r.id === rule.id);
    if (idx >= 0) {
      this.rules[idx] = rule;
    } else {
      this.rules.push(rule);
    }
    // Sort by priority (higher priority first)
    this.rules.sort((a, b) => b.priority - a.priority);
  }

  public static evaluateAll(context: any): RuleEvaluationResult[] {
    const results: RuleEvaluationResult[] = [];
    for (const rule of this.rules) {
      let triggered = false;
      try {
        triggered = rule.condition(context);
      } catch (err) {
        console.error(`[RULE ENGINE] Error evaluating rule ${rule.id}:`, err);
      }

      if (triggered) {
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          category: rule.category,
          severity: rule.severity,
          triggered: true,
          recommendation: rule.recommendation,
          action: rule.action
        });
      }
    }
    return results;
  }

  public static getRules(): EnterpriseRule[] {
    return [...this.rules];
  }
}
export default RuleEngine;
