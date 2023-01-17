<template>
  <div>
    <div class="w-full">
      <el-form
        ref="formRef"
        :inline="true"
        :model="queryParam"
        class="bg-bg_color w-[99/100] pl-8 pt-4"
      >
        <el-form-item label="SQL" prop="sql">
          <el-input
            v-model="queryParam.sql"
            @keydown.enter="refresh"
            placeholder="请输入要查询的SQL,支持模糊匹配"
            clearable
            class="!w-[800px]"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon(Search)"
            :loading="refreshing"
            @click="refresh"
          >
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-space>
      <el-card
        class="box-card"
        shadow="never"
        :key="index"
        v-for="(option, index) in chartOptions"
      >
        <template #header>
          <div class="card-header">
            <div style="font-size: 10px; margin-right: 10px">
              <el-popover placement="top" :width="1000">
                <code>{{ option.durationChartOption.sqlStr }}</code>
                <template #reference>
                  <div class="hide-more">
                    {{ option.durationChartOption.sqlStr }}
                  </div>
                </template>
              </el-popover>
            </div>
            <el-button
              type="primary"
              :icon="Setting"
              @click="handleAddCacheConfig(option.durationChartOption.sqlStr)"
            />
          </div>
        </template>
        <el-row>
          <el-col :span="12">
            <v-chart class="chart" :option="option.durationChartOption" />
          </el-col>
          <el-divider />
          <el-col :span="12">
            <v-chart class="chart" :option="option.countChartOption" />
          </el-col>
        </el-row>
      </el-card>
    </el-space>
    <el-row>
      <el-col :span="16" />
      <el-col :span="8">
        <el-pagination
          style="margin-top: 10px"
          background
          layout="prev, pager, next,jumper"
          v-model:current-page="queryParam.pageParam.pageNo"
          v-model:page-size="queryParam.pageParam.pageSize"
          @size-change="refresh"
          @current-change="refresh"
          :total="total"
        />
      </el-col>
    </el-row>
    <dialogForm v-model:visible="editFormDialogVisible" :data="editFormData" />
  </div>
</template>

<script lang="ts" setup>
import { listSQL } from "@/api/metric";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import dialogForm from "@/views/cache_config/DialogForm.vue";
import { useCacheConfig } from "@/views/cache_config/hook";
import { Setting } from "@element-plus/icons-vue";
import Search from "@iconify-icons/ep/search";
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ref } from "vue";
import VChart from "vue-echarts";

use([CanvasRenderer, TitleComponent, TooltipComponent, LegendComponent]);

// provide(THEME_KEY, "dark");

const { editFormDialogVisible, editFormData, handleUpdate } = useCacheConfig();

const handleAddCacheConfig = sql => {
  handleUpdate({ sql_template: sql, enabled: 1 });
};

const chartOptions = ref([]);
const total = ref(0);
const queryParam = ref({
  pageParam: {
    pageNo: 1,
    pageSize: 4
  },
  sql: ""
});

const refreshing = ref(false);

const refresh = async () => {
  chartOptions.value = [];
  refreshing.value = true;
  const r = await listSQL(queryParam.value);
  const { data } = r;
  total.value = data.total;
  refreshing.value = false;
  data.list.forEach(metric_result => {
    const durationChartOption = {
      sqlStr: metric_result.sqlStr,
      title: {
        text: "耗时"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["avg", "min", "max"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: metric_result.dates
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "avg",
          type: "line",
          data: metric_result.avgDurations,
          smooth: true
        },
        {
          name: "min",
          type: "line",
          data: metric_result.minDurations,
          smooth: true
        },
        {
          name: "max",
          type: "line",
          data: metric_result.maxDurations,
          smooth: true
        }
      ]
    };

    const countChartOption = {
      sqlStr: metric_result.sqlStr,
      title: {
        text: "执行次数"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["总次数", "缓存命中次数"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: metric_result.dates
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "总次数",
          type: "line",
          data: metric_result.execCounts,
          smooth: true
        },
        {
          name: "缓存命中次数",
          type: "line",
          data: metric_result.cacheHitCounts,
          smooth: true
        }
      ]
    };
    const option = {
      durationChartOption,
      countChartOption
    };
    chartOptions.value.push(option);
  });
};

refresh();
</script>

<style scoped>
.chart {
  height: 200px;
  /* margin-bottom: 20px; */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 400px;
  height: 560px;
  margin: 10px 13px 0 0px;
  border: 1px solid transparent;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
}

.hide-more {
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
