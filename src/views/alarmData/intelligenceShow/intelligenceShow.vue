<template>
  <div class="alarmData">
    <SelectTop
      ref="SelectTop"
      @seach="getData"
      @download="download"
      :isVideo="isVideo"
      :alarmOptions="alarmOptions"
      :camerList="camerList"
    ></SelectTop>
    <div v-if="vidoeModel" style="margin-bottom: 20px">
      <div v-if="showChangeModel">
      <el-button
        size="mini"
        icon="el-icon-s-grid"
        @click="changeModel(false)"
      ></el-button>
      <el-button
        size="mini"
        icon="el-icon-menu"
        @click="changeModel(true)"
      ></el-button>
      </div>
    </div>
    <div :class="{ imageAll: true, noVideo: !isVideo }">
      <div class="imageItem" v-for="item in imgArr" :key="item.id">
        <!-- 人脸识别 -->
        <ImageShow
          v-if="isVideo"
          :imageData="item"
          :alarmOptions="alarmOptions"
          :camerList="camerList"
        ></ImageShow>
        <!-- 人脸抓拍 -->
        <ImageShow2
          v-else
          :imageData="item"
          :alarmOptions="alarmOptions"
          :camerList="camerList"
        ></ImageShow2>
      </div>
    </div>
    <div class="block">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :total="page.total"
        :page-size="page.pageNum"
        :current-page.sync="page.curPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getAlarmHisApi,
  getAlgorithmListApi,
  getCameraApi,
  downloadAlarmHisApi,
} from "@/api/article";
import SelectTop from "./component/selectTop.vue";
import FunAreaSelect from "@/components/funAreaSelect.vue";
import ImageShow from "./component/imageShow.vue";
import ImageShow2 from "./component/imageShow2.vue";
import { setDownloadIdToken, getDownloadIdToken } from "@/utils/token";
import { changeImge } from "@/utils/utils";
import { mapGetters } from "vuex";
export default {
  components: { FunAreaSelect, SelectTop, ImageShow, ImageShow2 },
  props:{
    showChangeModel:{
      type:Boolean,
      default:false
    }
  },
  inject:['model'],
  data() {
    return {
      alarmOptions: [],
      camerList: [],
      imgArr: [],
      page: {
        pageNum: 12,
        curPage: 1,
        total: 0,
      },
      show: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 10,
        xl: 6,
      },
      baseUrl:
        process.env.NODE_ENV == "dev"
          ? process.env.VUE_APP_URL.replace(":8183", "")
          : window.location.origin,
      timer: null,
      isVideo: false,
      vidoeModel: false, //判断是否有切换的按钮
    };
  },
  watch: {
    isVideo: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue == true) {
          this.page.pageNum = 12;
        } else {
          this.page.pageNum = 24;
        }
      },
    },
  },
  created() {
    var roles = this.$store.getters.roles;
    if (roles.includes("isVideo")) {
      this.isVideo = true;
    }
    if (
      roles == "admin" ||
      (roles.includes("isVideo") && roles.includes("NoVideo"))
    ) {
      this.vidoeModel = true;
    }
  },
  computed: {
    ...mapGetters(["downloadFlag"]),
  },
  mounted() {
    this.getOption();
    this.changeModel(this.model)
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    changeModel(flag) {
      this.isVideo = flag
            this.$nextTick(() => {
              this.$refs.SelectTop.seach();
          });
      // const flag = this.model
      // if (flag !== this.isVideo) {
      //   this.isVideo = flag;
      //   if (this.imgArr.length > 0) {
      //     if (flag == true && this.imgArr.length > 12) {
      //       this.imgArr = this.imgArr.slice(0, 12);
      //     }
      //     this.$nextTick(() => {
      //     });
      //   }
      // }
    },
    getOption() {
      // getAlgorithmListApi({}).then((result) => {
      //   if (result.code == 0) {
      //     this.alarmOptions = JSON.parse(result.data);
      //   }
      // });
      getCameraApi({}).then((result) => {
        if (result.code == 0) {
          this.camerList = JSON.parse(result.data);
        }
      });
    },
    // 点击检索
    getData(sourceData) {
      getAlarmHisApi(Object.assign(sourceData, this.page)).then((res) => {
        if (res.code == 0) {
          const data = JSON.parse(res.data);
          if(!data?.alarmList.length>0){
            this.$message({
              message: this.$t("js.msgoneb"),
                type: "success",
              });  
          }
           this.page.total = Number(data.total);
          this.imgArr = this.getDrawPoint(data.alarmList);
               console.log("🤡 ~~ data", data.alarmList)
          console.log("🤡 ~~ this.imgArr", this.imgArr)
          // try {
          //   console.log("🤡 ~~ data", data)
          //   // data.alarmList
          //   if (
          //     (data.alarmList && data.alarmList.length > 0) ||
          //     this.page.curPage != 1
          //   ) {
          //     if (!data.alarmList || data.alarmList.length == 0) {
          //       this.page.curPage = Math.ceil(data.total / this.page.pageNum);
          //       this.getData(sourceData);
          //     }
          //     if (data.alarmList && data.alarmList.length > 0) {
          //     } else {
          //       this.imgArr = [];
          //     }
          //   } else {
          //     this.imgArr = [];
          //     this.page.total = 0;
          //     this.$message({
          //       message: this.$t("js.msgoneb"),
          //       type: "success",
          //     });
          //   }
          // } catch (error) {
          //   this.imgArr = [];
          //   this.page.total = 0;
          //   this.$message({
          //     message: this.$t("js.msgoneb"),
          //     type: "success",
          //   });
          // }
        }
      })
    },
    handleCurrentChange(val) {
      this.page.curPage = val;
      this.$refs.SelectTop.seach();
    },
    download(data) {
      let { startTime, endTime, alarmType, cameraId, download } = data;
      let userId = getDownloadIdToken();
      if (!this.downloadFlag) {
        downloadAlarmHisApi({
          startTime,
          endTime,
          alarmType,
          cameraId,
          download,
          userId,
        }).then((res) => {
          try {
            var data = JSON.parse(res.data);
            if (data.status == 1) {
              setDownloadIdToken(data.userId);
              this.$store.dispatch("seachFile");
            } else {
              // this.$message.error(
              //   "内容过大/暂无报警信息，请重新选择条件下载！"
              // );
            }
          } catch (error) {
            console.log(error);
          }
        });
      }
    },
    getDrawPoint(alarmList) {
      return alarmList.map((item) => {
        item.alarmUrl = this.baseUrl + item.alarmUrl;
        if (item.alarmVideo) {
          item.alarmVideo = this.baseUrl + item.alarmVideo;
        }
        item.time = item.time.split(" ")[0] + " " + item.time.split(" ")[1];
        item.listData = [];
        var boxArr = item.alarmBox.split(";");
        for (let i = 0; i < boxArr.length; i++) {
          const element = boxArr[i];
          var arr = element.split("-");
          var x = Number(arr[0]);
          var y = Number(arr[1]);
          var w = Number(arr[2]);
          var h = Number(arr[3]);
          item.listData.push({
            id: item.id,
            modeType: "react",
            serviceData: JSON.stringify([
              [x, y],
              [x, y + h],
              [x + w, y + h],
              [x + w, y],
            ]),
          });
        }
        item.yuan = JSON.parse(JSON.stringify(item.listData));
        item.listData = changeImge(
          item.listData,
          this.isVideo ? 170 : 160,
          this.isVideo ? 95.625 : 90
        );
        return item;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.imageAll {
  width: 100%;
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, 372px);
  grid-gap: 10px;
  min-height: 550px;
  &.noVideo {
    grid-template-columns: repeat(auto-fill, 176px);
    min-height: 420px;
  }
  .imageItem {
    margin-top: 5px;
  }
}
.alarmData {
  padding: 20px;
}
.block {
  text-align: center;
  margin-top: 20px;
}
.el-row {
  margin-bottom: 20px;
}
</style>