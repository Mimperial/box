<template>
  <div id="videoFlv"></div>
</template>

<script>
import { objVideo } from "objecteye";
export default {
  props: {
    videoUrl: {
      type: String,
      default: "",
    },
  },
  watch: {
    videoUrl(newValue, oldValue) {
      this.objvideo.changeUrl(newValue);
    },
  },
  data() {
    return {
      objvideo: null,
    };
  },
  beforeDestroy() {
    this.objvideo && this.objvideo.destroy();
  },
  methods: {
    changeUrl(videoUrl) {
      this.objvideo.changeUrl(videoUrl);
    },
  },
  mounted() {
    var url = this.videoUrl || "";
    this.objvideo = new objVideo("videoFlv", url, {
      volume: 0,
      autoplay: true,
      enableStashBuffer: false,
      // screenshot:true
    });
  },
};
</script>

<style lang="scss" scoped>
#videoFlv {
  height: 100%;
  position: relative;
}
</style>