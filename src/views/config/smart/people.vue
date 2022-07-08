<template>
  <div class="people">
    <div class="people-left">
      <div
        style="padding: 30px 10px 10px 30px; box-sizing: border-box"
        class="left-top"
      >
        <BaseIcon title="人员库"></BaseIcon>
      </div>
      <div class="left-content">
        <div class="search-box">
          <el-input
            placeholder="请输入库名称"
            suffix-icon="el-icon-search"
            v-model="input1"
            style="width: 80%; margin: 0 4%"
            @change="getFaceGroups"
          >
          </el-input>
          <i
            @click="getBankDialog('新建')"
            style="font-size: 20px; font-weight: 900; cursor: pointer"
            class="el-icon-plus"
          ></i>
        </div>

        <div class="content-list">
          <div
            v-for="item in faceGroups"
            :key="item.GroupId"
            class="content-list-itemBox"
            :style="{
              backgroundColor:
                groupActive == item.GroupId ? '#010b56' : '#aaaaaa',
            }"
            @click="faceGroupsChange(item.GroupId)"
          >
            <i class="el-icon-user"></i>
            <span class="text">{{ item.GroupName }}</span>
            <i
              v-show="groupActive == item.GroupId"
              style="margin-right: 20px"
              class="el-icon-edit"
              @click="getBankDialog('修改', item)"
            ></i>
            <i
              @click="deleteFaceGroup(item.GroupId)"
              v-show="groupActive == item.GroupId"
              class="el-icon-delete"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <div class="people-right">
      <div class="right-top">
        <div
          style="padding: 30px 10px 10px 30px; box-sizing: border-box"
          class="right-top-title"
        >
          <BaseIcon title="库内人员"></BaseIcon>
        </div>
        <div class="right-btn">
          <el-row :gutter="10">
            <el-col :span="16">
              <div>
                <el-button class="right-top-btn" @click="getForm('添加')"
                  >新增</el-button
                >
                <el-button @click="deleteFacePerson" class="right-top-btn"
                  >删除</el-button
                >
                <el-button
                  class="right-top-btn"
                  @click="$refs.peopleDialog.dialogVisible = true"
                  >导入</el-button
                >
                <el-button class="right-top-btn">导出</el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-input
                  placeholder="请输入姓名"
                  suffix-icon="el-icon-search"
                  v-model="PersonName"
                  style="width: 80%; margin: 0 4%"
                  @change="PersonNameChange"
                >
                </el-input>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="right-centent">
        <div class="right-list">
          <div
            @click="personActive = item.PersonId"
            @dblclick="getForm('编辑', item)"
            v-for="item in personList"
            :key="item.PersonId"
            class="right-list-item"
            :class="[personActive == item.PersonId ? 'person-active' : '']"
          >
            <img :src="httpUrl + item.Url" alt="" />
            <div class="img-title">
              <el-row :gutter="10">
                <el-col :span="12">{{ item.PersonName }}</el-col>
                <el-col style="text-align: right" :span="12">{{
                  item.Gender == 1 ? '男' : '女'
                }}</el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="right-page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.current"
            :page-sizes="[18, 32]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 人员库 -->
    <peopleBankDialog
      :title="bankDialogTitle"
      :bankDialogShow="bankDialogShow"
      :editData="editData"
      @setGroup="getFaceGroups"
    ></peopleBankDialog>
    <!-- 人员 -->
    <peopleFormDialog
      :title="formTitle"
      :bankDialogShow="formShow"
      :editData="formData"
      :GroupId="groupActive"
      :httpUrl="httpUrl"
      @faceGroupsChange="faceGroupsChange"
    >
    </peopleFormDialog>
    <!-- 导入 -->
    <peopleImportDialog ref="peopleDialog" :GroupId="groupActive">
    </peopleImportDialog>
  </div>
</template>

<script>
import BaseIcon from '@/components/baseIcon.vue'
import peopleBankDialog from './component/peopleBankDialog.vue'
import peopleFormDialog from './component/peopleFormDialog.vue'
import peopleImportDialog from './component/peopleImportDialog.vue'
import {
  getFaceGroups,
  deleteFaceGroup,
  getFacePersons,
  deleteFacePerson,
} from '@/api/article.js'

