// 抓拍
<template>
  <div>
    <intelligenceShow :model="2" :cardList="contentList"></intelligenceShow>
  </div>
</template>

<script>
import intelligenceShow from '../intelligenceShow.vue'
export default {
components:{
  intelligenceShow
},
data(){
  return {
    contentList:{
      imgsrc:'alarmUrl',
      bottomText:[
        {label:'相机名称',value:'cameraId'},
        {label:'时间',value:'time'}
      ]
    },
  }
}
}
</script>

<style>

</style>