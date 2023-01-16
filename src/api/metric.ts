import { http } from "@/utils/http";

export type MetricListResult = {
  success: boolean;
  data: {
    list: Array<Metric>;
    total: number;
  };
};

export type Metric = {
  sqlStr: string;
  avgDurations: Array<number>;
  execCounts: Array<number>;
  dates: Array<string>;
  minDurations: Array<number>;
  maxDurations: Array<number>;
  cacheHitCounts: Array<number>;
};

/** 图表数据 */
export const listSQL = (data?: object) => {
  return http.request<MetricListResult>("post", "/metric/list_sql", { data });
};
