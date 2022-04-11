<template>
  <div class="transitionKuang">
    <transition
      name="alarmTransition"
      @before-leave="beforeLeave"
      @after-leave="afterLeave"
    >
      <div class="showPicture" v-show="show">
        <div
          :class="{ oneMsg: true, show: show || index > 1 }"
          v-for="(item, index) in alarmList"
          :key="index"
        >
          <div class="image">
            <img :src="item.AlarmPath" alt="" />
          </div>
          <div class="msg">
            <div class="msgCenter">
              <div class="num">{{ item.Count }}</div>
              <div class="name">{{ item.AlarmName }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ["alarmMap"],
  data() {
    return {
      length: 0, //原始报警的个数
      alarmList: [], //报警算法都有什么
      show: true,
      stopTime: 2000,
      time: false, //判断是否启动动画
    };
  },
  watch: {
    alarmMap: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        this.length = Object.keys(newValue).length;
        if (this.alarmList.length == 0) {
          for (const key in newValue) {
            this.alarmList.push({
              key: key,
              Count: newValue[key].count,
              AlarmName: newValue[key].name,
              AlarmPath: newValue[key].path,
            });
          }
        } else {
          for (const key in newValue) {
            for (let i = 0; i < this.alarmList.length; i++) {
              const element = this.alarmList[i];
              if (element.key == key) {
                this.$set(this.alarmList[i], "Count", newValue[key].count);
              }
            }
          }
        }
        this.initCartoon();
      },
    },
  },
  methods: {
    initCartoon() {
      if (this.time) return;
      if (this.length > 6) {
        this.time = true;
        setTimeout(() => {
          this.show = false;
        }, this.stopTime);
      }
    },
    setAlarmList() {
      var one = this.alarmList.shift();
      var two = this.alarmList.shift();
      if (this.length % 2 == 0) {
        this.alarmList.push(one);
      }
      this.alarmList.push(two);
      setTimeout(() => {
        this.show = false;
      }, this.stopTime);
    },
    beforeLeave() {
      if (this.length % 2 != 0) {
        this.alarmList.push(this.alarmList[0]);
      }
    },
    afterLeave() {
      this.setAlarmList();
      this.show = true;
    },
  },
};
</script>

<style lang="scss" scoped>
// .alarmTransition-enter-active,
// .alarmTransition-enter,
.alarmTransition-leave-active {
  top: 0;
  transition: top 1.5s;
}
.alarmTransition-leave-to {
  top: -0.8rem;
}
.transitionKuang {
  position: relative;
  overflow: hidden;
  height: 2.22rem;
}
.showPicture {
  position: absolute;
  // top: 0;
  // left: 0.32rem;
  padding-left: 0.32rem;
  box-sizing: border-box;
  overflow: hidden;
  .oneMsg {
    float: left;
    width: 1.46rem;
    opacity: 0;
    transition: opacity 1.5s;
    &.show {
      transition: none;
      opacity: 1;
    }
    &:nth-child(even) {
      margin-left: 0.27rem;
    }
    &:nth-child(n + 3) {
      margin-top: 0.18rem;
    }
    .image {
      float: left;
      width: 0.57rem;
      height: 0.62rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .msg {
      float: left;
      margin-left: 0.13rem;
      height: 0.62rem;
      .msgCenter {
        display: inline-block;
        line-height: 0.62rem;
        .num {
          font-size: 0.18rem;
          font-weight: 600;
          color: #43e3fe;
          line-height: 0.25rem;
        }
        .name {
          font-size: 0.12rem;
          font-weight: 300;
          color: #c5f1fa;
          line-height: 0.17rem;
        }
      }
    }
  }
}
</style>