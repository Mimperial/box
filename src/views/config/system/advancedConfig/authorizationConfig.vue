<template>
  <div class="limian">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="140px"
      class="demo-ruleForm"
    >
      <el-form-item size="mini" :label-width="labelWidth" :label="$t('html.dsfzxfwq')" prop="url">
        <el-input v-model="ruleForm.url"></el-input>
      </el-form-item>
      <el-form-item size="mini" :label-width="labelWidth" :label="$t('html.sfkq')">
        <el-checkbox v-model="ruleForm.armVod">{{$t('html.zxztzxlx')}}</el-checkbox>
      </el-form-item>
      <el-form-item size="mini" :label-width="labelWidth">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >{{$t('html.bc')}}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setHttpPushApi, getHttpPushApi } from "@/api/article";
export default {
  computed: {
    labelWidth() {
      var labelWidth = "140px";
      if (this.$i18n.locale == "en") {
        labelWidth = "190px";
      }
      return labelWidth;
    },
  },
  data() {
    return {
      ruleForm: {
        url: "",
        armVod: "",
      },
      rules: {
        url: [
          { required: true, message: this.$t('js.msguone'), trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getHttpPushApi({}).then((res) => {
        if (res.code == 0) {
          var data = (res.data&&res.data !=" ")?JSON.parse(res.data)[0]:{}
          data.armVod = data.armVod == 0 ? true : false;
          this.ruleForm = data;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          setHttpPushApi({
            url: this.ruleForm.url,
            armVod: this.ruleForm.armVod ? "0" : "1",
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: this.$t('js.gmsgone'),
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