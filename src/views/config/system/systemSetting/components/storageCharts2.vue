<template>
  <div :id="id" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as echarts from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { TitleComponent } from "echarts/components";
echarts.use([GaugeChart, CanvasRenderer, TitleComponent]);
export default {
  props: ["id"],
  props: {
    id: {
      type: String,
      default: "storeage2",
    },
    useStorage: {
      type: Number,
      default: 35,
    },
    allStorage: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      colors: ["#0086fa", "#ffbf00", "#f5222d"],
      valueConfig: [30, 70, 100],
    };
  },
  watch: {
    allStorage(newValue) {
      var value = Number((this.useStorage / newValue).toFixed(2)) * 100;
      this.init(value);
    },
  },
  mounted() {
    var chartDom = document.getElementById(this.id);
    this.myChart = echarts.init(chartDom);
    var value = Number((this.useStorage / this.allStorage).toFixed(2)) * 100;
    if (isNaN(value)) {
      value = 0;
    }
    this.init(value);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeFc);
  },
  methods: {
    init(value) {
      var option = {
        title: {
          left: "center",
          text: "存储",
          textStyle: { color: "#010B56" },
        },
        series: this.baseData(value),
      };
      option && this.myChart.setOption(option);
      window.addEventListener("resize", this.resizeFc);
    },
    resizeFc() {
      this.myChart.resize();
    },
    baseData(val) {
      var arr = [];
      let { colors, valueConfig } = this;
      if (val < valueConfig[0]) {
        arr.push(
          this.optionsBase({ value: val, name: "充足" }, true, colors[0])
        );
      } else if (val <= valueConfig[1]) {
        arr.push(
          this.optionsBase(
            { value: valueConfig[0], name: "充足" },
            false,
            colors[0]
          )
        );
        arr.push(
          this.optionsBase({ value: val, name: "良好" }, true, colors[1])
        );
      } else if (val <= valueConfig[2]) {
        arr.push(
          this.optionsBase(
            { value: valueConfig[0], name: "充足" },
            false,
            colors[0]
          )
        );
        arr.push(
          this.optionsBase(
            { value: valueConfig[1], name: "良好" },
            false,
            colors[1]
          )
        );
        arr.push(
          this.optionsBase({ value: val, name: "不足" }, true, colors[2])
        );
      }
      return arr;
    },
    optionsBase(data, pointer = true, color = "#000") {
      var obj = {
        type: "gauge",
        progress: {
          show: true,
          width: 10,
          itemStyle: {
            color: color,
          },
        },
        pointer: {
          show: pointer,
          icon: "path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z",
          length: "50%",
          itemStyle: {
            color: color,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          length: 7,
          lineStyle: {
            width: 2,
            color: "#999",
          },
        },
        axisLabel: {
          color: "#999",
          fontSize: 10,
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 15,
          itemStyle: {
            borderWidth: 4,
            borderColor: color,
          },
        },
        title: {
          show: pointer,
          offsetCenter: [0, "40%"],
          fontSize: 15,
        },
        detail: {
          show: pointer,
          valueAnimation: true,
          fontSize: 20,
          offsetCenter: [0, "70%"],
          formatter: function (value) {
            return value.toFixed(0) + "%";
          },
        },
        data: [data],
      };
      return obj;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>