<template>
  <div class="limian">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="135px"
      class="demo-ruleForm"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="7" :lg="7">
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.GB28181xy')"
          >
            <el-checkbox v-model="ruleForm.status">{{
              $t("html.qy")
            }}</el-checkbox>
          </el-form-item>
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.xybb')"
          >
            <el-input disabled v-model="ruleForm.version"></el-input>
          </el-form-item>
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.bdsipdk')"
            prop="sipPortLocal"
          >
            <el-input v-model="ruleForm.sipPortLocal"></el-input>
          </el-form-item>
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.sipfwqid')"
            prop="sipServerId"
          >
            <el-input v-model="ruleForm.sipServerId"></el-input>
          </el-form-item>
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.sipfwqy')"
            prop="sipRegion"
          >
            <el-input v-model="ruleForm.sipRegion"></el-input>
          </el-form-item>
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.sipfwqdz')"
            prop="sipIp"
          >
            <el-input v-model="ruleForm.sipIp"></el-input>
          </el-form-item>
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.sipfwqdk')"
            prop="sipPort"
          >
            <el-input v-model="ruleForm.sipPort"></el-input>
          </el-form-item>

          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.zxzt')"
          >
            <el-input disabled v-model="ruleForm.onLine"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="7" :lg="7">
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.password')"
            prop="pwd"
          >
            <el-input v-model="ruleForm.pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.mmqr')"
            prop="surePwd"
          >
            <el-input v-model="ruleForm.surePwd" type="password"></el-input>
          </el-form-item>
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.zcyxq')"
            prop="regTime"
          >
            <el-input v-model="ruleForm.regTime">
              <template slot="append">{{ $t("html.秒") }}</template>
            </el-input>
          </el-form-item>
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.xtzq')"
            prop="heartbeat"
          >
            <el-input v-model="ruleForm.heartbeat">
              <template slot="append">{{ $t("html.秒") }}</template>
            </el-input>
          </el-form-item>
          <!-- <el-form-item size="mini" :label-width="labelWidth" :label="$t('html._28181ml')" prop="streamType">
            <el-select
              style="width: 100%"
              v-model="ruleForm.streamType"
              :placeholder="$t('html.qxz28121ml')"
            >
              <el-option :label="$t('html.zml')"  :value="0"></el-option>
              <el-option :label="$t('html._zml')"  :value="1"></el-option>
              <el-option :label="$t('html.dsml')" :value="2"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.csxy')"
            prop="netType"
          >
            <el-select
              style="width: 100%"
              v-model="ruleForm.netType"
              :placeholder="$t('html.qxzcsxy')"
            >
              <el-option label="tcp" :value="0"></el-option>
              <el-option label="udp" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item size="mini" :label-width="labelWidth" :label="$t('html.zcjg')" prop="regedit">
            <el-input v-model="ruleForm.regedit">
              <template slot="append">{{$t('html.秒')}}</template>
            </el-input>
          </el-form-item>
          <el-form-item size="mini" :label-width="labelWidth" :label="$t('html.zdxtcscs')" prop="beatNum">
            <el-input v-model="ruleForm.beatNum">
              <template slot="append">{{$t('html.次')}}</template>
            </el-input>
          </el-form-item> -->
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.sipyhrzid')"
            prop="authenticate"
          >
            <el-input v-model="ruleForm.authenticate"></el-input>
          </el-form-item>
          <el-form-item
            size="mini"
            :label-width="labelWidth"
            :label="$t('html.sipyhm')"
            prop="user"
          >
            <el-input v-model="ruleForm.user"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <TopHeader :list="[{ name: $t('html.sptdid') }]"></TopHeader>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-col
            v-for="(item, index) in ruleForm.channel"
            :key="item.id"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
          >
            <el-form-item
              size="mini"
              :label-width="labelWidth"
              :label="$t('html.xh') + (index + 1)"
            >
              <el-input v-model="item.code"></el-input>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-button
          size="mini"
          :label-width="labelWidth"
          :style="{ marginLeft: parseInt(labelWidth) + 12 + 'px' }"
          type="primary"
          @click="submitForm('ruleForm')"
          >{{ $t("html.bc") }}</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TopHeader from "@/components/topHeader.vue";
