<template>
  <div class="box-Capture">
    <div class="capture-left">
      <img :src="item.url" alt="" />
    </div>
    <div class="capture-right">
      <p>通道:{{ item.channelName }}</p>
      <p>{{ item.time }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
}
</script>

<style lang="scss">
.box-Capture {
  //   width: 2.8rem;
  height: 1.9rem;
  border: 1px solid rgba(21, 62, 118, 1);
  background-color: rgba(25, 35, 94, 1);
  font-size: 0.14rem;
  // display: flex;
  padding: 0.05rem;
  align-items: center;
  color: #fff;
  margin-right: 0.1rem;
  .capture-left {
    width: 99%;
    height: 72%;
    & > img {
      width: 100%;
      height: 100%;
    }
  }
  .capture-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.02rem;
  }
}
</style>
