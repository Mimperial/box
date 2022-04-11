<template>
  <div @click="screen" class="imageHeader">
    <img :src="imgSrc" alt="" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgSrc: require("@/assets/img/fullSecc.png"),
      isFullScreen: false, //判断是否是全屏
    };
  },
  methods: {
    screen() {
      let element = document.documentElement;
      if (this.isFullScreen) {
        this.exitFullScreen();
        this.isFullScreen = false;
      } else {
        this.fullScreen();
        this.isFullScreen = true;
      }
    },
    fullScreen() {
      var el = document.documentElement;
      var rfs =
          el.requestFullScreen ||
          el.webkitRequestFullScreen ||
          el.mozRequestFullScreen ||
          el.msRequestFullScreen,
        wscript;

      if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
        return;
      }

      if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    // 退出全屏
    exitFullScreen(el) {
      var el = document,
        cfs =
          el.cancelFullScreen ||
          el.webkitCancelFullScreen ||
          el.mozCancelFullScreen ||
          el.exitFullScreen,
        wscript;
      if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
        return;
      }
      if (typeof window.ActiveXObject != "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
  },
};
</script>

<style>
</style>