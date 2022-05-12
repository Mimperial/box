<template>
  <div>
    <intelligenceShow :model="true"></intelligenceShow>
  </div>
</template>

<script>
import intelligenceShow from '../intelligenceShow.vue'
export default {
components:{
  intelligenceShow
},
provide:{
  model:true
}
}
</script>

<style>

</style>