<template>
  <div id="curve"></div>
</template>

<script>
import * as echarts from "echarts/core";
import { GridComponent, MarkLineComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([GridComponent, MarkLineComponent, LineChart, CanvasRenderer]);
import { getAlarmCountApi } from "@/api/article";
export default {
  data() {
    return {
      xdata: [],
      sdata: [],
      myChart: null,
    };
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeFc);
  },
  methods: {
    resizeFc() {
      this.myChart.resize();
    },
    getData() {
      getAlarmCountApi({})
        .then((res) => {
          if (res.code == 0) {
            if (res.data) {
              var arr = JSON.parse(res.data);
              this.xdata = arr.map(
                (item) => item.Day.split("-")[1] + "-" + item.Day.split("-")[2]
              );
              this.sdata = arr.map((item) => Number(item.Count));
            }
          }
          this.init();
        })
        .catch((err) => {
          console.log(err);
          this.init();
        });
    },
    init() {
      this.myChart = echarts.init(document.getElementById("curve"));
      var option;
      option = {
        grid: {
          top: 10,
          bottom: 50,
          right: 19,
          left: 50,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xdata,
          axisLabel: {
            color: "#C5F1FA",
          },
          axisLine: {
            symbolSize: [10, 8],
            symbolOffset: [0, 7],
            lineStyle: {
              color: "#1CABFE",
              width: 1, //这里是为了突出显示加上的
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#C5F1FA",
          },
          axisLine: {
            symbolSize: [10, 8],
            symbolOffset: [0, 7],
            lineStyle: {
              color: "#1CABFE",
              width: 1, //这里是为了突出显示加上的
            },
          },
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            data: this.sdata,
            type: "line",
            lineStyle: {
              width: 3,
              color: "#4DD5E2",
            },
            symbol: "circle",
            symbolSize: 10,
            markLine: {
              silent: true,
              symbol: ["none", "none"],
              label: { show: false },
              data: [
                { xAxis: 0 },
                { xAxis: 1 },
                { xAxis: 2 },
                { xAxis: 3 },
                { xAxis: 4 },
                { xAxis: 5 },
                { xAxis: 6 },
              ],
              lineStyle: {
                type: "solid",
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 1,
                    color: "rgba(77, 213, 226, 0.8)",
                  },
                  {
                    offset: 0,
                    color: "rgba(77, 213, 226, 0)",
                  },
                ]),
              },
            },
            itemStyle: {
              color: "#4DD5E2",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(77, 213, 226, 0.7)",
                },
                {
                  offset: 1,
                  color: "rgba(77, 213, 226, 0)",
                },
              ]),
            },
          },
        ],
      };
      option && this.myChart.setOption(option);
      window.addEventListener("resize", this.resizeFc);
    },
  },
};
</script>

<style lang="scss" scoped>
#curve {
  width: 3.2rem;
  height: 2.15rem;
  margin-left: 0.11rem;
  margin-top: 0.3rem;
}
</style>