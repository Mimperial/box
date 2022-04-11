<template>
  <div class="creameList">
    <div class="titleHeader">
      <div class="name">名称</div>
      <div class="status">状态</div>
    </div>
    <div class="showKuang">
      <transition name="cramerTransition" @after-leave="afterLeave">
        <div class="showItem" v-show="show">
          <div
            :class="{ items: true, select: item.channelId == cameraId }"
            v-for="(item, index) in cramerListIn"
            :key="index"
          >
            <div class="name">{{ item.name.trim() ? item.name : "-" }}</div>
            <div
              :class="{
                status: true,
                red: item.status == 0,
                nomonal: item.status != 0 && item.status != 1,
              }"
            >
              {{ item.status == 1 ? "正常" : item.status == 0 ? "异常" : "-" }}
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: ["camerList", "cameraId"],
  data() {
    return {
      cramerListIn: [],
      show: true,
      stopTime: 2000,
    };
  },
  watch: {
    camerList: {
      deep: true,
      handler(newValue, oldValue) {
        this.cramerListIn = newValue;
        this.init();
      },
    },
  },
  methods: {
    init() {
      if (this.cramerListIn.length > 6) {
        setTimeout(() => {
          this.show = false;
        }, this.stopTime);
      }
    },
    setcramerListIn() {
      var one = this.cramerListIn.shift();
      this.cramerListIn.push(one);
      setTimeout(() => {
        this.show = false;
      }, this.stopTime);
    },
    afterLeave() {
      this.setcramerListIn();
      this.show = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.cramerTransition-leave-active {
  top: 0;
  transition: top 1.5s;
}
.cramerTransition-leave-to {
  top: -0.33rem;
}
.creameList {
  width: 3.27rem;
  margin-left: 0.96rem;
  .showKuang {
    overflow: hidden;
    position: relative;
    height: 1.98rem;
    .showItem {
      width: 100%;
      position: absolute;
    }
  }
  .name,
  .status {
    float: left;
    width: 50%;
    text-align: center;
    font-size: 0.14rem;
    font-weight: 300;
    color: #c5f1fa;
    line-height: 0.33rem;
  }
  .status {
    font-size: 0.14rem;
    font-weight: 400;
    color: #43fe6d;
    &.red {
      color: #fe4343;
    }
    &.nomonal {
      color: #c5f1fa;
    }
  }
  .items {
    width: 100%;
    height: 0.33rem;
    overflow: hidden;
    &.select {
      width: 100%;
      box-shadow: 0rem 0rem 0.2rem 0.08rem rgba(67, 227, 254, 0.08),
        0rem 0rem 0.28rem 0.08rem rgba(67, 227, 254, 0.4) inset;
    }
  }
  .titleHeader {
    margin-bottom: 0.07rem;
    overflow: hidden;
    .name,
    .status {
      font-size: 0.14rem;
      font-weight: 500;
      color: #43e3fe;
      line-height: 0.34rem;
    }
  }
}
</style>