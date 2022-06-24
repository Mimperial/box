<template>
  <div>
    <el-dialog
      :title="title"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :visible.sync="dialogValue"
    >
      <el-form
        ref="ruleForm"
        :rules="rules"
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-background="rgba(255, 255, 255, 0.5)"
        :model="formDate"
        :label-width="formLabelWidth"
      >
        <el-form-item label="名称：" prop="name">
          <el-input
            v-model="formDate.name"
            :placeholder="$t('html.rtsp11')"
          ></el-input>
        </el-form-item>
        <el-form-item label="接入方式：" :label-width="formLabelWidth">
          <el-select
            :disabled="disabled"
            style="width: 100%"
            v-model="addType"
            :placeholder="$t('html.qxztjfs')"
          >
            <el-option
              v-for="(item, index) in addOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="addType == 3" prop="url" label="RTSP流地址：">
          <el-input
            :disabled="disabled"
            v-model="formDate.url"
            :placeholder="$t('html.rtsp15')"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="addType == 2" prop="deviceType" label="厂家：">
          <el-select
            style="width: 100%"
            :disabled="disabled"
            v-model="formDate.deviceType"
            :placeholder="$t('html.rtsp3')"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="addType == 2" prop="deviceIp" label="IP地址：">
          <el-input
            :disabled="disabled"
            v-model="formDate.deviceIp"
            :placeholder="$t('html.rtsp5')"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="addType == 2" prop="devicePort" label="端口号：">
          <el-input
            v-model="formDate.devicePort"
            :placeholder="$t('html.rtsp7')"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="addType == 2" prop="userName" label="账号：">
          <el-input
            v-model="formDate.userName"
            :placeholder="$t('html.qxzyhm')"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="addType == 2" prop="pwd" label="密码：">
          <el-input
            v-model="formDate.pwd"
            :placeholder="$t('html.rtsp2')"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            :autosize="{ minRows: 2, maxRows: 6 }"
            v-model="formDate.remark"
            :placeholder="$t('html.rtsp12')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t("html.qkx") }}</el-button>
        <el-button :disabled="loading" type="primary" @click="sureClick">{{
          $t("html.qkd")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  validatorIp,
  validatorSport1,
  validatorNumber,
} from "@/utils/validators";
export default {
  props: {
    value: {
      type: Boolean,
      require: true,
    },
    title: {
      type: String,
      default: "默认",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    defaultData: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    value(newValue) {
      this.dialogValue = newValue;
    },
    defaultData: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
          let { userName, pwd, deviceType } = newValue;
          if (!userName && !pwd && !deviceType) {
            this.addType = "3";
          } else {
            this.addType = "2";
          }
          this.formDate = newValue;
        }
      },
    },
  },
  data() {
    return {
      dialogValue: false,
      formDate: {},
      loading: false,
      typeOptions: [
        {
          value: this.$t("js.msgonve"),
          label: this.$t("js.msgonve"),
        },
        {
          value: this.$t("js.msgonbe"),
          label: this.$t("js.msgonbe"),
        },
      ],
      addOptions: [
        {
          label: this.$t("js.msgonce"),
          value: "2",
        },
        {
          label: "rtsp",
          value: "3",
        },
      ],
      addType: "2",
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 0, max: 15, message: this.$t("js.msgonje"), trigger: "blur" },
        ],
        url: [{ required: true, message: "请输入RTSP地址", trigger: "blur" }],
        deviceType: [
          { required: true, message: "请选择厂家", trigger: "blur" },
        ],
        deviceIp: [
          { required: true, message: "请输入ip地址", trigger: "blur" },
          { validator: validatorIp.bind(this), trigger: "blur" },
        ],
        devicePort: [
          { required: true, message: "请输入端口", trigger: "blur" },
          { validator: validatorSport1.bind(this), trigger: "blur" },
        ],
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        remark: [
          { min: 0, max: 100, message: this.$t("js.msgonhe"), trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    width() {
      var width = "100";
      if (this.$i18n.locale == "en") {
        width = "120";
      }
      return width;
    },
    formLabelWidth() {
      var formLabelWidth = "120px";
      if (this.$i18n.locale == "en") {
        formLabelWidth = "160px";
      }
      return formLabelWidth;
    },
  },
  methods: {
    sureClick() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$emit("sureClick", {
            loading: this.showLoading.bind(this),
            close: this.closeDialog.bind(this),
            formDate: this.formDate,
            addType: this.addType,
            resetFields: this.$refs["ruleForm"].resetFields,
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showLoading() {
      this.loading = true;
    },
    cancel() {
      this.closeDialog(true);
      this.$refs["ruleForm"].resetFields();
      this.formDate = {};
    },
    closeDialog(data = true) {
      this.$emit("input", false);
      this.loading = false;
      if (data) {
        this.dialogValue = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>