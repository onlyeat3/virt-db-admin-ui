<template>
  <div>
    <div class="w-full">
      <el-button
        type="primary"
        :icon="useRenderIcon(Refresh)"
        :loading="refreshing"
        @click="refresh"
      />
    </div>
    <el-space wrap>
      <el-card
        class="box-card"
        shadow="never"
        :key="index"
        v-for="(option, index) in chartOptions"
      >
        <template #header>
          <div class="card-header">
            <div style="font-size: 12px; margin-right: 10px">
              {{ option.durationChartOption.sqlStr }}
            </div>
            <el-button
              type="primary"
              :icon="Setting"
              @click="handleAddCacheConfig(option.durationChartOption.sqlStr)"
            />
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="24">
            <v-chart class="chart" :option="option.durationChartOption" />
          </el-col>
          <el-divider />
          <el-col :span="24">
            <v-chart class="chart" :option="option.countChartOption" />
          </el-col>
        </el-row>
      </el-card>
      <el-pagination
        background
        layout="prev, pager, next,jumper"
        v-model:current-page="queryParam.pageParam.pageNo"
        v-model:page-size="queryParam.pageParam.pageSize"
        @size-change="refresh"
        @current-change="refresh"
        :total="total"
      />
    </el-space>
    <dialogForm v-model:visible="editFormDialogVisible" :data="editFormData" />
  </div>
</template>

<script lang="ts" setup>
import Refresh from "@iconify-icons/ep/refresh";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { listSQL } from "@/api/metric";
import { Setting } from "@element-plus/icons-vue";
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent
} from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { ref } from "vue";
import VChart from "vue-echarts";
import dialogForm from "@/views/cache_config/DialogForm.vue";
import { useCacheConfig } from "@/views/cache_config/hook";

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
  }
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
  width: 800px;
  height: 600px;
  margin: 10px 0 0 10px;
  border: 1px solid transparent;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
