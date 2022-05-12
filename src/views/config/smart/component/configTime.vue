<template>
  <div class="configClass">
    <div id="configTimeNew"></div>
    <div
      v-show="timeShow.show"
      id="showTime"
      :style="{
        left: timeShow.left + 'px',
        top: timeShow.top + 'px',
      }"
      class="showTime"
    >
      {{ timeShow.time }}
    </div>
    <div
      class="changeTime"
      id="changeTime"
      :style="{
        left: changeTimeData.left + 'px',
        top: changeTimeData.top + 'px',
      }"
      v-show="changeTimeData.show"
    >
      <div>
        <el-time-picker
          is-range
          :clearable="false"
          format="HH:mm"
          v-model="changeTimeData.time"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        >
        </el-time-picker>
      </div>
      <div class="btnStyle">
        <el-button size="mini" @click="changeTimeData.show = false" type="info"
          >关闭</el-button
        >
        <el-button size="mini" @click="saveChangeTime" type="primary"
          >保存</el-button
        >
      </div>
    </div>
    <div
      v-show="cloneShow.show"
      class="copy"
      :style="{
        left: cloneShow.left + 'px',
        top: cloneShow.top + 'px',
      }"
      @click="
        rootCloneTime.show = true;
        rootCloneTime.index = cloneShow.index;
      "
    >
      <i class="el-icon-document-copy"></i>
    </div>
    <CloneTime
      v-show="rootCloneTime.show"
      :style="{
        left: rootCloneTime.left + 'px',
        top: rootCloneTime.top + 'px',
      }"
      @cancel="rootCloneTime.show = false"
      @submit="submit"
      :selectData="rootCloneTime.index"
    ></CloneTime>
  </div>
</template>

