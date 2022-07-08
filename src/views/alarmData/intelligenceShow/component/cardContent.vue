<template>
  <div
    :class="{
      'card-content': true,
      'card-width-content': cardList.videoSrc || cardList.FaceUrl,
    }"
  >
    <template v-for="(item, i) in handlerCardData">
      <div class="box-card" :key="i">
        <div class="image" @click="clickImage(item[cardList.imgsrc], item)">
          <div v-if="model == 3" class="card-top-text">底库</div>
          <el-image
            style="width: 104%; height: 100%"
            :src="item[cardList.imgsrc]"
            @load="successLoad(i)"
            fit="scale-down"
          >
          </el-image>
          <FunAreaSelect
            v-if="item.isShow"
            :id="item.id"
            :circleRadius="1"
            :circleBorderWidth="1"
            :listData="item.listData"
            :disabled="true"
            areaColor="rgba(40, 177, 217, 0)"
            selectAreaColor="rgba(40, 177, 217, 0)"
          ></FunAreaSelect>
        </div>

        <div class="video" v-if="cardList.videoSrc">
          <div class="img_top_text">抓拍</div>

          <div
            @click="showVideo(item[cardList.videoSrc], item)"
            :class="{ player: true, black: true }"
          >
            <i class="el-icon-mybofang"></i>
          </div>
        </div>

        <div
          v-if="model == 3"
          class="image"
          @click="clickImage(item[cardList.FaceUrl], item)"
        >
          <div class="card-top-text">抓拍</div>
          <el-image
            style="width: 100%; height: 100%"
            :src="item[cardList.FaceUrl]"
            @load="successLoad(i)"
            fit="contain"
          >
          </el-image>
        </div>

        <div :class="{ 'text-bottom': true, mt3: model === 3 }">
          <template v-for="(t, tindex) in cardList.bottomText">
            <div :key="tindex" :class="{ text: true, model3: model === 3 }">
              <span>{{ t.label }}:</span>
              <span>{{ handleData(t.value, item) }}</span>
            </div>
          </template>
        </div>
      </div>
    </template>
    <ImageDialog
      ref="imageDialog"
      :title="name"
      :imageData="showUrl"
      v-model="showImageDialog"
    ></ImageDialog>
    <VideoDialog
      :title="name"
      :imageData="showUrl"
      v-model="showVidoeDialog"
    ></VideoDialog>
  </div>
</template>

<script>
import FunAreaSelect from '@/components/funAreaSelect.vue'
import ImageDialog from './imageDialog.vue'
import VideoDialog from './videoDialog.vue'

export default {
  props: {
    cardList: {
      type: Object,
      default: () => {},
    },
    cardData: {
      type: Array,
      default: () => [],
    },
    camerList: {
      type: Array,
    },
    alarmOptions: {
      type: Array,
    },
    model: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    handlerCardData: {
      get: function () {
        console.log(this.cardData)
        return this.cardData.map((item) => {
          return { ...item, isShow: false } //是否显示绘框
        })
      },
      set: function (value) {
        console.log('🤡 ~~ value', value)
      },
    },
  },
  components: {
    FunAreaSelect,
    ImageDialog,
    VideoDialog,
  },
  data() {
    return {
      show: false,
      showImageDialog: false,
      showVidoeDialog: false,

      showUrl: {},
      name: '',
    }
  },

  methods: {
    handleData(name, i) {
      if (name == 'alarmType') {
        var alarm = this.alarmOptions.find(
          (item) => item.alarmNumber == i[name]
        )
        return alarm ? alarm.name : '暂无'
      }
      if (name == 'cameraId' || name == 'CameraId') {
        var camera = this.camerList.find((item) => item.channelId == i[name])
        return camera ? camera.name : '暂无'
      }
      return i[name]
    },
    clickImage(url, i) {
      this.name = this.camerList.find(
        (item) => item.channelId === i.cameraId
      )?.name
      this.showImageDialog = true
      this.showUrl = { id: i.id, alarmUrl: url, yuan: i.yuan }
      this.$nextTick(() => {
        this.$refs.imageDialog.show = true
      })
    },
    successLoad(i) {
      this.$set(this.handlerCardData[i], 'isShow', true)
      this.$forceUpdate()
    },
    showVideo(url, i) {
      this.name = this.camerList.find(
        (item) => item.channelId === i.cameraId
      ).name
      this.showVidoeDialog = true
      this.showUrl = { id: i.id, alarmUrl: url, yuan: i.yuan }
    },
  },
}
</script>

<style lang="scss">
.card-top-text {
  font-size: 14px;
  text-align: left;
  padding-left: 10px;
}
.card-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, 176px);
  gap: 20px;
}
.card-width-content {
  grid-template-columns: repeat(auto-fill, 376px);
}
.text-bottom {
  float: left;
  width: 100%;
  margin-top: 12px;
  .text {
    font-size: 13px;
    margin-bottom: 10px;
    // margin-right: 20px;
  }
  .model3 {
    width: 50%;
    display: inline-block;
    // margin-top: 30px;
    text-align: left;
    padding-left: 20px;
    box-sizing: border-box;
  }
}
.box-card {
  border: 1px solid #d7d7d7;
  text-align: center;
  padding: 6px;
}
.image {
  cursor: pointer;
  position: relative;
  float: left;
  width: 160px;
  height: 90px;
}
.video {
  cursor: pointer;
  position: relative;
  float: left;
  width: 170px;
  height: 95.625px;
  margin-left: 10px;
  right: 0;
  top: 0;

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
.mt3 {
  margin-top: 30px;
}
</style>
