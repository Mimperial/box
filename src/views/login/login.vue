<template>
  <div class="login-container">
    <language></language>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      class="login-form"
      label-position="left"
    >
      <div class="title-container">
        <!-- <h3 class="title">智能边缘计算终端管理平台</h3> -->
        <h3 class="title">移动安防安保智能分析应用平台</h3>
        <!-- <h3 class="title">{{ $t("html.rtsp16") }}</h3> -->
      </div>
      <shakeInput
        :account="ruleForm.userName"
        :password="ruleForm.pwd"
        @login="login"
      />
    </el-form>
  </div>
</template>

<script>
import shakeInput from "./shakeIput.vue";
import md5 from "md5";
import language from "@/components/language.vue";
export default {
  data() {
    return {
      ruleForm: {
        // userName: "system",
        // pwd: "objecteye4U",
        userName: "",
        pwd: "",
      },
    };
  },
  components: { shakeInput, language },
  methods: {
    login(account, password) {
      this.ruleForm.userName = account;
      this.ruleForm.pwd = md5(password);
      this.$store.dispatch("Login", this.ruleForm).then((res) => {
        if (res.code == 0) {
          this.$router.push("/home");
        }
      });
    },
  },
};
</script>

<style lang="scss">
.login-container {
  height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;

    width: 520px;
    max-width: 100%;
    padding: 170px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    text-align: center;
    font-size: 22px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.el-form-item {
  position: relative;
  &.red {
    border: 1px solid red !important;
    transition: all 0.3s;
  }
}
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
