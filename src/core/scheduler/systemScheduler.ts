// Centralized System Scheduler Service
// File: src/core/scheduler/systemScheduler.ts

import { CacheManager } from "../cache/cacheManager.ts";
import { RuleEngine } from "../rules/ruleEngine.ts";
import { RuleRegistry } from "../rules/ruleRegistry.ts";

export type JobName =
  | "refreshKPI"
  | "refreshDashboard"
  | "refreshAlert"
  | "refreshInsight"
  | "refreshAIContext"
  | "scanRules"
  | "cleanupCache"
  | "archiveLog";

export interface ScheduledJob {
  name: JobName;
  intervalMs: number;
  lastRun?: string;
  action: () => Promise<void>;
}

export class SystemScheduler {
  private static instance: SystemScheduler;
  private timerIds: Record<string, number> = {};
  private jobs: Map<JobName, ScheduledJob> = new Map();

  private constructor() {
    RuleRegistry.initializeDefaultRules();
  }

  public static getInstance(): SystemScheduler {
    if (!SystemScheduler.instance) {
      SystemScheduler.instance = new SystemScheduler();
    }
    return SystemScheduler.instance;
  }

  public registerJob(job: ScheduledJob): void {
    this.jobs.set(job.name, job);
  }

  public startAll(): void {
    this.jobs.forEach(job => this.startJob(job.name));
  }

  public stopAll(): void {
    Object.keys(this.timerIds).forEach(key => {
      clearInterval(this.timerIds[key]);
    });
    this.timerIds = {};
  }

  public startJob(name: JobName): void {
    const job = this.jobs.get(name);
    if (!job || this.timerIds[name]) return;

    // Run immediately once
    job.action().then(() => {
      job.lastRun = new Date().toISOString();
    }).catch(err => console.error(`[SCHEDULER] Job ${name} error:`, err));

    // Schedule interval
    const id = setInterval(async () => {
      try {
        await job.action();
        job.lastRun = new Date().toISOString();
      } catch (err) {
        console.error(`[SCHEDULER] Job ${name} error:`, err);
      }
    }, job.intervalMs) as any;

    this.timerIds[name] = id;
  }

  public stopJob(name: JobName): void {
    if (this.timerIds[name]) {
      clearInterval(this.timerIds[name]);
      delete this.timerIds[name];
    }
  }
}

export const systemScheduler = SystemScheduler.getInstance();
export default systemScheduler;
