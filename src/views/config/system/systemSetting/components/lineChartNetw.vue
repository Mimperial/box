<template>
  <div class="lineCharts">
    <div :id="id" style="width: 100%; height: 100%"></div>
    <div class="time1">{{$t('html.lss')}}</div>
    <div class="time2">{{$t('html.l')}}</div>
    <div class="danwei1">{{ unitLeft }}</div>
    <div class="danwei2">
      <div>
        {{$t('html.scm')}}{{ unitRight[0]|speedFilter }}
      </div>
      <div>
        {{$t('html.xzm')}}{{ unitRight[1]|speedFilter }}
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import {
  GridComponent,
  TitleComponent,
  DataZoomComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([
          GridComponent,
          LineChart,
          CanvasRenderer,
          TitleComponent,
          DataZoomComponent,
        ]);
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    dataArr: {
      //数据存入数组的值
      type: Array,
      default: () => [],
    },
    dataArra: {
      //数据存入数组的值
      type: Array,
      default: () => [],
    },
    xLength: {
      //横坐标长度默认60s
      type: Number,
      default: 60,
    },
    lineColor: {
      type: String,
      default: "#117dbb",
    },
    areaColor: {
      type: String,
      default: "rgba(17,125,187,.5)",
    },
    unitLeft: {
      type: String,
      default: function(){
        return this.$t('js.ymsgone')
      } ,
    },
    unitRight: {
      type: Array,
      default: () => [],
    },
    maxValue: {
      type: Number | null, //y轴的最大值
      default: 100,
    },
  },
  data() {
    return {
      myChart: null,
      startNumber: 0,
      xData: [],
    };
  },
  watch: {
    dataArr: {
      handler(newValue) {
        if (this.xLength != newValue.length) {
          this.xData.push(this.xLength + this.startNumber);
          this.init(newValue);
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init(data) {
      if (!this.myChart) {
        
        var chartDom = document.getElementById(this.id);
        this.myChart = echarts.init(chartDom);
        for (var i = 0; i < this.xLength; i++) {
          this.dataArr.push(0);
          this.dataArra.push(0);
          this.xData.push(i);
        }
      }
      var option;
      option = {
        title: [
          {
            left: "center",
            text: this.title,
            textStyle: { color: "#010B56" },
          },
        ],
        dataZoom: [
          {
            type: "slider",
            show: false,
            realtime: true,
            startValue: this.startNumber,
            endValue: this.xLength + this.startNumber, // 初始显示index0-30的数据,可根据你的数据量设置
            filterMode: "none",
          },
        ],
        xAxis: {
          show: true,
          boundaryGap: false,
          axisLabel: {
            interval: 3, // 间隔长度，可自定义（如果是时间格式，echarts会自动处理）
            formatter: () => "",
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
          },
          data: this.xData,
        },
        yAxis: {
          type: "value",
          // min: this.maxValue,
          splitNumber: 10,
          axisLabel: {
            formatter: () => "",
          },
        },
        // data || this.dataArr
        series: [
          {
            data: this.dataArr,
            type: "line",
            showSymbol: false,
            color: this.lineColor,
            areaStyle: {
              color: this.areaColor,
            },
          },
          {
            data: this.dataArra,
            type: "line",
            showSymbol: false,
            color: this.lineColor,
            lineStyle: {
              type: "dashed",
            },
          },
        ],
      };
      option && this.myChart.setOption(option);
      window.addEventListener("resize", this.resizeFc);
      this.startNumber++;
    },
    resizeFc() {
      this.myChart.resize();
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeFc);
  },
  filters:{
    speedFilter(val){
        if(Number(val)>1024){
          return (val/1024).toFixed(2) + "MB/S";
        }else if(Number(val)>1024*1024){
          return (val/1024).toFixed(2) + "GB/S";
        }else{
          var num=parseInt(val);
          return num.toFixed(2) + "KB/S";
        }
    }
  }
};
</script>

<style lang="scss" scoped>
.lineCharts {
  width: 100%;
  height: 100%;
  position: relative;
  .time1 {
    position: absolute;
    bottom: 17%;
    left: 10%;
    font-size: 12px;
    color: #000;
    opacity: 0.8;
  }
  .time2 {
    position: absolute;
    bottom: 17%;
    right: 10%;
    font-size: 12px;
    color: #000;
    opacity: 0.8;
  }
  .danwei1 {
    position: absolute;
    top: 14%;
    left: 10%;
    font-size: 12px;
    color: #000;
    opacity: 0.8;
  }
  .danwei2 {
    position: absolute;
    top: 9%;
    right: 10%;
    font-size: 12px;
    color: #000;
    opacity: 0.8;
  }
}
</style>

