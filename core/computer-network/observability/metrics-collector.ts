import { NetworkMetric, NetworkMetricType } from "./types";

export class NetworkMetricsCollector {
  private readonly metrics: NetworkMetric[] = [];

  record(
    name: string,
    type: NetworkMetricType,
    value: number,
    labels?: Record<string, string>
  ): NetworkMetric {
    if (!name.trim()) throw new Error("Metric name is required.");

    const metric: NetworkMetric = {
      name,
      type,
      value,
      timestamp: new Date().toISOString(),
      labels,
    };

    this.metrics.push(metric);
    return { ...metric };
  }

  increment(
    name: string,
    amount = 1,
    labels?: Record<string, string>
  ): NetworkMetric {
    return this.record(name, "counter", amount, labels);
  }

  gauge(
    name: string,
    value: number,
    labels?: Record<string, string>
  ): NetworkMetric {
    return this.record(name, "gauge", value, labels);
  }

  histogram(
    name: string,
    value: number,
    labels?: Record<string, string>
  ): NetworkMetric {
    return this.record(name, "histogram", value, labels);
  }

  list(name?: string): NetworkMetric[] {
    return this.metrics
      .filter((metric) => !name || metric.name === name)
      .map((metric) => ({ ...metric }));
  }

  latest(name: string): NetworkMetric | undefined {
    const matching = this.metrics.filter((metric) => metric.name === name);
    const metric = matching[matching.length - 1];
    return metric ? { ...metric } : undefined;
  }

  clear(): void {
    this.metrics.length = 0;
  }
}
