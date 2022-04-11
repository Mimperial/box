<template>
  <div
    class="bottom"
    :style="{
      background: 'url(' + bigScreenBottom + ') 100% 100% no-repeat',
    }"
  >
    <div class="boxWrite">
      <span class="left">实时报警图片</span>
      <span @click="toAlarm" class="right"
        >更多报警信息<img
          :src="require('@/assets/img/bigScreen/more.png')"
          alt=""
      /></span>
    </div>
    <div class="alarmPicure">
      <transition-group
        @after-enter="afterEnter"
        name="alarmImage"
        @enter="enter"
      >
        <div
          :class="{
            picture: true,
            hidden: hidden,
          }"
          :style="{
            left:
              alarmImageList.length > maxImageCount
                ? 3.64 * (index - 1) + 'rem'
                : false,
          }"
          v-for="(item, index) in alarmImageList"
          :data-index="index"
          :key="item.id"
        >
          <div class="name">
            <span>{{ item.name }}</span>
            <img :src="alarmHeader" alt="" />
          </div>
          <FunAreaSelect
            v-if="item.listData"
            :id="item.id + index + 'big'"
            :circleRadius="1"
            :circleBorderWidth="1"
            :listData="item.listData"
            :yanListData="item.yanListData"
            :disabled="true"
            areaColor="rgba(40, 177, 217, 0)"
            selectAreaColor="rgba(40, 177, 217, 0)"
          ></FunAreaSelect>
          <img class="alarmPic" :src="item.url" alt="" />
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import FunAreaSelect from "@/components/funAreaSelect.vue";
export default {
  components: {
    FunAreaSelect,
  },
  props: ["alarmCacle"],
  data() {
    return {
      bigScreenBottom: require("@/assets/img/bigScreen/bigScreenBottom.png"),
      alarmHeader: require("@/assets/img/bigScreen/alarmHeader.png"),
      alarmImageList: [],
      maxImageCount: 5,
      hidden: false,
      timer: null,
      resizeTime: null,
    };
  },
  mounted() {
    document.addEventListener("visibilitychange", this.visibilitychange);
    setInterval(() => {
      if (this.alarmCacle.length > 0) {
        this.alarmImageList.push(this.alarmCacle[0]);
        if (this.alarmImageList.length > this.maxImageCount + 1) {
          this.alarmImageList.shift();
        }
        this.$emit("change", true);
      }
    }, 3000);
    window.addEventListener("resize", this.resizeWidth);
  },
  beforeDestroy() {
    document.removeEventListener("visibilitychange", this.visibilitychange);
    window.removeEventListener("resize", this.resizeWidth);
  },
  methods: {
    resizeWidth() {
      this.hidden = true;
      if (this.resizeTime) {
        clearTimeout(this.resizeTime);
        this.resizeTime = null;
      }
      this.resizeTime = setTimeout(() => {
        this.hidden = false;
        this.resizeTime = null;
      }, 1000);
    },
    visibilitychange(event) {
      if (document.visibilityState == "hidden") {
        this.hidden = true;
      } else {
        if (!this.timer) {
          this.timer = setTimeout(() => {
            this.hidden = false;
            this.timer = null;
          }, 1000);
        }
      }
    },
    toAlarm() {
      this.$router.push("/home/alarmData/intelligenceShow");
    },
    afterEnter(el) {
      var index = Number(el.dataset.index);
      if (this.alarmImageList.length > this.maxImageCount) {
        el.style.left = 3.64 * (index - 1) + "rem";
      } else {
        el.style.left = 3.64 * index + "rem";
      }
    },
    enter(el) {
      var index = Number(el.dataset.index);
      if (this.alarmImageList.length > this.maxImageCount) {
        index = index - 1;
      }
      var fontSize = document.querySelector("html").style.fontSize;
      fontSize = Number(fontSize.replace("px", ""));
      el.style.left =
        parseInt((el.offsetWidth + fontSize * 0.2) * index) + "px";
    },
  },
};
</script>

<style lang="scss" scoped>
.alarmImage-enter {
  left: 18.2rem !important;
}
.bottom {
  height: 100%;
  .boxWrite {
    padding: 0.19rem;
    box-sizing: border-box;
    overflow: hidden;
    .left {
      float: left;
      font-size: 0.16rem;
      font-weight: 500;
      color: #c5f1fa;
      line-height: 0.2rem;
    }
    .right {
      float: right;
      font-size: 0.14rem;
      font-weight: 400;
      color: #43e3fe;
      line-height: 0.2rem;
      cursor: pointer;
      user-select: none;
      img {
        margin-left: 0.08rem;
      }
    }
  }
  .alarmPicure {
    width: 18rem;
    height: 1.93rem;
    overflow: hidden;
    margin: 0 auto;
    position: relative;
    .picture {
      position: absolute;
      transition: left 2s ease;
      // left: 0;
      width: 3.44rem;
      height: 1.93rem;
      &.hidden {
        transition: unset;
      }
      // & + .picture {
      //   margin-left: 0.2rem;
      // }
      .name {
        position: absolute;
        top: 0;
        left: 0;
        width: auto;
        height: 0.4rem;
        span {
          position: absolute;
          top: 47%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.14rem;
          font-weight: 500;
          color: #ffffff;
          line-height: 0.24rem;
          letter-spacing: 1px;
          white-space: nowrap;
        }
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .alarmPic {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>