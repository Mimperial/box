<template>
  <div class="limian">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.zdhqip')"
      >
        <el-tooltip
          :content="ruleForm.type == -1 ? $t('html.gb') : $t('html.kq')"
          placement="top"
        >
          <el-switch
            v-model="ruleForm.type"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.ipv4dz')"
        prop="ip"
      >
        <el-input v-model="ruleForm.ip"></el-input>

        <div @click="testIp" class="button">{{ $t("html.cs") }}</div>
      </el-form-item>
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.ipv4zwym')"
        prop="mask"
      >
        <el-input v-model="ruleForm.mask"></el-input>
      </el-form-item>
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.ipv4wg')"
        prop="gateway"
      >
        <el-input v-model="ruleForm.gateway"></el-input>
      </el-form-item>
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.sxdns')"
        prop="nds"
      >
        <el-input v-model="ruleForm.nds"></el-input>
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
import { setNetCardInfoApi, getNetCardInfoApi, testIpApi } from "@/api/article";
import { validatorIp } from "@/utils/validators";
export default {
  props: ["etc"],
  computed: {
    labelWidth() {
      var labelWidth = "120px";
      if (this.$i18n.locale == "en") {
        labelWidth = "170px";
      }
      return labelWidth;
    },
  },
  data() {
    return {
      ruleForm: {
        name: this.etc,
        type: 1,
        ip: "",
        mask: "",
        gateway: "",
        nds: "",
      },
      rules: {
        ip: [
          { required: true, message: this.$t("js.msghone"), trigger: "blur" },
          { validator: validatorIp.bind(this), trigger: "blur" },
        ],
        mask: [
          { required: true, message: this.$t("js.msggone"), trigger: "blur" },
          {
            pattern:
              /^(254|252|248|240|224|192|128)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/,
            message: this.$t("js.msgjone"),
            trigger: "blur",
          },
        ],
        gateway: [
          { required: true, message: this.$t("js.msgfone"), trigger: "blur" },
          { validator: validatorIp.bind(this), trigger: "blur" },
        ],
        nds: [
          { required: true, message: this.$t("js.msgdone"), trigger: "blur" },
          { validator: validatorIp.bind(this), trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getDate();
  },
  methods: {
    testIp() {
      testIpApi({
        Ip: this.ruleForm.ip,
      }).then((res) => {
        if (res.data && JSON.parse(res.data).Code == "0") {
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
    getDate() {
      getNetCardInfoApi({}).then((res) => {
        if (res.code == 0 && res.data && res.data != " ") {
          this.ruleForm = JSON.parse(res.data).filter(
            (item) => item.name == this.ruleForm.name
          )[0];
        }
      });
    },
    submitForm(formName) {
      this.ruleForm.type = parseInt(this.ruleForm.type);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          setNetCardInfoApi(this.ruleForm).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: this.$t("js.msgqone"),
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
  .button {
    width: 95px;
    height: 28px;
    font-size: 13px;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
    user-select: none;
    background: white;
    position: absolute;
    right: -100px;
    top: 1px;
    color: #409eff;
    border: 1px solid #409eff;
    &:hover {
      color: #409eff;
      background-color: #ecf5ff;
    }
  }
}
</style>
