<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import { ref, watch } from "vue";
import dialogForm from "./DialogForm.vue";
import { useCacheConfig } from "./hook";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import Search from "@iconify-icons/ep/search";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "User"
});

const formRef = ref();
const {
  form,
  editFormDialogVisible,
  editFormData,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleAdd,
  handleUpdate,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useCacheConfig();

watch(
  () => editFormDialogVisible.value,
  _ => {
    onSearch();
  }
);
</script>

<template>
  <div class="main">
    <div class="w-full">
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="bg-bg_color w-[99/100] pl-8 pt-4"
      >
        <el-form-item label="缓存名称：" prop="cache_name">
          <el-input
            v-model="form.cache_name"
            placeholder="请输入缓存名称"
            clearable
            class="!w-[160px]"
          />
        </el-form-item>
        <el-form-item label="SQL模板：" prop="sql_template">
          <el-input
            v-model="form.sql_template"
            placeholder="请输入SQL模板"
            clearable
            class="!w-[160px]"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="enabled">
          <el-select
            v-model="form.enabled"
            placeholder="请选择"
            clearable
            class="!w-[160px]"
          >
            <el-option label="已启用" value="1" />
            <el-option label="已禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon(Search)"
            :loading="loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <PureTableBar title="缓存管理" @refresh="onSearch">
        <template #buttons>
          <el-button
            type="primary"
            @click="handleAdd()"
            :icon="useRenderIcon(AddFill)"
          >
            新增
          </el-button>
        </template>
        <template v-slot="{ size, checkList }">
          <pure-table
            border
            align-whole="center"
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="columns"
            :checkList="checkList"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="{
              background: 'var(--el-table-row-hover-bg-color)',
              color: 'var(--el-text-color-primary)'
            }"
            re
            @selection-change="handleSelectionChange"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                @click="handleUpdate(row)"
                :icon="useRenderIcon(EditPen)"
              >
                修改
              </el-button>
              <el-popconfirm title="是否确认删除?" @confirm="handleDelete(row)">
                <template #reference>
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon(Delete)"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <dialogForm
      v-model:visible="editFormDialogVisible"
      :data="editFormData"
      :on-success="onSearch"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
