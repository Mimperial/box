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
  model:false
}
}
</script>

<style>

</style>