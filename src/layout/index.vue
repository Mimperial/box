<template>
  <el-container>
    <el-header><headerzz @change="handleSelect"></headerzz></el-header>
    <el-container class="neibu-container">
      <leftzz></leftzz>
      <mainzz></mainzz>
    </el-container>
  </el-container>
</template>

<script>
import { leftzz, headerzz, mainzz } from "./components/index";
export default {
  components: { leftzz, headerzz, mainzz },
  data() {
    return {
      listKey: "",
    };
  },
  methods: {
    handleSelect(data) {
      // console.log(data)
    },
  },
};
</script>

<style>
.el-container {
  width: 100%;
  height: 100%;
}
.neibu-container {
  height: calc(100% - 60px);
}
.el-aside {
  height: 100%;
  background: #010b56;
  box-shadow: 3px 0px 5px 1px rgba(51, 51, 51, 0.4);
}
.el-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>