export default {
  components: {
    BaseIcon,
    peopleBankDialog,
    peopleFormDialog,
    peopleImportDialog,
  },
  data() {
    return {
      groupActive: null,
      personActive: null,
      PersonName: '',
      input1: '',
      page: {
        total: 0,
        size: 18,
        current: 1,
      },
      bankDialogTitle: '新建',
      bankDialogShow: false,
      editData: {},
      formTitle: '添加',
      formShow: false,
      formData: {},
      faceGroups: [],
      personList: [],
      httpUrl: '',
    }
  },
  created() {
    this.httpUrl =
      process.env.NODE_ENV == 'dev'
        ? process.env.VUE_APP_URL
        : window.location.origin
    this.init()
    // this.faceGroupsChange();
  },
  methods: {
    async faceGroupsChange(val, PersonName) {
      const ruleRes = await getFacePersons({
        GroupId: `'${val}'` || '',
        curPage: String(this.page.current),
        pageNum: String(this.page.size),
        PersonName: PersonName || '',
      })
      console.log('faceGroupsChange', ruleRes)
      if (ruleRes.code !== 0) return this.$message.error(ruleRes.msg)
      this.groupActive = val
      this.personList = ruleRes.data.row
      this.page.total = ruleRes.data.total
    },
    PersonNameChange(val) {
      this.page.current = 1
      this.faceGroupsChange(this.groupActive, val)
    },
    handleSizeChange(val) {
      this.page.size = val
      this.faceGroupsChange(this.groupActive)
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.faceGroupsChange(this.groupActive)
    },
    getBankDialog(val, item = {}) {
      this.bankDialogTitle = val
      this.bankDialogShow = !this.bankDialogShow
      if (val == '修改') {
        this.editData = item
      }
    },
    getForm(val, item = {}) {
      this.formTitle = val
      this.formShow = !this.formShow
      if (val == '编辑') {
        this.personActive = item.PersonId
        this.formData = item
      }
    },
    init() {
      this.getFaceGroups()
    },
    deleteFacePerson() {
      this.$confirm('确定要删除该数据吗?', '提示', {
        confirmButtonText: this.$t('js.msgonez'),
        cancelButtonText: this.$t('js.msgoneq'),
        type: 'warning',
      })
        .then(() => {
          deleteFacePerson({
            PersonId: this.personActive,
          }).then((ruleRes) => {
            if (ruleRes.code !== 0) return this.$message.error(ruleRes.msg)
            this.faceGroupsChange(this.groupActive)
            this.$message({
              type: 'success',
              message: this.$t('js.mqsgone'),
            })
          })
        })
        .catch((err) => {
          this.$message({
            type: 'info',
            message: this.$t('js.msgonoe'),
          })
        })
    },
    async getFaceGroups(val) {
      console.log('val', val)
      // GroupName
      const ruleRes = await getFaceGroups({ GroupName: val || '' })
      if (ruleRes.code !== 0) return this.$message.error(ruleRes.msg)
      this.faceGroups = ruleRes.data.row
      if (this.groupActive == null) {
        this.faceGroupsChange(this.faceGroups[0]['GroupId'])
      }
    },

    deleteFaceGroup(GroupId) {
      if (this.personList.length)
        return this.$message({
          type: 'info',
          message: '该群组已涉及人员，不允许删除!',
        })

      this.$confirm('确定要删除该数据吗?', '提示', {
        confirmButtonText: this.$t('js.msgonez'),
        cancelButtonText: this.$t('js.msgoneq'),
        type: 'warning',
      })
        .then(() => {
          deleteFaceGroup({
            GroupId,
          }).then((ruleRes) => {
            if (ruleRes.code !== 0) return this.$message.error(ruleRes.msg)
            this.groupActive = null
            this.getFaceGroups()
            this.$message({
              type: 'success',
              message: this.$t('js.mqsgone'),
            })
          })
        })
        .catch((err) => {
          this.$message({
            type: 'info',
            message: this.$t('js.msgonoe'),
          })
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.people {
  //   min-width: 1660px;
  //   min-height: 820px;
  height: 100%;
  // max-height: 870px;
  margin: 0 auto;
  box-sizing: border-box;
  background-color: #efeff4;
  // padding: 20px;
  overflow: hidden;
}

.people-left {
  background-color: white;
  width: 375px;
  height: 100%;
  float: left;
  //   padding: 15px 25px;
  box-sizing: border-box;

  .left-top {
    width: 100%;
    // height: 45px;
    // box-sizing: border-box; 18 -25
    padding: 15px 25px 5px;
    box-sizing: border-box;
    border-bottom: 1px solid #bdbdbd;
  }

  .left-content {
    width: 100%;
    height: 100%;
    margin-top: 15px;

    .search-box {
      .el-input--suffix {
        border: 1px solid #09135b;
      }
    }

    .content-list {
      width: 100%;
      margin-top: 30px;
      .content-list-itemBox {
        width: 100%;
        height: 45px;
        // background-color: #010b56;
        background-color: #aaaaaa;
        color: #fff;
        padding: 10px 20px;
        box-sizing: border-box;
        cursor: pointer;

        .text {
          display: inline-block;
          margin-left: 20px;
          width: 70%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

.people-right {
  background-color: white;
  float: right;
  height: 100%;
  width: calc(100% - 385px);
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px 15px 0 15px;

  .right-top-btn {
    background-color: #09135b;
    color: #fff;
    margin-right: 20px;
  }

  .right-centent {
    width: 100%;
    height: 100%;
    margin-top: 10px;

    .right-list {
      width: 100%;
      height: 81%;
      overflow: auto;
      //   display: flex;
      //   flex-wrap: wrap;

      .right-list-item {
        width: 174;
        height: 200px;
        float: left;
        position: relative;
        box-sizing: border-box;

        margin: {
          bottom: 20px;
          right: 27px;
        }

        > img {
          width: 174px;
          height: 174px;
        }

        .img-title {
          background-color: #8e92ad;
          height: 40px;
          position: absolute;
          width: 100%;
          bottom: 0;
          line-height: 35px;
          color: #fff;
          padding: 0 15px;
          font-size: 14px;
          box-sizing: border-box;
        }
      }
    }

    .right-page {
      text-align: center;
    }
  }
}

.person-active {
  border: 2px solid #000;
}
</style>
