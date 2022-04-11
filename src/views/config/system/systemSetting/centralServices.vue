<template>
  <div class="limian" :style="{width:width}">
    <el-form
      :model="ruleForm"
      :rules="rules"
      label-position="left"
      ref="ruleForm"
      label-width="140px"
      class="demo-ruleForm"
    >
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.kqzxglfw')"
      >
        <el-tooltip
          :content="ruleForm.status ? $t('html.kq') : $t('html.gb')"
          placement="top"
        >
          <el-switch v-model="ruleForm.status"> </el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.fwqdz')"
        prop="url"
      >
        <el-input v-model="ruleForm.url"></el-input>
      </el-form-item>
      <el-form-item
        size="mini"
        :label-width="labelWidth"
        :label="$t('html.sbbjxx')"
      >
        <el-tooltip
          :content="ruleForm.flagArm ? $t('html.sc') : $t('html.wsc')"
          placement="top"
        >
          <el-switch v-model="ruleForm.flagArm"> </el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.sfscbjsp')"
      >
        <el-checkbox v-model="ruleForm.flagVod">{{
          $t("html.bjsp")
        }}</el-checkbox>
      </el-form-item>
      <el-form-item :label-width="labelWidth" size="mini">
        <el-button type="primary" @click="submitForm('ruleForm')">{{
          $t("html.bc")
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSentreServerApi, setSentreServerApi } from "@/api/article";
export default {
  computed: {
    labelWidth() {
      var labelWidth = "140px";
      if (this.$i18n.locale == "en") {
        labelWidth = "270px";
      }
      return labelWidth;
    },
    width(){
      var width = "382px";
      if (this.$i18n.locale == "en") {
        width = "500px";
      }
      return width;
    }
  },
  data() {
    return {
      ruleForm: {
        status: false,
        url: "",
        flagArm: false,
        flagVod: false,
      },
      rules: {
        url: [
          { required: true, message: this.$t("js.fzfwqdz"), trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getSentreServerApi({}).then((res) => {
        if (res.code == 0) {
          let { status, url, flagArm, flagVod } = res.data
            ? JSON.parse(res.data)[0]
            : {};
          this.ruleForm.status = status == 0 ? true : false;
          this.ruleForm.url = url;
          this.ruleForm.flagArm = flagArm == 0 ? true : false;
          this.ruleForm.flagVod = flagVod == 0 ? true : false;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { status, url, flagArm, flagVod } = this.ruleForm;
          setSentreServerApi({
            status: status ? "0" : "1",
            url: url,
            flagArm: flagArm ? "0" : "1",
            flagVod: flagVod ? "0" : "1",
          }).then((res) => {
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
.limian {
  width: 382px;
  @media screen and (max-width: 530px) {
    width: 100%;
  }
  .el-button {
    width: 100%;
  }
}
</style>