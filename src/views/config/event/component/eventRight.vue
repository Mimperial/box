<template>
  <div class="eventRightnei">
    <div v-show="selectMethod == 1" class="playVideo" id="playVideoDraw">
      <VideoCom :seek="true" :videoUrl="videoUrl"></VideoCom>
      <div id="kuangFunArea"></div>
    </div>
    <div
      :class="{
        timeConfig: true,
        show: selectMethod == 2,
      }"
      id="TimeDraw"
    >
      <ConfigTimeCom
        :timeConfigVal="timeConfigVal"
        ref="ConfigTimeCom"
      ></ConfigTimeCom>
      <!-- <div id="configTime"></div> -->
      <div class="timeSet">
        <el-select
          v-show="selectMethod == 2"
          @change="chagneTem"
          v-model="timeConfigVal"
          placeholder="请选择"
        >
          <el-option
            v-for="item in timeConfigOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          style="margin-left: 10px"
          type="danger"
          size="mini"
          icon="el-icon-close"
          @click="delTimeWeek(1)"
          >删除</el-button
        >
        <el-button
          @click="delTimeWeek(0)"
          type="danger"
          size="mini"
          icon="el-icon-delete"
          >全部删除</el-button
        >
      </div>
    </div>
    <div class="operation">
      <TabSet v-model="selectMethod" @change="changeTab"></TabSet>
      <div v-show="selectMethod == 1" v-if="algorithmData">
        <el-button
          :disabled="
            algorithmData.Utools && !algorithmData.Utools.includes('4')
          "
          icon="el-icon-myduobianxing"
          size="mini"
          @click="add('polygon')"
        ></el-button>
        <el-button
          :disabled="
            algorithmData.Utools && !algorithmData.Utools.includes('3')
          "
          class="anniu"
          @click="add('react')"
          icon="el-icon-myfangkuang"
          size="mini"
        ></el-button>
        <el-button
          :disabled="
            algorithmData.Utools && !algorithmData.Utools.includes('5')
          "
          class="anniu"
          @click="add('line')"
          icon="el-icon-myline"
          size="mini"
        ></el-button>
        <el-button
          :disabled="
            algorithmData.Utools && !algorithmData.Utools.includes('5')
          "
          class="anniu"
          @click="add('zhuanhuan')"
          icon="el-icon-myzhuanhuan"
          size="mini"
        ></el-button>
        <el-button
          :disabled="algorithmData.Utools && !algorithmData.Utools"
          class="anniu"
          @click="add('delete')"
          icon="el-icon-myshanchu"
          size="mini"
        ></el-button>
      </div>
    </div>
    <div class="bottomConfig">
      <div class="config">
        <AlgorithmConfig
          ref="AlgorithmConfig"
          :cameraData="cameraData"
          :configShow="configShow"
        ></AlgorithmConfig>
      </div>
      <el-button
        class="save"
        v-loading="loading"
        :disabled="loading"
        @click="save"
        type="primary"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import { VideoCom } from "zzvue";
