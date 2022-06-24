<template>
  <div>
    <intelligenceShow :model="3" :cardList="contentList"></intelligenceShow>
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
      imgsrc:'FaceUrl',
      FaceUrl:'FaceSnap',
      bottomText:[
        {label:'姓名',value:'PersonName'},
        {label:'识别度',value:'FaceThreshold'},
        {label:'时间',value:'time'},
        {label:'相机名称',value:'CameraId'},
      ]
    },
  }
}
}
</script>

<style>

</style>