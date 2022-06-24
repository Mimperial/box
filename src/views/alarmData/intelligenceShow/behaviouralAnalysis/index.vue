<template>
  <div>
      <intelligenceShow :isVideo="isVideo" :model="1" v-model="isRight" :cardList="isRight?contentRightList:contentList"></intelligenceShow>
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
        {label:'报警类型',value:'alarmType'},
        {label:'时间',value:'time'}
      ]
    },
    contentRightList:{
      imgsrc:'alarmUrl',
      videoSrc:'alarmVideo',
        bottomText:[
        {label:'相机名称',value:'cameraId'},
        {label:'时间',value:'time'},
        {label:'报警类型',value:'alarmType'},
      ]
    },
    isRight:false,
    isVideo:false
  }
},
created(){
    var roles = this.$store.getters.roles;
    if (roles.includes("isVideo")) {
      this.isVideo = true;
      this.isRight=  true
    }
}
}
</script>

<style>

</style>