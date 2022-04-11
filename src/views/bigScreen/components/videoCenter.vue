<template>
  <div class="videoBox">
    <div class="videoPlay">
      <div class="videoName" v-if="osdData.camName && cameraInfo.url">
        <p>{{ cameraInfo.name }}</p>
      </div>
      <div class="videoTime" v-if="cameraInfo.url && osdData">
        {{ timeChange(osdData, videoTime, osdData.datecfg, osdData.timecfg) }}
      </div>
      <img class="border" :src="videoGif" alt="" />
      <img class="border top" :src="videoBoder" alt="" />

      <div class="video" id="playerVideo">
        <!-- <VideoCom
          :seek="true"
          :videoUrl="cameraInfo.url"
        ></VideoCom> -->
        <VideoFlv :videoUrl="cameraInfo.url"></VideoFlv>
        <!-- <VideoFlv ref="VideoFlv" :videoUrl="videoUrl"></VideoFlv> -->
      </div>
      <FunAreaSelect
        v-if="osdData.ai && listData && listData.length > 0"
        titlePadding="0px"
        titleFillColor="rgba(40, 177, 217, 0)"
        titleFont="20px bolder 黑体"
        :position="[-2, 0]"
        titleColor="#ff7e00"
        lineColor="#07bd07"
        :showTitle="true"
        :circleRadius="1"
        :circleBorderWidth="1"
        :listData="listData"
        :disabled="true"
        areaColor="rgba(40, 177, 217, 0)"
        selectAreaColor="rgba(40, 177, 217, 0)"
      ></FunAreaSelect>
      <div class="vidoeChange leftChange" @click="chaneVidoe('left')">
        <img class="bg" :src="changeLeft" alt="" />
        <img class="arrow" :src="arrowLeft" alt="" />
      </div>
      <div class="vidoeChange rightChange" @click="chaneVidoe('right')">
        <img class="bg" :src="changeRight" alt="" />
        <img class="arrow" :src="arrowRight" alt="" />
      </div>
      <div class="liang">
        <img :src="videoCenter" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { VideoCom, FunAreaSelect } from "zzvue";
import VideoFlv from "./VideoFlv.vue";
import { getOsdInfoApi } from "@/api/article";
export default {
  props: ["cameraInfo", "cameraId", "listData", "videoTime"],
  components: {
    VideoCom,
    FunAreaSelect,
    VideoFlv,
  },
  data() {
    return {
      videoGif: require("@/assets/img/bigScreen/video.gif"),
      videoBoder: require("@/assets/img/bigScreen/videoBoder.png"),
      videoCenter: require("@/assets/img/bigScreen/videoCenter.png"),
      changeLeft: require("@/assets/img/bigScreen/changeLeft.png"),
      arrowLeft: require("@/assets/img/bigScreen/arrowLeft.png"),
      changeRight: require("@/assets/img/bigScreen/changeRight.png"),
      arrowRight: require("@/assets/img/bigScreen/arrowRight.png"),
      mark: null,
      osdData: {
        camName: false,
        date: false,
        datecfg: "1",
        time: false,
        timecfg: "12",
        ai: false,
      },
      // videoUrl: "",
    };
  },
  watch: {
    "cameraInfo.id": {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue) {
          this.initOsdData();
          this.getOsdInfo(newValue);
        }
      },
    },
  },
  methods: {
    chaneVidoe(data) {
      this.$emit("chaneVidoe", data);
    },
    getOsdInfo(id) {
      getOsdInfoApi({ id: id })
        .then((res) => {
          if (res.code == 0) {
            try {
              var data = JSON.parse(res.data);
              this.osdData = data;
            } catch (error) {
              this.initOsdData();
            }
          }
        })
        .catch((err) => {
          this.initOsdData();
        });
    },
    initOsdData() {
      this.osdData = {
        camName: false,
        date: false,
        datecfg: "1",
        time: false,
        timecfg: "12",
        ai: false,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.videoBox {
  .videoPlay {
    position: relative;
    width: 9.4rem;
    height: 5.37rem;
    font-size: 15px;
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
    .vidoeChange {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      width: 0.4rem;
      height: 1.43rem;
      cursor: pointer;
      img {
        -webkit-user-drag: none;
      }
      &.leftChange {
        left: -0.54rem;
      }
      &.rightChange {
        right: -0.54rem;
      }
      .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .arrow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0.26rem;
        height: 0.32rem;
      }
    }
    .liang {
      position: absolute;
      bottom: -1.5rem;
      left: 50%;
      transform: translate(-50%);
      width: 5.3rem;
      height: 2.25rem;
      img {
        width: 100%;
        height: 100%;
      }
      z-index: 102;
    }
    .video {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      border-radius: 0.09rem;
      box-sizing: border-box;
      overflow: hidden;
    }
    .border {
      position: absolute;
      -webkit-user-drag: none;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      &.top {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100.5%;
        height: 100.5%;
      }
    }
  }
}
</style>