import { markPlugin } from "objecteye";
import TabSet from "./tabSet.vue";
import AlgorithmConfig from "./algorithmConfig.vue";
import kuangFunAreaData from "./kuangFunArea";
import { changeAreas } from "@/utils/utils";
import { flvJoin } from "@/utils/videoJoin";
import ConfigTimeCom from "./configTime.vue";
export default {
  components: {
    VideoCom,
    TabSet,
    AlgorithmConfig,
    ConfigTimeCom,
  },
  props: {
    cameraData: {
      type: Object,
      default: () => ({}),
    },
    algorithmData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      kuangFunArea: null, //存入多功能框
      selectMethod: 1, //判断是选择了区域还是时间配置
      timeConfigOptions: [
        {
          value: "1",
          label: "全天模板",
        },
        {
          value: "2",
          label: "工作日模板",
        },
        {
          value: "3",
          label: "自定义模板",
        },
      ],
      timeConfigVal: "1",
      loading: false,
    };
  },
  computed: {
    configShow() {
      var inputConfig = [];
      if (this.algorithmData && this.algorithmData.inputConfig) {
        try {
          inputConfig = JSON.parse(this.algorithmData.inputConfig);
          if (!inputConfig) {
            inputConfig = [];
          }
        } catch (error) {
          console.log(
            "inputConfig解析失败请检查：" + this.algorithmData.inputConfig
          );
        }
      }
      var algInfo;
      if (
        this.cameraData &&
        this.cameraData.algInfos &&
        this.cameraData.algInfos.length > 0
      ) {
        algInfo = this.cameraData.algInfos.find(
          (item) => item.AlgCode == this.algorithmData.alarmNumber
        );
      }
      return { inputConfig, algInfo };
    },

    videoUrl() {
      var url = "";
      if (this.cameraData && this.cameraData.channelId) {
        url = flvJoin(this.cameraData);
      }
      return url;
    },
  },
  watch: {
    cameraData: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        this.setChangeConfig(newValue, this.algorithmData);
      },
    },
    algorithmData: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        // Utools 3多边形4矩形5线和转换功能
        this.timeConfigVal = "1";
        this.setChangeConfig(this.cameraData, newValue);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initFunArea();
    });
  },
  methods: {
    setChangeConfig(cameraData, algorithmData) {
      //当相机或者算法设置的选择变化时候右面发生变化
      if (cameraData && cameraData.id) {
        var findData = null;
        if (cameraData.algInfos && cameraData.algInfos.length > 0) {
          findData = cameraData.algInfos.find(
            (item) => item.AlgCode == algorithmData.alarmNumber
          );
        }
        if (this.$refs.ConfigTimeCom && this.$refs.ConfigTimeCom.timeweek) {
          if (findData) {
            if (findData.Time) {
              var time = this.$refs.ConfigTimeCom.stringToTime(findData.Time);
              this.$refs.ConfigTimeCom.setTime(time);
              this.timeConfigVal = "3";
            }
            if (findData.Are) {
              var drawElement = document.getElementById("TimeDraw"); //获取当前的元素的宽度和高度这里用TimeDraw是因为不管你怎么切换他都会存在的只是透明度的问题
              let { offsetWidth: width, offsetHeight: height } = drawElement;
              var are = changeAreas(
                this.kuangFunArea,
                width,
                height,
                findData.Are,
                "show"
              );
              this.kuangFunArea.setServiceData(are);
            }
          } else {
            // Utools 3 矩形 4多边形 5是线和转换
            this.kuangFunArea.setServiceData([]);
            if (algorithmData.Utools) {
              var serviceData = [];
              if (algorithmData.Utools.includes("3")) {
                serviceData = JSON.parse(JSON.stringify(kuangFunAreaData["3"]));
              } else if (algorithmData.Utools.includes("4")) {
                serviceData = JSON.parse(JSON.stringify(kuangFunAreaData["4"]));
              } else if (algorithmData.Utools.includes("5")) {
                serviceData = JSON.parse(JSON.stringify(kuangFunAreaData["5"]));
                this.kuangFunArea.chagneArrowDirection("+");
              }
              this.kuangFunArea.setServiceData(serviceData);
            }
            this.$refs.ConfigTimeCom.setTime();
          }
        } else {
          console.log("timeweek实例没有加载出来");
        }
      }
    },
    save() {
      if (this.kuangFunArea && this.kuangFunArea.addStatus) {
        this.$message({
          type: "warning",
          message: "请在视频中，点击右键保存图形！",
        });
        return;
      }
      var data = this.getInfo();
      this.$emit("save", { data, setLoading: this.setLoading.bind(this) });
    },
    setLoading(data) {
      this.loading = data;
    },
    getInfo() {
      /**
       * 获取时间和绘图区域
       */
      var drawElement = document.getElementById("TimeDraw"); //获取当前的元素的宽度和高度这里用TimeDraw是因为不管你怎么切换他都会存在的只是透明度的问题
      let { offsetWidth: width, offsetHeight: height } = drawElement;
      var areas = changeAreas(
        this.kuangFunArea,
        width,
        height,
        JSON.parse(JSON.stringify(this.kuangFunArea.getServiceData()))
      );
      var times = this.$refs.ConfigTimeCom.toString();
      var Parameters = this.$refs.AlgorithmConfig.getData();
      var data = {
        areas,
        times,
        alarmNumber: this.algorithmData.alarmNumber,
        id: this.algorithmData.id,
        Parameters: Parameters,
      };
      return data;
    },
    initFunArea() {
      this.kuangFunArea = new markPlugin("kuangFunArea", {
        devicePixelRatio: true,
        judgment: true,
        serviceData: [],
      });
      this.kuangFunArea.onError((msg) => {
        this.$message({
          type: "warning",
          message: msg,
        });
      });
    },
    delTimeWeek(data) {
      //删除
      this.$refs.ConfigTimeCom.clearData(data == 0);
    },
    chagneTem() {
      if (this.timeConfigVal != "3") {
        this.$refs.ConfigTimeCom.setTime();
      }
    },
    changeTab(data) {
      // console.log(data);
    },
    add(type) {
      if (type == "polygon" || type == "line" || type == "react") {
        this.kuangFunArea.addShape(type);
      } else if (type == "zhuanhuan") {
        this.kuangFunArea.chagneArrowDirection();
      } else if (type == "delete") {
        if (
          this.kuangFunArea.cacheSelect ||
          this.kuangFunArea.cacheSelect == 0
        ) {
          this.kuangFunArea.remove(this.kuangFunArea.cacheSelect);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#kuangFunArea{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.eventRightnei {
  position: relative;
  height: 100%;
  max-width: 1110px;
  .playVideo,
  .timeConfig {
    position: relative;
    width: 1110px;
    height: 624.375px;
    background-color: #f7f7f7;
  }
  .timeConfig {
    text-align: center;
    padding-top: 100px;
    opacity: 0;
    height: 624.375px;
    box-sizing: border-box;
    pointer-events: none;
    cursor: default;
    &.show {
      opacity: 1;
      pointer-events: auto;
    }
    #configTime {
      display: inline-block;
    }
    .timeSet {
      position: absolute;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 20px;
      top: 0;
      text-align: left;
    }
  }
  .operation {
    position: absolute;
    width: 70px;
    right: -70px;
    top: 0;
    text-align: center;
    /deep/ .el-button {
      margin-left: 0 !important;
      margin-top: 12px;
    }
  }
  .bottomConfig {
    position: absolute;
    top: 641.875px;
    width: 100%;
    right: 0px;
    z-index: 100;
    overflow: hidden;
    .config {
      float: left;
    }
    .save {
      float: right;
    }
  }
}
</style>