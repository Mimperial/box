<template>
  <div>
      <intelligenceShow :showChangeModel="true"></intelligenceShow>
  </div>
</template>

<script>
import intelligenceShow from '../intelligenceShow.vue'
export default {
components:{
    intelligenceShow
},
provide:{
  model:false,
  showChangeModel:true // 是否是行为分析
}
}
</script>

<style>

</style>