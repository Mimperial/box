<template>
  <div class="loudou">
    <div class="oneList" v-for="(item, index) in alarmList" :key="index">
      <span>{{ item.AlarmName }}</span>
      <img
        :src="
          require('@/assets/img/bigScreen/rightTop/react' +
            (index + 1) +
            '.png')
        "
        alt=""
      />
      <span class="num">{{ item.Count }}</span>
    </div>
  </div>
</template>

<script>
import { getAlarmInfoCountApi } from "@/api/article";
export default {
  data() {
    return {
      alarmList: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      getAlarmInfoCountApi({ TimeType: "month" })
        .then((res) => {
          if (res.code == 0) {
            if (res.data) {
              var data = JSON.parse(res.data);
              this.alarmList = data.slice(0, 6);
            }
          }
          if (this.alarmList.length < 6) {
            for (let i = this.alarmList.length; i < 6; i++) {
              this.alarmList.push({
                AlarmName: "暂无",
                Count: 0,
              });
            }
          }
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.loudou {
  height: 2.2rem;
  margin-top: 0.1rem;
  user-select: none;
  .oneList {
    line-height: 0.37rem;
    height: 0.37rem;
    font-size: 0.12rem;
    font-weight: 300;
    color: #c5f1fa;
    text-align: center;
    position: relative;
    span {
      display: inline-block;
      line-height: 0.37rem;
      vertical-align: top;
      width: 0.8rem;
      &.num {
        width: 0.5rem;
        font-size: 0.18rem;
        font-weight: 600;
        color: #43e3fe;
        // margin-left: 0.06rem;
      }
    }
    img {
      display: inline-block;
      // margin-left: 0.1rem;
      height: 0.37rem;
      -webkit-user-drag: none;
    }
    &:nth-child(1) {
      img {
        width: 2.57rem;
      }
    }
    &:nth-child(2) {
      img {
        width: 2.07rem;
      }
    }
    &:nth-child(3) {
      img {
        width: 1.67rem;
      }
    }
    &:nth-child(4) {
      img {
        width: 1.34rem;
      }
    }
    &:nth-child(5) {
      img {
        width: 1.07rem;
      }
    }
    &:nth-child(6) {
      img {
        width: 0.85rem;
      }
    }
  }
}
</style>