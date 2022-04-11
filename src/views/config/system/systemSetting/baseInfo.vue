<template>
  <div class="kuang">
    <div class="limitKuang">
      <div class="limian">
        <baseIcon title="终端基础信息"></baseIcon>
        <div class="topTitle"></div>
        <div class="tableItem" v-for="(item, index) in tableData" :key="index">
          <div class="name">{{ item.title }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
      <div class="limian right">
        <iconCom
          title="主机温度"
          :info="temperature"
          smallInfo="℃"
          :srcImg="require('@/assets/img/temperature.png')"
        ></iconCom>
        <iconCom
          :blue="true"
          title="安全运行"
          :info="runningDays"
          smallInfo="天"
          :srcImg="require('@/assets/img/time.png')"
        ></iconCom>
      </div>
    </div>
    <div class="bottom">
      <baseIcon title="资源使用情况"></baseIcon>
      <div class="topTitle"></div>
      <div class="bottomDiv">
        <div class="storageCharts" style="height: 300px">
          <storageCharts
            :useStorage="storageObj.useStorage"
            :allStorage="storageObj.allStorage"
          ></storageCharts>
        </div>
        <div class="cpuCharts" style="height: 300px">
          <lineCharts
            id="cpuCharts"
            :title="$t('html.cpusyl')"
            :unitRight="cpuNow"
            :dataArr="cpuArr"
            lineColor="#B74F4F"
            areaColor="rgba(183, 79, 79, 0.2)"
          ></lineCharts>
        </div>
        <div class="memoryCharts" style="height: 300px">
          <lineCharts
            id="memoryCharts"
            :title="$t('html.ncsyl')"
            :unitRight="memoryNow"
            :dataArr="memoryArr"
            lineColor="#2D3BA2"
            areaColor="rgba(45, 59, 162, 0.2)"
          ></lineCharts>
        </div>
        <div class="ethernetCharts" style="height: 300px">
          <lineChartNetw
            id="ethernetCharts"
            :unitLeft="$t('html.tul')"
            :unitRight="bigArr"
            :title="$t('html.ytw')"
            :dataArr="ethernetArr"
            :dataArra="ethernetArr1"
            lineColor="#4FB8CD"
            areaColor="rgba(79, 184, 205,.2)"
          ></lineChartNetw>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDevInfoApi, setDevInfoApi, wsCpu } from "@/api/article";
import storageCharts from "./components/storageCharts2";
import lineCharts from "./components/lineCharts";
import lineChartNetw from "./components/lineChartNetw";
import iconCom from "./components/iconCom.vue";
import baseIcon from "@/components/baseIcon.vue";

export default {
  components: { storageCharts, lineCharts, lineChartNetw, iconCom, baseIcon },
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
      tableData: [],
      ws: null,
      cpuNow: "0%",
      memoryNow: "0%",
      bigArr: [],
      storageObj: {
        useStorage: 0,
        allStorage: 0,
      },
      cpuArr: [],
      memoryArr: [],
      ethernetArr: [],
      ethernetArr1: [],
      temperature: 0,
      runningDays: 0,
      arrStr: [
        {
          title: "设备名称",
          value: "devName",
        },
        {
          title: "设备编号",
          value: "devNumber",
        },
        {
          title: "设备类型",
          value: "devType",
        },
        {
          title: "设备序列号",
          value: "serialNo",
        },
        {
          title: "主控版本",
          value: "versionMain",
        },
        {
          title: "WEB版本",
          value: "versionWeb",
        },
      ],
    };
  },
  created() {
    this.setTableData({});
  },
  mounted() {
    this.getData();
    this.initWs();
  },
  methods: {
    setTableData(data) {
      var arr = [];
      this.arrStr.forEach((element) => {
        arr.push({
          title: element.title,
          value: data[element.value] ? data[element.value].trim() || "-" : "-",
        });
      });
      this.tableData = arr;
    },
    initWs() {
      this.ws = wsCpu(
        (data) => {
          if (data.Cmd == "ComputerInfo") {
            var obj = JSON.parse(data.Data);
            this.temperature = obj.temperature || 0;
            this.runningDays = obj.runningDays || 0;
            this.storageObj.useStorage = parseInt(
              obj.diskUsed ? obj.diskUsed : 0
            );
            this.storageObj.allStorage = parseInt(
              obj.diskTotal ? obj.diskTotal : 0
            );
            this.cpuNow = parseInt(obj.cpu ? obj.cpu : 0) + "%";
            this.memoryNow = parseInt(obj.memory ? obj.memory : 0) + "%";
            this.cpuArr.push(parseInt(obj.cpu));
            this.memoryArr.push(parseInt(obj.memory));
            var upSpeed = obj.ethernet.reduce((total, cur) => {
              return total + Number(Number(cur.upSpeed).toFixed(2));
            }, 0);
            var downSpeed = obj.ethernet.reduce((total, cur) => {
              return total + Number(Number(cur.downSpeed).toFixed(2));
            }, 0);
            this.bigArr = [upSpeed, downSpeed];
            this.ethernetArr.push(downSpeed);
            this.ethernetArr1.push(upSpeed);
          }
        },
        {
          info: ["ComputerInfo"],
        }
      );
    },
    getData() {
      getDevInfoApi({}).then((res) => {
        if (res.code == 0) {
          if (res.data) {
            var data = JSON.parse(res.data)[0];
            this.setTableData(data);
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          setDevInfoApi(this.ruleForm).then((res) => {
            if (res.code == 0) {
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
  beforeDestroy() {
    this.ws && this.ws.close();
  },
};
</script>

<style lang="scss" scoped>
.kuang {
  // justify-content: space-between;
  background-color: #efeff4;
  .tableItem {
    width: 100%;
    border-bottom: 1px solid#ebebeb;
    box-sizing: border-box;
    padding: 0 19px;
    .name,
    .value {
      width: 50%;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 37px;
      display: inline-block;
    }
  }
  .topTitle {
    height: 20px;
  }
  .limitKuang {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 346px;
    padding: 25px 40px 0;
    background-color: white;
    .limian {
      width: 489px;
      height: 100%;
      &.right {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 968px;
        height: auto;
      }
      .el-button {
        width: 100%;
      }
    }
  }
  .bottom {
    clear: both;
    // padding-top: 60px;
    margin-top: 24px;
    padding: 25px 40px 0;
    background-color: white;
    .bottomDiv {
      width: 100%;
      display: flex;
      padding-top: 20px;
      & > div {
        width: 25%;
      }
    }
  }
}
</style>