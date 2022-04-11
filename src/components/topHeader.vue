<template>
  <div>
    <ul v-if="list.length > 1">
      <li
        @click="change(index)"
        :class="selectIndex == index ? 'select' : ''"
        v-for="(item, index) in list"
        :key="index"
      >
        {{ item.name }}
      </li>
    </ul>
    <div v-else class="oneStyle">
      <span>{{ list[0].name }}</span>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["list"],
  data() {
    return {
      selectIndex: 0,
    };
  },
  methods: {
    change(index) {
      this.selectIndex = index;
      this.$emit("change", this.list[index]);
    },
  },
};
</script>

<style lang="scss" scoped>
.oneStyle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 2%;
  span {
    min-width: 123px;
    // width: 123px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #010b56;
  }
  div.line {
    flex: 1;
    height: 2px;
    background: #010b56;
  }
}
ul {
  list-style: none;
  overflow: hidden;
  background-color: #efeff4;
  li {
    // width: 123px;
    min-width: 123px;
    padding: 0 10px;
    box-sizing: border-box;
    line-height: 50px;
    text-align: center;
    float: left;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #010b56;
    cursor: pointer;
    &.select {
      background-color: #ffffff;
    }
  }
}
</style>