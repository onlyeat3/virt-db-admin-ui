import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: {
    list: Array<CacheConfig>;
    total: number;
  };
};
export type CacheConfig = {
  id: number;
  sql_template: String;
  duration: number;
  cache_name: String;
  remark: String;
  enabled: number;
  created_at: String;
  updated_at: String;
};

/** 获取缓存配置列表 */
export const getCacheConfigList = (data?: object) => {
  return http.request<Result>("post", "/cache_config/list", {
    data
  });
};

/** 获取缓存配置列表 */
export const createOrUpdateCacheConfig = (data?: object) => {
  return http.request<Result>("post", "/cache_config/createOrUpdate", {
    data
  });
};
