// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/metric/list_sql",
    method: "post",
    response: ({ _ }) => {
      return {
        success: true,
        data: {
          total: 10,
          list: [
            {
              sql_str:
                "select zu. account 用户账号, zu. realname 姓名, za. `date` 操作时间, za. actor 操作人, zd. name 部门,( select GROUP_CONCAT( zg. `name` separator ',') from zt_group zg join zt_usergroup zug on zg. id = zug. `group` where zug. account = zu. account) as 分组 from zt_user zu, zt_action za, zt_dept zd where zu. id = za. objectID and zd. id = zu. dept and za. objectType = 'user' and za. `action` = 'created' and zu. deleted = '0'",
              avgDurations: [3, 1, 1],
              execCounts: [1, 2, 4],
              cacheHitCount: [0, 2, 3],
              dates: [
                "2023-01-15 04:24:42",
                "2023-01-15 04:25:12",
                "2023-01-15 04:27:13"
              ]
            }
          ]
        }
      };
    }
  }
] as MockMethod[];
