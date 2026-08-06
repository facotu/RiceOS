// Enterprise Application Layer Use Cases
// File: src/core/usecases/useCases.ts

import { CacheManager } from "../cache/cacheManager.ts";
import { ExecutiveDashboardRepository } from "../../features/executive-dashboard/repository/executiveDashboardRepository.ts";
import { ExecutiveDashboardService } from "../../features/executive-dashboard/services/executiveDashboardService.ts";
import { ExecutiveKPI } from "../../features/executive-dashboard/domain/types.ts";
import { IntelligenceEngine } from "../../features/intelligence/services/intelligenceEngine.ts";
import { AlertEngine } from "../../features/alerts/services/alertEngine.ts";
import { AIContextBuilder } from "../../features/ai/services/aiContextBuilder.ts";
import { eventBus, KPIUpdatedEvent, BusinessInsightGeneratedEvent, AlertGeneratedEvent } from "../events/eventBus.ts";

const repo = new ExecutiveDashboardRepository();
const service = new ExecutiveDashboardService(repo);

export class CalculateExecutiveKPIUseCase {
  public async execute(): Promise<ExecutiveKPI> {
    const kpi = await service.calculateKPIs();
    await CacheManager.set("executive_dashboard_cache", "latest_kpi", kpi);

    // Publish Domain Event
    await eventBus.publish(new KPIUpdatedEvent({
      totalWeightRaw: kpi.totalWeightRaw,
      expectedProfit: kpi.expectedProfit
    }));

    return kpi;
  }
}

export class GetDashboardUseCase {
  public async execute(): Promise<ExecutiveKPI> {
    const cached = await CacheManager.get<ExecutiveKPI>("executive_dashboard_cache", "latest_kpi");
    if (cached) return cached;

    // Fallback if cache missed
    const calcUseCase = new CalculateExecutiveKPIUseCase();
    return await calcUseCase.execute();
  }
}

export class RefreshDashboardUseCase {
  public async execute(): Promise<ExecutiveKPI> {
    const calcUseCase = new CalculateExecutiveKPIUseCase();
    return await calcUseCase.execute();
  }
}

export class GenerateBusinessInsightUseCase {
  public async execute(): Promise<any[]> {
    const insights = await IntelligenceEngine.analyzeBusinessInsights();
    await CacheManager.set("business_insight_cache", "latest_insights", insights);

    for (const item of insights) {
      await eventBus.publish(new BusinessInsightGeneratedEvent({
        category: item.category,
        message: item.message,
        severity: item.severity
      }));
    }

    return insights;
  }
}

export class GenerateAlertUseCase {
  public async execute(): Promise<any[]> {
    const alerts = await AlertEngine.runDiagnostics();
    await CacheManager.set("alert_cache", "latest_alerts", alerts);

    for (const item of alerts) {
      await eventBus.publish(new AlertGeneratedEvent({
        alertId: item.id,
        message: item.message,
        severity: item.severity
      }));
    }

    return alerts;
  }
}

export class RefreshAIContextUseCase {
  public async execute(): Promise<string> {
    const contextJson = await AIContextBuilder.buildERPContext();
    await CacheManager.set("ai_context_cache", "latest_context", contextJson);
    return contextJson;
  }
}
