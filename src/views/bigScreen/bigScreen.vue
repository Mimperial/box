<template>
  <div>
    <Main></Main>
  </div>
</template>

<script>
import Main from "./components/main.vue";
export default {
  components: {
    Main,
  },
  data() {
    return {
      oldZoom: null,
    };
  },
  created() {
    // this.initScreen();
    this.setRem();
  },
  mounted() {
    this.$nextTick(() => {
      this.setRem();
    });
    window.addEventListener("resize", this.setRem);
  },
  methods: {
    initScreen() {
      //初始化屏幕因为在全局设置了缩小所以大屏要转换回去
      let c = document.querySelector("body");
      this.oldZoom = c.style.zoom;
      c.style.zoom = 1;
    },
    setRem() {
      // 在标准 375px 适配下，100px = 1rem;
      var baseFontSize = 100; //转换的尺寸
      var baseWidth = 1920; //设计师的尺寸
      var clientWidth =
        document.documentElement.clientWidth || window.innerWidth;
      var rem = 100;
      if (clientWidth != baseWidth) {
        rem = (clientWidth / baseWidth) * baseFontSize;
      }
      var t = window.devicePixelRatio || 1;
      document.querySelector("html").style.fontSize = rem * t + "px";
    },
    resetScreen() {
      if (this.oldZoom) {
        let c = document.querySelector("body");
        c.style.zoom = this.oldZoom;
      }
    },
  },
  beforeDestroy() {
    document.querySelector("html").style.fontSize = "";
    window.removeEventListener("resize", this.setRem);
    this.resetScreen();
  },
};
</script>
<style lang="scss">
.el-icon-error {
  font-size: 16px;
}
</style>