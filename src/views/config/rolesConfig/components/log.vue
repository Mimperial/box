<template>
  <div class="nei">
    <div class="header">
      <div class="leftBtn">
        <div>
          <el-radio v-model="logType" label="socket">{{
            $t("html.ss")
          }}</el-radio>
          <el-radio v-model="logType" label="history">{{
            $t("html.ls")
          }}</el-radio>
        </div>
        <div>
          <el-form label-width="80px">
            <el-form-item
              size="small"
              style="margin-bottom: 0px"
              :label="$t('html.mk')"
            >
              <el-select
                clearable
                @change="changeModel"
                size="small"
                v-model="modelValue"
                :placeholder="$t('html.xzmk')"
              >
                <el-option
                  v-for="item in modelOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-form label-width="52px">
            <el-form-item
              size="small"
              style="margin-bottom: 0px"
              :label="$t('html.lx')"
            >
              <el-select
                clearable
                @change="changeType"
                size="small"
                v-model="typeValue"
                :placeholder="$t('html.qxzlx')"
              >
                <el-option
                  v-for="item in typeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div style="margin-left: 10px" v-show="logType == 'history'">
          <el-date-picker
            @change="changeTime"
            size="small"
            style="width: 100%"
            v-model="timerRange"
            type="datetimerange"
            :range-separator="$t('html.z')"
            :start-placeholder="$t('html.ksrq')"
            :end-placeholder="$t('html.jsrq')"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="rightBtn">
        <el-button
          size="small"
          v-show="logType == 'history'"
          type="primary"
          @click="selectLogHistory"
          >{{ $t("html.cxrq") }}</el-button
        >
        <el-button size="small" @click="outFile" type="primary">{{
          $t("html.dcrq")
        }}</el-button>
      </div>
    </div>
    <div class="neirong" v-show="logType == 'socket'">
      <ul
        v-bodyScroll="load"
        id="shangjuan"
        style="overflow: auto; height: 100%"
      >
        <li v-for="(item, index) in logArr" :key="index">
          <span style="color: #67c23a">{{ item.time }} </span>
          <span style="color: #f56c6c">
            <span style="color: #e6a23c">[ {{ item.modelValue }} ]</span> - [
            {{ item.info | infoFilter }} ]
          </span>
          <span
            style="letter-spacing: 1.5px"
            :style="
              item.info == '4' || $t('html.cw')
                ? 'color:#F56C6C'
                : item.info == '3' || $t('html.jg')
                ? 'color:#409EFF'
                : ''
            "
          >
            {{ item.content }}
          </span>
        </li>
      </ul>
    </div>
    <div class="neirong" v-show="logType == 'history'">
      <ul
        v-bodyScroll="load"
        id="shangjuan"
        style="overflow: auto; height: 100%"
      >
        <li v-for="(item, index) in logArr" :key="index">
          <span style="color: #67c23a">{{ item.logTime }} </span>
          <span style="color: #f56c6c">
            <span style="color: #e6a23c">[ {{ item.logModule }} ]</span> - [
            {{ item.logLevel | infoFilter }} ]
          </span>
          <span
            style="letter-spacing: 1.5px"
            :style="
              item.info == 'error' || $t('html.cw')
                ? 'color:#F56C6C'
                : item.info == 'warning' || $t('html.jg')
                ? 'color:#409EFF'
                : ''
            "
          >
            {{ item.logInfo }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { modelOptionsApi, historyLogApi, wsLog } from "@/api/article";
export default {
  data() {
    return {
      //错误红色  #F56C6C
      //正常白色
      //警告蓝色 #409EFF
      logType: "socket",
      modelValue: "",
      logArr: [],
      modelOption: [],
      typeOption: [
        {
          label: "Info",
          value: "1",
        },
        {
          label: "Debug",
          value: "2",
        },
        {
          label: "Warning",
          value: "3",
        },
        {
          label: "Error",
          value: "4",
        },
      ],
      typeValue: "",
      timerRange: ["", ""],
      ws: null,
      page: {
        curPage: 40,
        pageNum: 1,
        total: 0,
      },
    };
  },
  filters: {
    infoFilter(data) {
      if (/^[\u4e00-\u9fa5]+$/i.test(data)) {
        return data;
      } else {
        switch (data) {
          case "1":
            return "Info";
          case "2":
            return "Debug";
          case "3":
            return "Warning";
          case "4":
            return "Error";
          default:
            return "无";
        }
      }
    },
  },
  watch: {
    logType(newValue) {
      if (newValue == "socket") {
        this.logArr = [];
        this.getwsData();
      } else {
        this.ws && this.ws.close();
        this.initPage();
        this.logArr = [];
      }
    },
  },
  beforeDestroy() {
    this.ws && this.ws.close();
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    changeType() {
      if (this.logType == "socket") {
        this.logArr = [];
        this.getwsData();
      } else {
        this.initPage();
      }
    },
    changeModel() {
      if (this.logType == "socket") {
        this.logArr = [];
        this.getwsData();
      } else {
        this.initPage();
      }
    },
    initPage() {
      this.page.total = 0;
      this.page.pageNum = 1;
    },
    changeTime() {
      this.initPage();
    },
    selectLogHistory() {
      if (this.timerRange && this.timerRange.length > 0) {
        if (this.page.pageNum <= 1) {
          this.getHistory();
        } else {
          this.$message({
            message: this.$t("js.mesgone"),
            type: "warning",
          });
        }
      } else {
        this.$message({
          message: this.$t("js.mrsgone"),
          type: "warning",
        });
      }
    },
    getHistory() {
      historyLogApi({
        logModule: this.modelValue,
        logLevel: String(this.typeValue),
        startTime: this.timerRange[0]
          ? new Date(this.timerRange[0]).format("yyyy-MM-dd hh:mm:ss")
          : "",
        endTime: this.timerRange[1]
          ? new Date(this.timerRange[1]).format("yyyy-MM-dd hh:mm:ss")
          : "",
        pageNum: String(this.page.curPage),
        curPage: String(this.page.pageNum),
      }).then((res) => {
        if (res.code == 0) {
          if (this.page.pageNum <= 1) {
            document.getElementById("shangjuan").scrollTop = 0;
            this.logArr = JSON.parse(res.data).loggingList;
          } else {
            if (this.logArr.length >= this.page.total) return;
            this.logArr = this.logArr.concat(JSON.parse(res.data).loggingList);
          }
          this.page.total = JSON.parse(res.data).total;
        }
      });
    },
    getOptions() {
      modelOptionsApi().then((res) => {
        if (res.code == 0) {
          this.modelOption = JSON.parse(res.data).map((item) => {
            return {
              label: item.modelValue,
              value: item.id,
            };
          });
          this.modelValue = this.modelOption[0].label;
          this.getwsData();
        }
      });
      this.typeValue = this.typeOption[0].value;
    },
    load() {
      //加载
      if (this.logType == "socket") return; //如果是websocke没有这个
      if (this.logArr.length >= this.page.total) return; //如果到最后一条就不用加载了
      this.page.pageNum++;
      this.getHistory();
    },
    getwsData() {
      this.ws && this.ws.close();
      // console.log(this.modelValue,this.typeValue)
      var a = this.typeOption.filter((item) => {
        return item.value === this.typeValue;
      });
      this.ws = wsLog(
        (res) => {
          var data = JSON.parse(res.Data);
          if (res.Cmd === "ReallyLog") {
            if (data.time) {
              if (
                data.modelValue == this.modelValue &&
                data.info >= a[0].value
              ) {
                this.logArr.push(data);
              }
            }
          }
        },
        {
          info: ["ReallyLog"],
        }
      );
    },
    outFile() {
      var str = "";
      if (this.logType === "socket") {
        this.logArr.forEach((item) => {
          str += item.time + item.modelValue + item.content + "\n";
        });
      } else {
        this.logArr.forEach((item) => {
          str += item.logTime + item.logModule + item.logInfo + "\n";
        });
      }

      var urlObject = window.URL || window.webkitURL || window;
      var exportBlob = new Blob([str]);
      var saveLink = document.createElement("a");
      saveLink.href = urlObject.createObjectURL(exportBlob);
      saveLink.download = this.$t("js.mtsgone");
      saveLink.click();
    },
  },
};
</script>

<style lang="scss" scoped>
.nei {
  padding: 10px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .leftBtn {
      display: flex;
      align-items: center;
      & > div {
        display: flex;
        align-items: center;
      }
    }
    .rightBtn {
      margin-right: 2.8%;
    }
  }
  .headerTwo {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      width: 431px;
    }
    & > div:last-child {
      margin-right: 2.8%;
    }
  }
  .neirong {
    width: 100%;
    margin-top: 15px;
    height: 77vh;
    background-color: rgb(43, 43, 43);
    list-style: none;
    color: white;
    font-size: 15px;
    line-height: 20px;
    padding: 6px 10px;
    box-sizing: border-box;
    // overflow: auto;
    ul {
      li:not(:first-child) {
        margin-top: 5px;
      }
    }
  }
}
</style>