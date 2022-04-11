<template>
  <div class="baseTitle">{{ title }}</div>
</template>

<script>
export default {
  props: ["title"],
};
</script>

<style lang="scss" scoped>
.baseTitle {
  position: relative;
  top: -10px;
  font-size: 16px;
  font-weight: 600;
  color: #010b56;
  &:before {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: #010b56;
    left: -22px;
    top: 50%;
    transform: translate(0, -50%);
  }
}
</style>