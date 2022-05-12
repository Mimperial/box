<template>
  <div>
    <div @click="clickItme(1)" :class="{ textBtn: true, select: value == 1 }">
      区域设置
    </div>
    <div @click="clickItme(2)" :class="{ textBtn: true, select: value == 2 }">
      时间配置
    </div>
  </div>
</template>

<script>
export default {
  props: ["value"],
  watch: {
    value(newValue) {
      this.$emit("change", newValue);
    },
  },
  methods: {
    clickItme(data) {
      this.$emit("input", data);
    },
  },
};
</script>

<style lang="scss" scoped>
.textBtn {
  display: inline-block;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  font-weight: 400;
  color: #010b56;
  text-align: center;
  width: 82px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #010b56;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  & + .textBtn {
    margin-top: 10px;
  }
  &:hover {
    background-color: rgba($color: #010b56, $alpha: 0.1);
  }
  &.select {
    background-color: #010b56;
    color: white;
  }
}
</style>