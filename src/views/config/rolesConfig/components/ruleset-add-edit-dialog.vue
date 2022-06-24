<template>
  <el-dialog custom-class="rulesDialog"
  :close-on-click-modal="false"
   :title="dataForm.RuleId ? $t('html.editRule') : $t('html.newRule')" :visible.sync="dialogShow" width="30%"  @close="closeDialog">
    <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataFormRef">
      <el-form-item :label="$t('html.ruleName')" prop="RuleName">
        <el-input v-model.trim="dataForm.RuleName" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item :label="$t('html.xzsf')">
        <el-select :disabled="dataForm.RuleId" v-model="dataForm.AlgList" multiple :placeholder="$t('html.select')" style="width: 100%">
          <el-option
              v-for="item in algorithmList"
              :key="item.alarmNumber"
              :label="item.name"
              :value="item.alarmNumber">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('html.jumpFrames')" prop="ExtraData">
        <el-input  v-model.number="dataForm.ExtraData"></el-input>
      </el-form-item>
    </el-form>
   <div slot="footer" style="text-align: center">
      <el-button type="info" size="small" @click="closeDialog">{{$t('html.gb')}}</el-button>
      <el-button type="primary" size="small" @click="dataFormSubmit">{{$t('html.submit')}}</el-button>
   </div>
  </el-dialog>
</template>

<script>
import { addRules, editRules, getAlgorithmListApi } from '@/api/article.js'
export default {
  name: "handle-dialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    dialogData: {
      type: Object,
      default: () =>({})
    }
  },
  data() {
    const extraDataVal = (rule, value, callback)=>{
        const  re = /^[0-9]+$/ ;
        if(!re.test(value)){
          callback(new Error(this.$t('html.ExtraDataMes')))
          return
        }
        callback()
    }
    return {
      dialogShow: false,
      dataForm: {
        RuleName: '',
        AlgList: [],
        ExtraData:5 // 跳帧数
      },
      algorithmList: [],
      dataFormRules: {
        RuleName: [
          { required: true, message: this.$t('html.please') , trigger: 'blur' },
        ],
        ExtraData:[
          { validator: extraDataVal,trigger:'blur'}
        ]
      }
    };
  },
  created() {
    this.defaultAddForm = JSON.parse(JSON.stringify(this.dataForm))
    this.getAlgorithmList()
  },
  watch: {
    visible() {
      this.dialogShow = this.visible;
    },
    dialogData(newValue){
      this.dataForm = JSON.parse(JSON.stringify(newValue))
    }
  },
  methods: {
    async getAlgorithmList(){
      try {
        const result = await getAlgorithmListApi({})
        const {code, data, msg} = result
        if(code !== 0){
          return this.$message.error(msg)
        }
        this.algorithmList = JSON.parse(data)
      }catch (e){
        console.log(e.error)
      }
    },
    dataFormSubmit(){
      this.$refs.dataFormRef.validate(async (isOk) => {
        if(isOk){
          if(this.dataForm.RuleId){
            const {ExtraData} = this.dataForm
            const editRes = await editRules({...this.dataForm,ExtraData:String(ExtraData)})
            const {code, msg} = editRes;
            if(code !== 0){
              this.$message.error(msg)
            }
            this.$message.success(this.$t('js.mnsgone'))
            this.closeDialog()
          }else {
            const {ExtraData} = this.dataForm
            const result = await addRules({...this.dataForm,ExtraData:String(ExtraData)})
            const {code, msg} = result
            if(code !== 0){
              return this.$message.error(msg)
            }
            this.$message.success(this.$t('js.mdsgone'))
            this.closeDialog()
          }
        }else {
          return false
        }
      })
    },
    closeDialog(){
      this.dialogShow = false;
      this.$emit("update:visible", false);
      this.dataForm = JSON.parse(JSON.stringify(this.defaultAddForm))
      this.$emit('refresh')
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
