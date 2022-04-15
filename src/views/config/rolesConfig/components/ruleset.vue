<template>
  <div class="ruleset">
    <el-row :gutter="20">
      <el-col :offset="22" :span="2">
        <el-button type="primary" size="small" @click="addNewRule">{{$t('html.addRule')}}</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table v-loading="loading" :data="tableData" style="width: 100%" height="740px">
          <el-table-column prop="RuleName" :label="$t('html.engineName')" align="center"></el-table-column>
          <el-table-column prop="name" :label="$t('html.state')" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column :label="$t('html.handle')" align="center">
            <template v-slot="{ row }">
              <el-button type="primary" size="small" @click="rowEdit(row)">{{$t('html.edit')}}</el-button>
              <el-button type="danger"  size="small" @click="rowDelete(row)">{{$t('html.scdel')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--  新增编辑弹框  -->
    <ruleset-addor-edit-dialog :visible.sync="isShowDialog" :dialogData="rowData" @refresh="getRuleData()"></ruleset-addor-edit-dialog>
  </div>
</template>

<script>
import {getRule, deleteRules, getAlgorithmListApi } from '@/api/article.js'
import RulesetAddorEditDialog from './ruleset-add-edit-dialog'
export default {
  name: 'ruleset',
  components: {
    RulesetAddorEditDialog
  },
  created() {
    this.getRuleData()
  },
  data(){
    return {
      loading: false,
      isShowDialog:false,
      rowData: {},
      tableData:[]
    }
  },
  methods: {
    addNewRule(){
      this.isShowDialog = true
    },
    rowEdit(row){
      this.isShowDialog = true
      this.rowData = {...row}
    },
    async getRuleData(){
      const listResult = await getRule({})
      const AlgorithmResult = await getAlgorithmListApi({})
      let AlgorithmList = JSON.parse(AlgorithmResult.data) // 算法列表
      const { code, data, msg } = listResult
      if(code !== 0){
        this.$message.error(msg)
      }
      const ruleList = JSON.parse(data)
      let nameTemp = []
      let tempMap = {}
      AlgorithmList.forEach((item) => {
        tempMap[item.alarmNumber] = item.name
      })
      for(let i = 0; i < ruleList.length; i++){
        nameTemp = []
        for(let j = 0; j< ruleList[i].AlgList.length; j++){
          nameTemp.push(tempMap[ruleList[i].AlgList[j]])
        }
        ruleList[i].name = nameTemp.join('、')
      }
      this.tableData = ruleList.reverse()
    },
    async rowDelete(row){
      const newRow = JSON.parse(JSON.stringify(row))
      this.$confirm(this.$t('js.msgtit'), this.$t('js.msgonex'), {
        confirmButtonText: this.$t('js.msgonez'),
        cancelButtonText: this.$t('js.msgoneq')
      }).then((res) => {
        deleteRules({RuleId: newRow.RuleId}).then((res) => {
          const {code, msg} = res
          if(code !== 0){
            return this.$message.error(msg)
          }
          this.$message.success(this.$t('js.mqsgone'))
          this.getRuleData()
        })
      }).catch((err) => {
        this.$message.info(this.$t('js.quxiao'))
      })
    },

  }
}
</script>

<style scoped>
.ruleset {
  height: 100%;
  padding: 10px;
}
</style>