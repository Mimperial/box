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
        size="mini"
        :label-width="labelWidth"
        :label="$t('html.fwqdz')"
        prop="ip"
      >
        <el-input v-model="ruleForm.ip"></el-input>
      </el-form-item>
      <el-form-item
        size="mini"
        :label-width="labelWidth"
        :label="$t('html.dk')"
        prop="port"
      >
        <el-input v-model="ruleForm.port"></el-input>
      </el-form-item>
      <el-form-item
        size="mini"
        :label-width="labelWidth"
        :label="$t('html.account')"
        prop="user"
      >
        <el-input v-model="ruleForm.user"></el-input>
      </el-form-item>
      <el-form-item
        size="mini"
        :label-width="labelWidth"
        :label="$t('html.password')"
        prop="pwd"
      >
        <el-input type="password" v-model="ruleForm.pwd"></el-input>
      </el-form-item>
      <el-form-item
        size="mini"
        :label-width="labelWidth"
        :label="$t('html.mmqr')"
        prop="surePassword"
      >
        <el-input type="password" v-model="ruleForm.surePassword"></el-input>
      </el-form-item>
      <el-form-item
        size="mini"
        :label-width="labelWidth"
        :label="$t('html.yjml')"
        prop="flag"
      >
        <el-select v-model="ruleForm.flag" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item size="mini" :label-width="labelWidth">
        <div class="defaltz btnli" @click="testFtp">
          {{ $t("html.cs") }}
        </div>
        <!-- <el-button @click="testFtp">{{ $t("html.cs") }}</el-button> -->
      </el-form-item>
      <el-form-item size="mini" :label-width="labelWidth">
        <el-button type="primary" @click="submitForm('ruleForm')">{{
          $t("html.bc")
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setFtpInfoApi, getFtpInfoApi, testFtpApi } from "@/api/article";
import { validatorIp } from "@/utils/validators";
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
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("js.msgonei")));
      } else {
        if (this.ruleForm.surePassword !== "") {
          this.$refs.ruleForm.validateField("surePassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("js.msgoneo")));
      } else if (value !== this.ruleForm.pwd) {
        callback(new Error(this.$t("js.msgonep")));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        ip: "",
        port: "",
        user: "",
        pwd: "",
        surePassword: "",
        flag: "",
      },
      options: [
        {
          value: "0",
          label: this.$t("js.msgyone"),
        },
        {
          value: "1",
          label: this.$t("js.msgtone"),
        },
      ],
      rules: {
        ip: [
          { required: true, message: this.$t("js.fzfwqdz"), trigger: "blur" },
          {
            validator: validatorIp.bind(this),
            trigger: "blur",
          },
        ],
        port: [
          { required: true, message: this.$t("js.msgrone"), trigger: "blur" },
          {
            pattern:
              /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t("js.msgjone"),
            trigger: "change",
          },
        ],
        user: [
          { required: true, message: this.$t("js.msgeone"), trigger: "blur" },
        ],
        pwd: [{ validator: validatePass, trigger: "blur" }],
        surePassword: [{ validator: validatePass2, trigger: "blur" }],
        flag: [
          { required: true, message: this.$t("js.msgwone"), trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    testFtp() {
      let { ip, port, user, pwd } = this.ruleForm;
      testFtpApi({
        Ip: ip,
        Port: port,
        User: user,
        Passwd: pwd,
      }).then((res) => {
        if (res.data && JSON.parse(res.data).Code == 0) {
          this.$message({
            type: "success",
            message: this.$t("js.msgsone"),
          });
        } else {
          this.$message({
            type: "error",
            message: this.$t("js.msgaone"),
          });
        }
      });
    },
    getData() {
      getFtpInfoApi({}).then((res) => {
        if (res.code == 0) {
          this.ruleForm =
            res.data && res.data != " " ? JSON.parse(res.data)[0] : {};
          if (res.data && res.data != " ") {
            var obj = JSON.parse(res.data)[0];
            obj.surePassword = obj.pwd;
            this.ruleForm = obj;
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { ip, port, user, pwd, flag } = this.ruleForm;
          setFtpInfoApi({
            ip: ip,
            port: port,
            user: user,
            pwd: pwd,
            flag: flag,
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: this.$t("js.gmsgone"),
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
.defaltz {
  width: 100%;
  height: 28px;
  font-size: 13px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid #409eff;
  color: #409eff;
  user-select: none;
  &:hover {
    color: #409eff;
    background-color: #ecf5ff;
  }
}
</style>