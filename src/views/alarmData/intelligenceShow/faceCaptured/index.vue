<template>
  <div>
    <intelligenceShow :model="false"></intelligenceShow>
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