<template>
  <div class="wangkuang">
    <div class="image"  @click="imageClick(imageData.FaceUrl)" >
      <el-image
       
        style="width: 100%; height: 100%"
        :src="imageData.FaceUrl"
        @load="successLoad"
      >
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <!-- <FunAreaSelect
        v-if="show"
        :id="imageData.id"
        :circleRadius="1"
        :circleBorderWidth="1"
        :listData="imageData"
        :disabled="true"
        areaColor="rgba(40, 177, 217, 0)"
        selectAreaColor="rgba(40, 177, 217, 0)"
      ></FunAreaSelect> -->
      <div class="img-bottom-text">
        <div class="tetx-m">姓名：{{imageData.PersonName}}</div>
        <div>时间：{{imageData.time }}</div>  
      </div>
    </div>
    <div class="video" >
      <el-image
        style="width: 100%; height: 100%"
        :src="imageData.FaceSnap"
         @load="successLoad"
        @click.native="imageClick(imageData.FaceSnap)"
      ></el-image>
      <!-- <div :class="{ player: true, black: !imageData.alarmVideo }">
        <i class="el-icon-mybofang"></i>
      </div> -->
       <div class="img-bottom-text">
        <div class="tetx-m">识别度：{{imageData.FaceThreshold}}</div>
        <div>相机名称：{{imageData.CamerName}}</div>
      </div>
    </div>
    <ImageDialog
      :title="imageData.CamerName"
      :imageData="showUrl"
      v-model="showImageDialog"
    ></ImageDialog>
  </div>
</template>

<script>
// import FunAreaSelect from "@/components/funAreaSelect.vue";
import ImageDialog from "./imageDialog.vue";
import VideoDialog from "./videoDialog.vue";
export default {
  components: {
    // FunAreaSelect,
    ImageDialog,
    VideoDialog,
  },
  props: ["", ""],
  props:{
    imageData:{
      type:[Object]
    },
    alarmOptions:{
      type:Array 
    },
    camerList:{
      type:Array
    }
  },
  data() {
    return {
      show: false, //是否显示绘框
      showImageDialog: false,
      showUrl:{}
    };
  },
  created(){
    // console.log(this.imageData);
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
    },
    successLoad() {
      this.show = true;
    },
    imageClick(url){
      this.showImageDialog = true;
        this.showUrl = {id:this.imageData.id,alarmUrl:url}
    }
  },
};
</script>

<style lang="scss" scoped>
.wangkuang {
  // width: 350px;
  height: 100%;
  padding: 10px;
  border: 1px solid #d7d7d7;
  overflow: hidden;
  user-select: none;
  box-sizing: border-box;
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
  .img-bottom-text{
    font-size: 13px;
    color: #555555;
    .tetx-m{
      margin-top: 3px;
      margin-bottom: 10px;
    }
  }
}
</style>