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
        :label="$t('html.sbsj')"
      >
        <el-date-picker
          disabled
          style="width: 100%"
          v-model="datetime"
          type="datetime"
          :placeholder="$t('html.xzrqsj')"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.szsj')"
      >
        <el-date-picker
          style="width: 100%"
          v-model="nowTime"
          type="datetime"
          :placeholder="$t('html.xzrqsj')"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item :label-width="labelWidth" size="mini">
        <el-checkbox @change="changeTime" :value="ruleForm.flagLocal">{{
          $t("html.yjsjsjtb")
        }}</el-checkbox>
      </el-form-item>
      <el-form-item
        :label-width="labelWidth"
        size="mini"
        :label="$t('html.ntpfwdz')"
        prop="ntpUrl"
      >
        <el-input v-model="ruleForm.ntpUrl"></el-input>
      </el-form-item>
      <el-form-item :label-width="labelWidth" size="mini">
        <el-checkbox @change="ntpConfig" v-model="ruleForm.flagNtp">{{
          $t("html.ntpjzsj")
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
import { getDatetimeApi, setDatetimeApi } from "@/api/article";
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
        flagLocal: "",
        ntpUrl: "",
        flagNtp: "",
      },
      rules: {
        ntpUrl: [
          {
            required: false,
            message: this.$t("js.fzNTPjzsj"),
            trigger: "blur",
          },
        ],
      },
      datetime: null,
      nowTime: null,
      timerOne: null, //定时器
    };
  },
  mounted() {
    this.getData();
  },
  destroyed() {
    if (this.timerOne) clearInterval(this.timerOne);
  },
  methods: {
    getData() {
      getDatetimeApi({}).then((res) => {
        if (res.code == 0) {
          let { flagLocal, flagNtp, ntpUrl, dateTime } = res.data
            ? JSON.parse(res.data)[0]
            : {};
          this.ruleForm.flagLocal = flagLocal == 0 ? true : false;
          this.ruleForm.flagNtp = flagNtp == 0 ? true : false;
          this.ruleForm.ntpUrl = ntpUrl;
          this.datetime = dateTime;
          this.timeChange();
        }
      });
    },
    ntpConfig() {
      if (this.ruleForm.flagNtp == true) {
        this.ruleForm.flagLocal = false;
      }
    },
    timeChange() {
      if (this.timerOne) clearInterval(this.timerOne);
      this.timerOne = setInterval(() => {
        if (this.ruleForm.flagLocal) {
          this.nowTime = new Date().getTime();
        }
        this.datetime = new Date(this.datetime).getTime() + 1000;
      }, 1000);
    },
    changeTime() {
      this.$nextTick(() => {
        this.ruleForm.flagLocal = !this.ruleForm.flagLocal;
        if (this.ruleForm.flagLocal == true) {
          this.ruleForm.flagNtp = false;
        }
      });
      if (this.ruleForm.flagLocal) {
        var time = new Date().getTime();
        this.nowTime = time;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { flagLocal, flagNtp, ntpUrl } = this.ruleForm;
          var dateTime = "";
          if (this.nowTime) {
            dateTime = new Date(this.nowTime).format("yyyy-MM-dd hh:mm:ss");
          } else {
            dateTime = new Date(this.datetime).format("yyyy-MM-dd hh:mm:ss");
          }
          setDatetimeApi({
            dateTime: dateTime,
            flagLocal: flagLocal ? "0" : "1",
            flagNtp: flagNtp ? "0" : "1",
            ntpUrl: ntpUrl,
          }).then((res) => {
            if (res.code == 0) {
              this.getData();
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