<script>
import { timeWeekNew } from "objecteye";
import CloneTime from "./cloneTime.vue";
import timeData from "./timeData";
export default {
  components: {
    CloneTime,
  },
  props: {
    timeConfigVal: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      timeweek: null,
      timeShow: {
        //控制滑动时显示的时间框
        width: 0,
        show: false,
        time: "00:00-00:00",
        left: 0,
        top: 0,
      },
      changeTimeData: {
        //弹出修改某一条的时间
        width: 0,
        height: 0,
        show: false,
        time: [new Date(), new Date()],
        left: 0,
        top: 0,
      },
      cloneShow: {
        //克隆图标是否显示
        show: false,
        left: 0,
        top: 0,
        index: -1,
      },
      rootCloneTime: {
        //这里是控制弹出克隆的那个复选框
        show: false,
        index: -1,
        left: 0,
        top: -100,
      },
      week: -1,
      draw: -1,
      timeDefalut: JSON.parse(JSON.stringify(timeData[this.timeConfigVal])),
      timer: null, //纺织时间框闪烁用定时器进行控制延时显示时间
    };
  },
  watch: {
    timeConfigVal(newValue, oldValue) {
      this.timeDefalut = JSON.parse(JSON.stringify(timeData[newValue]));
    },
  },
  beforeDestroy() {
    this.timeweek &&
      this.timeweek.rootEL.removeEventListener("mousemove", this.mouseMove);
    this.timer && clearTimeout(this.timer);
  },
  mounted() {
    this.$nextTick(() => {
      this.timeweek = new timeWeekNew("configTimeNew");
      this.timeweek.handleSelect = (xyAndTime, week, draw) => {
        //监听选中元素
        let { time, value } = xyAndTime;
        this.week = week;
        this.draw = draw;
        if (!this.timer) {
          this.timer = setTimeout(() => {
            this.changeTimeDataShow(time, value);
            this.timer = null;
          }, 100);
        }
      };
      this.timeweek.handleChange = (time, xy) => {
        //监听滑动时候的变化
        this.changeTimeShow(time, xy);
        this.changeTimeData.show = false;
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
      };

      this.timeweek.handleMouseup = (selectKey) => {
        //鼠标抬起 参数选择的内容
        this.timeShow.show = false;
      };
      this.timeweek.handleError = (msg, data) => {
        //错误捕获data会打印一些可以进行判断的信息
        this.$message.error(msg);
      };
      this.timeweek.setTime(this.timeDefalut);
      this.timeweek.rootEL.addEventListener("mousemove", this.mouseMove);
    });
  },
  methods: {
    submit(data) {
      let { cloneData, root } = data;
      if (root >= 0 && cloneData.length > 0) {
        this.timeweek.cloningWeek(root, cloneData); //克隆星期 星期下标，需要克隆星期的下标数组
        this.rootCloneTime.show = false;
      }
    },
    mouseMove(e) {
      if (e.target.tagName === "IMG") return;
      var { layerY: y } = e;
      let i = 0;
      for (i = 0; i < this.timeweek.reactPointArr.length; i++) {
        const [xx, yy, xx1, yy1] = this.timeweek.reactPointArr[i];
        if (y > yy && y < yy1) {
          this.cloneShow.show = true;
          this.cloneShow.left = xx1 + 12;
          this.rootCloneTime.left = xx1 - 270;
          this.cloneShow.top = (yy1 - yy) / 2 + yy - 15;
          this.cloneShow.index = i;
          break;
        }
      }
      if (i === this.timeweek.reactPointArr.length) {
        this.cloneShow.show = false;
        this.cloneShow.index = -1;
      }
    },
    saveChangeTime() {
      if (this.week >= 0 && this.draw >= 0) {
        var dataTimes = this.changeTimeData.time.map((item) => {
          return new Date(item).format("hh:mm:ss");
        });
        if (dataTimes.length == 2) {
          this.timeweek.setOneTime(dataTimes.join("-"), this.week, this.draw); //设置某个星期的某段时间 星期二第一段
        }
        this.changeTimeData.show = false;
      }
    },
    changeTimeDataShow(time, value) {
      this.changeTimeData.show = true;
      this.$nextTick(() => {
        var changeTime = document.getElementById("changeTime");
        this.changeTimeData.width = changeTime.offsetWidth;
        this.changeTimeData.height = changeTime.offsetHeight;
        let [time1, time2] = time.split(",");
        let [x, y, x1, y1] = value;
        var str = "2021-12-14 ";
        this.changeTimeData.time = [
          new Date(str + time1),
          new Date(str + time2),
        ];
        this.changeTimeData.left = (x + x1 - this.changeTimeData.width) / 2;
        this.changeTimeData.top = y - this.changeTimeData.height;
      });
    },
    changeTimeShow(time, value) {
      this.timeShow.show = true;
      this.$nextTick(() => {
        this.timeShow.width = document.getElementById("showTime").offsetWidth;
        let [time1, time2] = time.split(",");
        let [x, y, x1, y1] = value;
        this.timeShow.time = time1.slice(0, 5) + "-" + time2.slice(0, 5);
        this.timeShow.left = (x + x1 - this.timeShow.width) / 2;
        this.timeShow.top = y - 30;
      });
    },
    stringToTime(time) {
      return this.timeweek.stringToTime(time);
    },
    setTime(time) {
      this.$nextTick(() => {
        var times = time || this.timeDefalut;
        this.timeweek.setTime(times);
      });
    },
    clearData(flag = false) {
      this.timeweek.clearData(flag);
    },
    toString() {
      var timesStr = this.timeweek.toString();
      return (
        timesStr ||
        this.timeweek.toString(JSON.parse(JSON.stringify(timeData["1"])))
      ); //转换字符串
    },
  },
};
</script>
<style lang="scss">
img {
  -webkit-user-drag: none;
}
</style>
<style lang="scss" scoped>
.configClass {
  position: relative;
  width: 1000px;
  height: 500px;
  margin: 0 auto;
  #configTimeNew {
    margin: 0 auto;
    position: relative;
    height: 100%;
  }
  .changeTime {
    position: absolute;
    padding: 10px;
    background-color: white;
    z-index: 100;
    .btnStyle {
      margin-top: 10px;
      padding-right: 10px;
      box-sizing: border-box;
      text-align: right;
    }
  }
  .copy {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 20px;
    cursor: pointer;
    z-index: 100;
  }
  .showTime {
    position: absolute;
    font-size: 12px;
    width: 98px;
    height: 19px;
    line-height: 19px;
    background-color: white;
    text-align: center;
    box-shadow: rgb(204, 204, 204) 0px 1px 2px;
  }
}
</style>