
<template>
  <div class="wangkuang">
    <div class="image" @click.stop="showImage">
      <el-image
        style="width: 100%; height: 100%"
        fit="contain"
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
    <div class="info">
      <div class="wenzi">相机名称：{{ name }}</div>
      <!-- <div class="wenzi">报警类型：{{ type }}</div> -->
      <div class="wenzi">时间：{{ imageData.time }}</div>
    </div>
    <ImageDialog
      :title="name"
      :imageData="imageData"
      v-model="showImageDialog"
    ></ImageDialog>
  </div>
</template>

<script>
import FunAreaSelect from "@/components/funAreaSelect.vue";
import ImageDialog from "./imageDialog.vue";
export default {
  components: {
    FunAreaSelect,
    ImageDialog,
  },
  props: ["alarmOptions", "imageData", "camerList"],
  data() {
    return {
      show: false, //是否显示绘框
      showImageDialog: false,
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
  },
};
</script>

<style lang="scss" scoped>
.wangkuang {
  width: 162px;
  padding: 6px;
  border: 1px solid #d7d7d7;
  overflow: hidden;
  user-select: none;
  .image {
    cursor: pointer;
    position: relative;
    float: left;
    width: 160px;
    height: 90px;
  }
  .info {
    float: left;
    width: 100%;
    margin-top: 8px;
    .wenzi {
      line-height: 28px;
      font-size: 12px;
    }
  }
}
</style>