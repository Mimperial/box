<template>
  <div class="topAll">
    <div class="time">{{ videoTime }}</div>
    <!-- <img class="bg" :src="header" alt="" /> -->
    <img class="bg" :src="headerGif" alt="" />
    <div class="title">
      <div class="content">
        <img v-show="show == 'true'" :src="logoBigScreen" alt="" />
      </div>
      <div class="content">智能边缘计算终端管理平台</div>
    </div>
    <div class="setIcon">
      <img @click="toConfig" :src="setBigScreen" alt="" />
      <fallScreen :src="allBigScreen"></fallScreen>
    </div>
  </div>
</template>

<script>
import fallScreen from "./topCom/fallScreen.vue";
export default {
  props: ["videoTime"],
  components: {
    fallScreen,
  },
  data() {
    return {
      logoBigScreen: require("@/assets/img/bigScreen/logoBigScreen.png"),
      setBigScreen: require("@/assets/img/bigScreen/setBigScreen.png"),
      allBigScreen: require("@/assets/img/bigScreen/allBigScreen.png"),
      header: require("@/assets/img/bigScreen/header.png"),
      headerGif: require("@/assets/img/bigScreen/header.gif"),
      show: process.env.VUE_APP_LOGO,
    };
  },
  methods: {
    toConfig() {
      this.$router.push("/home/config/system/systemSetting");
    },
  },
};
</script>

<style lang="scss" scoped>
.topAll {
  position: relative;
  display: flex;
  justify-content: space-between;
  //   display: inline-block;
  //   width: 100%;
  //   text-align: justify;
  box-sizing: border-box;
  padding-top: 0.28rem;
  color: #c5f1fa;
  .bg {
    position: absolute;
    width: 100%;
    top: 0;
    z-index: 1;
  }
  img {
    display: inline-block;
  }
  .time,
  .title,
  .setIcon {
    position: relative;
    z-index: 2;
  }
  .time {
    display: inline-block;
    vertical-align: top;
    font-size: 0.16rem;
    width: 2rem;
  }
  .title {
    display: inline-block;
    vertical-align: top;
    .content {
      display: inline-block;
      vertical-align: top;
      line-height: 0.32rem;
      img {
        width: 0.59rem;
        height: 0.38rem;
      }
      &:nth-child(2) {
        margin-left: 0.16rem;
      }
    }
    font-size: 0.36rem;
  }
  .setIcon {
    display: inline-block;
    width: 2rem;
    text-align: right;
    img {
      cursor: pointer;
      vertical-align: top;
      width: 0.25rem;
      height: 0.25rem;
      &:nth-child(2) {
        width: 0.2rem;
        height: 0.2rem;
        margin-left: 0.39rem;
      }
    }
  }
}
</style>