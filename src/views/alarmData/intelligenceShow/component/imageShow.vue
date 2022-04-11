<template>
  <div class="wangkuang">
    <div class="image" @click.stop="showImage">
      <el-image
        style="width: 100%; height: 100%"
        :src="imageData.alarmUrl"
        @load="successLoad"
      >
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <FunAreaSelect
        v-if="show"
        :id="imageData.id"
        :circleRadius="1"
        :circleBorderWidth="1"
        :listData="imageData.listData"
        :disabled="true"
        areaColor="rgba(40, 177, 217, 0)"
        selectAreaColor="rgba(40, 177, 217, 0)"
      ></FunAreaSelect>
    </div>
    <div class="video" @click.stop="showVideo">
      <el-image
        style="width: 100%; height: 100%"
        :src="imageData.alarmUrl"
      ></el-image>
      <div :class="{ player: true, black: !imageData.alarmVideo }">
        <i class="el-icon-mybofang"></i>
      </div>
    </div>
    <div class="info">
      <div class="wenzi">相机名称：{{ name }}</div>
      <div class="wenzi">
        <span>时间：{{ imageData.time }}</span>
        <span>报警类型：{{ type }}</span>
      </div>
    </div>
    <ImageDialog
      :title="name"
      :imageData="imageData"
      v-model="showImageDialog"
    ></ImageDialog>
    <VideoDialog
      :title="name"
      :imageData="imageData"
      v-model="showVidoeDialog"
    ></VideoDialog>
  </div>
</template>

<script>
import FunAreaSelect from "@/components/funAreaSelect.vue";
import ImageDialog from "./imageDialog.vue";
import VideoDialog from "./videoDialog.vue";
export default {
  components: {
    FunAreaSelect,
    ImageDialog,
    VideoDialog,
  },
  props: ["alarmOptions", "imageData", "camerList"],
  data() {
    return {
      show: false, //是否显示绘框
      showImageDialog: false,
      showVidoeDialog: false,
    };
  },
  computed: {
    name() {
      var camera = this.camerList.find(
        (item) => item.channelId == this.imageData.cameraId
      );
      return camera ? camera.name : "暂无";
    },
    type() {
      var alarm = this.alarmOptions.find(
        (item) => item.alarmNumber == this.imageData.alarmType
      );
      return alarm ? alarm.name : "暂无";
    },
  },
  methods: {
    showImage() {
      this.showImageDialog = true;
    },
    successLoad() {
      this.show = true;
    },
    showVideo() {
      this.showVidoeDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.wangkuang {
  width: 350px;
  padding: 10px;
  border: 1px solid #d7d7d7;
  overflow: hidden;
  user-select: none;
  .image {
    cursor: pointer;
    position: relative;
    float: left;
    width: 170px;
    height: 95.625px;
  }
  .video {
    cursor: pointer;
    position: relative;
    float: left;
    width: 170px;
    height: 95.625px;
    margin-left: 10px;

    .player {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000, $alpha: 0.2);
      &.black {
        background-color: #000;
      }
      i {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 35px;
        color: white;
      }
    }
  }
  .info {
    float: left;
    width: 100%;
    height: 60px;
    margin-top: 8px;
    .wenzi {
      line-height: 30px;
      font-size: 13px;
      span + span {
        margin-left: 10px;
      }
    }
  }
}
</style>