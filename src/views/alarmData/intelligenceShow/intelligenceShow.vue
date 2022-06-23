<template>
  <div class="alarm-page">
    <!-- 顶部search -->
    <Select :model="model" :formData.sync="form" :camerList="camerList" :alarmOptions="alarmOptions">
      <el-button type="primary" @click="search">检索</el-button>
    <el-button type="primary" @click="dialogVisibleDownload = true"  :disabled="downloadFlag">{{ downloadFlag ? "压缩中" : "下载" }}</el-button>
    </Select>
    <!-- 中间切换按钮部分 -->
    <div v-if="model === 1" style="margin-bottom:20px">
      <el-button
        size="mini"
        icon="el-icon-s-grid"
        @click="behavioutBtn(false)"
      ></el-button>
      <el-button
        size="mini"
        icon="el-icon-menu"
        @click="behavioutBtn(true)"
      ></el-button>
      </div>
    <!-- 中间内容 -->
  <cardContent v-loading="loading" :model="model" :cardList="cardList" :cardData="cardData" :alarmOptions="alarmOptions" :camerList="camerList"></cardContent>
  <!-- 分页器 -->
   <div class="block">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :total="page.total"
        :page-size="page.pageNum"
        :current-page.sync="page.curPage"
      >
      </el-pagination>
      <!-- diaflog -->
       <el-dialog
      title="下载文件"
      :visible.sync="dialogVisibleDownload"
      width="30%"
    >
      <div class="content">
        <span class="title">下载类型：</span>
        <el-radio-group v-model="form.download">
          <el-radio label="picture">图片</el-radio>
          <el-radio label="video" v-if="isVideo">视频</el-radio>
          <el-radio label="all" v-if="isVideo">图片+视频</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisibleDownload = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="download"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import Select from './component/select.vue'
import cardContent from './component/cardContent.vue'
import {getAlarmHisApi,getAlgorithmListApi,
  getCameraApi,getFaceAlarms,downloadAlarmHisApi} from '@/api/article'
