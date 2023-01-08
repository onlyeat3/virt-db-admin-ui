// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/cache_config/list",
    method: "post",
    response: () => {
      return {
        success: true,
        data: {
          list: [
            {
              id: 1,
              sql_template:
                "select 1 from a join b on a.id = b.a_id join c on c.id = a.a_id where a.a = ? and a.b = ? and a.c = ? and a.d = ? and a.e = ?",
              duration: 60,
              cache_name: "test",
              remark: "",
              enabled: 1,
              created_at: "2023-01-01 00:00:00",
              updated_at: "2023-01-01 00:00:00"
            }
          ],
          total: 100
        }
      };
    }
  }
] as MockMethod[];