import { setIntegrateCfgApi, getIntegrateCfgApi } from "@/api/article";
import {
  validatorIp,
  validatorSport,
  validatorNumber,
} from "@/utils/validators";
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
  components: { TopHeader },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("js.msgonei")));
      } else {
        if (this.ruleForm.surePwd !== "") {
          this.$refs.ruleForm.validateField("surePwd");
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
        host: "",
        port: "",
        username: "",
        password: "",
        surePassword: "",
        foldertype: "",
        channel: [],
      },
      rules: {
        // version: [{ required: true, message: "请输入版本号", trigger: "blur" }],
        sipPortLocal: [
          { required: true, message: this.$t("js.bddkfz"), trigger: "blur" },
          { validator: validatorSport.bind(this), trigger: "blur" },
        ],
        sipServerId: [
          { required: true, message: this.$t("js.sipfwfz"), trigger: "blur" },
          { max: 30, message: this.$t("js.cdrule"), trigger: "change" },
          { validator: validatorNumber.bind(this), trigger: "blur" },
        ],
        sipRegion: [
          { required: true, message: this.$t("js.sipfwyufz"), trigger: "blur" },
          { max: 30, message: this.$t("js.cdrule"), trigger: "change" },
        ],
        sipIp: [
          { required: true, message: this.$t("js.sipfwdzfz"), trigger: "blur" },
          { validator: validatorIp.bind(this), trigger: "blur" },
        ],
        sipPort: [
          { required: true, message: this.$t("js.sipfwdkfz"), trigger: "blur" },
          { validator: validatorSport.bind(this), trigger: "blur" },
        ],
        authenticate: [
          {
            required: true,
            message: this.$t("js.sipyhrzipfz"),
            trigger: "blur",
          },
          { max: 30, message: this.$t("js.cdrule"), trigger: "change" },
          { validator: validatorNumber.bind(this), trigger: "blur" },
        ],
        user: [
          { required: true, message: this.$t("js.sipyhmfz"), trigger: "blur" },
          { max: 30, message: this.$t("js.cdrule"), trigger: "change" },
          { validator: validatorNumber.bind(this), trigger: "blur" },
        ],
        pwd: [
          { max: 30, message: this.$t("js.cdrule"), trigger: "change" },
          { validator: validatePass, trigger: "blur" },
        ],
        surePwd: [
          { max: 30, message: this.$t("js.cdrule"), trigger: "change" },
          { validator: validatePass2, trigger: "blur" },
        ],
        regTime: [
          {
            required: true,
            message: this.$t("js.zcyxqfz"),
            trigger: "blur",
          },
          { validator: validatorNumber.bind(this), trigger: "blur" },
        ],
        heartbeat: [
          { required: true, message: this.$t("js.xtzqfz"), trigger: "blur" },
          { validator: validatorNumber.bind(this), trigger: "blur" },
        ],
        streamType: [
          { required: true, message: this.$t("js.mlfz"), trigger: "change" },
        ],
        netType: [
          { required: true, message: this.$t("js.csxyfz"), trigger: "change" },
        ],
        regedit: [
          { required: true, message: this.$t("js.zcjgfz"), trigger: "blur" },
        ],
        beatNum: [
          {
            required: true,
            message: this.$t("js.zdxtcs"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getIntegrateCfgApi({}).then((res) => {
        if (res.code == 0) {
          var obj = res.data && res.data != " " ? JSON.parse(res.data) : {};
          obj.onLine =
            obj.onLine == 0 ? this.$t("js.lxfz") : this.$t("js.zxfz");
          obj.status = obj.status == 1 ? true : false;
          obj.surePwd = obj.pwd;
          this.ruleForm = obj;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var obj = JSON.parse(JSON.stringify(this.ruleForm));
          obj.status = obj.status ? 1 : 0;
          obj.sipPortLocal = Number(obj.sipPortLocal);
          obj.sipPort = Number(obj.sipPort);
          obj.regTime = Number(obj.regTime);
          obj.heartbeat = Number(obj.heartbeat);
          obj.streamType = Number(obj.streamType);
          obj.netType = Number(obj.netType);
          obj.regedit = Number(obj.regedit);
          obj.beatNum = Number(obj.beatNum);
          obj.onLine = obj.onLine == this.$t("js.lxfz") ? 0 : 1;
          delete obj.surePwd;
          setIntegrateCfgApi(obj).then((res) => {
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
  width: 100%;
  .el-button {
    width: 100%;
  }
}
</style>