import { changeImge } from "@/utils/utils";
import { setDownloadIdToken, getDownloadIdToken } from "@/utils/token";
import { mapGetters } from "vuex";
import {formatTime} from '@/utils/time'


  export default {
    name: '',
    model:{
      prop: 'checked',
    event: 'change'
    },
    props:{
      model:{
        type:Number,
        default:1
      },
      checked: Boolean,
      cardList:{
        type:Object,
        defautl:()=>[]
      },
    },
    components:{
      Select,
      cardContent
    },
     computed: {
    ...mapGetters(["downloadFlag"]),
  },
    created(){
      var roles = this.$store.getters.roles;
    if (roles.includes("isVideo")) {
      this.isVideo = true;
    }
       this.getSelectData()
    },
    mounted(){
      if(this.model === 1){
        this.behavioutBtn()
        return
      }
      this.search()

    },
    data() {
      return {
          form:{
            startTime:formatTime(new Date(new Date() - 7 * 24 * 3600 * 1000).getTime()),
            endTime: formatTime(new Date()),
            alarmType:'',
            cameraId:'',
            Gender:'',
            download:'picture'
          },
          page: {
          pageNum: 24,
          curPage: 1,
          total: 0,
        },
        camerList:[],
        alarmOptions:[],
        cardData:[],
           baseUrl:
        process.env.NODE_ENV == "dev"
          ? process.env.VUE_APP_URL.replace(":8183", "")
          : window.location.origin,
          dialogVisibleDownload:false,
          isVideo:false,
          loading:false
      }
    },
    methods:{
      handleCurrentChange(val) {
      this.page.curPage = val;
    this.search()
    },
    
      search(){
        this.loading = true
        const parms = {...this.form,...this.page}
          const cameraId =
          this.form.cameraId.map((item) => "'" + item + "'").join(",") ||
          this.camerList.map((item) => "'" + item.channelId + "'").join(",");
        if(this.model === 1){
          // 调用行为分析接口
        const  alarmType = this.form.alarmType.map((item) => "'" + item + "'").join(",");
          getAlarmHisApi({...parms,alarmType,cameraId}).then(res=>{
            const data = JSON.parse(res.data)
            if(!data?.alarmList.length>0){
            this.$message({
              message: this.$t("js.msgoneb"),
                type: "success",
              });  
          }
           this.page.total = Number(data.total);
            this.cardData = this.getDrawPoint(data.alarmList)
          }).finally(()=>{
        this.loading = false
          })
        }else if(this.model == 2){
           getAlarmHisApi({...parms,cameraId,alarmType: "'400'"}).then((res) => {
        if (res.code == 0) {
          const data = JSON.parse(res.data);
          if(!data?.alarmList.length>0){
            this.$message({
              message: this.$t("js.msgoneb"),
                type: "success",
              });  
          }
           this.page.total = Number(data.total);
          this.cardData = this.getDrawPoint(data.alarmList);
        }
      }).finally(()=>{
        this.loading = false
          })
        }else{
       const {pageNum,curPage} = this.page
      getFaceAlarms({...parms,CameraId:cameraId,pageNum:'12',curPage:String(curPage)}).then(res=>{
        const {data} = res
        if(data.row.length===0){
              this.$message({
              message: this.$t("js.msgoneb"),
                type: "success",
              });  
        }
        this.page.total = res.data.total
         this.cardData = this.handleData(data.row)
      }).finally(()=>{
        this.loading = false
          })
    
        }
      },
      download(){
          const cameraId =
          this.form.cameraId.map((item) => "'" + item + "'").join(",") ||
          this.camerList.map((item) => "'" + item.channelId + "'").join(",");
        console.log("🤡 ~~ this.form", this.form)
        const  alarmType = this.form.alarmType&&this.form.alarmType.map((item) => "'" + item + "'").join(",");
        let { startTime, endTime, download } = this.form;
      let userId = getDownloadIdToken();
      if (!this.downloadFlag) {
        downloadAlarmHisApi({
          startTime,
          endTime,
          alarmType,
          cameraId,
          download,
          userId,
        }).then((res) => {
          console.log("🤡 ~~ res", res)
          try {
            var data = JSON.parse(res.data);
            if (data.status == 1) {
              setDownloadIdToken(data.userId);
              this.$store.dispatch("seachFile");
            } else {
              // this.$message.error(
              //   "内容过大/暂无报警信息，请重新选择条件下载！"
              // );
            }
          } catch (error) {
            console.log(error);
          }
          this.dialogVisibleDownload = false
        })
      }
      },
        handleData(data){
      const copyData = [...data]
      const baseUrl = this.baseUrl
      const arr =  copyData.map((v,index)=>{
        const FaceThreshold = (v.FaceThreshold * 100).toFixed(0)+'%'
        const FaceSnap = baseUrl+v.FaceSnap
        const FaceUrl = baseUrl+v.FaceUrl
        const time = v.time.slice(0,-4)
       const {name:CamerName =''} = this.camerList.find(item=>item.channelId === v.CameraId)||{}
      //  v['CamerName'] = name
      return {...v,FaceThreshold,FaceSnap,FaceUrl,time,CamerName}
      })
      console.log("🤡 ~~ copyData", arr)
      return arr
    },
      behavioutBtn(bol=this.checked){
         this.page.pageNum = bol?12:24
       this.$emit('change',bol)
         this.search()
         

      },
      // 获取数据
       getSelectData(){
            getAlgorithmListApi({}).then(res=>{
              const data = JSON.parse(res.data)
              this.alarmOptions = data
            })
            getCameraApi({}).then(res=>{
                 if (res.code == 0) {
                this.camerList = JSON.parse(res.data);
            }
            })
        },
         getDrawPoint(alarmList) {
      return alarmList.map((item) => {
        item.alarmUrl = this.baseUrl + item.alarmUrl;
        if (item.alarmVideo) {
          item.alarmVideo = this.baseUrl + item.alarmVideo;
        }
        item.time = item.time.split(" ")[0] + " " + item.time.split(" ")[1];
        item.listData = [];
        var boxArr = item.alarmBox.split(";");
        for (let i = 0; i < boxArr.length; i++) {
          const element = boxArr[i];
          var arr = element.split("-");
          var x = Number(arr[0]);
          var y = Number(arr[1]);
          var w = Number(arr[2]);
          var h = Number(arr[3]);
          item.listData.push({
            id: item.id,
            modeType: "react",
            serviceData: JSON.stringify([
              [x, y],
              [x, y + h],
              [x + w, y + h],
              [x + w, y],
            ]),
          });
        }
        item.yuan = JSON.parse(JSON.stringify(item.listData));
        item.listData = changeImge(
          item.listData,
         170,
         95.625
        );
        return item;
      });
    },
    }
  }
</script>

<style lang="scss" scoped>
  .alarm-page{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
  }
  .block {
  text-align: center;
  margin-top: 20px;
}
</style>