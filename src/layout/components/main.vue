<template>
  <el-main>
    <div class="contentObj">
      <router-view></router-view>
    </div>
  </el-main>
</template>

<script>
export default {};
</script>

<style>
.el-main .contentObj {
  /* width: 100%; */
  min-width: 100%;
  background-color: white;
  /* min-height: 100%; */
  height: 100%;
  flex: 1;
  box-sizing: border-box;
  position: relative;
}
</style>