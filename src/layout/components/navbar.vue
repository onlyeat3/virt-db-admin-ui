<script setup lang="ts">
import { reactive, ref } from "vue";
import globalization from "@/assets/svg/globalization.svg?component";
import { useNav } from "@/layout/hooks/useNav";
import Check from "@iconify-icons/ep/check";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import { useTranslationLang } from "../hooks/useTranslationLang";
import Search from "./search/index.vue";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import mixNav from "./sidebar/mixNav.vue";
import topCollapse from "./sidebar/topCollapse.vue";
import { IconifyIconOffline, IconifyIconOnline } from "@/components/ReIcon";
import {
  FormInstance,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  FormRules
} from "element-plus";
import { PasswordUpdateParam, updatePasswordApi } from "@/api/user";
import { transformI18n, $t } from "@/plugins/i18n";

const {
  layout,
  device,
  logout,
  pureApp,
  username,
  avatarsStyle,
  toggleSideBar,
  getDropdownItemStyle,
  getDropdownItemClass
} = useNav();

const { t, locale, translationCh, translationEn } = useTranslationLang();

const passwordUpdateFormRef = ref<FormInstance>();
const passwordUpdateDialogForm = ref<PasswordUpdateParam>({
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: ""
});
const passwordUpdateDialogVisiable = ref(false);
const handleOpenUpdatePasswordDialog = () => {
  passwordUpdateDialogVisiable.value = true;
};

const resetForm = () => {
  if (!passwordUpdateFormRef.value) {
    return;
  }
  passwordUpdateFormRef.value.resetFields();
};

const whenUpdatePasswordDialogClosing = () => {
  resetForm();
  passwordUpdateDialogVisiable.value = false;
};
const handleUpdatePassword = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      updatePasswordApi(passwordUpdateDialogForm.value).then(result => {
        if (result.success) {
          passwordUpdateDialogVisiable.value = false;
          resetForm();
        }
      });
    }
  });
};

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

/** 登录校验 */
const passwordUpdateFormRules = reactive<FormRules>({
  currentPassword: [
    {
      required: true,
      message: transformI18n($t("validate.currentPassword")),
      trigger: "blur"
    }
  ],
  newPassword: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("validate.newPassword"))));
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error(transformI18n($t("login.passwordRuleReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  newPasswordConfirm: [
    {
      required: true,
      message: transformI18n($t("validate.newPasswordConfirm")),
      trigger: "blur"
    },
    {
      required: true,
      trigger: "blur",
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("validate.newPasswordConfirm"))));
        } else if (value != passwordUpdateDialogForm.value.newPassword) {
          callback(
            new Error(transformI18n($t("validate.newPasswordConfirmNotValid")))
          );
        } else {
          callback();
        }
      }
    }
  ]
});
</script>

<template>
  <div
    class="navbar bg-[#fff] shadow-sm shadow-[rgba(0, 21, 41, 0.08)] dark:shadow-[#0d0d0d]"
  >
    <topCollapse
      v-if="device === 'mobile'"
      class="hamburger-container"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />

    <Breadcrumb
      v-if="layout !== 'mix' && device !== 'mobile'"
      class="breadcrumb-container"
    />

    <mixNav v-if="layout === 'mix'" />

    <div v-if="layout === 'vertical'" class="vertical-header-right">
      <!-- 菜单搜索 -->
      <Search />
      <!-- 通知 -->
      <!-- <Notice id="header-notice" /> -->
      <!-- 国际化 -->
      <el-dropdown id="header-translation" trigger="click">
        <globalization
          class="navbar-bg-hover w-[40px] h-[48px] p-[11px] cursor-pointer outline-none"
        />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'zh')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"
              @click="translationCh"
            >
              <IconifyIconOffline
                class="check-zh"
                v-show="locale === 'zh'"
                :icon="Check"
              />
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'en')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'en')]"
              @click="translationEn"
            >
              <span class="check-en" v-show="locale === 'en'">
                <IconifyIconOffline :icon="Check" />
              </span>
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover select-none">
          <img
            src="https://avatars.githubusercontent.com/u/44761321?v=4"
            :style="avatarsStyle"
          />
          <p v-if="username" class="dark:text-white">{{ username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="navbar-dropdown-menu">
            <el-dropdown-item @click="handleOpenUpdatePasswordDialog">
              <IconifyIconOnline
                icon="ri:lock-password-line"
                style="margin: 5px"
              />
              {{ t("buttons.hsUpdatePassword") }}
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              {{ t("buttons.hsLoginOut") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- <span class="set-icon navbar-bg-hover" :title="t('buttons.hssystemSet')" @click="onPanel">
        <IconifyIconOffline :icon="Setting" />
      </span> -->
    </div>
    <el-dialog
      :before-close="whenUpdatePasswordDialogClosing"
      v-model="passwordUpdateDialogVisiable"
      title="修改密码"
      :width="480"
      draggable
    >
      <el-form
        ref="passwordUpdateFormRef"
        :model="passwordUpdateDialogForm"
        :rules="passwordUpdateFormRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            type="password"
            v-model="passwordUpdateDialogForm.currentPassword"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            v-model="passwordUpdateDialogForm.newPassword"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="newPasswordConfirm">
          <el-input
            type="password"
            v-model="passwordUpdateDialogForm.newPasswordConfirm"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="whenUpdatePasswordDialogClosing">取消</el-button>
          <el-button
            type="primary"
            @click="handleUpdatePassword(passwordUpdateFormRef)"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;

  .hamburger-container {
    line-height: 48px;
    height: 100%;
    float: left;
    cursor: pointer;
  }

  .vertical-header-right {
    display: flex;
    min-width: 280px;
    height: 48px;
    align-items: center;
    color: #000000d9;
    justify-content: flex-end;

    .el-dropdown-link {
      height: 48px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      cursor: pointer;
      color: #000000d9;

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

.navbar-dropdown-menu {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    min-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
  }
}
</style>
