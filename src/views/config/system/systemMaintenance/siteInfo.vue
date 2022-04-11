<template>
  <div class="limian">
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
        :label="$t('html.zdbx')"
        prop="Name"
      >
        <el-input v-model="ruleForm.Name"></el-input>
      </el-form-item>
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.zdmc')"
        prop="Longitude"
      >
        <el-input v-model="ruleForm.Longitude"></el-input>
      </el-form-item>
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.jdwd')"
        prop="Latitude"
      >
        <el-input v-model="ruleForm.Latitude"></el-input>
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
import { setStationConfigApi, getStationConfigApi } from "@/api/article";
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
        Name: "",
        Longitude: "",
        Latitude: "",
      },
      rules: {
        Name: [{ required: true, message: "请输入站点名称", trigger: "blur" }],
        Longitude: [{ required: true, message: "请输入经度", trigger: "blur" }],
        Latitude: [{ required: true, message: "请输入维度", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getStationConfigApi({})
        .then((res) => {
          if (res.code == 0) {
            try {
              var data = JSON.parse(res.data);
              this.ruleForm = data;
            } catch (error) {
              console.log(error, "解析失败可能是后端传过来的值是空");
            }
          }
        })
        .catch((err) => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          setStationConfigApi(this.ruleForm)
            .then((res) => {
              if (res.code == 0) {
                this.$message({
                  message: this.$t("js.msgonxe"),
                  type: "success",
                });
                this.getData();
              }
            })
            .catch((err) => {});
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