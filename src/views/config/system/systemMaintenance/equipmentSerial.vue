<template>
  <div class="equipmentSerial">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.sbmc')"
        prop="devName"
      >
        <el-input v-model="ruleForm.devName"></el-input>
      </el-form-item>
      <el-form-item
        size="mini"
        :label-width="labelWidth"
        :label="$t('html.sbbh')"
        prop="devNumber"
      >
        <el-input v-model="ruleForm.devNumber"></el-input>
      </el-form-item>
      <!-- <el-form-item
        size="mini"
        :label-width="labelWidth"
        :label="$t('html.eqType')"
        prop="devType"
      >
        <el-input :disabled="true" v-model="ruleForm.devType"></el-input>
      </el-form-item>
      <el-form-item
        size="mini"
        :label-width="labelWidth"
        :label="$t('html.sbxlh')"
        prop="serialNo"
      >
        <el-input :disabled="true" v-model="ruleForm.serialNo"></el-input>
      </el-form-item>
      <el-form-item
        size="mini"
        :label-width="labelWidth"
        :label="$t('html.zkbb')"
        prop="versionMain"
      >
        <el-input :disabled="true" v-model="ruleForm.versionMain"></el-input>
      </el-form-item>
      <el-form-item
        size="mini"
        :label-width="labelWidth"
        :label="$t('html.webbb')"
        prop="versionWeb"
      >
        <el-input :disabled="true" v-model="ruleForm.versionWeb"></el-input>
      </el-form-item> -->
      <el-form-item size="mini">
        <el-button type="primary" @click="submitForm('ruleForm')">{{
          $t("html.bc")
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDevInfoApi, setDevInfoApi } from "@/api/article";
export default {
  computed: {
    labelWidth() {
      var labelWidth = "120px";
      if (this.$i18n.locale == "en") {
        labelWidth = "150px";
      }
      return labelWidth;
    },
  },
  data() {
    return {
      ruleForm: {
        devName: "",
        devNumber: "",
        devType: "",
        serialNo: "",
        versionMain: "",
        versionWeb: "",
      },
      rules: {
        devName: [
          { required: true, message: this.$t("js.sbmc"), trigger: "blur" },
          { max: 30, message: this.$t("js.cdrule"), trigger: "change" },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9-_]+$/,
            message: this.$t("js.onlyzzfs"),
            trigger: "change",
          },
        ],
        devNumber: [
          { required: true, message: this.$t("js.fzsbbh"), trigger: "blur" },
          { max: 30, message: this.$t("js.cdrule"), trigger: "change" },
          {
            pattern: /^[a-zA-Z0-9-_]+$/,
            message: this.$t("js.onlyzsf"),
            trigger: "change",
          },
        ],
        devType: [
          { required: true, message: this.$t("js.fzsblx"), trigger: "blur" },
        ],
        serialNo: [
          { required: true, message: this.$t("js.fzsbxl"), trigger: "blur" },
        ],
        versionMain: [
          { required: true, message: this.$t("js.fzsbzkbb"), trigger: "blur" },
        ],
        versionWeb: [
          { required: true, message: this.$t("js.fzwebbb"), trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getDevInfoApi({}).then((res) => {
        if (res.code == 0) {
          if (res.data) {
            var data = JSON.parse(res.data)[0];
            this.ruleForm = data;
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          setDevInfoApi(this.ruleForm).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: this.$t("js.gmsgone"),
                type: "success",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.equipmentSerial {
  width: 382px;
  .el-button {
    width: 100%;
  }
}
</style>