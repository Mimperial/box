<template>
  <div>
    <el-dialog
      :title="title"
      :before-close="closeDialog"
      :visible.sync="dialogValue"
      width="1000px"
    >
      <div class="playVideo">
        <VideoCom :seek="true" :videoUrl="videoUrl"></VideoCom>
        <div class="videoName" v-if="osdForm.camName && videoUrl">
          <p>{{ cameraData.name }}</p>
        </div>
        <div class="videoTime" v-if="videoUrl && osdForm">
          {{ timeChange(osdForm, videoTime, osdForm.datecfg, osdForm.timecfg) }}
        </div>
        <FunAreaSelect
          v-if="osdForm && osdForm.ai"
          titlePadding="0px"
          titleFillColor="rgba(40, 177, 217, 0)"
          titleFont="20px bolder 黑体"
          :position="[-2, 0]"
          titleColor="#ff7e00"
          lineColor="#07bd07"
          :showTitle="true"
          :circleRadius="1"
          :circleBorderWidth="1"
          :listData="videoArrListData"
          :disabled="true"
          areaColor="rgba(40, 177, 217, 0)"
          selectAreaColor="rgba(40, 177, 217, 0)"
        ></FunAreaSelect>
      </div>
      <div class="osdConfig">
        <ul>
          <li>
            <div class="col">
              <el-checkbox
                v-model="osdForm.ai"
                :label="$t('html.xsznxx')"
              ></el-checkbox>
            </div>
            <div class="col">
              <el-checkbox
                v-model="osdForm.date"
                :label="$t('html.xsrq')"
              ></el-checkbox>
              <el-select
                style="margin-left: 8px"
                size="mini"
                v-model="osdForm.datecfg"
                :placeholder="$t('html.qxz')"
              >
                <el-option
                  v-for="item in optionsDate"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </li>
          <li>
            <div class="col">
              <el-checkbox
                v-model="osdForm.camName"
                :label="$t('html.xsxjmc')"
              ></el-checkbox>
            </div>
            <div class="col">
              <el-checkbox
                v-model="osdForm.time"
                :label="$t('html.xssj')"
              ></el-checkbox>
              <el-select
                style="margin-left: 8px"
                size="mini"
                v-model="osdForm.timecfg"
                :placeholder="$t('html.qxz')"
              >
                <el-option
                  v-for="item in optionsTime"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="col right">
              <el-button type="primary" size="mini" @click="saveOsd"
                >保存</el-button
              >
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VideoCom, FunAreaSelect } from "zzvue";
import { flvJoin } from "@/utils/videoJoin";
import {
  wsPreview,
  getOsdInfoApi,
  getDatetimeApi,
  setOsdInfoApi,
} from "@/api/article";
export default {
  components: {
    VideoCom,
    FunAreaSelect,
  },
  props: {
    value: {
      type: Boolean,
      require: true,
    },
    title: {
      type: String,
      default: "默认",
    },
    cameraData: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    value(newValue) {
      this.dialogValue = newValue;
    },
    cameraData: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.videoUrl = this.flvJoin(newVal);
        this.getOsd(newVal.id);
      },
    },
  },
  data() {
    return {
      flvJoin: flvJoin,
      dialogValue: this.value, //控制框是否显示
      videoUrl: "", //视频播放的url
      videoTime: "", //视频osd时间
      osdForm: {
        camName: false,
        date: false,
        datecfg: "1",
        time: false,
        timecfg: "12",
        ai: false,
      },
      videoArrListData: [], //视频点位的展示
      optionsDate: [
        {
          value: "1",
          label: this.$t("js.msgione"), //xxxx年xx月xx日
        },
      ],
      optionsTime: [
        {
          value: "12",
          label: this.$t("js.msgoone"),
        },
        {
          value: "24",
          label: this.$t("js.msgpone"),
        },
      ],
      ws: null,
      Vtimer: null,
    };
  },
  mounted() {
    this.getTime();
    this.initWs();
  },
  beforeDestroy() {
    this.ws && this.ws.close();
    this.Vtimer && clearInterval(this.Vtimer);
  },
  methods: {
    saveOsd() {
      setOsdInfoApi({
        id: this.cameraData.id,
        osdConfig: JSON.stringify(this.osdForm),
      }).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: this.$t("js.gmsgone"),
            type: "success",
          });
        }
      });
      // this.closeDialog();
    },
    getTime() {
      //获取系统时间
      getDatetimeApi({}).then((res) => {
        if (JSON.parse(res.data)[0]) {
          this.videoTime = JSON.parse(res.data)[0].dateTime;
          this.Vtimer = setInterval(() => {
            this.videoTime = new Date(
              new Date(this.videoTime).getTime() + 1000
            ).format("yyyy-MM-dd hh:mm:ss");
          }, 1000);
        }
      });
    },
    getOsd(id) {
      //获取osd时间
      getOsdInfoApi({ id: id }).then((res) => {
        if (res.code == 0) {
          var osdData = res.data ? JSON.parse(res.data) : {};
          if (osdData && Object.keys(osdData)) {
            for (const key in osdData) {
              this.osdForm[key] = osdData[key];
            }
          }
        }
      });
    },
    closeDialog() {
      //关闭弹框
      this.$emit("input", false);
      this.dialogValue = false;
      this.videoUrl = "";
    },
    initWs() {
      //初始化ws
      this.ws = wsPreview(
        (data) => {
          if (data.Cmd == "Detection") {
            var xinxi = JSON.parse(data.Data);
            for (let i = 0; i < xinxi.listData.length; i++) {
              if (xinxi.listData[i].alarmType != 0) {
                xinxi.listData[i].lineColor = "#ff0000";
                xinxi.listData[i].titleColor = "#ff0000";
              }
              xinxi.listData[i].modeType = "react";
              xinxi.listData[i].title = xinxi.listData[i].id;
            }
            if (
              this.cameraData &&
              xinxi.channelId == this.cameraData.channelId
            ) {
              this.videoArrListData = this.changeImge(
                JSON.parse(JSON.stringify(xinxi.listData)),
                960,
                540
              );
            }
          }
        },
        {
          info: ["Detection"],
        }
      );
    },
    changeImge(data, width, height, imgWidth = 1920, imgHeight = 1080) {
      //用来像素进行转换
      for (let i = 0; i < data.length; i++) {
        var dataService = JSON.parse(data[i].serviceData);
        for (let j = 0; j < dataService.length; j++) {
          dataService[j][0] =
            Math.floor((width / imgWidth) * dataService[j][0] * 100) / 100;
          dataService[j][1] =
            Math.floor((height / imgHeight) * dataService[j][1] * 100) / 100;
        }
        data[i].serviceData = dataService;
      }
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: inline-block;
  width: 100%;
  text-align: center;
}
.videoTime {
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 18px;
  z-index: 80;
  color: white;
}
.videoName {
  position: absolute;
  top: 0;
  color: white;
  width: 100%;
  z-index: 100;
  box-sizing: border-box;
  padding: 5px 15px;
  background: rgba($color: #000000, $alpha: 0.2);
}
.playVideo {
  position: relative;
  width: 960px;
  height: 540px;
}
ul,
li {
  list-style: none;
}
/deep/ .el-dialog__header {
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
}
/deep/ .el-dialog__body {
  padding-top: 20px;
}
.osdConfig {
  padding: 17px 20px 0;
  ul {
    li {
      margin-top: 13px;
      overflow: hidden;
      .col {
        float: left;
        min-width: 150px;
        height: 30px;
        line-height: 30px;
        &.right {
          float: right;
          text-align: right;
        }
      }
    }
  }
}
</style>