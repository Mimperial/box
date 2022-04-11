<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { VideoCom } from "zzvue";
export default {
  components: {
    VideoCom,
  },
  computed: mapState({
    timer: (state) => state.download.timer,
    downloadFlag: (state) => state.download.downloadFlag,
  }),
  created() {
    if (this.downloadFlag && !this.timer) {
      console.log("重新加载上次压缩状态");
      this.$store.dispatch("seachFile");
    }
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
}
video {
  object-fit: fill;
}
</style>