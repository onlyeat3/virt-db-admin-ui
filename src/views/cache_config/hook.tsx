import { getCacheConfigList } from "@/api/system";
import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { ElMessageBox } from "element-plus";
import { computed, onMounted, reactive, ref } from "vue";

export function useCacheConfig() {
  const form = reactive({
    cache_name: null,
    sql_template: null,
    enabled: null
  });
  const editFormDialogVisible = ref(false);
  const editFormData = ref({});
  const dataList = ref([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "id",
      prop: "id",
      minWidth: 130
    },
    {
      label: "缓存名",
      prop: "cache_name",
      minWidth: 130
    },
    {
      label: "有效时长(秒)",
      prop: "duration",
      minWidth: 130
    },
    {
      label: "SQL template",
      prop: "sql_template",
      minWidth: 80,
      cellRenderer: scope => (
        <el-tooltip
          class="box-item"
          effect="dark"
          content={scope.row.sql_template}
          placement="top-start"
        >
          {scope.row.sql_template?.substring(0, 80) + "..."}
        </el-tooltip>
      )
    },
    {
      label: "创建时间",
      prop: "created_at",
      minWidth: 90
    },
    {
      label: "最后修改时间",
      prop: "updated_at",
      minWidth: 90
    },
    {
      label: "状态",
      prop: "enabled",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          width="60"
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.enabled}
          active-value={1}
          inactive-value={0}
          active-text="已启用"
          inactive-text="已禁用"
          inline-prompt
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.cache_name
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message("已成功修改状态", {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function handleUpdate(row) {
    editFormDialogVisible.value = true;
    editFormData.value = row;
    console.log(row);
  }

  function handleAdd() {
    editFormDialogVisible.value = true;
    editFormData.value = {};
    console.log(editFormData);
  }

  function handleDelete(row) {
    console.log(row);
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const reqParam = {
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    Object.assign(reqParam, form);
    const { data } = await getCacheConfigList(reqParam);
    dataList.value = data.list;
    pagination.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    editFormDialogVisible,
    editFormData,
    loading,
    columns,
    dataList,
    pagination,
    buttonClass,
    onSearch,
    resetForm,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}