<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "@/utils/message";
import { FormInstance } from "element-plus";
import { createOrUpdateCacheConfig } from "@/api/system";

const status_options = [
  {
    value: 0,
    label: "禁用"
  },
  {
    value: 1,
    label: "启用"
  }
];
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const ruleFormRef = ref<FormInstance>();

const formVisible = ref(false);
const formData = ref(props.data);

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      const req_param = {};
      Object.assign(req_param, formData.value);
      createOrUpdateCacheConfig(req_param).then(result => {
        console.log("result", result);
        if (result.success) {
          message("提交成功", { type: "success" });
          formVisible.value = false;
          resetForm(formEl);
        }
      });
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const closeDialog = () => {
  formVisible.value = false;
  resetForm(ruleFormRef.value);
};

const emit = defineEmits(["update:visible"]);
watch(
  () => formVisible.value,
  val => {
    emit("update:visible", val);
  }
);

watch(
  () => props.visible,
  val => {
    formVisible.value = val;
  }
);

watch(
  () => props.data,
  val => {
    formData.value = val;
  }
);

const rules = {
  cache_name: [{ required: true, message: "请输入缓存名称", trigger: "blur" }]
};
</script>

<template>
  <el-dialog
    v-model="formVisible"
    title="新建产品"
    :width="680"
    draggable
    :before-close="closeDialog"
  >
    <!-- 表单内容 -->
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="缓存名称" prop="cache_name">
        <el-input
          v-model="formData.cache_name"
          :style="{ width: '480px' }"
          placeholder="请输入缓存名称"
        />
      </el-form-item>
      <el-form-item label="有效时长(秒)" prop="duration">
        <el-input
          v-model.number="formData.duration"
          :style="{ width: '480px' }"
          placeholder="请输入缓存时长"
        />
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-select-v2
          v-model="formData.enabled"
          :options="status_options"
          placeholder="请选择状态"
        />
      </el-form-item>
      <el-form-item label="SQL模板" prop="sql_template">
        <el-input
          v-model="formData.sql_template"
          type="textarea"
          :style="{ width: '480px' }"
          placeholder="请输入SQL模板"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :style="{ width: '480px' }"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
