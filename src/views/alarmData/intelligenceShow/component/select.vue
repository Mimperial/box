<template>
  <el-form ref="form" :model="formData" :inline="true" label-width="70px">
      <el-row>
          <el-col v-bind="strapData">
      <el-form-item label="开始时间">
              <el-date-picker
                v-model="formData.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
                </el-date-picker>
      </el-form-item>
      </el-col>
       <el-col v-bind="strapData">
      <el-form-item label="结束时间">
            <el-date-picker
                v-model="formData.endTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
                </el-date-picker>
      </el-form-item>
       </el-col>
       <el-col v-bind="strapData">
      <el-form-item label="告警类型" v-if="model == 1">
          <el-select v-model="formData.alarmType"  multiple
    collapse-tags placeholder="请选择">
                   <el-option
              v-for="item in alarmOptions"
              :key="item.id"
              :label="item.name"
              :value="item.alarmNumber"
            ></el-option>
            </el-select>
      </el-form-item>
       </el-col>
       <el-col v-bind="strapData">
      <el-form-item label="设备">
           <el-select v-model="formData.cameraId"  multiple
    collapse-tags placeholder="请选择">
                   <el-option
              v-for="item in camerList"
              :key="item.id"
              :label="item.name"
              :value="item.channelId"
            ></el-option>
            </el-select>
      </el-form-item>
       </el-col>
       <el-col v-bind="strapData">
      <el-form-item label="性别" v-if="model === 3">
            <el-select v-model="formData.Gender" placeholder="请选择">
                   <el-option
              v-for="item in GenderList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
            </el-select>
      </el-form-item>
       </el-col>
      <el-form-item>
           <slot></slot>
      </el-form-item>
      </el-row>
  </el-form>
</template>

<script>
import {
  
} from "@/api/article";
export default {
    name:'Select',
   props:{
       formData:{
           type:Object,
           default:()=>{}
       },
       camerList:{
           type:Array,
           default:()=>[]
       },
       alarmOptions:{
           type:Array,
           default:()=>[]
       },
       model:{
           type:Number,
           default:1
       }
   },
  
     watch:{
       formData:{
           handler:(v,oldv)=>{
               console.log(v,oldv);
           },
           immediate:true,
           deep:true
       },
       
   },
     data(){
        return{
            strapData: {
        xs: 24,
        sm: 12,
        md: 5,
        lg: 5,
        xl: 5
      },
            GenderList:[
                {
                    label:'男',
                    value:'1'
                },
                {
                    label:'女',
                    value:'2'
                },
            ]
        }
    },
    methods:{
       
    }
 
  
}
</script>

<style>

</style>