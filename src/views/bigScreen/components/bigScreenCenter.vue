<template>
  <div class="showBigScreen">
    <div class="left">
      <div
        class="leftTop"
        :style="{
          background: 'url(' + leftTop + ') 100% 100% no-repeat',
        }"
      >
        <div class="smallTitle">今日报警数据统计</div>
        <LeftTop v-bind="$attrs"></LeftTop>
      </div>
      <div
        class="leftBottom"
        :style="{
          background: 'url(' + leftBottom + ') 100% 100% no-repeat',
        }"
      >
        <div class="smallTitle">7日内报警数据统计</div>
        <LeftBottom></LeftBottom>
      </div>
    </div>
    <div class="center">
      <VideoCenter v-bind="$attrs" @chaneVidoe="chaneVidoe"></VideoCenter>
    </div>
    <div class="right">
      <div
        class="rightTop"
        :style="{
          background: 'url(' + rightTop + ') 100% 100% no-repeat',
        }"
      >
        <div class="smallTitle rigth">本月安全隐患TOP排名</div>
        <RightTop v-bind="$attrs"></RightTop>
      </div>
      <div
        class="rightBottom"
        :style="{
          background: 'url(' + rightBottom + ') 100% 100% no-repeat',
        }"
      >
        <div class="smallTitle rigth">接入通道状态</div>
        <RightBottom v-bind="$attrs" :camerList="camerList"></RightBottom>
      </div>
    </div>
  </div>
</template>

<script>
import LeftTop from "./leftTop.vue";
import LeftBottom from "./leftBottom.vue";
import RightTop from "./rightTop.vue";
import RightBottom from "./rightBottom.vue";
import VideoCenter from "./videoCenter.vue";
export default {
  props: ["camerList"],
  components: {
    LeftTop,
    LeftBottom,
    RightTop,
    RightBottom,
    VideoCenter,
  },
  data() {
    return {
      leftTop: require("@/assets/img/bigScreen/leftTop.png"),
      leftBottom: require("@/assets/img/bigScreen/leftBottom.png"),
      rightTop: require("@/assets/img/bigScreen/rightTop.png"),
      rightBottom: require("@/assets/img/bigScreen/rightBottom.png"),
    };
  },
  computed: {
    name() {
      return this.data;
    },
  },
  methods: {
    chaneVidoe(data) {
      this.$emit("chaneVidoe", data);
    },
  },
};
</script>

<style lang="scss" scoped>
.showBigScreen {
  position: relative;
  height: 6.5rem;
  .smallTitle {
    font-size: 0.16rem;
    line-height: 0.22rem;
    padding: 0.17rem 0.21rem;
    color: #c5f1fa;
    &.rigth {
      text-align: right;
    }
  }
  .left {
    float: left;
    width: 4.34rem;
    .leftTop,
    .leftBottom {
      height: 3.16rem;
    }
    .leftBottom {
      margin-top: 0.18rem;
      height: 3.16rem;
    }
  }
  .center {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    width: 9.4rem;
    height: 6.33rem;
    margin-top: 0.17rem;
    z-index: 2;
  }
  .right {
    float: right;
    width: 4.34rem;
    .rightTop,
    .rightBottom {
      height: 3.16rem;
    }
    .rightBottom {
      margin-top: 0.18rem;
      height: 3.16rem;
    }
  }
}
</style>