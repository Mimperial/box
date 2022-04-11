<template>
  <div class="waibu">
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
          :label="$t('html.ysmm')"
          prop="pwdOld"
        >
          <el-input v-model="ruleForm.pwdOld"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="labelWidth"
          size="mini"
          :label="$t('html.xmm')"
          prop="pass"
        >
          <el-input type="password" v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="labelWidth"
          size="mini"
          :label="$t('html.qrxmm')"
          prop="checkPass"
        >
          <el-input type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item :label-width="labelWidth" size="mini">
          <el-button type="primary" @click="submitForm('ruleForm')">{{
            $t("html.bc")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { editPasswordApi } from "@/api/article";
import { getUserToken } from "@/utils/token.js";
import md5 from "md5";
export default {
  computed: {
    labelWidth() {
      var labelWidth = "100px";
      if (this.$i18n.locale == "en") {
        labelWidth = "150px";
      }
      return labelWidth;
    },
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("js.msgonei")));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("js.msgoneo")));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error(this.$t("js.msgonep")));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      if (value) {
        if (/[\u4E00-\u9FA5\s]/.test(value)) {
          callback(new Error(this.$t("js.amsgone")));
        } else {
          callback();
        }
      }
      callback();
    };
    var validatePass4 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("js.msgonei")));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pwdOld: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        pwdOld: [
          { validator: validatePass4, trigger: "blur" },
          { min: 1, max: 20, message: this.$t("js.dmsgone"), trigger: "blur" },
          { validator: validatePass3, trigger: "change" },
        ],
        pass: [
          { validator: validatePass, trigger: "blur" },
          { min: 1, max: 20, message: this.$t("js.fmsgone"), trigger: "blur" },
          { validator: validatePass3, trigger: "change" },
        ],
        checkPass: [
          { validator: validatePass2, trigger: "blur" },
          { validator: validatePass3, trigger: "change" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editPasswordApi({
            userId: getUserToken(),
            pwdOld: md5(this.ruleForm.pwdOld),
            pwdNew: md5(this.ruleForm.pass),
          }).then((res) => {
            // if(res.code == -2){
            //   this.$message({
            //     message: "原始密码输入错误",
            //     type: "warning",
            //   });
            // }
            if (res.code == 0) {
              this.$message({
                message: this.$t("js.gmsgone"),
                type: "success",
              });
              this.$store.dispatch("LogOut").then((res) => {
                this.$router.push("/");
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
.waibu {
  padding-left: 30px;
  @media screen and (max-width: 530px) {
    padding-left: 10px;
  }
}
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

