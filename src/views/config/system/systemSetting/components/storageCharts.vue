<template>
  <div id="storageCharts" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as echarts from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([GaugeChart, CanvasRenderer]);
export default {
  props:{
    useStorage:{
      type:Number,
      default:35
    },
    allStorage:{
      type:Number,
      default:100
    }
  },
  data() {
    return {
      myChart: null,
    };
  },
  watch:{
    useStorage(){
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (!this.myChart) {
       
        var chartDom = document.getElementById("storageCharts");
        this.myChart = echarts.init(chartDom);
      }
      var option;
      option = {
        title: [
          {
            left: "center",
            text: this.$t('js.umsgone'),
          },
        ],
        series: [
          {
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 1,
            splitNumber: 8,
            center: ["50%", "66%"], // 仪表位置
            axisLine: {
              lineStyle: {
                width: 5,
                color: [
                  [0.25, "#7CFFB2"],
                  [0.75, "#58D9F9"],
                  [1, "#FF6E76"],
                ],
              },
            },
            pointer: {
              icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
              length: "12%",
              width: 18,
              offsetCenter: [0, "-55%"],
              itemStyle: {
                color: "auto",
              },
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: "auto",
                width: 2,
              },
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: "auto",
                width: 5,
              },
            },
            axisLabel: {
              color: "#464646",
              fontSize: 15,
              distance: -60,
              formatter:  (value)=> {
                if (value === 0.875) {
                  return this.$t('js.imsgone');
                } else if (value === 0.5) {
                  return this.$t('js.omsgone');
                } else if (value === 0.125) {
                  return this.$t('js.pmsgone');
                }
              },
            },
            title: {
              offsetCenter: [0, "-30%"],
              fontSize: 15,
            },
            detail: {
              fontSize: 25,
              offsetCenter: [0, "-2%"],
              valueAnimation: true,
              formatter:  (value)=> {
                return this.useStorage + "/" + this.allStorage + "G";
              },
              color: "inherit",
            },
            data: [
              {
                value: Number((this.useStorage / (this.allStorage?this.allStorage:100)).toFixed(2)),
                name: this.$t('js.mzsgone'),
              },
            ],
          },
        ],
      };
      option && this.myChart.setOption(option);
      window.addEventListener("resize",this.resizeFc);
    },
    resizeFc(){
      this.myChart.resize()
    }
  },
   beforeDestroy() {
    window.removeEventListener("resize", this.resizeFc)
  },
};
</script>

<style>
</style>